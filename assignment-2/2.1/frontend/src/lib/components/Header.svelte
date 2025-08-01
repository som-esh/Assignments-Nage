<script>
  import { authStore } from "$lib/stores/auth";
  import { cartCount } from "$lib/stores/cart";
  import { goto } from "$app/navigation";

  function logout() {
    authStore.set(null);
    goto("/login");
  }
</script>

<header class="bg-white shadow-sm">
  <div class="container mx-auto px-4 py-4 flex justify-between items-center">
    <a href="/" class="text-xl font-bold text-indigo-600">eShop</a>

    <div class="flex items-center space-x-4">
      <a href="/products" class="hover:text-indigo-600">Products</a>

      <div class="relative">
        <a href="/cart" class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span
            class="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            {$cartCount}
          </span>
        </a>
      </div>

      {#if $authStore}
        <div class="flex items-center space-x-2">
          <span>Hi, {$authStore.username}</span>
          <button on:click={logout} class="btn btn-primary">Logout</button>
        </div>
      {:else}
        <a href="/login" class="btn btn-primary">Login</a>
      {/if}
    </div>
  </div>
</header>
