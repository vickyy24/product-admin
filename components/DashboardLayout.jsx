'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '../lib/auth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
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
            {isSidebarOpen ? <button className="fixed inset-0 z-[45] bg-slate-950/35 backdrop-blur-md lg:hidden" onClick={() => setIsSidebarOpen(false)} type="button" aria-label="Close sidebar" /> : null}
            <Sidebar
                isOpen={isSidebarOpen}
                pathname={pathname}
                onToggle={() => setIsSidebarOpen((current) => !current)}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />
            <div className={`pt-16 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
                <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
                {children}
            </div>
        </div>
    );
}
