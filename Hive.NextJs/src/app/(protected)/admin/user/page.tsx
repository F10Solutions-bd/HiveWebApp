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
import Select from '@/components/modal/Select';
import CreateUserModal from '@/features/users/components/modals/CreateUserModal';
import DynamicHeaderTitle from '@/components/features/contact-and-vendors-details/DynamicHeaderTitle';
import Pagination from '@/components/ui/Pagination';

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
    roleId: number;
}

export interface CreateOrUpdateUser {
    id: number;
    systemId: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
}

export interface UserRole {
    id: number;
    name: string;
}

export default function UserListPage() {
    const api = createApiClient();
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddUserFormModal, setShowAddUserFormModal] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');

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

    const filteredUsers = useMemo(() => {
        if (!searchText) return users;

        const q = searchText.toLowerCase();

        return users.filter((row) =>
            columns.some((col) =>
                String(row[col.key])
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            )
        );
    }, [users, searchText]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const handleAddUserClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowAddUserFormModal(true);
    };

    useEffect(() => {
        fetchUsers();
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

    const handleEdit = (id: number) => {
        router.push(`/admin/user/edit/${id}`);
    };

    const handleDeleteConfirm = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (deleteId !== null) {
            try {
                const res = await api.delete<number>(
                    `/users/${deleteId}`
                );
                setUsers(users.filter((u) => u.id !== deleteId));
                setShowDeleteModal(false);
                toast.success("User Deleted Successfully");
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-segment">
            {/* <DynamicHeaderTitle title="Users" /> */}
            <div className="bg-segment rounded-lg">
                <div className="flex flex-wrap gap-4 items-center p-2.5">
                    <div className="flex-1 min-w-[300px]">
                        <h1 className="text-3xl font-bold text-gray-900 p-5">Users</h1>
                    </div>
                </div>
            </div>
            <div className="px-6">
                <div className="bg-bg rounded-lg p-6 mb-4 flex justify-end gap-3 items-center">
                    <div className="w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-5 rounded-md
                            focus:outline-none focus:ring-2 focus:ring-[#008ca8]"
                        />
                    </div>
                    <button
                        onClick={handleAddUserClick}
                        className="flex btn-blue items-center gap-2 text-white px-4 h-10 rounded-lg transition"
                    >
                        <FiPlus /> Add User
                    </button>
                </div>

                <div className="overflow-auto bg-bg rounded-lg shadow max-h-[600px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-primary text-white">
                            <tr>
                                <th className="px-3">User Name</th>
                                <th className="px-3">Email</th>
                                <th className="px-3">First Name</th>
                                <th className="px-3">Last Name</th>
                                <th className="px-3">Created By</th>
                                <th className="px-3">Created At</th>
                                <th className="p-2.5 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200 max-h-[600px]">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="py-10 text-center">
                                        <div className="flex justify-center items-center">
                                            <ThreeDot
                                                color="#0085ad"
                                                size="medium"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                paginatedUsers.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-[var(--table-row-bg)]"
                                    >
                                        <td className="p-3 font-medium text-gray-900">
                                            {row.userName}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {row.email}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {row.firstName}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {row.lastName}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {row.createdBy === 0
                                                ? ''
                                                : row.createdBy}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {new Date(
                                                row.createdAt
                                            ).toLocaleString()}
                                        </td>
                                        <td className="p-3 text-center">
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
                    </table >

                    {/* Pagination */}
                    <div className="sticky bottom-0 bg-white rounded-b-lg">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredUsers.length}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                            }}
                            onItemsPerPageChange={(count) => {
                                setItemsPerPage(count);
                                setCurrentPage(1);
                            }}
                            pageSizeOptions={[10, 15, 20, 50]}
                        />
                    </div>
                </div >
            </div>


            {showAddUserFormModal &&
                <CreateUserModal
                    showAddUserFormModal={showAddUserFormModal}
                    setShowAddUserFormModal={setShowAddUserFormModal} />
            }


            <DeleteModal
                title="Confirm Delete This User"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this user?"
                size="md"
            />
        </div >
    );
}
