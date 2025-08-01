<script>
  import { goto } from "$app/navigation";
  import { cartStore } from "$lib/stores/cart";
  import { authStore } from "$lib/stores/auth";
  import { notificationStore } from "$lib/stores/notifications";

  export let form;

  let orderStatus = form?.success ? "success" : "pending";

  // Clear cart on successful order
  if (form?.success) {
    cartStore.set([]);
  }
</script>

<div class="max-w-2xl mx-auto">
  {#if !authStore}
    <div class="text-center py-12">
      <p class="mb-4">You need to be logged in to view orders</p>
      <a href="/login" class="btn btn-primary">Login</a>
    </div>
  {:else if orderStatus === "pending"}
    <div class="text-center py-12">
      <h1 class="text-2xl font-bold mb-4">Processing Your Order</h1>
      <p>Please wait while we process your payment...</p>
    </div>
  {:else if form?.success}
    <div class="text-center py-12">
      <div class="text-green-500 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 class="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p class="text-lg mb-6">
        Your order ID is: <span class="font-mono bg-gray-100 p-1 rounded"
          >{form.orderId}</span
        >
      </p>

      <p class="mb-8">
        Thank you for your purchase. A confirmation email has been sent.
      </p>

      <a href="/products" class="btn btn-primary">Continue Shopping</a>
    </div>
  {:else}
    <div class="text-center py-12">
      <div class="text-red-500 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 class="text-2xl font-bold mb-4">Order Failed</h1>
      <p class="mb-6">
        {form?.error || "There was a problem processing your order"}
      </p>

      <div class="flex justify-center space-x-4">
        <button on:click={() => goto("/cart")} class="btn btn-primary"
          >Return to Cart</button
        >
        <button on:click={() => goto("/products")} class="btn bg-gray-200"
          >Continue Shopping</button
        >
      </div>
    </div>
  {/if}
</div>
