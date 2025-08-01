import { notificationStore } from '$lib/stores/notifications';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_URL = `${API_BASE_URL}/users/login`;

const API_URL = 'http://localhost:3000/auth/login';

export async function loginUser(username, password) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "username": username, "password": password })
    });

    console.error(response)
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    notificationStore.send(`Login failed: ${error.message}`, 'error');
    throw error;
  }
}