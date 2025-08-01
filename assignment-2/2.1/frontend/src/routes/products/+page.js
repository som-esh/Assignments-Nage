export async function load({ fetch }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/products`);
  // ...
}