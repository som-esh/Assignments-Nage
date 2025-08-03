<script>
  import { page } from "$app/stores";
  import { cart as cartStore } from "$lib/stores/cart.js";
  import { derived } from "svelte/store";
  import "../app.css";

  const cartCount = derived(cartStore, ($cart) =>
    $cart.reduce((sum, item) => sum + item.quantity, 0),
  );
</script>

{#if $page.url.pathname !== "/login"}
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0 text-2xl font-bold text-blue-700">
          <a href="/login" class="hover:text-blue-900"
            >Ecommerce Svelte & Express</a
          >
        </div>
        <div class="hidden md:flex space-x-8">
          <a
            href="/products"
            class="text-gray-700 hover:text-blue-700 font-medium transition"
            >Products</a
          >
          <a
            href="/cart"
            class="relative text-gray-700 hover:text-blue-700 font-medium transition"
          >
            Cart
            {#if $cartCount > 0}
              <span
                class="absolute -top-2 -right-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
              >
                {$cartCount}
              </span>
            {/if}
          </a>
          <a
            href="/notification"
            class="text-gray-700 hover:text-blue-700 font-medium transition"
            >Notifications</a
          >
        </div>
      </div>
    </nav>
  </header>
{/if}

<main class="pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <slot />
</main>
