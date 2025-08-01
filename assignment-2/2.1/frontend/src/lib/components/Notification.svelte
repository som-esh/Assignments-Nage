<script>
  import { notificationStore } from "$lib/stores/notifications";

  export let id;
  export let message;
  export let type = "info";

  const typeStyles = {
    info: "bg-blue-100 border-blue-400 text-blue-700",
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  };
</script>

<div
  class={`fixed top-4 right-4 border-l-4 p-4 max-w-xs ${typeStyles[type]} shadow-lg z-50`}
>
  <div class="flex justify-between">
    <p>{message}</p>
    <button on:click={() => notificationStore.remove(id)} class="ml-4">✕</button
    >
  </div>
</div>
