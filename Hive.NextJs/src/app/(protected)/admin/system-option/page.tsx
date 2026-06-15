/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CreateUserModal from '@/features/users/components/modals/CreateUserModal';
import Link from 'next/link';
import { useState } from 'react';
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
    roleId: number;
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

export default function SystemOptionsPage() {

    const [showAddUserFormModal, setShowAddUserFormModal] = useState(false);
    const [showEditUserFormModal, setShowEditUserFormModal] = useState(false);

    const handleAddUserClick = (e: React.MouseEvent) => {
        console.log("Create User Clicked");
        e.preventDefault();
        setShowAddUserFormModal(true);
    };

    const handleEditUserClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // setFormData(defaultUser);
        setShowEditUserFormModal(true);
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
            </div>

            {showAddUserFormModal &&
                <CreateUserModal
                    showAddUserFormModal={showAddUserFormModal}
                    setShowAddUserFormModal={setShowAddUserFormModal} />}
        </div>
    );
}
