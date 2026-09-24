'use client';

import { FiMenu, FiUser, FiX } from 'react-icons/fi';

export default function Navbar({ isSidebarOpen, onToggleSidebar, user }) {
    const username = user?.username || 'admin';

    return (
        <header className={`fixed left-0 right-0 top-0 z-40 h-16 border-b border-slate-200 bg-white ${isSidebarOpen ? 'lg:left-64' : 'lg:left-20'}`}>
            <div className="relative mx-auto flex h-16 w-[92%] max-w-7xl items-center justify-between">
                <div className="flex items-center">
                    <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 lg:hidden" onClick={onToggleSidebar} type="button" aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'} aria-expanded={isSidebarOpen}>
                        {isSidebarOpen ? <FiX className="h-5 w-5" aria-hidden="true" /> : <FiMenu className="h-5 w-5" aria-hidden="true" />}
                    </button>
                    <p className="ml-3 truncate text-sm font-semibold text-slate-700 lg:hidden">Product Admin Dashboard</p>
                    <p className="hidden truncate text-base font-semibold leading-tight text-slate-700 lg:block lg:text-lg">Product Admin Dashboard</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-slate-50/80 py-1 pl-1.5 pr-3.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-100/70">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-inner">
                            <FiUser className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <span className="text-xs font-bold leading-none text-slate-800">{username}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
