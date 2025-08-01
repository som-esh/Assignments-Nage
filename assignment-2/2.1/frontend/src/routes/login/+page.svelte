<script>
  import { authStore } from "$lib/stores/auth";
  import { loginUser } from "$lib/api/auth";
  import { goto } from "$app/navigation";

  let username = "";
  let password = "";
  let loading = false;
  let error = "";

  async function handleLogin() {
    loading = true;
    error = "";

    try {
      const user = await loginUser(username, password);
      authStore.set(user);
      goto("/products");
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-16">
  <h1 class="text-2xl font-bold mb-6">Login to your account</h1>

  {#if error}
    <div class="mb-4 p-3 bg-red-100 text-red-700 rounded">
      {error}
    </div>
  {/if}

  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="username" class="block mb-1">Username</label>
      <input
        id="username"
        type="text"
        bind:value={username}
        required
        class="w-full p-2 border rounded-md"
      />
    </div>

    <div>
      <label for="password" class="block mb-1">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        class="w-full p-2 border rounded-md"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      class="w-full btn btn-primary disabled:opacity-50"
    >
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>
</div>
