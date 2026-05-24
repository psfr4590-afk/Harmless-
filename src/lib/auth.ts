/**
 * auth.ts — Native local identity
 * Replaces Firebase Auth. No accounts, no Google, no cloud.
 * Users can optionally set a local nickname stored in localStorage.
 */

const AUTH_KEY = 'harmless:user';

export interface LocalUser {
  nickname: string;
  createdAt: number;
}

export function getUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(nickname: string): LocalUser {
  const user: LocalUser = { nickname: nickname.trim(), createdAt: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY);
}
