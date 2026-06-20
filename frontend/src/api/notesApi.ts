import { apiRequest } from './client';
import { ApiNote, ExtractedIntelligence } from '../types/note';

export const notesApi = {
  list: (engagementId: string) => apiRequest<ApiNote[]>(`/engagements/${engagementId}/notes`),
  extract: (body: { engagementId: string; rawText: string; sourceType: string; title: string }) =>
    apiRequest<{ noteId: string; extracted: ExtractedIntelligence }>('/ai/extract-notes', { method: 'POST', body }),
  applyExtraction: (body: {
    noteId: string;
    applyToEngagement: boolean;
    createCommitments: boolean;
    createRisks: boolean;
    createProductSignals: boolean;
  }) => apiRequest<unknown>('/ai/apply-extraction', { method: 'POST', body })
};
