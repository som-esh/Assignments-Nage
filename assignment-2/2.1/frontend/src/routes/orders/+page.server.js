import { placeOrder } from '$lib/api/orders';
import { cartStore, cartTotal } from '$lib/stores/cart';
import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';

export const actions = {
  default: async () => {
    const cart = get(cartStore);
    const user = get(authStore);
    const total = get(cartTotal);
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }
    
    const order = {
      userId: user.id,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total
    };
    
    const result = await placeOrder(order);
    return { success: true, orderId: result.orderId };
  }
};