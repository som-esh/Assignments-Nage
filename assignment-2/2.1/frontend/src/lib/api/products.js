// const API_URL = 'http://localhost:3000/products';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/products`;

export async function fetchProducts(query = '') {
  const url = query ? `${API_URL}?search=${query}` : API_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function fetchProductDetails(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }

  return response.json();
}