<script>
  import {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } from "$lib/stores/cart.js";
  import { token, user } from "$lib/stores/auth.js"; // Your auth store, if you maintain user info/token
  import { onDestroy } from "svelte";

  import { writable } from "svelte/store";

  let error = writable("");
  let success = writable("");
  let isSubmitting = writable(false);

  $: cartItems = $cart;

  // Calculate total price
  $: total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Handle quantity updates
  function onQuantityChange(id, event) {
    const qty = +event.target.value;
    if (qty >= 1) {
      updateQuantity(id, qty);
    }
  }

  // Remove item
  function onRemove(id) {
    removeFromCart(id);
  }

  // Clear any messages on component destroy
  onDestroy(() => {
    error.set("");
    success.set("");
  });

  // Place Order API call
  async function placeOrder() {
    error.set("");
    success.set("");
    if (!$user || !$token) {
      error.set("You must be logged in to place an order.");
      return;
    }
    if (cartItems.length === 0) {
      error.set("Your cart is empty.");
      return;
    }

    isSubmitting.set(true);

    try {
      const response = await fetch("http://localhost:3000/order", {
        // Adjust URL and port based on your backend order service
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$token}`,
        },
        body: JSON.stringify({
          userId: $user.userId || $user.id,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      success.set(
        `Order placed successfully! Order ID: ${data.id || data.orderId || ""}`,
      );
      clearCart(); // clear cart on successful order
    } catch (e) {
      error.set(e.message);
    } finally {
      isSubmitting.set(false);
    }
  }
</script>

<div class="max-w-4xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-6">Your Cart</h1>

  {#if $error}
    <div class="mb-4 p-3 bg-red-100 text-red-700 rounded">{$error}</div>
  {/if}

  {#if $success}
    <div class="mb-4 p-3 bg-green-100 text-green-700 rounded">{$success}</div>
  {/if}

  {#if cartItems.length === 0}
    <p>Your cart is empty.</p>
  {:else}
    <table class="w-full mb-6 border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 p-2 text-left">Product</th>
          <th class="border border-gray-300 p-2 text-right">Price</th>
          <th class="border border-gray-300 p-2 text-center">Quantity</th>
          <th class="border border-gray-300 p-2 text-right">Subtotal</th>
          <th class="border border-gray-300 p-2">Remove</th>
        </tr>
      </thead>
      <tbody>
        {#each cartItems as item}
          <tr class="hover:bg-gray-50">
            <td class="border border-gray-300 p-2">{item.name}</td>
            <td class="border border-gray-300 p-2 text-right"
              >${item.price.toFixed(2)}</td
            >
            <td class="border border-gray-300 p-2 text-center">
              <input
                type="number"
                min="1"
                class="w-16 border rounded px-1"
                bind:value={item.quantity}
                on:change={(e) => onQuantityChange(item.id, e)}
              />
            </td>
            <td class="border border-gray-300 p-2 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </td>
            <td class="border border-gray-300 p-2 text-center">
              <button
                class="text-red-600 hover:text-red-900"
                on:click={() => onRemove(item.id)}
                aria-label="Remove item"
              >
                &times;
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <td
            colspan="3"
            class="border border-gray-300 p-2 font-bold text-right">Total</td
          >
          <td class="border border-gray-300 p-2 text-right font-bold"
            >${total.toFixed(2)}</td
          >
          <td class="border border-gray-300 p-2"></td>
        </tr>
      </tfoot>
    </table>

    <button
      class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded"
      on:click={placeOrder}
      disabled={$isSubmitting}
    >
      {#if $isSubmitting}
        Placing Order...
      {/if}
      {#if !$isSubmitting}
        Place Order
      {/if}
    </button>
  {/if}
</div>

<style>
  /* Tailwind CSS utility classes are used, add custom styling if desired */
</style>
