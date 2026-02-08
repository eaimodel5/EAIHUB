import { apiFetch } from './apiClient';

export type AssignmentInput = {
  classId?: string | null;
  studentId?: string | null;
  pathId: string;
  dueAt?: number | null;
};

export const createAssignment = (payload: AssignmentInput) => {
  return apiFetch<{ assignment: any }>('/api/assignment', {
    method: 'POST',
    body: payload
  });
};

export const listAssignments = (params: { classId?: string; studentId?: string } = {}) => {
  const queryParams = new URLSearchParams();
  if (params.classId) queryParams.set('classId', params.classId);
  if (params.studentId) queryParams.set('studentId', params.studentId);
  const query = queryParams.toString();
  const suffix = query ? `?${query}` : '';
  return apiFetch<{ assignments: any[] }>(`/api/assignment${suffix}`);
};
