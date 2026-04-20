/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormModal from '@/components/ui/FormModal';
import { createApiClient } from '@/services/apiClient';
import MultiSelect from '@/components/ui/MultiSelect';
import GlobalContext from '@/context/GlobalContext';

import {
    FiUser,
    FiUserPlus,
    FiSettings,
    FiFileText,
    FiShield,
    FiBriefcase,
    FiClipboard,
    FiBell,
} from 'react-icons/fi';

export interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    roleIdList: number[];
}

export interface UserRole {
    id: number;
    name: string;
}

const options = [
    {
        category: 'Member Section',
        items: [
            {
                name: 'Add New User',
                href: '/admin/users/add',
                icon: FiUserPlus,
            },
            { name: 'Edit User', href: '/admin/users', icon: FiUser },
            { name: 'Inactive Users', href: '/', icon: FiUser },
        ],
    },
    {
        category: 'User Role',
        items: [
            { name: 'Manage Roles', href: '/admin/user-role', icon: FiShield },
            {
                name: 'Manage Permissions',
                href: '/admin/permission',
                icon: FiShield,
            },
        ],
    },
    {
        category: 'API Access',
        items: [
            {
                name: 'API Access',
                href: '/admin/system-option/api-access',
                icon: FiShield,
            },
        ],
    },
    {
        category: 'Modules',
        items: [
            {
                name: 'Accounting Settings',
                href: '/admin/modules/accounting',
                icon: FiSettings,
            },
            {
                name: 'HRMS Settings',
                href: '/admin/modules/hrms',
                icon: FiSettings,
            },
            {
                name: 'Brokerage Settings',
                href: '/admin/modules/brokerage',
                icon: FiSettings,
            },
            {
                name: 'Assets Settings',
                href: '/admin/modules/assets',
                icon: FiSettings,
            },
            {
                name: 'RIMS Settings',
                href: '/admin/modules/rims',
                icon: FiSettings,
            },
            {
                name: 'Tenstreet Settings',
                href: '/admin/modules/tenstreet',
                icon: FiSettings,
            },
        ],
    },
    {
        category: 'Additional Reports',
        items: [
            {
                name: 'Duty Report',
                href: '/admin/reports/duty',
                icon: FiFileText,
            },
            {
                name: 'Report Access',
                href: '/admin/reports/access',
                icon: FiClipboard,
            },
        ],
    },
    {
        category: 'Organization',
        items: [
            {
                name: 'Company Profile',
                href: '/admin/organization/profile',
                icon: FiBriefcase,
            },
            {
                name: 'Branches',
                href: '/admin/organization/branches',
                icon: FiBriefcase,
            },
            {
                name: 'Regional Settings',
                href: '/admin/organization/regional',
                icon: FiSettings,
            },
        ],
    },
    {
        category: 'Audit & Compliance',
        items: [
            {
                name: 'Login History',
                href: '/admin/audit/logins',
                icon: FiUser,
            },
            {
                name: 'System Logs',
                href: '/admin/audit/activity',
                icon: FiFileText,
            },
            {
                name: 'Security Alerts',
                href: '/admin/audit/alerts',
                icon: FiShield,
            },
        ],
    },
    {
        category: 'System Configuration',
        items: [
            {
                name: 'Notifications',
                href: '/admin/system/notifications',
                icon: FiBell,
            },
            {
                name: 'Integrations',
                href: '/admin/system/integrations',
                icon: FiSettings,
            },
            {
                name: 'Security Policies',
                href: '/admin/system/security',
                icon: FiShield,
            },
        ],
    },
];

const defaultUser: User = {
    id: 0,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    roleIdList: [],
};

