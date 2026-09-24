'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '../lib/auth';

const navigationItems = [
    {
        label: 'Products',
        href: '/products',
        icon: '▦',
    },
];

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
                        {navigationItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);

                            return (
                                <Link
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-teal-50 text-brand'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                    href={item.href}
                                    key={item.href}
                                >
                                    <span className="text-lg leading-none">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="border-t border-slate-200 p-4">
                        <button
                            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                            onClick={handleLogout}
                            type="button"
                        >
                            <span aria-hidden="true">↪</span>
                            Log out
                        </button>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
                    <div className="flex h-16 items-center justify-between px-4">
                        <Link
                            className="text-lg font-bold tracking-tight text-brand"
                            href="/products"
                        >
                            Product Admin
                        </Link>
                        <button
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
                            onClick={handleLogout}
                            type="button"
                        >
                            Log out
                        </button>
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
}
