import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const initialCart = browser ? JSON.parse(localStorage.getItem('cart')) || [] : [];
export const cartStore = writable(initialCart);

export const cartTotal = derived(cartStore, $cart =>
  $cart.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const cartCount = derived(cartStore, $cart =>
  $cart.reduce((count, item) => count + item.quantity, 0)
);

if (browser) {
  cartStore.subscribe(cart => {
    localStorage.setItem('cart', JSON.stringify(cart));
  });
}