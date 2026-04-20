/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import FormModal from '@/components/ui/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import { createApiClient } from '@/services/apiClient';
import { toast } from 'react-hot-toast';
import { ThreeDot } from 'react-loading-indicators';

export interface Project {
    id: number;
    name: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface CreateOrUpdateProject {
    id: number;
    name: string;
}

export default function ProjectListPage() {
    const api = createApiClient();
    const [projects, setProjects] = useState<Project[]>([]);

    // Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Form Data
    const [formData, setFormData] = useState<CreateOrUpdateProject>({
        id: 0,
        name: '',
    });

    // Table Columns
    const columns: { key: keyof Project; label: string }[] = [
        { key: 'name', label: 'Name' },
        { key: 'createdBy', label: 'Created By' },
        { key: 'createdAt', label: 'Created At' },
        { key: 'updatedBy', label: 'Updated By' },
        { key: 'updatedAt', label: 'Updated At' },
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true); // start loader
        try {
            const res = await api.get<Project[]>('/projects');
            setProjects(res.data ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // stop loader
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setEditProject(null);
        setFormData({ id: 0, name: '' });
        setShowFormModal(true);
    };

    const handleEdit = (project: Project) => {
        setIsEditing(true);
        setEditProject(project);
        setFormData(project);
        setShowFormModal(true);
    };

    const handleSave = async () => {
        if (isEditing && editProject) {
            try {
                const res = await api.put<number>('/projects/update', {
                    ...formData,
                });
                setShowFormModal(false);
                toast.success(res.message);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const res = await api.post<number>('/projects/create', {
                    name: formData.name,
                });
                setShowFormModal(false);
                toast.success(res.message);
                fetchProjects();
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
                    `/projects/delete/${deleteId}`
                );
                setProjects(projects.filter((p) => p.id !== deleteId));
                setShowDeleteModal(false);
                toast.success(res.message);
            } catch (err) {
                console.error(err);
            }
        }
    };

    // === Embedded CommonTable Code ===
    const [searchText, setSearchText] = useState('');

    const filteredProjects = useMemo(() => {
        if (!searchText) return projects;
        return projects.filter((row) =>
            columns.some((col) =>
                String(row[col.key])
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            )
        );
    }, [searchText, projects, columns]);

    return (
        <>
            {/* === CommonTable Layout === */}
            <div>
                {/* Header with Add + Search */}
                <div className="flex justify-between items-center mb-2.5 gap-2 flex-wrap">
                    <div className="text-2xl font-semibold text-black/70">
                        Projects
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
                            <FiPlus /> Add Project
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse">
                        <thead className="header-bg text-white">
                            <tr>
                                <th className="px-3 border-b">Name</th>
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
                                        colSpan={6}
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
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-[var(--table-row-bg)]"
                                    >
                                        <td className="p-3 border-b font-medium text-gray-900">
                                            {row.name}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.createdBy}
                                        </td>
                                        <td className="p-3 border-b text-gray-600">
                                            {new Date(
                                                row.createdAt
                                            ).toLocaleString()}
                                        </td>
                                        <td className="p-3 border-b text-gray-700">
                                            {row.updatedBy == '0'
                                                ? ''
                                                : row.updatedBy}
                                        </td>
                                        <td className="p-3 border-b text-gray-600">
                                            {row.updatedBy == '0'
                                                ? ''
                                                : new Date(
                                                      row.updatedAt
                                                  ).toLocaleString()}
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
                                        colSpan={6}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No projects found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* === Create / Update Modal === */}
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={isEditing ? 'Update Project' : 'Create Project'}
                onSave={handleSave}
                size="lg"
                actionType={isEditing ? 'update' : 'create'}
            >
                <div className="flex justify-center mb-3">
                    <label className="mr-1">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Project Name"
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-60"
                        required
                    />
                </div>
            </FormModal>

            {/* === Delete Modal === */}
            <DeleteModal
                title="Confirm Delete This Project"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this project?"
                size="md"
            />
        </>
    );
}

//const UserName = "newuser";

//function test() {
//    return UserName;
//}

//export default test;
