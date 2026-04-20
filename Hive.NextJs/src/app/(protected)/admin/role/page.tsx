/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import FormModal from '@/components/ui/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import { createApiClient } from '@/services/apiClient';
import { toast } from 'react-hot-toast';
import { ThreeDot } from 'react-loading-indicators';

// --------------------
// Interfaces
// --------------------
export interface Role {
    id: number;
    name: string;
    projectName: string;
    userCount: number;
    createdBy: number;
    createdAt: string;
    updatedBy: number;
    updatedAt: string;
}

export interface CreateOrUpdateRole {
    id: number;
    name: string;
    projectId: number;
    projectName?: string;
}

// --------------------
// Main Component
// --------------------
export default function RoleListPage() {
    const api = createApiClient();
    const [roles, setRoles] = useState<Role[]>([]);
    const [projects, setProjects] = useState<{ id: number; name: string }[]>(
        []
    );

    // Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Form Data
    const [formData, setFormData] = useState<CreateOrUpdateRole>({
        id: 0,
        name: '',
        projectId: 0,
    });

    // --------------------
    // Table Columns
    // --------------------
    const columns: { key: keyof Role; label: string }[] = [
        { key: 'name', label: 'Role Name' },
        { key: 'projectName', label: 'Project Name' },
        { key: 'userCount', label: 'Users' },
        { key: 'createdBy', label: 'Created By' },
        { key: 'updatedBy', label: 'Updated By' },
    ];

    // --------------------
    // Fetch Data
    // --------------------
    useEffect(() => {
        fetchRoles();
        fetchProjects();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await api.get<Role[]>('/roles');
            setRoles(res.data ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res =
                await api.get<{ id: number; name: string }[]>('/projects');
            setProjects(res.data ?? []);
        } catch (err) {
            console.error(err);
        }
    };

    // --------------------
    // CRUD Handlers
    // --------------------
    const handleAdd = () => {
        setIsEditing(false);
        setEditRole(null);
        setFormData({ id: 0, name: '', projectId: 0 });
        setShowFormModal(true);
    };

    const handleEdit = (role: Role) => {
        setIsEditing(true);
        setEditRole(role);
        setFormData({
            id: role.id,
            name: role.name,
            projectId:
                projects.find((p) => p.name === role.projectName)?.id ?? 0,
        });
        setShowFormModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing && editRole) {
                const res = await api.put<number>('/roles/update', {
                    ...formData,
                });
                toast.success(res.message);
            } else {
                const res = await api.post<number>('/roles/create', {
                    ...formData,
                });
                toast.success(res.message);
            }
            setShowFormModal(false);
            fetchRoles();
        } catch (err) {
            console.error(err);
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
                    `/roles/delete/${deleteId}`
                );
                setRoles(roles.filter((r) => r.id !== deleteId));
                setShowDeleteModal(false);
                toast.success(res.message);
            } catch (err) {
                console.error(err);
            }
        }
    };

    // --------------------
    // Search
    // --------------------
    const [searchText, setSearchText] = useState('');

    const filteredRoles = useMemo(() => {
        if (!searchText) return roles;
        return roles.filter((row) =>
            columns.some((col) =>
                String(row[col.key])
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            )
        );
    }, [searchText, roles, columns]);

    // --------------------
    // JSX
    // --------------------
    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-2.5 gap-2 flex-wrap">
                    <div className="text-2xl font-semibold text-black/70">
                        Roles
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
                            <FiPlus /> Add Role
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse">
                        <thead className="header-bg text-white">
                            <tr>
                                <th className="px-3 border-b">Role Name</th>
                                <th className="px-3 border-b">Project Name</th>
                                <th className="px-3 border-b">Users</th>
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
                                        colSpan={8}
                                        className="py-10 text-center"
                                    >
                                        <div className="flex justify-center items-center">
                                            <ThreeDot
                                                color="#0085ad"
                                                size="medium"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRoles.length > 0 ? (
                                filteredRoles.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-[var(--table-row-bg)]"
                                    >
                                        <td className="p-3 border-b font-medium text-gray-900">
                                            {row.name}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.projectName}
                                        </td>
                                        <td className="p-3 border-b text-gray-700 text-center">
                                            {row.userCount}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.createdBy}
                                        </td>
                                        <td className="p-3 border-b text-gray-600">
                                            {row.createdAt?.toLocaleString()}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.updatedBy > 0
                                                ? row.updatedBy
                                                : ''}
                                        </td>
                                        <td className="p-3 border-b text-gray-600">
                                            {row.updatedAt?.toLocaleString()}
                                        </td>
                                        <td className="p-3 border-b text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(row)
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
                                        colSpan={8}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No roles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* -------------------- Form Modal -------------------- */}
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={isEditing ? 'Update Role' : 'Create Role'}
                onSave={handleSave}
                size="lg"
                actionType={isEditing ? 'update' : 'create'}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex justify-center mb-3">
                        <label className="w-[20%] mr-5">Role Name:</label>
                        <input
                            type="text"
                            name="roleName"
                            value={formData.name}
                            placeholder="Role Name"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-[80%]"
                            required
                        />
                    </div>
                    <div className="flex justify-center mb-3 w-full">
                        <label className="w-[20%] mr-5">Project:</label>
                        <select
                            className="w-[80%] border rounded-md p-2"
                            value={formData.projectId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    projectId: Number(e.target.value),
                                })
                            }
                            required
                        >
                            <option value={0}>-- Select Project --</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </FormModal>

            {/* -------------------- Delete Modal -------------------- */}
            <DeleteModal
                title="Confirm Delete This Role"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this role?"
                size="lg"
            />
        </>
    );
}
