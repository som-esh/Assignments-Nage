<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  // Get orderId from URL search params or page data (depends on your routing)
  let orderId = "";

  $: orderId = $page.url.searchParams.get("orderId") || "";

  // Optionally fetch full order details if backend supports an order lookup API

  // Could add a message or special UI if orderId is missing or invalid
</script>

<div class="max-w-3xl mx-auto p-6 text-center">
  {#if orderId}
    <h1 class="text-3xl font-bold mb-4 text-green-700">Order Confirmed!</h1>
    <p class="mb-4">Thank you for your purchase.</p>
    <p class="text-lg font-semibold">
      Your Order ID: <span class="text-blue-600">{orderId}</span>
    </p>
    <button
      class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
      on:click={() => (window.location.href = "/products")}
    >
      Continue Shopping
    </button>
  {:else}
    <p class="text-red-600">Order ID is not available.</p>
  {/if}
</div>
