'use client';

import Link from 'next/link';
import BrandLogo from './BrandLogo';

function ProductsIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" />
            <path d="M14 8l4 4-4 4M18 12H9" />
        </svg>
    );
}

export default function Sidebar({ isOpen, pathname, onToggle, onClose, onLogout }) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 overflow-hidden border-r border-slate-200 bg-white transition-[width,transform] duration-200 lg:z-30 ${
                isOpen ? 'w-56 translate-x-0 lg:w-64' : 'w-20 -translate-x-full lg:translate-x-0'
            }`}
        >
            <div className="flex h-full flex-col">
                <div className={`relative flex h-16 items-center ${isOpen ? 'px-6' : 'justify-center px-2'}`}>
                    <Link className={`inline-flex items-center ${isOpen ? '' : 'lg:hidden'}`} href="/products">
                        <BrandLogo />
                    </Link>
                    <button
                        className={`hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand hover:bg-teal-50 lg:inline-flex ${isOpen ? 'absolute right-3 top-3' : 'relative'}`}
                        onClick={onToggle}
                        type="button"
                        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        aria-expanded={isOpen}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            {isOpen ? <><path d="m14 7-5 5 5 5" /><path d="m19 7-5 5 5 5" /></> : <><path d="m10 7 5 5-5 5" /><path d="m5 7 5 5-5 5" /></>}
                        </svg>
                    </button>
                    <button className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden" onClick={onClose} type="button" aria-label="Close sidebar">
                        <span className="text-xl leading-none">×</span>
                    </button>
                </div>
                <nav className={`flex-1 space-y-1 ${isOpen ? 'p-4' : 'p-2'}`}>
                    <p className={`px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${isOpen ? '' : 'lg:hidden'}`}>Workspace</p>
                    <Link
                        className={`flex items-center rounded-lg py-2.5 text-sm font-semibold transition ${isOpen ? 'gap-3 px-3' : 'justify-center px-2'} ${pathname.startsWith('/products') ? 'bg-brand text-white shadow-[0_6px_14px_rgba(15,118,110,0.24)] hover:bg-[#0b5d57]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        href="/products"
                    >
                        <ProductsIcon />
                        <span className={isOpen ? '' : 'lg:hidden'}>Products</span>
                    </Link>
                </nav>
                <div className={`border-t border-slate-200 ${isOpen ? 'p-4' : 'p-2'}`}>
                    <button className={`flex w-full items-center rounded-lg border border-red-200 bg-red-50 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 ${isOpen ? 'gap-3 px-3' : 'justify-center px-2'}`} onClick={onLogout} type="button">
                        <LogoutIcon />
                        <span className={isOpen ? '' : 'lg:hidden'}>Log out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
