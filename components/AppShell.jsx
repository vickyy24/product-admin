'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '../lib/auth';
import BrandLogo from './BrandLogo';

function ProductsIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" />
            <path d="M14 8l4 4-4 4M18 12H9" />
        </svg>
    );
}

export default function AppShell({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setIsSidebarOpen(window.matchMedia('(min-width: 1024px)').matches);
    }, []);

    function handleLogout() {
        logout();
        router.replace('/');
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50">
            {isSidebarOpen ? (
                <button
                    className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    type="button"
                    aria-label="Close sidebar"
                />
            ) : null}

            <aside
                className={`fixed inset-y-0 left-0 z-30 overflow-hidden border-r border-slate-200 bg-white transition-[width,transform] duration-200 ${
                    isSidebarOpen
                        ? 'w-64 translate-x-0'
                        : 'w-20 -translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex h-full flex-col">
                    <div
                        className={`relative flex h-16 items-center border-b border-slate-200 ${
                            isSidebarOpen ? 'px-6' : 'justify-center px-2'
                        }`}
                    >
                        <Link
                            className={`inline-flex items-center ${
                                isSidebarOpen ? '' : 'lg:hidden'
                            }`}
                            href="/products"
                        >
                            <BrandLogo />
                        </Link>
                        <button
                            className={`hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand hover:bg-teal-50 lg:inline-flex ${
                                isSidebarOpen
                                    ? 'absolute right-3 top-3'
                                    : 'relative'
                            }`}
                            onClick={() => setIsSidebarOpen((current) => !current)}
                            type="button"
                            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                            aria-expanded={isSidebarOpen}
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                {isSidebarOpen ? (
                                    <>
                                        <path d="m14 7-5 5 5 5" />
                                        <path d="m19 7-5 5 5 5" />
                                    </>
                                ) : (
                                    <>
                                        <path d="m10 7 5 5-5 5" />
                                        <path d="m5 7 5 5-5 5" />
                                    </>
                                )}
                            </svg>
                        </button>
                        <button
                            className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                            type="button"
                            aria-label="Close sidebar"
                            aria-expanded={isSidebarOpen}
                        >
                            <span className="text-xl leading-none">×</span>
                        </button>
                    </div>

                    <nav
                        className={`flex-1 space-y-1 ${
                            isSidebarOpen ? 'p-4' : 'p-2'
                        }`}
                    >
                        <p
                            className={`px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                                isSidebarOpen ? '' : 'lg:hidden'
                            }`}
                        >
                            Workspace
                        </p>
                        <Link
                            className={`flex items-center rounded-lg py-2.5 text-sm font-semibold transition ${
                                isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'
                            } ${
                                pathname.startsWith('/products')
                                    ? 'bg-brand text-white shadow-[0_6px_14px_rgba(15,118,110,0.24)] hover:bg-[#0b5d57]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                            href="/products"
                        >
                            <ProductsIcon />
                            <span className={isSidebarOpen ? '' : 'lg:hidden'}>Products</span>
                        </Link>
                    </nav>

                    <div
                        className={`border-t border-slate-200 ${
                            isSidebarOpen ? 'p-4' : 'p-2'
                        }`}
                    >
                        <button
                            className={`flex w-full items-center rounded-lg border border-red-200 bg-red-50 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 ${
                                isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'
                            }`}
                            onClick={handleLogout}
                            type="button"
                        >
                            <LogoutIcon />
                            <span className={isSidebarOpen ? '' : 'lg:hidden'}>Log out</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className={`pt-16 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
                <header
                    className={`fixed right-0 top-0 z-40 h-16 border-b border-slate-200 bg-white ${
                        isSidebarOpen ? 'lg:left-64' : 'lg:left-20'
                    }`}
                >
                    <div className="mx-auto flex h-16 w-[92%] max-w-7xl items-center gap-4">
                        {!isSidebarOpen ? (
                            <button
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                                type="button"
                                aria-label="Open sidebar"
                                aria-expanded={isSidebarOpen}
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    aria-hidden="true"
                                >
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        ) : null}
                        {!isSidebarOpen ? (
                            <Link
                                className="ml-auto inline-flex items-center lg:hidden"
                                href="/products"
                            >
                                <BrandLogo compact />
                            </Link>
                        ) : null}
                        <div className="min-w-0">
                            <p className="hidden truncate text-base font-semibold leading-tight text-slate-700 sm:block sm:text-lg">
                                Manage your product catalog.
                            </p>
                        </div>
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
}
