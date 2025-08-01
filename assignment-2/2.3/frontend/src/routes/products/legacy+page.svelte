<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // Reactive state variables as simple variables (no stores needed for these)
  let searchName = "";
  let searchCategory = "";
  let sortField = "name";
  let sortOrder = "asc";
  let currentPage = 1;
  const itemsPerPage = 6;

  // API data and state
  let products = [];
  let totalPages = 1;
  let totalItems = 0;
  let loading = false;
  let error = "";

  // Static categories list (make sure it matches backend categories)
  const categories = ["All", "Electronics", "Clothing", "Books", "Sports"];

  // Fetch products from backend with query params
  async function fetchProducts() {
    loading = true;
    error = "";
    try {
      // Build query string parameters
      const params = new URLSearchParams();
      if (searchName.trim() !== "") params.append("search", searchName.trim());
      if (searchCategory && searchCategory !== "")
        params.append("category", searchCategory);
      if (sortField) params.append("sort", sortField);
      if (sortOrder) params.append("order", sortOrder);
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);

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
    } finally {
      loading = false;
    }
  }

  // Load products initially and whenever filter/sort/page changes
  $: debounceFetch();

  let debounceTimeout;
  function debounceFetch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchProducts();
    }, 300); // debounce 300ms to reduce backend calls
  }

  // Watch for changes in filters and reset page to 1
  function onSearchNameChange(e) {
    searchName = e.target.value;
    currentPage = 1;
  }
  function onCategoryChange(e) {
    searchCategory = e.target.value;
    currentPage = 1;
  }
  function onSortFieldChange(e) {
    sortField = e.target.value;
  }
  function onSortOrderChange(e) {
    sortOrder = e.target.value;
  }

  function changePage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
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
      bind:value={searchCategory}
      on:change={onCategoryChange}
    >
      <option value="">All Categories</option>
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>

    <select
      class="border rounded px-3 py-2"
      bind:value={sortField}
      on:change={onSortFieldChange}
    >
      <option value="name">Sort by Name</option>
      <option value="price">Sort by Price</option>
      <option value="category">Sort by Category</option>
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
    <p>Loading products...</p>
  {:else if error}
    <p class="text-red-600">Error: {error}</p>
  {:else if products.length === 0}
    <p>No products found matching your criteria.</p>
  {:else}
    <!-- Product cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each products as product}
        <div
          class="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
          on:click={() => (window.location.href = `/products/${product.id}`)}
        >
          <h2 class="text-lg font-semibold mb-2">{product.name}</h2>
          <p class="text-gray-600 mb-1">Price: ${product.price.toFixed(2)}</p>
          <p class="text-gray-600 mb-1">Category: {product.category}</p>
          <p class="text-gray-600 mb-1">
            Availability:
            <span
              class={product.availability ? "text-green-600" : "text-red-600"}
            >
              {product.availability ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      {/each}
    </div>

    <!-- Pagination Controls -->
    <div class="mt-6 flex justify-center space-x-3">
      <button
        class="px-3 py-1 border rounded disabled:opacity-50"
        on:click={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {#each Array(totalPages) as _, i}
        <button
          class="px-3 py-1 border rounded {currentPage === i + 1
            ? 'bg-blue-600 text-white'
            : ''}"
          on:click={() => changePage(i + 1)}
        >
          {i + 1}
        </button>
      {/each}

      <button
        class="px-3 py-1 border rounded disabled:opacity-50"
        on:click={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>

    <p class="mt-4 text-center text-gray-500">
      Showing page {currentPage} of {totalPages}, total {totalItems} products.
    </p>
  {/if}
</div>

<style>
  /* Tailwind CSS utility classes used for styling */
</style>
