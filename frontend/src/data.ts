import { Engagement, Playbook, ProductThemeAggregate } from './types';

export const INITIAL_ENGAGEMENTS: Engagement[] = [
  {
    id: 'acme-logistics',
    customer: 'Acme Logistics',
    industry: 'Supply Chain & Logistics',
    arr: '$240,000',
    stage: 'Production Hardening',
    health: 'green',
    owner: 'Sarah Connor (Senior FDE)',
    objective: 'Implement AI-native route optimization & automated dispatch sorting for regional distribution centers.',
    problem: 'Manual route planning takes dispatchers 3-4 hours daily, resulting in 12% in-transit idle delays and sub-optimal driver assignments.',
    workflow: 'V1 Route Planner -> Automated Dispatch API -> Driver Telematics Dashboard.',
    metric: 'Reduce planning time to under 15 minutes and decrease regional driver idle duration by 20%.',
    lastUpdated: '2026-06-19',
    executiveSummary: 'Acme Logistics is on track to pilot across 4 Midwest hubs next week. The core model has been fine-tuned using custom delivery constraints, and telematics integration is complete. Currently hardening latency performance and configuring high-availability failover endpoints.',
    stakeholders: [
      { name: 'Marcus Vance', role: 'VP of Operations', email: 'm.vance@acmelogistics.com' },
      { name: 'Diana Price', role: 'Head of Dispatch Systems', email: 'diana.price@acmelogistics.com' },
      { name: 'Raj Patel', role: 'Lead Infrastructure Architect', email: 'raj.patel@acmelogistics.com' }
    ],
    systems: ['SAP Warehouse Management', 'Geotab Telematics SDK', 'Kafka Distribution Bus', 'PostgreSQL v15'],
    timeline: [
      { date: '2026-05-10', stage: 'Discovery', note: 'Discovery call completed. Defined route optimization scope.', achieved: true },
      { date: '2026-05-20', stage: 'Workflow Mapping', note: 'Mapped existing route planning steps & API latency requirements.', achieved: true },
      { date: '2026-05-30', stage: 'Technical Scoping', note: 'Technical scoping signed off. Approved Kafka-based ingestion schema.', achieved: true },
      { date: '2026-06-05', stage: 'Prototype', note: 'Successfully demoed prototype routing algorithm with 94.2% accuracy.', achieved: true },
      { date: '2026-06-12', stage: 'Validation', note: 'Dispatcher validation trials completed across Indianapolis hub.', achieved: true },
      { date: '2026-06-25', stage: 'Production Hardening', note: 'Benchmarking API cluster latency under 150ms spikes.', achieved: false }
    ],
    currentBlocker: 'None. Undergoing standard load tests and rate-limit hardening.',
    nextMilestone: 'Deploy Kafka consumers into production cluster and transition to Handoff.',
    blockers: [],
    commitments: [
      {
        id: 'c-acme-1',
        title: 'Provide production Kafka TLS certificates',
        owner: 'Raj Patel (Customer)',
        type: 'Customer',
        dueDate: '2026-06-21',
        status: 'Open',
        source: 'Operations Sync Call',
        lastUpdated: '2026-06-18'
      },
      {
        id: 'c-acme-2',
        title: 'Optimize heavy batch routing model query latency from 8s to <2s',
        owner: 'Sarah Connor (Vendor)',
        type: 'Vendor',
        dueDate: '2026-06-23',
        status: 'Open',
        source: 'Technical Review',
        lastUpdated: '2026-06-19'
      },
      {
        id: 'c-acme-3',
        title: 'Complete Geotab callback payload verification tests',
        owner: 'Sarah Connor + Diana Price',
        type: 'Shared',
        dueDate: '2026-06-15',
        status: 'Done',
        source: 'Implementation Workspace',
        lastUpdated: '2026-06-15'
      }
    ],
    risks: [
      {
        id: 'r-acme-1',
        title: 'Telematics Callback Latency Spikes',
        severity: 'Medium',
        description: 'Webhook delivery times from Geotab occasionally exceed 1.5s during rush hour traffic reporting times.',
        impact: 'May cause temporary route drift if dispatch updates lag behind trucks by more than 3 minutes.',
        mitigation: 'Implement local caching & exponential backoff queueing for out-of-order telematics updates.',
        owner: 'Sarah Connor',
        status: 'Open'
      }
    ],
    productSignals: [
      {
        id: 'ps-acme-1',
        theme: 'Audit Logging',
        type: 'Security Requirement',
        evidence: 'Marcus emphasized that dispatch routing decisions must have granular historical audibility to defend vehicle allocation decisions in compliance hearings.',
        customerImpact: 'Essential compliance requirement for global logistics expansion.',
        frequency: 4,
        priority: 'P1'
      },
      {
        id: 'ps-acme-2',
        theme: 'Data Connector',
        type: 'Integration Gap',
        evidence: 'V1 lacks native connector to modern SAP S/4HANA OData streams. Had to write customized extractor scripts.',
        customerImpact: 'Adds 5 days of scaffolding script development to every enterprise customer on modern SAP.',
        frequency: 18,
        priority: 'P0'
      }
    ],
    readiness: [
      { id: 're-acme-1', category: 'Business Readiness', title: 'Operational stakeholders identified and executive mandate signed', checked: true, owner: 'Marcus Vance', notes: 'Complete. Operations VP is the primary sponsor.' },
      { id: 're-acme-2', category: 'Data Readiness', title: 'Route history telemetry parsed and sanitized', checked: true, owner: 'Sarah Connor', notes: 'Telemetry database containing 1M historical routes is processed.' },
      { id: 're-acme-3', category: 'Security Readiness', title: 'SOC2 & HIPAA constraints audited (telematics lacks PII)', checked: true, owner: 'Raj Patel', notes: 'Formal compliance review completed 2026-06-01.' },
      { id: 're-acme-4', category: 'Integration Readiness', title: 'Telemetry Kafka connection tested in sandbox with real SLA parameters', checked: true, owner: 'Sarah Connor', notes: 'Latency metrics met normal criteria under 1,000 req/sec load.' },
      { id: 're-acme-5', category: 'AI Evaluation Readiness', title: 'Establish benchmark datasets to evaluate routing efficiency', checked: true, owner: 'Sarah Connor', notes: 'Optimality evaluated using operational research linear solvers.' },
      { id: 're-acme-6', category: 'Production Readiness', title: 'Auto-scaling pods and cluster limits configured in Kubernetes', checked: false, owner: 'Raj Patel', notes: 'Awaiting deployment configuration reviews' },
      { id: 're-acme-7', category: 'Handoff Readiness', title: 'Train dispatcher supervisors on UI routing exception flags', checked: false, owner: 'Diana Price', notes: 'Scheduled for 2026-06-25.' }
    ],
    notesHistory: [
      {
        id: 'n-acme-1',
        date: '2026-06-18',
        title: 'Architecture Review & Rate Limiting Sync',
        content: 'Acme wants to ensure we don\'t overwhelm their internal dispatch API if telemetry registers severe updates. We agreed to implement a leaky bucket rate-limiter client side to buffer calls. Diana requests that in the case of endpoint failures, our backend fallback to a standard regional static routing file stored locally on the VM. Sarah Connor to build this safeguard next week.'
      }
    ],
    statusUpdates: [
      {
        id: 'su-acme-1',
        date: '2026-06-19',
        tone: 'Executive',
        summary: 'Regional route optimization program remains on schedule, with validation completed. High confidence on upcoming multi-hub pilot deployment.',
        completed: [
          'Dispatcher validation trials completed in Indianapolis with positive usability ratings.',
          'Custom telemetry parsing latency lowered to standard margins.',
          'Secured formal operations dashboard integration sign-off from Head of Dispatch Systems.'
        ],
        blockers: [
          'Waiting on TLS production certificates for final Kafka message broker handshake.'
        ],
        decisions: [
          'Decided to cache telematics locally if Geotab webhooks spike above 1.5 seconds.'
        ],
        nextSteps: [
          'Perform dry run pilot on June 22nd with live dispatch simulation.',
          'Complete cluster configurations & handover logs to internal infrastructure leads.'
        ]
      }
    ]
  },
  {
    id: 'northstar-bank',
    customer: 'Northstar Bank',
    industry: 'Financial Services',
    arr: '$450,000',
    stage: 'Validation',
    health: 'yellow',
    owner: 'Alex Carver (Solutions Architect)',
    objective: 'Deploy LLM-powered credit auditing workspace to summarize loan requests & cross-reference risk criteria.',
    problem: 'Underwriters spend 2 hours compiling corporate lending history, audit reviews, and assets spreadsheets into credit memos.',
    workflow: 'DocuSign PDF -> LLM Metadata Extractor -> Drizzle Database -> Underwriting Compliance Briefing UI.',
    metric: 'Reduce credit report curation cycle from 8 business days to 24 hours while ensuring zero hallucination on financial balances.',
    lastUpdated: '2026-06-18',
    executiveSummary: 'We have mapped workflows, parsed unstructured PDF structures with 97.4% precision, and established the validation staging dashboard. However, we are currently blocked by the bank\'s Enterprise Risk Group (ERG) regarding private VPC egress configurations for security audit trails. System is operating in a staging enclave pending firewall exception approvals.',
    stakeholders: [
      { name: 'Elizabeth Ward', role: 'Head of Underwriting Strategy', email: 'e.ward@northstar.com' },
      { name: 'Kenji Sato', role: 'VP Corporate Risk', email: 'k.sato@northstar.com' },
      { name: 'Sanjay Gupta', role: 'Principal Security Officer', email: 's.gupta@northstar.com' }
    ],
    systems: ['Salesforce Financial Services Cloud', 'Laserfiche Documents Repo', 'On-prem Oracle Core DB', 'Active Directory'],
    timeline: [
      { date: '2026-04-15', stage: 'Discovery', note: 'Discovered high error rates in manual underwriting memo spreadsheets.', achieved: true },
      { date: '2026-05-02', stage: 'Workflow Mapping', note: 'Drafted full lending appraisal workflow and PDF taxonomy catalog.', achieved: true },
      { date: '2026-05-20', stage: 'Technical Scoping', note: 'Completed security alignment regarding tenant isolation & OAuth constraints.', achieved: true },
      { date: '2026-06-01', stage: 'Prototype', note: 'Shipped interactive prototype for extracting loan metadata from multi-tab files.', achieved: true },
      { date: '2026-06-15', stage: 'Validation', note: 'Staging environment live in Virtual Private Cloud. ERG audit roadblock encountered.', achieved: false }
    ],
    currentBlocker: 'Compliance approval on private VPC egress gateway traffic routes delayed in Enterprise Risk Group queue.',
    nextMilestone: 'Hold ERG architecture review session to secure static route clearance.',
    blockers: [
      {
        id: 'b-ns-1',
        title: 'Static route clearance for LLM API egress gateway',
        stage: 'Validation',
        owner: 'Sanjay Gupta (Customer)',
        ageDays: 14,
        nextAction: 'Provide egress IP ranges and review SOC2 Type II audit logs for model servers.'
      }
    ],
    commitments: [
      {
        id: 'c-ns-1',
        title: 'Provide SOC2 model processing addendum files',
        owner: 'Alex Carver (Vendor)',
        type: 'Vendor',
        dueDate: '2026-06-10',
        status: 'Done',
        source: 'Security Review Chat',
        lastUpdated: '2026-06-10'
      },
      {
        id: 'c-ns-2',
        title: 'Deliver test underwriting spreadsheets containing complex debt listings',
        owner: 'Elizabeth Ward (Customer)',
        type: 'Customer',
        dueDate: '2026-06-22',
        status: 'Open',
        source: 'Weekly Touchpoint',
        lastUpdated: '2026-06-18'
      }
    ],
    risks: [
      {
        id: 'r-ns-1',
        title: 'Infosec Regulatory Delay',
        severity: 'High',
        description: 'Federal regulation constraints regarding data leaks require detailed key rotation procedures before deployment keys are provisioned.',
        impact: 'If delayed beyond July 1st, pilot start will slide into Q3 causing budget reallocation risks.',
        mitigation: 'Coordinate daily standups with risk team to answer API architecture questions in real-time.',
        owner: 'Alex Carver',
        status: 'Open'
      }
    ],
    productSignals: [
      {
        id: 'ps-ns-1',
        theme: 'Enterprise Auth',
        type: 'Security Requirement',
        evidence: 'Security architect explicitly warned that we cannot go to production without Active Directory token revocation listening.',
        customerImpact: 'Prevents enterprise-wide deployment to 450 underwriters.',
        frequency: 11,
        priority: 'P0'
      },
      {
        id: 'ps-ns-2',
        theme: 'Human Review Workflow',
        type: 'Workflow Gap',
        evidence: 'Elizabeth expects underwriters to click a check symbol directly next to individual sentences within the credit report to log feedback.',
        customerImpact: 'High; currently underwriters are reluctant to trust raw summaries without visual text-source attribution.',
        frequency: 25,
        priority: 'P1'
      }
    ],
    readiness: [
      { id: 're-ns-1', category: 'Business Readiness', title: 'Underwriting leads aligned and trained on pilot workflow', checked: true, owner: 'Elizabeth Ward', notes: 'Completed. 15 core underwriters identified for user testing.' },
      { id: 're-ns-2', category: 'Data Readiness', title: 'Sample memo documents gathered and structured', checked: true, owner: 'Elizabeth Ward', notes: 'Database seed loaded with 50 previous underwriting dossiers.' },
      { id: 're-ns-3', category: 'Security Readiness', title: 'Private tenant enclave isolation approved by IT', checked: true, owner: 'Sanjay Gupta', notes: 'Completed. Staging sandbox successfully isolated.' },
      { id: 're-ns-4', category: 'Integration Readiness', title: 'Laserfiche bulk PDF retrieval API configured', checked: false, owner: 'Alex Carver', notes: 'Blocked pending VPC firewall static IP routing approval.' },
      { id: 're-ns-5', category: 'AI Evaluation Readiness', title: 'Verify zero hallucination limits on numerical output matrices', checked: true, owner: 'Alex Carver', notes: 'Unit testing verifies that extracted credit values match raw documents 100%.' },
      { id: 're-ns-6', category: 'Production Readiness', title: 'Setup production health monitoring metrics', checked: false, owner: 'Alex Carver', notes: 'Deferred to validation completion.' }
    ],
    notesHistory: [
      {
        id: 'n-ns-1',
        date: '2026-06-15',
        title: 'Compliance Roadblock Review',
        content: 'Met with Sanjay and Kenji from compliance. They noted that their on-prem Oracle DB is technically behind a hardware firewall with no inbound egress allowed. Discussed utilizing a push-based API server with secure tunnels or placing an FDE agent on their intranet. Alex Carver compiling options document to resolve VPC deadlocks.'
      }
    ],
    statusUpdates: []
  },
  {
    id: 'zenith-health',
    customer: 'Zenith Health',
    industry: 'Healthcare & Pharma',
    arr: '$600,000',
    stage: 'Technical Scoping',
    health: 'red',
    owner: 'Arjun Mehta (Lead FDE)',
    objective: 'Integrate clinical trial patient eligibility matching utilizing historical electronic health records.',
    problem: 'Nurses search clinical eligibility database manually for hours; leading to 40% patient dropouts before trial validation matches.',
    workflow: 'Epic EHR API -> Patient Eligibility Analyzer -> Match Report Email Draft -> Clinical Trial Registry.',
    metric: 'Improve eligible patient screening volume by 3x and accelerate trial enrollment velocity by 30 days per site.',
    lastUpdated: '2026-06-19',
    executiveSummary: 'Deployment is RED. Epic API firewalls are completely blocking patient telemetry sync between the customer local testing servers and the isolated AI endpoints. Zenith IT is refusing technical exceptions without HIPAA business associate agreements (BAA) being rewritten, and Arjun Mehta lacks administrative access to test synthetic data.',
    stakeholders: [
      { name: 'Dr. Evelyn Reed', role: 'Director of Clinical Trials', email: 'evelyn.reed@zenithhealth.org' },
      { name: 'Gregory Cox', role: 'Informatics Administrator', email: 'gregory.cox@zenithhealth.org' },
      { name: 'Linda Vance', role: 'Head Legal Counsel', email: 'linda.vance@zenithhealth.org' }
    ],
    systems: ['Epic EHR (HL7 v2 & FHIR)', 'ClinicalTrials.gov API', 'Postgres Patient Repo'],
    timeline: [
      { date: '2026-05-01', stage: 'Discovery', note: 'Discovered manual nurse screening workflows are causing massive patient attrition.', achieved: true },
      { date: '2026-05-20', stage: 'Workflow Mapping', note: 'Operational mapping of clinical trial triage completed.', achieved: true },
      { date: '2026-06-10', stage: 'Technical Scoping', note: 'Blocked in technical scoping. Epic FHIR API integration blocked by legacy firewall.', achieved: false }
    ],
    currentBlocker: 'Epic EHR firewall blocks HL7 feeds; Legal department halts HIPAA BAA signoff.',
    nextMilestone: 'Acquire synthetic HL7 patient feed sandbox to resume offline pipeline tests.',
    blockers: [
      {
        id: 'b-zh-1',
        title: 'FHIR API sandbox authentication key creation',
        stage: 'Technical Scoping',
        owner: 'Gregory Cox (Customer)',
        ageDays: 25,
        nextAction: 'Escalate to VP IT to authorize Epic app credentials.'
      },
      {
        id: 'b-zh-2',
        title: 'HIPAA BAA contract revision regarding AI processing boundaries',
        stage: 'Technical Scoping',
        owner: 'Linda Vance (Customer)',
        ageDays: 19,
        nextAction: 'Incorporate updated regional patient data safety clauses.'
      }
    ],
    commitments: [
      {
        id: 'c-zh-1',
        title: 'Send sanitized sample patient eligibility PDF reports manually to verify matcher parsing',
        owner: 'Dr. Evelyn Reed (Customer)',
        type: 'Customer',
        dueDate: '2026-06-15',
        status: 'At Risk',
        source: 'Executive Steering Group',
        lastUpdated: '2026-06-10'
      },
      {
        id: 'c-zh-2',
        title: 'Configure mock FHIR sandbox running patient mock dataset',
        owner: 'Arjun Mehta (Vendor)',
        type: 'Vendor',
        dueDate: '2026-06-22',
        status: 'Open',
        source: 'Weekly Implementation Sync',
        lastUpdated: '2026-06-19'
      }
    ],
    risks: [
      {
        id: 'r-zh-1',
        title: 'Project Cancellation over BAA Terms',
        severity: 'High',
        description: 'Customer legal takes conservative stance on patient data cloud ingestion and might cancel the pilot if BAA negotiation stalls for another 3 weeks.',
        impact: 'Loss of $600K potential expanded ARR subscription contract.',
        mitigation: 'Suggest transitioning to a fully decentralized on-prem container deployment bypass.',
        owner: 'Arjun Mehta',
        status: 'Open'
      }
    ],
    productSignals: [
      {
        id: 'ps-zh-1',
        theme: 'Human Review Workflow',
        type: 'Workflow Gap',
        evidence: 'Evelyn requested that clinical checkers have audit records displaying exactly which section of clinical trials dictated exclusionary criteria.',
        customerImpact: 'Requires deep provenance audit trail implementation on model outputs.',
        frequency: 14,
        priority: 'P1'
      },
      {
        id: 'ps-zh-2',
        theme: 'Data Connector',
        type: 'Integration Gap',
        evidence: 'Epic HL7 v2 messaging structure has extremely customized local formats. Model pipeline requires custom adapter mapping schemas.',
        customerImpact: 'Requires a HL7 parser scaffolding library out of the box.',
        frequency: 9,
        priority: 'P2'
      }
    ],
    readiness: [
      { id: 're-zh-1', category: 'Business Readiness', title: 'Clinical investigators aligned and pilot goals quantified', checked: true, owner: 'Dr. Evelyn Reed', notes: 'Completed. Goal is 5 eligible patients screened per hour.' },
      { id: 're-zh-2', category: 'Data Readiness', title: 'Historical synthetic demographics prepared', checked: false, owner: 'Arjun Mehta', notes: 'Blocked. Awaiting raw schema descriptors.' },
      { id: 're-zh-3', category: 'Security Readiness', title: 'HIPAA Business Associate Agreement signed and approved', checked: false, owner: 'Linda Vance', notes: 'Extremely blocked. Status stuck in legal deadlock.' },
      { id: 're-zh-4', category: 'Integration Readiness', title: 'Epic FHIR server connection verified', checked: false, owner: 'Gregory Cox', notes: 'Blocked. Network routes are currently blocking all API handshakes.' }
    ],
    notesHistory: [
      {
        id: 'n-zh-1',
        date: '2026-06-10',
        title: 'Critical Gateway Blockage',
        content: 'Informatics lead Gregory notified us that testing with actual historical records requires complete sandbox segregation and static IP verification. He cannot proceed without internal security tickets being approved, which normally takes up to 45 business days. Arjun highlighted that legal BAA disputes regarding cloud model caching must be resolved during the next executive review.'
      }
    ],
    statusUpdates: []
  },
  {
    id: 'atlas-manufacturing',
    customer: 'Atlas Manufacturing',
    industry: 'Heavy Industry & Manufacturing',
    arr: '$180,000',
    stage: 'Prototype',
    health: 'green',
    owner: 'Sarah Connor (Senior FDE)',
    objective: 'Predictive maintenance alert translation and triage automation for industrial telemetry feeds.',
    problem: 'Maintenance crews receive 5,000+ machine warning alerts weekly, with 80% false positives, missing critical bearing failure telemetry.',
    workflow: 'Sensors -> Kafka Stream -> Fault Translator LLM -> Supervisor Operations Dashboard.',
    metric: 'Decrease false alert frequency by 70% and raise early predictive catch rates of hydraulic system leaks.',
    lastUpdated: '2026-06-17',
    executiveSummary: 'The telemetry translation model has successfully completed prototype sandbox testing, accurately classifying hydraulic faults with 93.1% precision. Crews express high satisfaction with simplified, plain-English summary suggestions.',
    stakeholders: [
      { name: 'John Miller', role: 'Director of Maintenance Tech', email: 'john.miller@atlasmfg.com' },
      { name: 'Clara Oswald', role: 'Head of Industrial IoT Servicess', email: 'clara.o@atlasmfg.com' }
    ],
    systems: ['Siemens MindSphere IoT Suite', 'Custom CAN-Bus logging files', 'EMQ Broker', 'Slack Notifications API'],
    timeline: [
      { date: '2026-05-15', stage: 'Discovery', note: 'Kickoff call. Understood severe crew alert fatigue issues.', achieved: true },
      { date: '2026-05-28', stage: 'Workflow Mapping', note: 'Mapped bearing failure indicators and operator control structures.', achieved: true },
      { date: '2026-06-12', stage: 'Technical Scoping', note: 'Agreed on Kafka ingestion parameters & sensor schema metadata.', achieved: true },
      { date: '2026-06-16', stage: 'Prototype', note: 'Completed dispatcher alert summarization model dashboard demo.', achieved: true }
    ],
    currentBlocker: 'None. Transitioning scheduled work towards validation stages.',
    nextMilestone: 'Integrate active telemetry streams into sandbox staging environments.',
    blockers: [],
    commitments: [
      {
        id: 'c-at-1',
        title: 'Add support for industrial telemetry formats (JSON schema definitions)',
        owner: 'Sarah Connor (Vendor)',
        type: 'Vendor',
        dueDate: '2026-06-22',
        status: 'Open',
        source: 'Prototype Showcase',
        lastUpdated: '2026-06-17'
      }
    ],
    risks: [],
    productSignals: [
      {
        id: 'ps-at-1',
        theme: 'Data Connector',
        type: 'Integration Gap',
        evidence: 'Atlas uses Siemens MindSphere. Lacking an out-of-the-box ingestion plug for MindSphere forced manual webhook scraping.',
        customerImpact: 'Adds heavy code overhead for IoT accounts.',
        frequency: 6,
        priority: 'P2'
      }
    ],
    readiness: [
      { id: 're-at-1', category: 'Business Readiness', title: 'Define critical predictive metrics targets', checked: true, owner: 'John Miller', notes: 'Aiming to capture telemetry errors before equipment shutoff loops activate.' },
      { id: 're-at-2', category: 'Data Readiness', title: 'Gather industrial sensor historical log sets for bearing failure patterns', checked: true, owner: 'Clara Oswald', notes: 'Acquired 10GB of telemetry logs.' },
      { id: 're-at-3', category: 'Security Readiness', title: 'Assess on-prem edge container security constraints', checked: true, owner: 'Sarah Connor', notes: 'Completed. Industrial systems isolated via local subnet routing.' }
    ],
    notesHistory: [],
    statusUpdates: []
  },
  {
    id: 'meridian-retail',
    customer: 'Meridian Retail',
    industry: 'Consumer Retail',
    arr: '$310,000',
    stage: 'Discovery',
    health: 'yellow',
    owner: 'Alex Carver (Solutions Architect)',
    objective: 'Deploy AI Customer Service Assistant to process post-purchase return exceptions and loyalty data loops.',
    problem: 'Sourcing transaction schemas and shipping data across multiple CRM platforms delays returns resolution by up to 5 days.',
    workflow: 'Zendesk -> Loyalty Schema Parser -> Order Inventory API -> Suggested Response generator.',
    metric: 'Halve average returns resolution window and decrease operator triage times to under 3 minutes.',
    lastUpdated: '2026-06-19',
    executiveSummary: 'Engagement is YELLOW. Discovery is complete and goals look very high-value, but we are currently waiting for the customer technical lead to supply Shopify custom database schemas and webhook tokens, preventing progress into Workflow Mapping.',
    stakeholders: [
      { name: 'Sarah Jenkins', role: 'VP Customer Success Systems', email: 's.jenkins@meridianretail.com' },
      { name: 'Tyler Durden', role: 'Lead Shopify Architect', email: 'tyler.durden@meridianretail.com' }
    ],
    systems: ['Shopify Custom Database', 'Klaviyo Segment API', 'Zendesk Customer Portal'],
    timeline: [
      { date: '2026-06-10', stage: 'Discovery', note: 'Completed discovery kickoff and mapped return policies.', achieved: true },
      { date: '2026-06-24', stage: 'Workflow Mapping', note: 'Develop schema catalog and outline customer support escalation paths.', achieved: false }
    ],
    currentBlocker: 'Awaiting Shopify transactional database schemas and API hook configurations.',
    nextMilestone: 'Secure trial data schemas from Shopify internal teams.',
    blockers: [
      {
        id: 'b-mr-1',
        title: 'Shopify order history schema files and field keys documentation',
        stage: 'Discovery',
        owner: 'Tyler Durden (Customer)',
        ageDays: 8,
        nextAction: 'Weekly escalation call scheduled to secure file dumps.'
      }
    ],
    commitments: [
      {
        id: 'c-mr-1',
        title: 'Document standard integration webhook security patterns',
        owner: 'Alex Carver (Vendor)',
        type: 'Vendor',
        dueDate: '2026-06-25',
        status: 'Open',
        source: 'Discovery Session',
        lastUpdated: '2026-06-19'
      }
    ],
    risks: [],
    productSignals: [],
    readiness: [
      { id: 're-mr-1', category: 'Business Readiness', title: 'Align business targets and track customer return bottlenecks', checked: true, owner: 'Sarah Jenkins', notes: 'Ready. Aiming to reduce ticket backlogs by 40%.' },
      { id: 're-mr-2', category: 'Data Readiness', title: 'Ingest representative Shopify shipping customer data', checked: false, owner: 'Tyler Durden', notes: 'Blocked. Awaiting test database export files.' }
    ],
    notesHistory: [],
    statusUpdates: []
  },
  {
    id: 'horizon-energy',
    customer: 'Horizon Energy',
    industry: 'Energy & Utilities',
    arr: '$500,000',
    stage: 'Expansion',
    health: 'green',
    owner: 'Arjun Mehta (Lead FDE)',
    objective: 'Expand smart grid asset tracking analysis to regional wind farm telemetry installations.',
    problem: 'Turbine failure assessments require specialized mechanical review, creating month-long backlogs across wind installations.',
    workflow: 'Turbine SCADA Hub -> Vibration Model Classifier -> Mechanical Repair Instruction drafts.',
    metric: 'Improve failure triage output capacity by 4x and enable predictive turbine shutdowns within minutes of sensor damage signs.',
    lastUpdated: '2026-06-16',
    executiveSummary: 'Success! The core grid system pilot in North Texas achieved a 99.1% mechanical diagnosis accuracy score. Grid engineers have completely operationalized the workflow. General Manager has approved a $500K pipeline expansion contract to cover wind installations in West Texas.',
    stakeholders: [
      { name: 'Roger Sterling', role: 'GM Smart Energy Grid', email: 'roger.sterling@horizonenergy.com' },
      { name: 'Jane Olsen', role: 'VP Infrastructure Maintenance', email: 'jane.olsen@horizonenergy.com' }
    ],
    systems: ['AeroSCADA Data Lake', 'Oracle Grid Control Cloud', 'Field Service Tickets API'],
    timeline: [
      { date: '2025-10-10', stage: 'Discovery', note: 'Discovered high maintenance repair delays due to localized wind telemetry parsing issues.', achieved: true },
      { date: '2025-11-20', stage: 'Workflow Mapping', note: 'Completed telemetry loop audits.', achieved: true },
      { date: '2025-12-15', stage: 'Technical Scoping', note: 'Completed technical scoping on SCADA streaming interfaces.', achieved: true },
      { date: '2026-01-10', stage: 'Prototype', note: 'Shipped pilot models predicting anomalous vibration patterns.', achieved: true },
      { date: '2026-02-25', stage: 'Validation', note: 'Engineers verified prediction alerts on 14 wind turbines.', achieved: true },
      { date: '2026-04-10', stage: 'Production Hardening', note: 'Enabled edge processing configurations inside SCADA gateways.', achieved: true },
      { date: '2026-05-15', stage: 'Handoff', note: 'Handed over full cluster operation guides and trained service desks.', achieved: true },
      { date: '2026-06-01', stage: 'Expansion', note: 'Expansion agreement signed. Deploying vibration detection protocols for Wind Hub B.', achieved: true }
    ],
    currentBlocker: 'None. Expansion contracts have rolled out smoothly.',
    nextMilestone: 'Map out the vibration schemas for Nordex Wind Telemetry sensors in Hub B.',
    blockers: [],
    commitments: [
      {
        id: 'c-hz-1',
        title: 'Deliver sensor catalogs outlining Nordex turbine specs',
        owner: 'Jane Olsen (Customer)',
        type: 'Customer',
        dueDate: '2026-06-25',
        status: 'Open',
        source: 'Expansion Kickoff',
        lastUpdated: '2026-06-15'
      }
    ],
    risks: [],
    productSignals: [
      {
        id: 'ps-hz-1',
        theme: 'Deployment Monitoring',
        type: 'Customization Debt',
        evidence: 'Wind Farm teams noticed that edge telemetry classifiers drift over time. They want a simple deployment-drift metrics dashboard to view pipeline performance.',
        customerImpact: 'Medium; will become a critical maintenance block over the next 12 months.',
        frequency: 4,
        priority: 'P2'
      }
    ],
    readiness: [
      { id: 're-hz-1', category: 'Business Readiness', title: 'Secure expansion approvals and set target success limits', checked: true, owner: 'Roger Sterling', notes: 'Complete. Expansion contract activated.' },
      { id: 're-hz-2', category: 'Data Readiness', title: 'Integrate SCADA vibration feeds for Hub B', checked: false, owner: 'Arjun Mehta', notes: 'Telemetry sensors are scheduled to stream pipeline outputs starting next week.' }
    ],
    notesHistory: [],
    statusUpdates: []
  }
];

