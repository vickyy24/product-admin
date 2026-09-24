import { api } from './api';

export async function getProducts(params) {
  const endpoint = params.search ? '/products/search' : '/products';
  const { data } = await api.get(endpoint, {
    params: {
      q: params.search || undefined,
      limit: params.limit,
      skip: params.skip,
      sortBy: params.sort || undefined,
      order: params.sort ? 'asc' : undefined
    }
  });
  return data;
}

export async function getCategories() {
  const { data } = await api.get('/products/category-list');
  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function saveProduct(product, id) {
  const { data } = id
    ? await api.put(`/products/${id}`, product)
    : await api.post('/products/add', product);
  return data;
}

export async function removeProduct(id) {
  await api.delete(`/products/${id}`);
}
