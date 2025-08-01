<script>
  export let error;
  export let status;
</script>

<div class="p-6 max-w-xl mx-auto text-center">
  <h1 class="text-4xl font-bold text-red-600 mb-4">{status}</h1>
  <p class="mb-4">{error.message}</p>
  <a
    href="/"
    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Go Home
  </a>
</div>
