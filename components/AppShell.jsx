'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '../lib/auth';

export default function AppShell({ children }) {
    const router = useRouter();

    function handleLogout() {
        logout();
        router.replace('/');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b bg-white">
                <div className="mx-auto flex h-16 w-[92%] max-w-7xl items-center justify-between">
                    <Link className="text-lg font-bold text-brand" href="/products">
                        Product Admin
                    </Link>
                    <button
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        onClick={handleLogout}
                        type="button"
                    >
                        Log out
                    </button>
                </div>
            </header>
            {children}
        </div>
    );
}
