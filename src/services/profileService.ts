// CLIENT-SIDE STORAGE for Profiles
import type { LearnerProfile } from '../types';

const PROFILE_KEY_PREFIX = 'eai_profile_local_';

export const fetchProfile = async (userId: string): Promise<{ userId: string; profile: LearnerProfile | null }> => {
  const stored = localStorage.getItem(`${PROFILE_KEY_PREFIX}${userId}`);
  return { userId, profile: stored ? JSON.parse(stored) : null };
};

export const updateProfile = async (userId: string, profile: LearnerProfile, consentScopes: string[] = []) => {
  localStorage.setItem(`${PROFILE_KEY_PREFIX}${userId}`, JSON.stringify(profile));
  return { ok: true };
};