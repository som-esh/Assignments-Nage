// src/routes/+page.server.js
import { redirect } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/config';

// export function load() {
//   throw redirect(307, '/login');
// }

export async function load({ url, fetch }) {
  // Get query parameters
  const page = parseInt(url.searchParams.get('page') || 1;
  const perPage = parseInt(url.searchParams.get('perPage') || 10;
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';
  const sort = url.searchParams.get('sort') || 'name';
  const order = url.searchParams.get('order') || 'asc';

  // Build API URL
  const apiUrl = new URL('http://localhost:3000/products');
  apiUrl.searchParams.append('page', page);
  apiUrl.searchParams.append('perPage', perPage);
  if (search) apiUrl.searchParams.append('search', search);
  if (category) apiUrl.searchParams.append('category', category);
  if (sort) apiUrl.searchParams.append('sort', sort);
  if (order) apiUrl.searchParams.append('order', order);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    return { status: response.status, error: await response.text() };
  }

  return await response.json();
}