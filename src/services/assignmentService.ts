// CLIENT-SIDE STORAGE for Assignments
// Uses localStorage to persist assignments in the browser.

export type AssignmentInput = {
  classId?: string | null;
  studentId?: string | null;
  pathId: string;
  dueAt?: number | null;
};

const STORAGE_KEY = 'eai_assignments_v1';

export const createAssignment = async (payload: AssignmentInput) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const currentStr = localStorage.getItem(STORAGE_KEY);
  let current: any[] = [];
  try {
      current = currentStr ? JSON.parse(currentStr) : [];
  } catch (e) {
      current = [];
  }
  
  const newAssignment = { 
      id: `local-assign-${Date.now()}`, 
      ...payload, 
      createdAt: Date.now() 
  };
  
  const updated = [newAssignment, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return { assignment: newAssignment };
};

export const listAssignments = async (params: { classId?: string; studentId?: string } = {}) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const currentStr = localStorage.getItem(STORAGE_KEY);
  let assignments: any[] = [];
  try {
      assignments = currentStr ? JSON.parse(currentStr) : [];
  } catch (e) {
      assignments = [];
  }
  
  // Simple client-side filtering
  if (params.classId) {
      assignments = assignments.filter((a: any) => a.classId === params.classId);
  }
  if (params.studentId) {
      assignments = assignments.filter((a: any) => a.studentId === params.studentId);
  }
  
  return { assignments };
};