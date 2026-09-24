'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    image: '',
};

export default function ProductForm() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;
    const [form, setForm] = useState(emptyForm);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    function handleImageChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please select a valid image file.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage('Image size must be 2 MB or smaller.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((currentForm) => ({
                ...currentForm,
                image: reader.result,
            }));
            setErrorMessage('');
        };
        reader.onerror = () => setErrorMessage('The image could not be read.');
        reader.readAsDataURL(file);
    }

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
            const { image, ...productFields } = form;
            const savedProduct = await saveProduct(
                {
                    ...productFields,
                    price: Number(form.price),
                    stock: Number(form.stock),
                },
                productId
            );
            const productWithImage = image
                ? {
                      ...savedProduct,
                      thumbnail: image,
                      images: [image],
                  }
                : savedProduct;

            localStorage.setItem(
                `product_override_${productWithImage.id}`,
                JSON.stringify(productWithImage)
            );

            if (!productId) {
                localStorage.setItem(
                    `product_created_${productWithImage.id}`,
                    JSON.stringify(productWithImage)
                );
            }
            router.replace(`/products/${productWithImage.id}`);
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
                        image: product.thumbnail || '',
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

                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                        Product image
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:font-semibold file:text-indigo-700 focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <span className="mt-1 text-xs font-normal text-slate-500">
                            Upload an image file up to 2 MB.
                        </span>
                        {form.image ? (
                            <Image
                                className="mt-3 h-32 w-32 rounded-lg border object-cover"
                                src={form.image}
                                alt="Selected product preview"
                                width={128}
                                height={128}
                                unoptimized
                            />
                        ) : null}
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
