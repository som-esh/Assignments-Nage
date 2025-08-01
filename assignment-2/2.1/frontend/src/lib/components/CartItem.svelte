<script>
  export let item;
  export let removeItem;
  export let updateQuantity;
</script>

<div class="flex items-center border-b py-4">
  <img
    src={item.image || "https://via.placeholder.com/100"}
    alt={item.name}
    class="w-20 h-20 object-cover rounded"
  />

  <div class="ml-4 flex-grow">
    <h3 class="font-medium">{item.name}</h3>
    <p class="text-gray-600">${item.price.toFixed(2)}</p>

    <div class="flex items-center mt-2">
      <button
        on:click={() => updateQuantity(item.id, item.quantity - 1)}
        class="bg-gray-200 rounded-l-md px-3 py-1"
        disabled={item.quantity <= 1}>-</button
      >

      <span class="bg-gray-100 px-4 py-1">{item.quantity}</span>

      <button
        on:click={() => updateQuantity(item.id, item.quantity + 1)}
        class="bg-gray-200 rounded-r-md px-3 py-1">+</button
      >

      <button
        on:click={() => removeItem(item.id)}
        class="ml-4 text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  </div>

  <div class="text-right">
    <p class="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
  </div>
</div>
