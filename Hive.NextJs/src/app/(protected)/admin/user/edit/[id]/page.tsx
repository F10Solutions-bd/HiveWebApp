/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Loader from '@/components/ui/Loader';
import NotFound from '@/components/ui/NotFound';
import { FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';
import { createApiClient } from '@/services/apiClient';
import { notFound, useParams, useRouter } from 'next/navigation';
import { toDateInputString, toISOString } from '@/utils/dateHelper';
import Select from '@/components/modal/Select';
import { SelectOption } from '@/types/common';
import { MdCancel, MdDelete } from 'react-icons/md';
import { DatePicker } from '@/components/modal/DatePicker';
import { Alumni_Sans } from 'next/font/google';

interface Permission {
    id: number;
    name: string;
    granted: boolean;
}
interface Role {
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
    birthDate?: Date;
    address?: string;
    phone?: number;
    updatedAt?: string;
    password?: string;
    isActive: boolean;
    roleId: number;
    // roleIdList: number[];
    permissions: Permission[];
}

export interface UpdateUserDto {
    id: number;
    userName: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: number;
    address?: string;
    birthDate?: string | null | Date;
    isActive: boolean;
    roleId: number;
    // roleIdList?: number[];
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
    const [rolesOptions, setRolesOptions] = useState<SelectOption[]>([]);

    console.log("user", user);
    const userId = Number(id);

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

            const rolesResponse = await api.get<Role[]>('/roles');

            if (rolesResponse.data) {
                const options: SelectOption[] = rolesResponse.data.map((role) => ({
                    label: role.name,
                    value: role.id.toString(),
                }));

                setRolesOptions(options);
            }

            const res = await api.get<User>(`/users/${id}`);
            console.log("res from data get", res);

            const userData = {
                ...res.data,
                id: userId,
                birthDate: (res.data?.birthDate),
                permissions: mergedPermissions,
            } as User;

            setUser(userData);
        } catch (err) {
            notFound();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            phone: user.phone,
            address: user.address,
            birthDate: toISOString(user.birthDate),
            isActive: user.isActive,
            roleId: user.roleId,
            permissionIdList: user.permissions
                .filter((p) => p.granted)
                .map((p) => p.id),
        };

        try {
            const res = await api.put<number>(
                `/users/${user.id}`,
                payload
            );
            console.log("payload", payload);

            router.push(`/admin/user/details/${user.id}`);
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

    const containerClass = 'bg-white rounded-lg  p-6 mb-5';
    const sectionTitleClass =
        'text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300 text-teal-600 ';
    const inputClass = 'w-[50%]';
    const labelClass = 'w-[25%] flex justify-end mr-3';
    const actionButtonBase =
        'px-5 py-2 rounded-lg font-medium transition-colors';
    const tabButtonBase =
        'flex items-center px-6 py-2 gap-2 border-b-2 font-medium transition-colors whitespace-nowrap';
    const tabButtonActive = 'border-teal-500 text-teal-600 bg-primary text-white';
    const tabButtonHover =
        'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100';
    return (
        <div className="min-h-screen bg-segment p-4">
            {/*className="max-w-7xl mx-auto"*/}
            <div className="">
                <div className={`mb-2`}>
                    {/* <DynamicHeaderTitle title="Edit User Profile" /> */}
                    <div className='flex justify-between'>
                        <div className="rounded-lg mb-2">
                            <div className="flex flex-wrap gap-4 items-center p-2.5">
                                <div className="flex-1 min-w-[300px]">
                                    <div className="">
                                        <h1 className="text-3xl font-bold text-left text-gray-900">Loads Management</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* className="bg-secondary w-[100%] h-7 rounded-[11px] cursor-pointer flex items-center justify-center" */}
                        <div className="flex justify-end gap-3 items-center flex-wrap">
                            <div className="hover:opacity-60 transition-opacity 2xl:!w-[100px] !w-[110px]  duration-300 flex justify-center">
                                <button onClick={handleSave} className="bg-primary text-bg w-[100%] h-7 rounded-[11px] cursor-pointer flex items-center justify-center">
                                    Save
                                </button>
                            </div>
                            <div className="hover:opacity-60 transition-opacity 2xl:!w-[150px] !w-[110px]  duration-300 flex justify-center">
                                <button onClick={handleCancel} className="bg-secondary w-[100%] h-7 rounded-[11px] cursor-pointer flex items-center justify-center">
                                    Cancel
                                </button>
                                <MdCancel className="h-9 w-9 p-1.5 text-bg bg-primary cursor-pointer !rounded-[50%] -ml-5 -mt-[3px]" />
                            </div>
                            <div className="hover:opacity-60 transition-opacity 2xl:!w-[150px] !w-[110px] duration-300 flex justify-center">
                                <button onClick={handleDelete} className="bg-secondary w-[100%] h-7 rounded-[11px] cursor-pointer flex items-center justify-center">
                                    Delete
                                </button>
                                <MdDelete className="h-9 w-9 p-1.5 text-bg bg-primary cursor-pointer !rounded-[50%] -ml-5 -mt-[3px]" />
                            </div>
                        </div>
                    </div>
                    <div className="flex border-b border-gray-400 my-6 overflow-x-auto gap-2 ">
                        <button
                            className={`${tabButtonBase} ${activeTab === 'basic' ? tabButtonActive : tabButtonHover}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            <FaUser /> Basic Info
                        </button>
                        <button
                            className={`${tabButtonBase} ${activeTab === 'permissions'
                                ? tabButtonActive
                                : tabButtonHover
                                }`}
                            onClick={() => setActiveTab('permissions')}
                        >
                            <FaShieldAlt /> Permissions
                        </button>
                    </div>

                </div>
                <div>
                    {activeTab === 'basic' && (
                        <div className='gap-4 mb-5'>
                            <div className={containerClass}>
                                <h3 className="items-center flex justify-center mb-5 text-2xl">
                                    Account Info
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center ">
                                        <label className={labelClass}>
                                            Email Address :
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
                                    <div className="flex w-2/3 py-6  justify-center items-center">
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
                                            className="accent-primary !h-[19px] !w-[19px] cursor-pointer"
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

                            <div className={containerClass}>
                                <h3
                                    className="items-center flex justify-center mb-5 text-2xl"
                                >
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center ">
                                        <label className={labelClass}>
                                            First Name:
                                        </label>
                                        <input
                                            type="text"
                                            value={user.firstName || ""}
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
                                            Last Name:
                                        </label>
                                        <input
                                            type="text"
                                            value={user.lastName || ""}
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
                                            Full Name:
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
                                            {' '}
                                            Address:
                                        </label>
                                        <input
                                            type="text"
                                            value={user.address || ''}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'address',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div><div className="flex items-center">
                                        <label className={labelClass}>
                                            {' '}
                                            Phone:
                                        </label>
                                        <input
                                            type="number"
                                            value={user.phone || ''}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'phone',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className={labelClass}>
                                            Birth Date:
                                        </label>
                                        <div className='flex-1'>
                                            <DatePicker
                                                value={user.birthDate
                                                    ? new Date(user.birthDate)
                                                    : null}
                                                parentClassName="w-full"
                                                className="!w-2/3"
                                                placeholder='Birth Date'
                                                onChange={(date) =>
                                                    handleInputChange(
                                                        'birthDate',
                                                        date ? date.toISOString() : ''
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'permissions' && (
                        <div className="space-y-8">
                            <div className={containerClass}>
                                <h3 className="items-center flex justify-center mb-5 text-2xl">
                                    User Roles
                                </h3>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <h3 className="items-center flex justify-center text-2xl">
                                        Assigned Roles:
                                    </h3>
                                    <div className="flex-1 w-full md:max-w-md">
                                        <Select
                                            options={rolesOptions}
                                            value={user?.roleId ? user.roleId.toString() : ''}
                                            onSelect={(value) => setUser({ ...user, roleId: Number(value) })}
                                        />

                                        {
                                            // <MultiSelect
                                            //     options={roles.map((r) => ({
                                            //         value: r.id,
                                            //         label: r.name,
                                            //     }))}
                                            //     value={user.roleId}
                                            //     onChange={(ids) =>
                                            //         setUser((prev) =>
                                            //             prev
                                            //                 ? {
                                            //                     ...prev,
                                            //                     roleIdList: ids,
                                            //                 }
                                            //                 : prev
                                            //         )
                                            //     }
                                            //     placeholder="-- Select User Roles --"
                                            //     maxHeight={200}
                                            // />
                                        }

                                    </div>
                                </div>
                            </div>

                            <div className={containerClass}>
                                <h3 className="items-center flex justify-center mb-5 text-2xl">
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
                                                className="accent-primary !h-[19px] !w-[19px] cursor-pointer"
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
        </div >
    );
}
