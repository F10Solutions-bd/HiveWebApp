'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/services/tokenManager';
import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { LuUserCog } from 'react-icons/lu';
import { RiBankLine, RiBarChart2Line } from 'react-icons/ri';
import {
    LayoutDashboard,
    DollarSign,
    Users,
    Truck,
    LogOut,
    ChevronRight,
} from 'lucide-react';

import { getOrCreateKeyPair } from "@/lib/dpop/store";
import { createDPoPProof } from "@/lib/dpop/proof";

/* ---------------- Circle Icon ---------------- */
const CircleIcon = ({ active = false }) => (
    <span className="relative flex items-center justify-center w-4 h-4">
        <span
            className={`absolute w-4 h-4 rounded-full border ${active ? 'border-white' : 'border-black/40'
                }`}
        />
        <span
            className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-black/40'
                }`}
        />
    </span>
);

/* ---------------- Menu Config ---------------- */
const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Accounting', icon: DollarSign, path: '/accounting' },
    { name: 'Compliance', icon: RiBankLine, path: '/compliance' },
    { name: 'Reports', icon: RiBarChart2Line, path: '/reports' },
    { name: 'Admin', icon: LuUserCog, path: '/admin' },
    { name: 'CRM', icon: Users, path: '/crm' },
    { name: 'Load Board', icon: Truck, path: '/load' },
    // { name: 'User & Contacts', icon: Truck, path: '/loads' },
];

const adminDropdownItems = [
    { name: 'Status', path: '/admin/status' },
    { name: 'Services', path: '/admin/service' },
    { name: 'Projects', path: '/admin/project' },
    { name: 'Offices', path: '/admin/office' },
    { name: 'System Options', path: '/admin/system-option' },
    { name: 'System Log', path: '/admin/system-log' },
    { name: 'Service Table', path: '/admin/service-table' },
    { name: 'User Profile', path: '/admin/user' },
    { name: 'Contacts & Vendors', path: '/admin/user-contacts/contacts' },
    { name: 'Active Users', path: '/admin/active-users' },
];

/* ---------------- Sidebar ---------------- */
export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    /* Auto open Admin menu when on /admin routes */
    useEffect(() => {
        if (pathname.startsWith('/admin')) {
            setAdminMenuOpen(true);
        }
    }, [pathname]);

    const closeAdminMenu = () => {
        setAdminMenuOpen(false);
    };

    const handleLogout = async () => {
        const url = `${baseUrl}/auth/logout`;
        try {
            const accessToken = await getAccessToken();
            const keyPair = await getOrCreateKeyPair();
            const dpopProof = await createDPoPProof('POST', url, keyPair);
            const res = await axios.post(
                `${baseUrl}/auth/logout`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        DPoP: dpopProof || ""
                    }
                }
            );

            if (res.status === 200 && res.data) {
                localStorage.setItem('user', JSON.stringify(res.data.data));
                router.push('/login');
            } else {
                toast.error('Logout failed. Please try again.');
            }
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };

    const isSubActive = (subItemPath: string) => {
        if (pathname === subItemPath) {
            return true;
        }

        // Case 1: If the pathname contains "user-contacts" (for both User and User Contacts)
        if (pathname.includes('user-contacts')) {
            // We want both "User Management" and "User Contacts" to be active if "user-contacts" is in the pathname
            if (subItemPath === '/admin/user-contacts/contacts') {
                return true;
            }
        }

        // Case 2: If the pathname contains "user" but not "user-contacts"
        if (
            pathname.includes('user') &&
            !pathname.includes('user-contacts') &&
            !pathname.includes('active-users')
        ) {
            if (subItemPath === '/admin/user') {
                return true; // Only the "User Management" subitem should be active
            }
        }

        return false;
    };

    return (
        <div className="h-screen w-48 p-2 bg-white text-black flex flex-col shadow-[4px_0_12px_rgba(0,0,0,0.08)] overflow-auto scrollbar-hide">
            {/* Logo */}
            <div>
                <img
                    src="/hive-brand-logo.png"
                    className="w-full"
                    alt="Hive Brand Logo"
                />
            </div>

            {/* Search */}
            <div className="pt-2 relative w-full group">
                <FiSearch
                    className="absolute left-4 top-[1.65rem] -translate-y-1/2 text-black/30 transition-opacity group-focus-within:opacity-0"
                    size={25}
                />
                <input
                    type="text"
                    placeholder="Search"
                    className=" w-full !bg-black/10 !border-1 !border-transparent !shadow-none !rounded-lg !p-4.5 !pl-13 placeholder:!text-black/30 placeholder:!text-[13px] placeholder:!font-semibold focus:!pl-4 focus:!bg-white focus:!border-1 focus:!border-black/30 !transition-all "
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 pt-2 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isAdmin = item.name === 'Admin';
                    const isActive = pathname === item.path;

                    if (isAdmin) {
                        const isAdminActive = pathname.startsWith('/admin');
                        return (
                            <div key={item.name}>
                                {/* Admin parent */}
                                <button
                                    onClick={() =>
                                        setAdminMenuOpen((prev) => !prev)
                                    }
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isAdminActive
                                            ? 'bg-[var(--base-bg)] text-white'
                                            : 'text-black hover:bg-[#c3e5ec]'
                                        }`}
                                >
                                    <Icon
                                        size={20}
                                        className={`text-black/40 ${isAdminActive ? 'bg-[var(--base-bg)] !text-white' : 'text-black/40'}`}
                                    />

                                    <span className="text-[0.75rem] font-semibold flex-1 text-left">
                                        Admin
                                    </span>

                                    {/* Right angle icon */}
                                    <ChevronRight
                                        size={16}
                                        className={`transition-transform duration-200 ${adminMenuOpen
                                                ? 'rotate-90'
                                                : 'rotate-0'
                                            }`}
                                    />
                                </button>

                                {/* Admin dropdown */}
                                {adminMenuOpen && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {adminDropdownItems.map((subItem) => {
                                            const isSubAdminActive =
                                                isSubActive(subItem.path);

                                            return (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.path}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[0.7rem] font-semibold transition-colors ${isSubAdminActive
                                                            ? 'bg-[var(--base-bg)] text-white'
                                                            : 'text-black/70 hover:bg-black/5'
                                                        }`}
                                                >
                                                    <CircleIcon
                                                        active={
                                                            isSubAdminActive
                                                        }
                                                    />
                                                    {subItem.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    /* Default menu item */
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            onClick={closeAdminMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-[var(--base-bg)] text-white'
                                    : 'text-black hover:bg-[#c3e5ec]'
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`text-black/40 ${isActive ? 'bg-[var(--base-bg)] !text-white' : 'text-black/40'}`}
                            />
                            <span className="text-[0.75rem] font-semibold">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-gray-200">
                <button
                    onClick={handleLogout}
                    className="
                        group
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        w-full cursor-pointer
                        transition-colors
                        text-gray-500
                        hover:bg-red-400
                    "
                >
                    <LogOut
                        size={20}
                        className="
                            text-red-400
                            transition-colors
                            group-hover:text-white
                        "
                    />
                    <span
                        className="
                            text-[0.75rem] font-semibold flex-1 text-left
                            text-black/90
                            transition-colors
                            group-hover:text-white
                        "
                    >
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
}
