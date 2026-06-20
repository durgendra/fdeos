import { useCallback, useEffect, useState } from 'react';
import { engagementsApi } from '../api/engagementsApi';
import { mapApiEngagementToUi } from '../api/adapters';
import { Engagement } from '../types';

export function useEngagements(enabled: boolean) {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await engagementsApi.list();
      setEngagements(data.map((engagement) => mapApiEngagementToUi(engagement)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load engagements');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { engagements, setEngagements, loading, error, retry: load };
}
