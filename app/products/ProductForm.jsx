'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';
import { getProduct, saveProduct } from '../../lib/products';

const emptyForm = {
    title: '',
    category: '',
    price: '',
    stock: '',
    description: '',
};

export default function ProductForm() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;
    const [form, setForm] = useState(emptyForm);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    }

    function validateForm() {
        if (!form.title.trim()) {
            return 'Product title is required.';
        }

        if (Number(form.price) < 0 || Number(form.stock) < 0) {
            return 'Price and stock must be non-negative.';
        }

        return '';
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSaving) {
            return;
        }

        const validationMessage = validateForm();
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        setIsSaving(true);
        setErrorMessage('');

        try {
            const savedProduct = await saveProduct(
                {
                    ...form,
                    price: Number(form.price),
                    stock: Number(form.stock),
                },
                productId
            );

            localStorage.setItem(
                `product_override_${savedProduct.id}`,
                JSON.stringify(savedProduct)
            );

            if (!productId) {
                localStorage.setItem(
                    `product_created_${savedProduct.id}`,
                    JSON.stringify(savedProduct)
                );
            }
            router.replace(`/products/${savedProduct.id}`);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/');
            return;
        }

        if (productId) {
            getProduct(productId)
                .then((product) => {
                    setForm({
                        title: product.title || '',
                        category: product.category || '',
                        price: product.price ?? '',
                        stock: product.stock ?? '',
                        description: product.description || '',
                    });
                })
                .catch((error) => setErrorMessage(error.message));
        }
    }, [productId, router]);

    if (!isAuthenticated()) {
        return null;
    }

    return (
        <main className="mx-auto w-[92%] max-w-3xl py-8 md:py-10">
            <Link
                className="text-sm font-semibold text-slate-500 hover:text-brand"
                href="/products"
            >
                ← Back to products
            </Link>
            <div className="mb-6 mt-4">
                <h1 className="text-3xl font-bold text-slate-900">
                    {productId ? 'Edit product' : 'Add product'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    {productId
                        ? 'Update the product information below.'
                        : 'Add a new item to your catalog.'}
                </p>
            </div>

            <form
                className="rounded-2xl border bg-white p-6 shadow-sm md:p-8"
                onSubmit={handleSubmit}
            >
                {errorMessage ? (
                    <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Title
                        <input
                            className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Category
                        <input
                            className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            name="category"
                            value={form.category}
                            onChange={handleInputChange}
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Price
                        <input
                            className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                        Stock
                        <input
                            className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            name="stock"
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                        Description
                        <textarea
                            className="mt-2 min-h-32 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <Link
                        className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        href="/products"
                    >
                        Cancel
                    </Link>
                    <button
                        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save product'}
                    </button>
                </div>
            </form>
        </main>
    );
}
