'use client';

export default function Navbar({ isSidebarOpen, onToggleSidebar }) {
    return (
        <header className={`fixed left-0 right-0 top-0 z-40 h-16 border-b border-slate-200 bg-white ${isSidebarOpen ? 'lg:left-64' : 'lg:left-20'}`}>
            <div className="relative mx-auto flex h-16 w-[92%] max-w-7xl items-center">
                <button className="absolute left-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 lg:hidden" onClick={onToggleSidebar} type="button" aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'} aria-expanded={isSidebarOpen}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        {isSidebarOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
                <p className="absolute left-12 truncate text-sm font-semibold text-slate-700 lg:hidden">Product Admin Dashboard</p>
                <p className="hidden truncate text-base font-semibold leading-tight text-slate-700 lg:block lg:text-lg">Product Admin Dashboard</p>
            </div>
        </header>
    );
}
