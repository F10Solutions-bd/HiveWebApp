/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import MultiSelect from '@/components/ui/MultiSelect';
import Loader from '@/components/ui/Loader';
import NotFound from '@/components/ui/NotFound';
import { FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';
import { createApiClient } from '@/services/apiClient';
import { useParams, useRouter } from 'next/navigation';
import { toDateInputString, toISOString } from '@/utils/dateHelper';

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
    updatedAt?: string;
    password?: string;
    isActive: boolean;
    roleIdList: number[];
    permissions: Permission[];
}

export interface UpdateUserDto {
    id: number;
    userName: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    birthDate?: string | null;
    isActive: boolean;
    roleIdList?: number[];
    permissionIdList?: number[] | null;
}

export default function EditUserPage() {
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
                const grantedPermissionIds = userPermRes.data ?? [];

                const mergedPermissions = allPermissions.map((perm) => ({
                    ...perm,
                    granted: grantedPermissionIds.includes(perm.id),
                }));

                const roles = await api.get<Roles[]>('/roles');

                const userRolesRes = await api.get<object[]>(
                    `/roles/user-roles/${userId}`
                );

                if (userRolesRes.data == null) return;

                const roleIdList = userRolesRes.data.map(
                    (item: any) => item.id
                );

                const res = await api.get<User>(`/users/${id}`);
                const userData = {
                    ...res.data,
                    id: userId,
                    birthDate: toDateInputString(res.data?.birthDate),
                    roleIdList: roleIdList,
                    permissions: mergedPermissions,
                } as User;

                setUser(userData);
                setRoles(roles.data ?? []);
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <Loader message="Loading page..." />;
    }

    if (!user) {
        return <NotFound message="User Not Found!" />;
    }

    const handleInputChange = (
        field: keyof User,
        value: string | boolean | number
    ) => {
        setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
    };
    const handlePermissionToggle = (permId: number) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updatedPermissions = prev.permissions.map((p) =>
                p.id === permId ? { ...p, granted: !p.granted } : p
            );
            return { ...prev, permissions: updatedPermissions };
        });
    };

    const handleSave = async () => {
        if (!user) return;
        const payload: UpdateUserDto = {
            id: user.id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            birthDate: toISOString(user.birthDate),
            isActive: user.isActive,
            roleIdList: user.roleIdList,
            permissionIdList: user.permissions
                .filter((p) => p.granted)
                .map((p) => p.id),
        };

        try {
            const res = await api.post<number>(
                '/users/update-details',
                payload
            );
            console.log(res);
            if (res.data) {
                router.push(`/admin/user/details/${user.id}`);
            }
        } catch (err) {
            console.error('Error updating user', err);
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            alert('User deleted!');
        }
    };

    const handleCancel = () => {
        router.push(`/admin/user/details/${user.id}`);
    };

    const containerClass = 'bg-white rounded-lg  p-6';
    const sectionTitleClass =
        'text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 text-teal-600 ';
    const inputClass = 'w-[75%]';
    const labelClass = 'w-[25%] flex justify-end mr-3';
    const actionButtonBase =
        'px-5 py-2 rounded-lg font-medium transition-colors';
    const tabButtonBase =
        'flex items-center px-6 py-2 gap-2 border-b-2 font-medium transition-colors whitespace-nowrap';
    const tabButtonActive = 'border-teal-500 text-teal-600 bg-teal-50';
    const tabButtonHover =
        'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100';
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/*className="max-w-7xl mx-auto"*/}
            <div className="">
                <div className={`mb-2`}>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        Edit User Profile
                    </h1>
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                        <button
                            className={`${tabButtonBase} ${activeTab === 'basic' ? tabButtonActive : tabButtonHover}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            <FaUser /> Basic Info
                        </button>
                        <button
                            className={`${tabButtonBase} ${
                                activeTab === 'permissions'
                                    ? tabButtonActive
                                    : tabButtonHover
                            }`}
                            onClick={() => setActiveTab('permissions')}
                        >
                            <FaShieldAlt /> Permissions
                        </button>
                    </div>
                    <div className="flex justify-end gap-3 flex-wrap">
                        <button
                            onClick={handleDelete}
                            className={`${actionButtonBase} bg-red-600 text-white hover:bg-red-700 `}
                        >
                            Delete User
                        </button>
                        <button
                            onClick={handleCancel}
                            className={`${actionButtonBase} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`${actionButtonBase} bg-teal-600 text-white hover:bg-teal-700`}
                        >
                            Save Profile
                        </button>
                    </div>
                </div>
                <div className={containerClass}>
                    {activeTab === 'basic' && (
                        <div className="space-y-8">
                            <div>
                                <h3
                                    className={`${sectionTitleClass} text-teal-600`}
                                >
                                    Account Info
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center ">
                                        <label className={labelClass}>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'email',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                    {/*<div className="flex items-center">*/}
                                    {/*    <label className={labelClass}>Password</label>*/}
                                    {/*    <input*/}
                                    {/*        type="password"*/}
                                    {/*        value={user.password}*/}
                                    {/*        onChange={(e) =>*/}
                                    {/*            handleInputChange("password", e.target.value)*/}
                                    {/*        }*/}
                                    {/*        placeholder="Enter new password"*/}
                                    {/*        className={inputClass}*/}
                                    {/*    />*/}
                                    {/*</div>*/}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="activeAccount"
                                            checked={user.isActive}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'isActive',
                                                    e.target.checked
                                                )
                                            }
                                            className="w-5 h-5  switch ml-30 text-teal-600  focus:ring-teal-500 cursor-pointer"
                                        />
                                        <label
                                            htmlFor="activeAccount"
                                            className="text-sm ml-5 font-medium text-gray-700 cursor-pointer"
                                        >
                                            Active Account
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className={`${sectionTitleClass} `}>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center">
                                        <label className={labelClass}>
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user.firstName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'firstName',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className={labelClass}>
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user.lastName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'lastName',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className={labelClass}>
                                            {' '}
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                user.firstName +
                                                ' ' +
                                                user.lastName
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'fullName',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className={labelClass}>
                                            Birth Date
                                        </label>
                                        <input
                                            type="date"
                                            value={user.birthDate}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'birthDate',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'permissions' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className={sectionTitleClass}>
                                    User Roles
                                </h3>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700 md:w-40">
                                        Assigned Roles
                                    </label>
                                    <div className="flex-1 w-full md:max-w-md">
                                        <MultiSelect
                                            options={roles.map((r) => ({
                                                value: r.id,
                                                label: r.name,
                                            }))}
                                            value={user.roleIdList}
                                            onChange={(ids) =>
                                                setUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              roleIdList: ids,
                                                          }
                                                        : prev
                                                )
                                            }
                                            placeholder="-- Select User Roles --"
                                            maxHeight={200}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className={sectionTitleClass}>
                                    Additional Permissions
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {user.permissions.map((perm) => (
                                        <div
                                            key={perm.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`perm-${perm.id}`}
                                                checked={perm.granted}
                                                onChange={() =>
                                                    handlePermissionToggle(
                                                        perm.id
                                                    )
                                                }
                                                className="w-5 h-5 switch cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`perm-${perm.id}`}
                                                className="text-sm text-gray-700 cursor-pointer"
                                            >
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
