<script>
  export let product;
</script>

<div class="card h-full flex flex-col">
  <img
    src={product.image || "https://via.placeholder.com/300"}
    alt={product.name}
    class="w-full h-48 object-cover rounded-t-lg"
  />

  <div class="p-4 flex-grow">
    <h3 class="font-semibold text-lg mb-2">{product.name}</h3>
    <p class="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
    <p class="text-sm text-gray-500 mb-4">{product.category}</p>

    <div class="mt-auto">
      {#if product.stock > 0}
        <span class="text-green-600">In Stock ({product.stock})</span>
      {:else}
        <span class="text-red-600">Out of Stock</span>
      {/if}
    </div>
  </div>

  <div class="p-4">
    <a href={`/products/${product.id}`} class="btn btn-primary w-full"
      >View Details</a
    >
  </div>
</div>
