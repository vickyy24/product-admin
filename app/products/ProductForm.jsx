'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';
import { getProduct, saveProduct } from '../../lib/products';
import DashboardLayout from '../../components/DashboardLayout';

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
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    function handleImageChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setFieldErrors((currentErrors) => ({
                ...currentErrors,
                image: 'Please select a valid image file.',
            }));
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setFieldErrors((currentErrors) => ({
                ...currentErrors,
                image: 'Image size must be 2 MB or smaller.',
            }));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((currentForm) => ({
                ...currentForm,
                image: reader.result,
            }));
            setFieldErrors((currentErrors) => ({
                ...currentErrors,
                image: '',
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
        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [name]: '',
        }));
        setErrorMessage('');
    }

    function validateForm() {
        const errors = {};
        const title = form.title.trim();
        const category = form.category.trim();
        const description = form.description.trim();

        if (!title) {
            errors.title = 'Title is required.';
        } else if (!/^[A-Za-z0-9][A-Za-z0-9 .,'&()\-]{1,99}$/.test(title)) {
            errors.title = 'Title must be 2-100 characters and use standard text characters.';
        }

        if (category && !/^[A-Za-z0-9][A-Za-z0-9 &()\-]{1,49}$/.test(category)) {
            errors.category = 'Category must be 2-50 characters.';
        }

        if (!/^\d+(\.\d{1,2})?$/.test(String(form.price).trim())) {
            errors.price = 'Enter a valid non-negative price with up to 2 decimals.';
        }

        if (!/^\d+$/.test(String(form.stock).trim())) {
            errors.stock = 'Enter a valid non-negative whole number for stock.';
        }

        if (description.length > 1000) {
            errors.description = 'Description must be 1000 characters or fewer.';
        }

        return errors;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSaving) {
            return;
        }

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            setErrorMessage('Please correct the highlighted fields.');
            return;
        }

        setIsSaving(true);
        setErrorMessage('');
        setFieldErrors({});

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

        setIsAuthReady(true);

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

    if (!isAuthReady || !isAuthenticated()) {
        return null;
    }

    return (
        <DashboardLayout>
            <main className="mx-auto w-[96%] max-w-[1600px] py-4 lg:w-full lg:max-w-none lg:px-3 lg:py-3">
            <Link
                className="text-sm font-semibold text-slate-500 hover:text-brand"
                href="/products"
            >
                ← Back to products
            </Link>
            <div className="mb-4 mt-2">
                <h1 className="text-2xl font-bold text-slate-900">
                    {productId ? 'Edit product' : 'Add product'}
                </h1>
                {productId ? (
                    <p className="mt-1 text-sm text-slate-500">
                        Update the product information below.
                    </p>
                ) : null}
            </div>

            <form
                className="rounded-2xl border bg-white p-6 shadow-sm md:p-8"
                noValidate
                onSubmit={handleSubmit}
            >
                {errorMessage ? (
                    <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="title">
                        Title
                        <input
                            className="product-form-input"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            aria-invalid={Boolean(fieldErrors.title)}
                        />
                        {fieldErrors.title ? <span className="mt-1 block text-xs font-normal text-red-600">{fieldErrors.title}</span> : null}
                    </label>

                    <label className="text-sm font-semibold text-slate-700" htmlFor="category">
                        Category
                        <input
                            className="product-form-input"
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleInputChange}
                            aria-invalid={Boolean(fieldErrors.category)}
                        />
                        {fieldErrors.category ? <span className="mt-1 block text-xs font-normal text-red-600">{fieldErrors.category}</span> : null}
                    </label>

                    <label className="text-sm font-semibold text-slate-700" htmlFor="price">
                        Price
                        <input
                            className="product-form-input"
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleInputChange}
                            aria-invalid={Boolean(fieldErrors.price)}
                        />
                        {fieldErrors.price ? <span className="mt-1 block text-xs font-normal text-red-600">{fieldErrors.price}</span> : null}
                    </label>

                    <label className="text-sm font-semibold text-slate-700" htmlFor="stock">
                        Stock
                        <input
                            className="product-form-input"
                            id="stock"
                            name="stock"
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={handleInputChange}
                            aria-invalid={Boolean(fieldErrors.stock)}
                        />
                        {fieldErrors.stock ? <span className="mt-1 block text-xs font-normal text-red-600">{fieldErrors.stock}</span> : null}
                    </label>

                    <label
                        className="text-sm font-semibold text-slate-700 md:col-span-2"
                        htmlFor="description"
                    >
                        Description
                        <textarea
                            className="product-form-input product-form-textarea"
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            aria-invalid={Boolean(fieldErrors.description)}
                        />
                        {fieldErrors.description ? <span className="mt-1 block text-xs font-normal text-red-600">{fieldErrors.description}</span> : null}
                    </label>

                    <label
                        className="text-sm font-semibold text-slate-700 md:col-span-2"
                        htmlFor="product-image"
                    >
                        Product image
                        <input
                            className="mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:font-semibold file:text-indigo-700 focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            aria-invalid={Boolean(fieldErrors.image)}
                        />
                        {fieldErrors.image ? <span className="mt-1 block text-xs font-normal text-red-600">{fieldErrors.image}</span> : null}
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
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                        href="/products"
                    >
                        Cancel
                    </Link>
                    <button
                        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0b5d57] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save product'}
                    </button>
                </div>
            </form>
            </main>
        </DashboardLayout>
    );
}
