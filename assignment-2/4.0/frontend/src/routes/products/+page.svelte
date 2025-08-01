<script>
  import { onMount } from "svelte";

  // Reactive state variables
  let searchName = "";
  let sortField = "name";
  let sortOrder = "asc";
  let currentPage = 1;
  const itemsPerPage = 10;

  // API data and state
  let products = [];
  let totalPages = 1;
  let totalItems = 0;
  let loading = false;
  let error = "";

  // Fetch products from backend with query params
  async function fetchProducts() {
    loading = true;
    error = "";
    try {
      // Build query string parameters
      const params = new URLSearchParams();
      if (searchName.trim() !== "") params.append("search", searchName.trim());
      if (sortField) params.append("sort", sortField);
      if (sortOrder) params.append("order", sortOrder);
      params.append("page", currentPage);
      params.append("perPage", itemsPerPage);

      const url = `http://localhost:3000/products?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await res.json();
      products = data.products || [];
      totalPages = data.totalPages || 1;
      totalItems = data.total || 0;
    } catch (e) {
      error = e.message;
      console.error("Fetch error:", e);
    } finally {
      loading = false;
    }
  }

  // Load products on mount
  onMount(fetchProducts);

  // Debounce function for search
  let debounceTimeout;
  function handleSearch() {
    clearTimeout(debounceTimeout);
    currentPage = 1; // Reset to first page when search changes
    debounceTimeout = setTimeout(fetchProducts, 300);
  }

  // Handle input changes
  function onSearchNameChange(e) {
    searchName = e.target.value;
    handleSearch();
  }
  
  function onSortFieldChange(e) {
    sortField = e.target.value;
    fetchProducts();
  }
  
  function onSortOrderChange(e) {
    sortOrder = e.target.value;
    fetchProducts();
  }

  function changePage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
</script>

<div class="max-w-7xl mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">Product Listing</h1>

  <!-- Filters and Sorting -->
  <div class="flex flex-wrap gap-4 mb-6 items-center">
    <input
      type="text"
      placeholder="Search by name"
      class="border rounded px-3 py-2 flex-grow min-w-[200px]"
      bind:value={searchName}
      on:input={onSearchNameChange}
    />

    <select
      class="border rounded px-3 py-2"
      bind:value={sortField}
      on:change={onSortFieldChange}
    >
      <option value="name">Sort by Name</option>
      <option value="price">Sort by Price</option>
      <option value="availability">Sort by Availability</option>
    </select>

    <select
      class="border rounded px-3 py-2"
      bind:value={sortOrder}
      on:change={onSortOrderChange}
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>

  <!-- Loading/Error -->
  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-2">Loading products...</p>
    </div>
  {:else if error}
    <p class="text-red-600 p-4 bg-red-50 rounded">Error: {error}</p>
  {:else if products.length === 0}
    <p class="text-center p-8 text-gray-500">No products found matching your criteria.</p>
  {:else}
    <!-- Product cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each products as product}
        <a
          href={`/products/${product.id}`}
          class="border rounded p-4 shadow hover:shadow-lg transition block bg-white"
        >
          <h2 class="text-lg font-semibold mb-2">{product.name}</h2>
          <p class="text-gray-600 mb-1">Price: ${product.price.toFixed(2)}</p>
          <p class="text-gray-600 mb-1">
            Stock: {product.stock} units
          </p>
          <p class="text-gray-600 mb-1">
            Availability:
            <span
              class={product.availability ? "text-green-600 font-medium" : "text-red-600"}
            >
              {product.availability ? " In Stock" : " Out of Stock"}
            </span>
          </p>
        </a>
      {/each}
    </div>

    <!-- Pagination Controls -->
    <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-gray-600">
        Showing <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - 
        <span class="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of 
        <span class="font-medium">{totalItems}</span> products
      </p>
      
      <div class="flex space-x-1">
        <button
          class="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
          on:click={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr; Prev
        </button>

        {#each Array(totalPages) as _, i}
          {#if i + 1 === currentPage || i + 1 === currentPage - 1 || i + 1 === currentPage + 1 || i === 0 || i === totalPages - 1}
            <button
              class={`px-4 py-2 border rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}
              on:click={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          {:else if i === 1 && currentPage > 3}
            <span class="px-3 py-2">...</span>
          {:else if i === totalPages - 2 && currentPage < totalPages - 2}
            <span class="px-3 py-2">...</span>
          {/if}
        {/each}

        <button
          class="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
          on:click={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  a {
    text-decoration: none;
    color: inherit;
  }
</style>