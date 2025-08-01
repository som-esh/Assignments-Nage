<script>
  import { onMount } from "svelte";
  import { cartStore, cartTotal, cartCount } from "$lib/stores/cart";
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { syncCartWithBackend, updateBackendCart } from "$lib/api/cart";
  import CartItem from "$lib/components/CartItem.svelte";

  let loading = false;
  let checkoutLoading = false;

  onMount(async () => {
    if (authStore) {
      loading = true;
      try {
        const backendCart = await syncCartWithBackend();
        cartStore.set(backendCart);
      } catch (error) {
        console.error("Failed to sync cart:", error);
      } finally {
        loading = false;
      }
    }
  });

  function removeItem(productId) {
    cartStore.update((cart) => cart.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;

    cartStore.update((cart) =>
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  }

  async function handleCheckout() {
    if (!authStore) {
      goto("/login");
      return;
    }

    checkoutLoading = true;

    try {
      await updateBackendCart($cartStore);
      goto("/orders");
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      checkoutLoading = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Your Shopping Cart</h1>

  {#if loading}
    <div class="text-center py-8">
      <p>Loading cart...</p>
    </div>
  {:else if $cartCount === 0}
    <div class="text-center py-12">
      <p class="mb-4">Your cart is empty</p>
      <a href="/products" class="btn btn-primary">Browse Products</a>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      {#each $cartStore as item (item.id)}
        <CartItem {item} {removeItem} {updateQuantity} />
      {/each}

      <div class="border-t pt-4 mt-4">
        <div class="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>${$cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div class="text-right">
      <button
        on:click={handleCheckout}
        disabled={checkoutLoading}
        class="btn btn-primary px-8 py-3 text-lg disabled:opacity-50"
      >
        {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
      </button>
    </div>
  {/if}
</div>
