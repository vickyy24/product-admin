'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import ProductCards from '../../components/ProductCards';
import ProductTable from '../../components/ProductTable';
import StatusMessage from '../../components/StatusMessage';
import { isAuthenticated } from '../../lib/auth';
import { getCategories, getProducts } from '../../lib/products';
import { FiPlus, FiSearch } from 'react-icons/fi';
import Button from '../../components/Button';

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
        <DashboardLayout>
            <main className="mx-auto w-[96%] max-w-[1600px] py-4 lg:w-full lg:max-w-none lg:px-3 lg:py-3">
                <div className="mt-0 lg:rounded-t-xl lg:border lg:border-b-0 lg:border-slate-200 lg:bg-white lg:p-4 lg:pb-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-10">
                        <div className="flex items-center justify-between gap-3 lg:contents">
                            <h2 className="shrink-0 text-lg font-bold text-slate-900">Product catalogue</h2>
                            <Link
                                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(15,118,110,0.28)] transition hover:bg-[#0b5d57] lg:hidden"
                                href="/products/new"
                            >
                                <FiPlus className="h-3.5 w-3.5" aria-hidden="true" />
                                Add product
                            </Link>
                        </div>
                        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 max-sm:grid-cols-3 max-sm:gap-1.5 sm:grid-cols-2 lg:ml-auto lg:flex-none lg:grid-cols-[minmax(220px,320px)_150px_150px_auto]">
                        <div className="relative">
                            <FiSearch                             className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 max-sm:left-2 max-sm:h-3.5 max-sm:w-3.5" aria-hidden="true" />
                            <input
                                className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-teal-100 max-sm:h-9 max-sm:pl-7 max-sm:pr-1 max-sm:text-[11px]"
                                id="product-search"
                                value={searchInput}
                                onChange={handleSearchChange}
                                placeholder="Search products..."
                                aria-label="Search products"
                            />
                        </div>
                        <select
                            className="product-filter-control"
                            id="product-category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            aria-label="Filter by category"
                        >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <select
                            className="product-filter-control"
                            id="product-sort"
                            value={selectedSort}
                            onChange={handleSortChange}
                            aria-label="Sort products"
                        >
                            <option value="">Sort by</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                            <option value="title">Title</option>
                        </select>
                        <Link
                            className="hidden items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(15,118,110,0.28)] transition hover:bg-[#0b5d57] lg:inline-flex"
                            href="/products/new"
                        >
                            <FiPlus className="h-3.5 w-3.5" aria-hidden="true" />
                            Add product
                        </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-0">
                    {isLoading ? (
                        <Loader label="Loading products..." />
                    ) : errorMessage ? (
                        <StatusMessage
                            title="Something went wrong"
                            description={errorMessage}
                            action={
                                <Button
                                    className="px-4 py-2"
                                    onClick={handleRetry}
                                >
                                    Retry
                                </Button>
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
        </DashboardLayout>
    );
}

export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <main className="mx-auto w-[92%] max-w-7xl py-10">
                    <Loader label="Loading products..." />
                </main>
            }
        >
            <ProductsView />
        </Suspense>
    );
}
