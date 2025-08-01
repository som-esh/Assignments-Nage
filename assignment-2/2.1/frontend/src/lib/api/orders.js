import { notificationStore } from '$lib/stores/notifications';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/orders`;

// const API_URL = 'http://localhost:3000/orders';

export async function placeOrder(orderData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Order failed');
    }

    return response.json();
  } catch (error) {
    notificationStore.send(`Order failed: ${error.message}`, 'error');
    throw error;
  }
}