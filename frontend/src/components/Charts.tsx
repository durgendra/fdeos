import React, { useState } from 'react';
import { Engagement, DeploymentStage, DeploymentHealth } from '../types';

interface ChartsProps {
  engagements: Engagement[];
}

export default function Charts({ engagements }: ChartsProps) {
  const [hoveredHealth, setHoveredHealth] = useState<DeploymentHealth | null>(null);
  const [hoveredStage, setHoveredStage] = useState<DeploymentStage | null>(null);

  // 1. Calculate health metrics
  const healthStats = engagements.reduce(
    (acc, cur) => {
      acc[cur.health] = (acc[cur.health] || 0) + 1;
      return acc;
    },
    { green: 0, yellow: 0, red: 0 } as Record<DeploymentHealth, number>
  );

  const totalEngagements = engagements.length;

  // 2. Calculate deployments by stage
  const stagesList: DeploymentStage[] = [
    'Discovery',
    'Workflow Mapping',
    'Technical Scoping',
    'Prototype',
    'Validation',
    'Production Hardening',
    'Handoff',
    'Expansion'
  ];

  const stageStats = stagesList.reduce((acc, stage) => {
    acc[stage] = engagements.filter((e) => e.stage === stage).length;
    return acc;
  }, {} as Record<DeploymentStage, number>);

  const maxStageCount = Math.max(...Object.values(stageStats), 1);

  // Doughnut math
  const radius = 50;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const getDoughnutSectors = () => {
    let currentCumulative = 0;
    const items = [
      { key: 'green' as DeploymentHealth, value: healthStats.green, color: '#10b981', label: 'Green (On Track)' },
      { key: 'yellow' as DeploymentHealth, value: healthStats.yellow, color: '#f59e0b', label: 'Yellow (Blocked/Recoverable)' },
      { key: 'red' as DeploymentHealth, value: healthStats.red, color: '#f43f5e', label: 'Red (Critical Risk)' }
    ].filter(item => item.value > 0);

    return items.map((item) => {
      const percentage = (item.value / totalEngagements) * 100;
      const strokeDashoffset = circumference - (percentage / 100) * circumference;
      const rotation = (currentCumulative / totalEngagements) * 360;
      currentCumulative += item.value;
      return {
        ...item,
        percentage,
        strokeDashoffset,
        rotation
      };
    });
  };

  const sectors = getDoughnutSectors();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="fde-charts">
      {/* Chart 1: Deployment Health Doughnut */}
      <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md/50 transition-all duration-200 flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-zinc-100"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={normalizedRadius}
              cx="50"
              cy="50"
            />
            {sectors.map((sector) => (
              <circle
                key={sector.key}
                className="transition-all duration-500 ease-out cursor-pointer"
                stroke={sector.color}
                strokeWidth={hoveredHealth === sector.key ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset: sector.strokeDashoffset, transformOrigin: '50% 50%' }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx="50"
                cy="50"
                transform={`rotate(${sector.rotation} 50 50)`}
                onMouseEnter={() => setHoveredHealth(sector.key)}
                onMouseLeave={() => setHoveredHealth(null)}
              />
            ))}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-sans text-zinc-900 leading-none">
              {totalEngagements}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase mt-1">
              TOTAL DEPLOYS
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">
              PIPELINE INTEGRITY
            </h4>
            <p className="text-sm font-semibold text-zinc-800">
              Deployment Health Diagnostics
            </p>
          </div>

          <div className="space-y-2.5">
            {sectors.map((sector) => (
              <div
                key={sector.key}
                className={`p-2 rounded-lg transition-all duration-150 flex items-center justify-between text-xs cursor-pointer ${
                  hoveredHealth === sector.key ? 'bg-zinc-50 border border-zinc-200 shadow-sm' : 'border border-transparent'
                }`}
                onMouseEnter={() => setHoveredHealth(sector.key)}
                onMouseLeave={() => setHoveredHealth(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: sector.color }}
                  ></span>
                  <span className="font-medium text-zinc-700">{sector.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-zinc-900 font-semibold">{sector.value}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">({Math.round(sector.percentage)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 2: Pipeline Stage Progress */}
      <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md/50 transition-all duration-200 flex flex-col">
        <div className="mb-4">
          <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">
            VELOCITY MATRIX
          </h4>
          <p className="text-sm font-semibold text-zinc-800">
            Account Volume distributed by Deployment Stage
          </p>
        </div>

        {/* SVG/HTML Bar Chart */}
        <div className="flex-1 flex flex-col justify-between space-y-3 pt-1">
          {stagesList.map((stage) => {
            const count = stageStats[stage] || 0;
            const percentage = (count / maxStageCount) * 100;
            const isHovered = hoveredStage === stage;
            return (
              <div
                key={stage}
                className="flex items-center gap-3 text-xs"
                onMouseEnter={() => setHoveredStage(stage)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <span className="w-32 truncate text-right text-zinc-600 font-medium select-none pr-1">
                  {stage}
                </span>

                <div className="flex-1 h-6 bg-zinc-50 rounded-md relative flex items-center border border-zinc-100 overflow-hidden group cursor-pointer hover:border-zinc-300 transition-colors">
                  <div
                    className={`h-full transition-all duration-500 rounded-r-md ${
                      isHovered
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.2)]'
                        : count > 0 
                          ? 'bg-zinc-800' 
                          : 'bg-zinc-100'
                    }`}
                    style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                  ></div>

                  {/* Count Label pinned */}
                  <span className={`absolute right-2 font-mono text-[11px] font-bold transition-all ${
                    count > 0 
                      ? 'text-zinc-900' 
                      : 'text-zinc-400'
                  }`}>
                    {count} account{count !== 1 && 's'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
