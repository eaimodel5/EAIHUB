import { apiFetch } from './apiClient';

export type AnalyticsSnapshot = {
  activeSessions: number;
  totalMessages: number;
  avgLatencyMs: number;
  breachRate: number;
  updatedAt: number;
};

export const fetchAnalytics = () => apiFetch<AnalyticsSnapshot>('/api/analytics');
