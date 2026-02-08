import { apiFetch } from './apiClient';
import type { LearnerProfile } from '../types';

export const fetchProfile = (userId: string) => {
  const params = new URLSearchParams({ userId });
  return apiFetch<{ userId: string; profile: LearnerProfile | null }>(`/api/profile?${params.toString()}`);
};

export const updateProfile = (userId: string, profile: LearnerProfile, consentScopes: string[] = []) => {
  return apiFetch('/api/profile', {
    method: 'PUT',
    body: { userId, profile, consentScopes }
  });
};
