'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { removeProduct } from '../lib/products';

function ProductImage({ product }) {
    return (
        <Image
            className="h-12 w-12 rounded-lg bg-slate-100 object-cover"
            src={product.thumbnail}
            alt=""
            width={48}
            height={48}
        />
    );
}

export default function ProductTable({ products }) {
    const [visibleProducts, setVisibleProducts] = useState(products);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setVisibleProducts(products);
    }, [products]);

    function openDeleteDialog(product) {
        setProductToDelete(product);
    }

    function closeDeleteDialog() {
        setProductToDelete(null);
    }

    async function confirmDelete() {
        if (!productToDelete || isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            await removeProduct(productToDelete.id);
            localStorage.setItem(`product_deleted_${productToDelete.id}`, 'true');
            setVisibleProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== productToDelete.id)
            );
            closeDeleteDialog();
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <div className="hidden w-full max-w-none overflow-x-auto rounded-b-xl border border-t-0 bg-white shadow-sm lg:block">
                <table className="w-full text-left">
                    <thead className="border-b border-teal-100 bg-teal-50 text-[11px] uppercase tracking-[0.18em] text-brand">
                        <tr>
                            <th className="px-5 py-4 font-bold">Product</th>
                            <th className="px-5 py-4 font-bold">Category</th>
                            <th className="px-5 py-4 font-bold">Price</th>
                            <th className="px-5 py-4 font-bold">Rating</th>
                            <th className="px-5 py-4 font-bold">Stock</th>
                            <th className="px-5 py-4 text-center font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {visibleProducts.map((product) => (
                            <tr key={product.id} className="text-sm text-slate-600">
                                <td className="px-5 py-4">
                                    <Link
                                        className="flex items-center gap-3 font-semibold text-slate-900 hover:text-brand"
                                        href={`/products/${product.id}`}
                                    >
                                        <ProductImage product={product} />
                                        {product.title}
                                    </Link>
                                </td>
                                <td className="px-5 py-4">{product.category}</td>
                                <td className="px-5 py-4">${product.price.toFixed(2)}</td>
                                <td className="px-5 py-4">★ {product.rating}</td>
                                <td className="px-5 py-4">{product.stock}</td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            className="rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                            href={`/products/${product.id}`}
                                        >
                                            View
                                        </Link>
                                        <Link
                                            className="rounded-lg bg-teal-50 px-3 py-2 font-semibold text-teal-700 transition hover:bg-teal-100 hover:text-teal-800"
                                            href={`/products/${product.id}/edit`}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700 transition hover:bg-red-100 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            type="button"
                                            onClick={() => openDeleteDialog(product)}
                                            disabled={isDeleting}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {productToDelete ? (
                <ConfirmDialog
                    title="Delete this product?"
                    description={`This will remove "${productToDelete.title}" from the dashboard. This action cannot be undone.`}
                    isConfirming={isDeleting}
                    onCancel={closeDeleteDialog}
                    onConfirm={confirmDelete}
                />
            ) : null}
        </>
    );
}
