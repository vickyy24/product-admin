import { api } from './api';

export async function getProducts(params) {
    const endpoint = params.search
        ? '/products/search'
        : params.category
          ? `/products/category/${params.category}`
          : '/products';
    const { data } = await api.get(endpoint, {
        params: {
            q: params.search || undefined,
            limit: params.limit,
            skip: params.skip,
            sortBy: params.sort || undefined,
            order: params.sort ? 'asc' : undefined,
        },
    });
    if (typeof window === 'undefined') {
        return data;
    }

    const products = data.products
        .filter((product) => localStorage.getItem(`product_deleted_${product.id}`) !== 'true')
        .map((product) => {
            const override = localStorage.getItem(`product_override_${product.id}`);
            return override ? { ...product, ...JSON.parse(override) } : product;
        });
    const createdProductIds = Object.keys(localStorage)
        .filter((key) => key.startsWith('product_created_'))
        .map((key) => JSON.parse(localStorage.getItem(key)));

    return {
        ...data,
        products: [...createdProductIds, ...products],
        total: data.total + createdProductIds.length,
    };
}

export async function getCategories() {
    const { data } = await api.get('/products/categories');
    return data.map((category) => {
        return typeof category === 'string' ? category : category.slug;
    });
}

export async function getProduct(id) {
    const { data } = await api.get(`/products/${id}`);
    if (typeof window === 'undefined') {
        return data;
    }

    const override = localStorage.getItem(`product_override_${id}`);
    return override ? { ...data, ...JSON.parse(override) } : data;
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
