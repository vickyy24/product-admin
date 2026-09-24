'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '../lib/auth';

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

    function handleLogout() {
        logout();
        router.replace('/');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center border-b border-slate-200 px-6">
                        <Link
                            className="text-lg font-bold tracking-tight text-brand"
                            href="/products"
                        >
                            Product Admin
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-1 p-4">
                        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Workspace
                        </p>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                pathname.startsWith('/products')
                                    ? 'bg-teal-50 text-brand'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                            href="/products"
                        >
                            <ProductsIcon />
                            Products
                        </Link>
                    </nav>

                    <div className="border-t border-slate-200 p-4">
                        <button
                            className="flex w-full items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                            onClick={handleLogout}
                            type="button"
                        >
                            <LogoutIcon />
                            Log out
                        </button>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex h-[72px] w-[92%] max-w-7xl items-center">
                        <Link
                            className="text-lg font-bold tracking-tight text-brand lg:hidden"
                            href="/products"
                        >
                            Product Admin
                        </Link>
                        <p className="hidden text-sm font-medium text-slate-500 lg:block">
                            Product workspace
                        </p>
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
}
