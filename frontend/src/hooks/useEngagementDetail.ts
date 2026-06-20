import { useCallback, useEffect, useState } from 'react';
import { Engagement } from '../types';
import { engagementsApi } from '../api/engagementsApi';
import { commitmentsApi } from '../api/commitmentsApi';
import { risksApi } from '../api/risksApi';
import { productSignalsApi } from '../api/productSignalsApi';
import { readinessApi } from '../api/readinessApi';
import { notesApi } from '../api/notesApi';
import { statusUpdatesApi } from '../api/statusUpdatesApi';
import { mapApiEngagementToUi } from '../api/adapters';

export function useEngagementDetail(enabled: boolean, engagementId?: string) {
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled || !engagementId) return;
    setLoading(true);
    setError(null);
    try {
      const [base, commitments, risks, productSignals, readiness, notes, statusUpdates] = await Promise.all([
        engagementsApi.get(engagementId),
        commitmentsApi.list(engagementId).catch(() => []),
        risksApi.list(engagementId).catch(() => []),
        productSignalsApi.list(engagementId).catch(() => []),
        readinessApi.list(engagementId).catch(() => []),
        notesApi.list(engagementId).catch(() => []),
        statusUpdatesApi.list(engagementId).catch(() => [])
      ]);
      setEngagement(mapApiEngagementToUi(base, { commitments, risks, productSignals, readiness, notes, statusUpdates }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load engagement');
      setEngagement(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, engagementId]);

  useEffect(() => {
    load();
  }, [load]);

  return { engagement, setEngagement, loading, error, retry: load };
}
