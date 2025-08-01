import { writable } from 'svelte/store';

function createNotificationStore() {
  const { subscribe, update } = writable([]);

  function send(message, type = 'info', timeout = 3000) {
    const id = Math.random().toString(36).slice(2);

    update(notifications => [
      ...notifications,
      { id, message, type }
    ]);

    setTimeout(() => remove(id), timeout);
  }

  function remove(id) {
    update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  return { subscribe, send, remove };
}

export const notificationStore = createNotificationStore();