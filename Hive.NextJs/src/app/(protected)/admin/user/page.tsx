/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import FormModal from '@/components/ui/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import { createApiClient } from '@/services/apiClient';
import { toast } from 'react-hot-toast';
//import { useRouter } from "next/navigation";
import { ThreeDot } from 'react-loading-indicators';
import MultiSelect from '@/components/ui/MultiSelect';
import { useRouter } from 'next/navigation';

export interface User {
    id: number;
    systemId: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordChangedDate: string;
    createdBy: number;
    createdAt: string;
    updatedBy: number;
    updatedAt: string;
    roleIdList: number[];
}

export interface CreateOrUpdateUser {
    id: number;
    systemId: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    roleIdList: number[];
}

export interface UserRole {
    id: number;
    name: string;
}

export default function UserListPage() {
    const api = createApiClient();
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();

    // Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);

    // Form Data
    const [formData, setFormData] = useState<CreateOrUpdateUser>({
        id: 0,
        systemId: 0,
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        roleIdList: [],
    });

    // Table Columns
    const columns: { key: keyof User; label: string }[] = [
        { key: 'userName', label: 'User Name' },
        { key: 'email', label: 'Email' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'createdBy', label: 'Created By' },
        { key: 'createdAt', label: 'Created At' },
        { key: 'updatedBy', label: 'Updated By' },
        { key: 'updatedAt', label: 'Updated At' },
    ];

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get<User[]>('/users');
            setUsers(res.data ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await api.get<UserRole[]>('/roles');
            setUserRoles(res.data ?? []);
        } catch (err) {
            throw err;
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setEditUser(null);
        setFormData({
            id: 0,
            systemId: 0,
            userName: '',
            email: '',
            firstName: '',
            lastName: '',
            roleIdList: [],
        });
        setShowFormModal(true);
        console.log(userRoles);
    };

    const handleEdit = (id: number) => {
        router.push(`/admin/user/edit/${id}`);
    };

    const handleSave = async () => {
        if (isEditing && editUser) {
            try {
                const res = await api.put<number>('/users/update', {
                    ...formData,
                });
                setShowFormModal(false);
                toast.success(res.message);
                fetchUsers();
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const res = await api.post<number>('/users/create', {
                    ...formData,
                });
                setShowFormModal(false);
                toast.success(res.message);
                fetchUsers();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleDeleteConfirm = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (deleteId !== null) {
            try {
                const res = await api.delete<number>(
                    `/users/delete/${deleteId}`
                );
                setUsers(users.filter((u) => u.id !== deleteId));
                setShowDeleteModal(false);
                toast.success(res.message);
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Search
    const [searchText, setSearchText] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchText) return users;
        return users.filter((row) =>
            columns.some((col) =>
                String(row[col.key])
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            )
        );
    }, [searchText, users, columns]);

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-2.5 gap-2 flex-wrap">
                    <div className="text-2xl font-semibold text-black/70">
                        Users
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <input
                            type="search"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="!h-[38px]"
                        />
                        <button
                            onClick={handleAdd}
                            className="flex btn-blue items-center gap-2 text-white px-4 h-10 rounded-lg transition"
                        >
                            <FiPlus /> Add User
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse">
                        <thead className="header-bg text-white">
                            <tr>
                                <th className="px-3 border-b">User Name</th>
                                <th className="px-3 border-b">Email</th>
                                <th className="px-3 border-b">First Name</th>
                                <th className="px-3 border-b">Last Name</th>
                                <th className="px-3 border-b">Created By</th>
                                <th className="px-3 border-b">Created At</th>
                                <th className="px-3 border-b">Updated By</th>
                                <th className="px-3 border-b">Updated At</th>
                                <th className="p-2.5 border-b text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="py-10 text-center"
                                    >
                                        <div className="flex justify-center items-center">
                                            <ThreeDot
                                                color="#0085ad"
                                                size="medium"
                                                text=""
                                                textColor=""
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-[var(--table-row-bg)]"
                                    >
                                        <td className="p-3 border-b font-medium text-gray-900">
                                            {row.userName}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.email}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.firstName}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.lastName}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.createdBy === 0
                                                ? ''
                                                : row.createdBy}
                                        </td>
                                        <td className="p-3 border-b text-gray-600">
                                            {new Date(
                                                row.createdAt
                                            ).toLocaleString()}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.updatedBy === 0
                                                ? ''
                                                : row.updatedBy}
                                        </td>
                                        <td className="p-3 border-b text-gray-600">
                                            {row.updatedBy === 0
                                                ? ''
                                                : new Date(
                                                      row.updatedAt
                                                  ).toLocaleString()}
                                        </td>
                                        <td className="p-3 border-b text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(row.id)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <FiEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteConfirm(
                                                            row.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={isEditing ? 'Update User' : 'Create User'}
                onSave={handleSave}
                size="lg"
                actionType={isEditing ? 'update' : 'create'}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex justify-center mb-3">
                        <label className="mr-1">User Name:</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            placeholder="User Name"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    userName: e.target.value,
                                })
                            }
                            className="w-50"
                            required
                        />
                    </div>
                    <div className="flex justify-end mb-3">
                        <label className="mr-1">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Email"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-50"
                            required
                        />
                    </div>
                    <div className="flex justify-center mb-3">
                        <label className="mr-1">First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            placeholder="First Name"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    firstName: e.target.value,
                                })
                            }
                            className="w-50"
                            required
                        />
                    </div>
                    <div className="flex justify-center mb-3">
                        <label className="mr-1">Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            placeholder="Last Name"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    lastName: e.target.value,
                                })
                            }
                            className="w-50"
                            required
                        />
                    </div>
                    <div className="flex justify-end items-center mb-3 w-full">
                        <label className="mr-1">User Roles:</label>
                        <div className="w-50">
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
                            />
                        </div>
                    </div>
                </div>
            </FormModal>

            <DeleteModal
                title="Confirm Delete This User"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this user?"
                size="md"
            />
        </>
    );
}