export const PLAYBOOKS: Playbook[] = [
  {
    id: 'pb-discovery',
    title: 'Discovery Call Playbook',
    description: 'Structure customer intake calls to uncover actual operational bottlenecks, security enclaves, API versions, and quantify baseline ARR impact.',
    stage: 'Discovery',
    requiredOutputs: ['Customer target objective', 'Target systems to ingest', 'Primary metrics & success criteria'],
    checklistCount: 6
  },
  {
    id: 'pb-mapping',
    title: 'Workflow Mapping Playbook',
    description: 'Document step-by-step actions performed by current customer operators, tracking individual manual handoffs and database read-writes.',
    stage: 'Workflow Mapping',
    requiredOutputs: ['Current raw data flow map', 'Operator exception pathways handbook', 'Latency threshold bounds document'],
    checklistCount: 8
  },
  {
    id: 'pb-scoping',
    title: 'Technical Scoping Playbook',
    description: 'Align network gateways, virtual enclaves, database query schemas, compliance constraints, HIPAA BAA clauses, and firewalls with IT leads.',
    stage: 'Technical Scoping',
    requiredOutputs: ['Virtual tenancy specification', 'JSON request/response schemas', 'Infosec approvals sign-off sheet'],
    checklistCount: 11
  },
  {
    id: 'pb-prototype',
    title: 'Prototype Demo Playbook',
    description: 'Build a high-fidelity visual sandbox using real or synthetic telemetry models, to obtain primary sponsor approval for model performance.',
    stage: 'Prototype',
    requiredOutputs: ['Model metrics baseline record', 'Operator mockup dashboard approval', 'Sanitized feedback matrix sheet'],
    checklistCount: 7
  },
  {
    id: 'pb-ready',
    title: 'Production Readiness Playbook',
    description: 'Establish load thresholds, SLA triggers, health checks, rate limits, audit trail log configurations, and failover safeguard scripts.',
    stage: 'Production Hardening',
    requiredOutputs: ['Production cluster allocation plan', 'Leaky-bucket rate limit config', 'Emergency fallback static route script'],
    checklistCount: 14
  },
  {
    id: 'pb-handoff',
    title: 'Handoff Playbook',
    description: 'Transfer operational logs and runbooks to internal customer support desks, and conduct supervisor training exception runs.',
    stage: 'Handoff',
    requiredOutputs: ['FDE deployment runbook docs', 'Supervisor exception logging guide', 'Support contact resolution tiers chart'],
    checklistCount: 9
  }
];

