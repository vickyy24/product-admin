'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AppShell from '../../components/AppShell';
import Pagination from '../../components/Pagination';
import ProductCards from '../../components/ProductCards';
import ProductTable from '../../components/ProductTable';
import StatusMessage from '../../components/StatusMessage';
import { isAuthenticated } from '../../lib/auth';
import { getCategories, getProducts } from '../../lib/products';

const pageSizes = [10, 20, 50];

function ProductsView() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const requestId = useRef(0);
    const rawPage = Number(searchParams.get('page'));
    const rawPageSize = Number(searchParams.get('size'));
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const pageSize = pageSizes.includes(rawPageSize) ? rawPageSize : 10;
    const searchQuery = searchParams.get('q') || '';
    const selectedCategory = searchParams.get('category') || '';
    const selectedSort = searchParams.get('sort') || '';
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [productsResponse, setProductsResponse] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthReady, setIsAuthReady] = useState(false);

    const updateSearchParams = useCallback(
        (key, value) => {
            const nextParams = new URLSearchParams(searchParams.toString());

            if (value) {
                nextParams.set(key, value);
            } else {
                nextParams.delete(key);
            }

            if (key !== 'page') {
                nextParams.set('page', '1');
            }

            router.push(`${pathname}?${nextParams.toString()}`);
        },
        [pathname, router, searchParams]
    );

    function handleSearchChange(event) {
        setSearchInput(event.target.value);
    }

    function handlePageChange(nextPage) {
        updateSearchParams('page', String(nextPage));
    }

    function handleCategoryChange(event) {
        updateSearchParams('category', event.target.value);
    }

    function handleSortChange(event) {
        updateSearchParams('sort', event.target.value);
    }

    function handlePageSizeChange(event) {
        updateSearchParams('size', event.target.value);
    }

    function handleRetry() {
        setProductsResponse(null);
        setErrorMessage('');
        setIsLoading(true);
        router.refresh();
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/');
            return;
        }

        setIsAuthReady(true);
    }, [router]);

    useEffect(() => {
        if (searchInput.trim() === searchQuery) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            updateSearchParams('q', searchInput.trim());
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [searchInput, searchQuery, updateSearchParams]);

    useEffect(() => {
        let isMounted = true;
        getCategories()
            .then((result) => {
                if (isMounted) {
                    setCategories(result);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setCategories([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const currentRequestId = ++requestId.current;
        setIsLoading(true);
        setErrorMessage('');

        getProducts({
            limit: pageSize,
            skip: (page - 1) * pageSize,
            search: searchQuery,
            category: selectedCategory,
            sort: selectedSort,
        })
            .then((result) => {
                if (currentRequestId === requestId.current) {
                    setProductsResponse(result);
                }
            })
            .catch((error) => {
                if (currentRequestId === requestId.current) {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                if (currentRequestId === requestId.current) {
                    setIsLoading(false);
                }
            });
    }, [page, pageSize, searchQuery, selectedCategory, selectedSort]);

    const visibleProducts = useMemo(() => {
        return (productsResponse?.products || []).filter((product) => {
            return !selectedCategory || product.category === selectedCategory;
        });
    }, [productsResponse, selectedCategory]);

    const total = selectedCategory ? visibleProducts.length : productsResponse?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    useEffect(() => {
        if (productsResponse && page > totalPages) {
            updateSearchParams('page', String(totalPages));
        }
    }, [page, productsResponse, totalPages, updateSearchParams]);

    if (!isAuthReady) {
        return null;
    }

    return (
        <AppShell>
            <main className="mx-auto w-[92%] max-w-7xl py-8 md:py-10">
                <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage your product catalog.</p>
                    </div>
                    <Link
                        className="w-full rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0b5d57] hover:shadow-md sm:w-auto"
                        href="/products/new"
                    >
                        Add product
                    </Link>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
                    <input
                        className="rounded-lg border bg-white px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                    />
                    <select
                        className="rounded-lg border bg-white px-3 py-2.5 outline-none focus:border-brand"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <select
                        className="rounded-lg border bg-white px-3 py-2.5 outline-none focus:border-brand"
                        value={selectedSort}
                        onChange={handleSortChange}
                    >
                        <option value="">Sort by</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="title">Title</option>
                    </select>
                </div>

                <div className="mt-6">
                    {isLoading ? (
                        <StatusMessage title="Loading products..." />
                    ) : errorMessage ? (
                        <StatusMessage
                            title="Something went wrong"
                            description={errorMessage}
                            action={
                                <button
                                    className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
                                    onClick={handleRetry}
                                    type="button"
                                >
                                    Retry
                                </button>
                            }
                        />
                    ) : visibleProducts.length === 0 ? (
                        <StatusMessage
                            title="No products found"
                            description="Try changing your search or filter."
                        />
                    ) : (
                        <>
                            <ProductTable products={visibleProducts} />
                            <ProductCards products={visibleProducts} />
                            <div className="mt-5">
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    total={total}
                                    pageSizes={pageSizes}
                                    onPageSizeChange={handlePageSizeChange}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </div>
            </main>
        </AppShell>
    );
}

export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <main className="mx-auto w-[92%] max-w-7xl py-10">
                    <StatusMessage title="Loading products..." />
                </main>
            }
        >
            <ProductsView />
        </Suspense>
    );
}
