'use client';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/services/tokenManager';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '@/components/layout/ThemeToggle';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import { getOrCreateKeyPair } from "@/lib/dpop/store";
import { createDPoPProof } from "@/lib/dpop/proof";

export default function Topbar() {
    const router = useRouter();
    const [userProfileDropdownOpen, setUserProfileDropdownOpen] =
        useState(false); // Set initial to false
    const userProfileDropdownRef = useRef<HTMLDivElement>(null);
    const userProfileButtonRef = useRef<HTMLButtonElement | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fullName = user?.fullName || '';
    const userId = user?.id || '';

    const closeUserProfileDropdown = (e: MouseEvent) => {
        if (
            userProfileDropdownRef.current &&
            !userProfileDropdownRef.current.contains(e.target as Node) &&
            !userProfileButtonRef.current?.contains(e.target as Node)
        ) {
            setUserProfileDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeUserProfileDropdown);

        return () => {
            document.removeEventListener('mousedown', closeUserProfileDropdown);
        };
    }, []);

    const handleLogout = async () => {
        try {
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
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };

    const handleUserMenuDropdownToggle = () => {
        setUserProfileDropdownOpen(!userProfileDropdownOpen);
    };

    return (
        <div className="flex justify-between items-center w-full">
            <div>
                <span>Last visited: </span>
                <select className="!h-6">
                    <option>/admin/status</option>
                    <option>/admin/system-option</option>
                    <option>/admin/system-option</option>
                </select>
            </div>

            <div className="flex justify-between">
                {/* <ThemeToggle /> */}
                <button
                    ref={userProfileButtonRef}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleUserMenuDropdownToggle}
                >
                    <span>{fullName}</span>
                    <UserCircle className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {userProfileDropdownOpen && (
                <div
                    ref={userProfileDropdownRef}
                    className="absolute top-6.5 right-5 mt-2 bg-gray-200 rounded-sm shadow-lg w-48 z-50"
                >
                    <Link
                        onClick={handleUserMenuDropdownToggle}
                        href={`/admin/user/details/${userId}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    >
                        My Profile
                    </Link>

                    <Link
                        onClick={handleUserMenuDropdownToggle}
                        href="/admin/user/change-password"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    >
                        Change Password
                    </Link>

                    <Link
                        onClick={handleUserMenuDropdownToggle}
                        href="/admin/change-others-password"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    >
                        Change Other&apos;s Password
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
