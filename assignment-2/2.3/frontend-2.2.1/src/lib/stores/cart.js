// import { writable } from 'svelte/store';

// const storedCart = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [];

// export const cart = writable(storedCart);

// cart.subscribe((items) => {
//   if (typeof localStorage !== 'undefined') {
//     localStorage.setItem('cart', JSON.stringify(items));
//   }
// });

// export function addToCart(product, quantity = 1) {
//   cart.update((items) => {
//     const existing = items.find((item) => item.id === product.id);
//     if (existing) {
//       return items.map((item) =>
//         item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
//       );
//     } else {
//       return [...items, { ...product, quantity }];
//     }
//   });
// }

import { writable } from 'svelte/store';

const storedCart = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [];

export const cart = writable(storedCart);

cart.subscribe(items => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
});

export function addToCart(product, quantity = 1) {
  cart.update(items => {
    const existing = items.find(item => item.id === product.id);
    if (existing) {
      return items.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    }
    return [...items, { ...product, quantity }];
  });
}

export function updateQuantity(productId, quantity) {
  if (quantity < 1) return; // guard minimum qty = 1
  cart.update(items =>
    items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
  );
}

export function removeFromCart(productId) {
  cart.update(items => items.filter(item => item.id !== productId));
}

export function clearCart() {
  cart.set([]);
  if (typeof localStorage !== 'undefined') localStorage.removeItem('cart');
}
