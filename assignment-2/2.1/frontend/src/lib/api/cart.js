import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';

// const API_URL = 'http://localhost:3000/cart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/cart`;

export async function syncCartWithBackend() {
  const user = get(authStore);
  if (!user) return;

  const response = await fetch(`${API_URL}/${user.id}`);

  if (response.ok) {
    const backendCart = await response.json();
    return backendCart;
  }
  return [];
}

export async function updateBackendCart(items) {
  const user = get(authStore);
  if (!user) return;

  await fetch(`${API_URL}/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items)
  });
}