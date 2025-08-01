<script>
  import { notificationStore } from "$lib/stores/notifications";
  import { page } from "$app/stores";

  $: error = $page.error;

  notificationStore.send(error.message, "error");
</script>

<div class="max-w-md mx-auto text-center py-16">
  <h1 class="text-4xl font-bold mb-4">Oops!</h1>
  <p class="text-xl mb-8">{error.message}</p>
  <a href="/" class="btn btn-primary">Return Home</a>
</div>
