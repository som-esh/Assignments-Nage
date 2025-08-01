import { writable } from 'svelte/store';

export const user = writable(null);
export const token = writable(null);

export function setAuth(userInfo, authToken) {
  user.set(userInfo);
  token.set(authToken);
  localStorage.setItem('user', JSON.stringify(userInfo));
  localStorage.setItem('token', authToken);
}

export function clearAuth() {
  user.set(null);
  token.set(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}