export const AGGREGATE_PRODUCT_THEMES: ProductThemeAggregate[] = [
  {
    theme: 'Data Connector',
    type: 'Integration Gap',
    customersAffected: ['Acme Logistics', 'Zenith Health', 'Atlas Manufacturing'],
    arrImpacted: '$1,020,000',
    evidenceSnippets: [
      'Acme: V1 lacks native connector to modern SAP S/4HANA streams. Had to write customized extractor scripts.',
      'Zenith: Epic HL7 v2 messaging structure has extremely customized local formats. Model pipeline requires custom adapter mapping schemas.',
      'Atlas: Atlas uses Siemens MindSphere. Lacking an out-of-the-box ingestion plug for MindSphere forced manual webhook scraping.'
    ],
    priority: 'Critical',
    suggestedAction: 'Build robust, modular Enterprise DB Connectors for SAP S/4HANA OData streams and HL7 schema parsing to bypass bespoke scripting delays.'
  },
  {
    theme: 'Enterprise Auth',
    type: 'Security Requirement',
    customersAffected: ['Northstar Bank'],
    arrImpacted: '$450,000',
    evidenceSnippets: [
      'Northstar: Security architect explicitly warned that we cannot go to production without Active Directory token revocation listening.'
    ],
    priority: 'High',
    suggestedAction: 'Integrate active token revocation webhook listening in the enterprise OAuth security module to support Active Directory and Ping Identity protocols.'
  },
  {
    theme: 'Human Review Workflow',
    type: 'Workflow Gap',
    customersAffected: ['Northstar Bank', 'Zenith Health'],
    arrImpacted: '$1,050,000',
    evidenceSnippets: [
      'Northstar: Elizabeth expects underwriters to click a check symbol directly next to individual sentences within the credit report to log feedback.',
      'Zenith: Evelyn requested that clinical checkers have audit records displaying exactly which section of clinical trials dictated exclusionary criteria.'
    ],
    priority: 'Critical',
    suggestedAction: 'Implement inline citation links and sentence-level validation markers. This lets operators verify & check off AI summary components against raw PDF text blocks.'
  },
  {
    theme: 'Audit Logging',
    type: 'Security Requirement',
    customersAffected: ['Acme Logistics'],
    arrImpacted: '$240,000',
    evidenceSnippets: [
      'Acme: Marcus emphasized that dispatch routing decisions must have granular historical audibility to defend vehicle allocation decisions in compliance hearings.'
    ],
    priority: 'Medium',
    suggestedAction: 'Incorporate detailed audit trailing records tracking exactly which telemetry values, thresholds, and routing algorithmic models were live during any dispatch recommendation.'
  },
  {
    theme: 'Deployment Monitoring',
    type: 'Customization Debt',
    customersAffected: ['Horizon Energy'],
    arrImpacted: '$500,000',
    evidenceSnippets: [
      'Horizon: Wind Farm teams noticed that edge telemetry classifiers drift over time. They want a simple deployment-drift metrics dashboard to view pipeline performance.'
    ],
    priority: 'Medium',
    suggestedAction: 'Provision localized model monitoring agents inside SCADA edge instances that routinely check classification drift and generate telemetry logs.'
  }
];
