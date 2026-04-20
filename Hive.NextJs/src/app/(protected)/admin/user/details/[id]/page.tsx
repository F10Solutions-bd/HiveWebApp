/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaUser, FaShieldAlt } from 'react-icons/fa';
import Loader from '@/components/ui/Loader';
import NotFound from '@/components/ui/NotFound';
import { createApiClient } from '@/services/apiClient';
import { toDisplayDateString } from '@/utils/dateHelper';

interface Permission {
    id: number;
    name: string;
    granted: boolean;
}
interface Roles {
    id: number;
    name: string;
}
interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    birthDate?: string;
    isActive: boolean;
    roleIdList: number[];
    permissions: Permission[];
}

export default function UserDetailsPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tabList = ['basic', 'permissions'] as const;
    type TabType = (typeof tabList)[number];

    const api = createApiClient();
    const { id } = useParams();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('basic');
    const [roles, setRoles] = useState<Roles[]>([]);

    useEffect(() => {
        const userId = Number(id);
        if (!id || userId <= 0) return;

        const fetchData = async () => {
            try {
                const permRes = await api.get<Permission[]>('/permissions');
                const allPermissions = permRes.data ?? [];

                const userPermRes = await api.get<number[]>(
                    `/users/user-permissions/${userId}`
                );
                const grantedIds = userPermRes.data ?? [];

                const mergedPermissions = allPermissions.map((p) => ({
                    ...p,
                    granted: grantedIds.includes(p.id),
                }));

                const rolesRes = await api.get<Roles[]>('/roles');
                const userRolesRes = await api.get<object[]>(
                    `/roles/user-roles/${userId}`
                );
                const roleIdList = (userRolesRes.data ?? []).map(
                    (r: any) => r.id
                );

                const res = await api.get<User>(`/users/${userId}`);
                const userData = {
                    ...res.data,
                    id: userId,
                    birthDate: toDisplayDateString(res.data?.birthDate),
                    roleIdList,
                    permissions: mergedPermissions,
                } as User;

                setUser(userData);
                setRoles(rolesRes.data ?? []);
            } catch (err) {
                console.error('Error loading user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <Loader message="Loading page..." />;
    if (!user) return <NotFound message="User Not Found!" />;

    const containerClass = 'bg-white rounded-lg p-6';
    const sectionTitleClass =
        'text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 text-teal-600';
    const labelValueClass = 'flex items-center font-medium gap-2';

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    User Details
                </h1>

                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button
                        className={`flex items-center px-6 py-2 gap-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                            activeTab === 'basic'
                                ? 'border-teal-500 text-teal-600 bg-teal-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('basic')}
                    >
                        <FaUser /> Basic Info
                    </button>
                    <button
                        className={`flex items-center px-6 py-2 gap-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                            activeTab === 'permissions'
                                ? 'border-teal-500 text-teal-600 bg-teal-50'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('permissions')}
                    >
                        <FaShieldAlt /> Permissions
                    </button>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() =>
                            router.push(`/admin/user/edit/${user.id}`)
                        }
                        className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Edit User
                    </button>
                </div>

                {/* Content */}
                <div className={containerClass}>
                    {activeTab === 'basic' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className={sectionTitleClass}>
                                    Account Info
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={labelValueClass}>
                                        <p>Email:</p>
                                        <p>{user.email}</p>
                                    </div>

                                    <div className={labelValueClass}>
                                        <p>Active Account:</p>
                                        <p>{user.isActive ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className={sectionTitleClass}>
                                    Personal Info
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={labelValueClass}>
                                        <p>First Name: </p>
                                        <p>{user.firstName}</p>
                                    </div>
                                    <div className={labelValueClass}>
                                        <p>Last Name: </p>
                                        <p>{user.lastName}</p>
                                    </div>
                                    <div className={labelValueClass}>
                                        <p>Full Name: </p>
                                        <p>
                                            {user.firstName}
                                            {','} {user.lastName}
                                        </p>
                                    </div>
                                    <div className={labelValueClass}>
                                        <p>Birth Date: </p>
                                        <p>{user.birthDate ?? 'none'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className={sectionTitleClass}>
                                    User Roles
                                </h3>
                                <div className="flex flex-wrap gap-2  mt-2">
                                    {roles
                                        .filter((r) =>
                                            user.roleIdList.includes(r.id)
                                        )
                                        .map((r) => (
                                            <span
                                                key={r.id}
                                                className="bg-gray-500 text-white text-sm font-medium px-2 py-1 rounded-full"
                                            >
                                                {r.name}
                                            </span>
                                        ))}
                                    {roles.filter((r) =>
                                        user.roleIdList.includes(r.id)
                                    ).length === 0 && (
                                        <span className="text-gray-500 text-sm">
                                            {' '}
                                            No roles assigned
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className={sectionTitleClass}>
                                    Additional Permissions
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {user.permissions.map((perm) => (
                                        <div
                                            key={perm.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={perm.granted}
                                                readOnly
                                                className="w-5 h-5 switch "
                                            />
                                            <label className="text-sm text-gray-700">
                                                {perm.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
