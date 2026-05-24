/**
 * storage.ts — Native localStorage data layer
 * Replaces Firebase Firestore. All data stays on-device, zero cloud.
 */

export interface Submission {
  id: string;
  type: string;
  name: string;
  address: string;
  description: string;
  lat: number | null;
  lng: number | null;
  status: 'pending';
  createdAt: number;
}

const SUBMISSIONS_KEY = 'harmless:submissions';

export function saveSubmission(data: Omit<Submission, 'id' | 'status' | 'createdAt'>): Submission {
  const existing = getSubmissions();
  const submission: Submission = {
    ...data,
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: 'pending',
    createdAt: Date.now(),
  };
  existing.push(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing));
  return submission;
}

export function getSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}
