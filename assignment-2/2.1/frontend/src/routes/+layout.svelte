<script>
  import Header from "$lib/components/Header.svelte";
  import { notificationStore } from "$lib/stores/notifications.js";
  import Notification from "$lib/components/Notification.svelte";
</script>

<div class="min-h-screen flex flex-col">
  <Header />
  <main class="flex-grow container mx-auto p-4">
    <slot />
  </main>

  {#each $notificationStore as notification (notification.id)}
    <Notification {...notification} />
  {/each}
</div>
