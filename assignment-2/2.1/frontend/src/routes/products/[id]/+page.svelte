<script>
  import { onMount } from "svelte";
  import { notificationStore } from "$lib/stores/notifications";
  import { cartStore } from "$lib/stores/cart";
  import { authStore } from "$lib/stores/auth";
  import { fetchProductDetails } from "$lib/api/products";
  import { goto } from "$app/navigation";

  export let data../$types.js;

  let product = data.product;
  let quantity = 1;
  let loading = false;

  function addToCart() {
    if (!authStore) {
      goto("/login");
      return;
    }

    cartStore.update((cart) => {
      const existing = cart.find((item) => item.id === product.id);

      if (existing) {
        return cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });

    notificationStore.send("Product added to cart!", "success");
  }
</script>

<div class="max-w-4xl mx-auto">
  {#if product}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.image || "https://via.placeholder.com/500"}
          alt={product.name}
          class="w-full h-96 object-contain rounded-lg"
        />
      </div>

      <div>
        <h1 class="text-3xl font-bold mb-2">{product.name}</h1>
        <p class="text-2xl text-indigo-600 mb-4">${product.price.toFixed(2)}</p>

        <div class="mb-6">
          <span class="text-gray-600">Category: </span>
          <span class="font-medium">{product.category}</span>
        </div>

        <div class="mb-6">
          <span class="text-gray-600">Availability: </span>
          {#if product.stock > 0}
            <span class="text-green-600 font-medium"
              >In Stock ({product.stock})</span
            >
          {:else}
            <span class="text-red-600 font-medium">Out of Stock</span>
          {/if}
        </div>

        <div class="mb-6">
          <p class="text-gray-700">
            {product.description || "No description available"}
          </p>
        </div>

        {#if product.stock > 0}
          <div class="flex items-center space-x-4 mb-6">
            <label for="quantity" class="text-gray-700">Quantity:</label>
            <input
              type="number"
              id="quantity"
              bind:value={quantity}
              min="1"
              max={product.stock}
              class="w-20 p-2 border rounded"
            />
          </div>

          <button on:click={addToCart} class="btn btn-primary w-full">
            Add to Cart
          </button>
        {:else}
          <button disabled class="btn btn-primary w-full opacity-50">
            Out of Stock
          </button>
        {/if}
      </div>
    </div>
  {:else}
    <div class="text-center py-12">
      <p>Product not found</p>
    </div>
  {/if}
</div>