export default function SystemOptionsPage() {
    const api = createApiClient();

    const [formData, setFormData] = useState<User>(defaultUser);
    const [showAddUserFormModal, setShowAddUserFormModal] = useState(false);
    const [showEditUserFormModal, setShowEditUserFormModal] = useState(false);
    const [isValidUserName, setIsValidUserName] = useState(true);
    const [isOkToAddNewUserName, setIsOkToAddNewUserName] = useState(true);
    const router = useRouter();
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const { userInfo } = useContext(GlobalContext);

    const handleAddUserClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setFormData(defaultUser);
        setShowAddUserFormModal(true);
    };
    const handleEditUserClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setFormData(defaultUser);
        setShowEditUserFormModal(true);
    };

    const validateUserName = async (value: any) => {
        setFormData({ ...formData, userName: value });
        value = value.trim();
        if (value.length > 0) {
            try {
                const res = await api.post<boolean>(
                    `/users/validate-user-name?userName=${encodeURIComponent(value)}`
                );
                if (res) {
                    setIsValidUserName(true);
                } else {
                    setIsValidUserName(false);
                }
            } catch {
                setIsValidUserName(false);
            }
        }
    };
    useEffect(() => {
        if (isValidUserName) setIsOkToAddNewUserName(true);
        else setIsOkToAddNewUserName(false);
    }, [isValidUserName]);

    useEffect(() => {
        if (showAddUserFormModal) {
            const fetchRoles = async () => {
                try {
                    const res = await api.get<UserRole[]>('/roles');
                    setUserRoles(res.data ?? []);
                } catch (err) {
                    throw err;
                }
            };
            fetchRoles();
        }
        if (showEditUserFormModal) {
            const fetchUsers = async () => {
                try {
                    const res = await api.get<User[]>('/users');
                    setUsers(res.data ?? []);
                } catch (err) {
                    throw err;
                }
            };
            fetchUsers();
        }
    }, [showAddUserFormModal, showEditUserFormModal, api]);

    const handleSaveUser = async () => {
        if (
            !isOkToAddNewUserName ||
            !formData.userName ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.roleIdList
        ) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            const payload = {
                ...formData,
            };

            const res = await api.post<User>('/users/create', payload);

            if (res.isSuccess) {
                setShowAddUserFormModal(false);
                router.push('/admin/user-role');
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleEditUser = async () => {
        if (formData.id <= 0) {
            alert('Please Select One User.');
            return;
        }
        try {
            setShowEditUserFormModal(false);
            router.push(`/admin/user/edit/${formData.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen">
            <h4 className="text-2xl font-bold text-white text-center header-bg py-1">
                System Options
            </h4>

            <div className="space-y-0">
                {options.map((section, idx) => (
                    <div
                        key={section.category}
                        className={`flex flex-col md:flex-row md:items-stretch border overflow-hidden ${idx % 2 === 0 ? 'table-row-bg' : 'bg-white'}`}
                    >
                        <div className="md:w-1/3 p-2 flex flex-col justify-center border-r border-gray-300">
                            <h4 className="text-xl font-semibold mb-1">
                                {section.category}
                            </h4>
                            <p className="text-sm text-gray-700">
                                Manage and configure{' '}
                                {section.category.toLowerCase()} settings.
                            </p>
                        </div>

                        <div className="md:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 m-2 items-center">
                            {section.items.map((item) => {
                                const handleClick =
                                    item.name === 'Add New User'
                                        ? handleAddUserClick
                                        : item.name === 'Edit User'
                                          ? handleEditUserClick
                                          : undefined;

                                const commonClasses =
                                    'flex text-decoration-none border-2 items-center p-3 bg-white rounded transition hover:bg-blue-50 group h-13 !border-[var(--header-bg)] hover:!border-green-700 w-full';

                                if (handleClick) {
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={handleClick}
                                            className={commonClasses}
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mr-3">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <span className="!text-[var(--header-bg)] font-medium group-hover:!text-green-700">
                                                {item.name}
                                            </span>
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href!}
                                        className={commonClasses}
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mr-3">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="!text-[var(--header-bg)] font-medium group-hover:!text-green-700">
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {/*User Create Modal*/}
                <FormModal
                    isOpen={showAddUserFormModal}
                    onClose={() => (
                        setShowAddUserFormModal(false),
                        setIsValidUserName(true)
                    )}
                    title="Create New User"
                    onSave={handleSaveUser}
                    size="lg"
                    actionType="create"
                >
                    <div>
                        <div className="flex justify-between mb-3 items-center gap-5">
                            <div>
                                <div className="flex justify-end mb-3 items-center">
                                    <label className="mr-2">
                                        Employee Id/Login:
                                    </label>
                                    <div className="">
                                        <input
                                            type="text"
                                            name="userName"
                                            value={formData.userName}
                                            placeholder="* Employee Id/Login "
                                            onChange={(e) =>
                                                validateUserName(e.target.value)
                                            }
                                            className={`${
                                                isOkToAddNewUserName
                                                    ? 'border-gray-500'
                                                    : '!border-red-500'
                                            }`}
                                            required
                                        />
                                        <span
                                            className={`text-red-500 text-sm mt-1 block ${
                                                isOkToAddNewUserName
                                                    ? 'hidden'
                                                    : 'block'
                                            }`}
                                        >
                                            This username already exists
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-end mb-3 items-center">
                                    <label className="mr-2">
                                        Email Address:
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="* user@emailDomain.com"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className=""
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-end mb-3 items-center">
                                    <label className="mr-2">First Name:</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        placeholder="* First Name"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className=""
                                        required
                                    />
                                </div>

                                <div className="flex justify-end mb-3 items-center">
                                    <label className="mr-2">Last Name:</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        placeholder="* Last Name"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                lastName: e.target.value,
                                            })
                                        }
                                        className=""
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mb-3">
                            <label className="mr-1">Time Zone:</label>
                            <select name="timeZone" className="w-80" required>
                                <option value="">-- Select Time Zone --</option>
                                <option value="(GMT-05:00) Eastern Time (US & Canada)">
                                    (GMT-05:00) Eastern Time (US & Canada)
                                </option>
                                <option value="(GMT-09:00) Alaska">
                                    (GMT-09:00) Alaska
                                </option>
                                <option value="(GMT-07:00) Arizona">
                                    (GMT-07:00) Arizona
                                </option>
                            </select>
                        </div>

                        <div className="flex justify-end mb-3">
                            <label className="mr-1">Time Zone:</label>
                            <select name="timeZone" className="w-80" required>
                                <option value="">-- Select Time Zone --</option>
                                <option value="(GMT-05:00) Eastern Time (US & Canada)">
                                    (GMT-05:00) Eastern Time (US & Canada)
                                </option>
                                <option value="(GMT-09:00) Alaska">
                                    (GMT-09:00) Alaska
                                </option>
                                <option value="(GMT-07:00) Arizona">
                                    (GMT-07:00) Arizona
                                </option>
                                <option value="(GMT-05:00) Eastern Time (US & Canada)">
                                    (GMT-05:00) Eastern Time (US & Canada)
                                </option>
                                <option value="(GMT-09:00) Alaska">
                                    (GMT-09:00) Alaska
                                </option>
                                <option value="(GMT-07:00) Arizona">
                                    (GMT-07:00) Arizona
                                </option>
                                <option value="(GMT-05:00) Eastern Time (US & Canada)">
                                    (GMT-05:00) Eastern Time (US & Canada)
                                </option>
                                <option value="(GMT-09:00) Alaska">
                                    (GMT-09:00) Alaska
                                </option>
                                <option value="(GMT-07:00) Arizona">
                                    (GMT-07:00) Arizona
                                </option>
                                <option value="(GMT-05:00) Eastern Time (US & Canada)">
                                    (GMT-05:00) Eastern Time (US & Canada)
                                </option>
                                <option value="(GMT-09:00) Alaska">
                                    (GMT-09:00) Alaska
                                </option>
                                <option value="(GMT-07:00) Arizona">
                                    (GMT-07:00) Arizona
                                </option>
                                <option value="(GMT-05:00) Eastern Time (US & Canada)">
                                    (GMT-05:00) Eastern Time (US & Canada)
                                </option>
                                <option value="(GMT-09:00) Alaska">
                                    (GMT-09:00) Alaska
                                </option>
                                <option value="(GMT-07:00) Arizona">
                                    (GMT-07:00) Arizona
                                </option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-center items-center mb-3 mt-3 w-full">
                                <label className="mr-2">User Roles:</label>
                                <div className="">
                                    <MultiSelect
                                        options={userRoles.map((r) => ({
                                            value: r.id,
                                            label: r.name,
                                        }))}
                                        value={formData.roleIdList}
                                        onChange={(ids) =>
                                            setFormData({
                                                ...formData,
                                                roleIdList: ids,
                                            })
                                        }
                                        placeholder="-- Select User Roles --"
                                        maxHeight={200}
                                        className=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </FormModal>

                {/*User Edit Modal*/}
                <FormModal
                    isOpen={showEditUserFormModal}
                    onClose={() => setShowEditUserFormModal(false)}
                    title="Edit OR Inactive User"
                    onSave={handleEditUser}
                    size="lg"
                    actionType="update"
                >
                    <div className="flex justify-center items-center mb-3 w-full">
                        <label className="mr-1  font-medium">
                            Select An User:
                        </label>

                        <div className="flex items-center w-[50%]">
                            <select
                                className="w-60"
                                value={formData.id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        id: Number(e.target.value),
                                    })
                                }
                            >
                                <option value={0}>-- Select User --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.userName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <span
                            onClick={() => {
                                const currentUser = users.find(
                                    (u) => u.id === userInfo?.id
                                );
                                if (currentUser) {
                                    setFormData({
                                        ...formData,
                                        id: currentUser.id,
                                    });
                                }
                            }}
                            className="ml-2 cursor-pointer text-blue-400  hover:text-blue-600 transition-colors"
                        >
                            [Select Me]
                        </span>
                    </div>
                </FormModal>
            </div>
        </div>
    );
}
