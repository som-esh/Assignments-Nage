import { writable } from 'svelte/store';
import { browser } from '$app/environment';

//const storedUser = browser ? JSON.parse(localStorage.getItem('user') || null : null;

const storedUser = browser
  ? JSON.parse(localStorage.getItem('user') || 'null')
  : null;

export const authStore = writable(storedUser);

if (browser) {
  authStore.subscribe(user => {
    localStorage.setItem('user', JSON.stringify(user));
  });
}