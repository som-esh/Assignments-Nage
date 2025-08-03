<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { addToCart } from "$lib/stores/cart.js";
  import { get } from "svelte/store";

  import { goto } from "$app/navigation";

  let productId;
  let product = null;
  let loading = true;
  let error = "";

  let quantity = 1;

  $: productId = $page.params.id;

  async function fetchProduct(id) {
    loading = true;
    error = "";
    try {
      const res = await fetch(`http://localhost:3000/products/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch product with ID: ${id}`);
      }
      product = await res.json();
    } catch (e) {
      error = e.message;
      product = null;
    } finally {
      loading = false;
    }
  }

  $: if (productId) {
    fetchProduct(productId);
  }
  function handleAddToCart() {
    if (!product) return;
    if (quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }
    addToCart(product, quantity);
    alert(`Added ${quantity} x ${product.name} to your cart.`);
  }
  function gotoCart() {
    goto("/cart");
  }
</script>

{#if loading}
  <p>Loading product details...</p>
{:else if error}
  <p class="text-red-600">Error: {error}</p>
{:else if product}
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">{product.name}</h1>

    <p class="mb-2"><strong>Price:</strong> ${product.price.toFixed(2)}</p>
    <p class="mb-2"><strong>Category:</strong> {product.category || "N/A"}</p>
    <p class="mb-2">
      <strong>Availability:</strong>
      <span class={product.stock > 0 ? "text-green-600" : "text-red-600"}>
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </span>
    </p>
    <p class="mb-4">
      <strong>Description:</strong>
      {product.description || "No description available."}
    </p>

    <div class="flex items-center space-x-2 mb-4">
      <label for="quantity" class="font-semibold">Quantity:</label>
      <input
        id="quantity"
        type="number"
        min="1"
        max={product.stock}
        bind:value={quantity}
        class="border rounded px-2 py-1 w-20"
      />
    </div>

    <button
      class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
      on:click={handleAddToCart}
      disabled={product.stock === 0}
    >
      Add to Cart
    </button>
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
      on:click={gotoCart}
      disabled={product.stock === 0}
    >
      GoTo Cart
    </button>
  </div>
{:else}
  <p>Product not found.</p>
{/if}

<style>
  /* Add your styles or Tailwind CSS utilities */
</style>
