'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Loader from '../../../components/Loader';
import StatusMessage from '../../../components/StatusMessage';
import { isAuthenticated } from '../../../lib/auth';
import { getProduct, removeProduct } from '../../../lib/products';
import Button from '../../../components/Button';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const loadProduct = useCallback(() => {
        setProduct(null);
        setErrorMessage('');

        getProduct(id).catch((error) => {
            setErrorMessage(error.message);
        }).then((result) => {
            if (result) {
                setProduct(result);
            }
        });
    }, [id]);

    function handleDelete() {
        if (isDeleting) {
            return;
        }

        setIsDeleteDialogOpen(true);
    }

    function confirmDelete() {
        setIsDeleting(true);
        removeProduct(product.id)
            .then(() => {
                localStorage.setItem(`product_deleted_${product.id}`, 'true');
                router.replace('/products');
            })
            .catch((error) => setErrorMessage(error.message))
            .finally(() => {
                setIsDeleting(false);
                setIsDeleteDialogOpen(false);
            });
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/');
            return;
        }

        setIsAuthReady(true);

        loadProduct();
    }, [loadProduct, router]);

    if (!isAuthReady || !isAuthenticated()) {
        return null;
    }

    if (errorMessage && !product) {
        return (
            <DashboardLayout>
                <main className="mx-auto w-[96%] max-w-[1600px] py-4 lg:w-full lg:max-w-none lg:px-3 lg:py-3">
                    <StatusMessage
                        title="Unable to load product"
                        description={errorMessage}
                        action={
                    <div className="flex justify-center gap-3">
                        <Button
                            className="px-4 py-2"
                            onClick={loadProduct}
                        >
                            Retry
                        </Button>
                        <Link
                            className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                            href="/products"
                        >
                            Back to products
                        </Link>
                    </div>
                        }
                    />
                </main>
                {isDeleteDialogOpen ? (
                    <ConfirmDialog
                        title="Delete this product?"
                        description="This product will be removed from your dashboard. This action cannot be undone."
                        isConfirming={isDeleting}
                        onCancel={() => setIsDeleteDialogOpen(false)}
                        onConfirm={confirmDelete}
                    />
                ) : null}
            </DashboardLayout>
        );
    }

    if (!product) {
        return (
            <DashboardLayout>
                <main className="mx-auto w-[96%] max-w-[1600px] py-4 lg:w-full lg:max-w-none lg:px-3 lg:py-3">
                    <Loader label="Loading product..." />
                </main>
            </DashboardLayout>
        );
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

                <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{product.title}</h1>
                        <p className="mt-1 text-sm capitalize text-slate-500">{product.category}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            className="rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                            href={`/products/${product.id}/edit`}
                        >
                            Edit
                        </Link>
                        <button
                            className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                            onClick={handleDelete}
                            type="button"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>

                {errorMessage ? (
                    <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="mt-7 grid gap-8 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
                    <div>
                        <Image
                            className="aspect-square w-full rounded-xl bg-slate-100 object-contain"
                            src={product.images?.[0] || product.thumbnail}
                            alt={product.title}
                            width={640}
                            height={640}
                        />
                    </div>

                    <div>
                        <p className="leading-7 text-slate-600">{product.description}</p>
                        <p className="mt-6 text-3xl font-bold text-slate-900">${product.price}</p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                            <p className="rounded-lg bg-slate-50 p-3">Rating: ★ {product.rating}</p>
                            <p className="rounded-lg bg-slate-50 p-3">Stock: {product.stock}</p>
                        </div>

                        <h2 className="mt-8 text-xl font-bold text-slate-900">Reviews</h2>
                        <div className="mt-3 divide-y">
                            {product.reviews?.length ? (
                                product.reviews.map((review) => (
                                    <article
                                        className="py-4"
                                        key={`${review.reviewerName}-${review.date}`}
                                    >
                                        <div className="flex justify-between gap-4">
                                            <p className="font-semibold text-slate-900">
                                                {review.reviewerName}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                ★ {review.rating}
                                            </p>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {review.comment}
                                        </p>
                                    </article>
                                ))
                            ) : (
                                <p className="py-4 text-sm text-slate-500">No reviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
}
