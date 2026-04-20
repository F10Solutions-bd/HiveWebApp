'use client';

import { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import FormModal from '@/components/ui/FormModal';
import toast from 'react-hot-toast';
import Link from 'next/link';

export interface UserType {
    id: number;
    name: string;
    roleId: number;
}

export interface Permission {
    id: number;
    name: string;
    roleId: number;
    checked: boolean;
}

export interface Role {
    id: number;
    name: string;
}

export default function UserRolesPage() {
    const users: UserType[] = [
        { id: 1, name: 'John Doe', roleId: 1 },
        { id: 2, name: 'Jane Smith', roleId: 1 },
        { id: 3, name: 'Michael Brown', roleId: 2 },
        { id: 4, name: 'Sarah Lee', roleId: 3 },
        { id: 5, name: 'John Doe', roleId: 1 },
        { id: 6, name: 'Jane Smith', roleId: 1 },
        { id: 7, name: 'Michael Brown', roleId: 2 },
        { id: 8, name: 'Sarah Lee', roleId: 3 },
        { id: 9, name: 'John Doe', roleId: 1 },
        { id: 10, name: 'Jane Smith', roleId: 1 },
        { id: 11, name: 'Michael Brown', roleId: 2 },
        { id: 12, name: 'Sarah Lee', roleId: 3 },
    ];

    const [permissions, setPermissions] = useState<Permission[]>([
        { id: 1, name: 'View Reports', roleId: 1, checked: true },
        { id: 2, name: 'Edit Users', roleId: 1, checked: false },
        { id: 3, name: 'Delete Projects', roleId: 2, checked: true },
        { id: 4, name: 'Assign Tasks', roleId: 3, checked: false },
        { id: 5, name: 'View Reports', roleId: 1, checked: true },
        { id: 6, name: 'Edit Users', roleId: 1, checked: false },
        { id: 7, name: 'Delete Projects', roleId: 2, checked: true },
        { id: 8, name: 'Assign Tasks', roleId: 3, checked: false },
        { id: 9, name: 'View Reports', roleId: 1, checked: true },
        { id: 10, name: 'Edit Users', roleId: 1, checked: false },
        { id: 11, name: 'Delete Projects', roleId: 2, checked: true },
        { id: 12, name: 'Assign Tasks', roleId: 3, checked: false },
    ]);

    // ---------------- State ----------------
    const [roles, setRoles] = useState<Role[]>([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Lead' },
        { id: 3, name: 'Manager1' },
        { id: 4, name: 'Manager2' },
    ]);

    const [formRoleData, setFormRoleData] = useState<Role>({
        id: roles[0].id,
        name: roles[0].name,
    });

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [editingRole, setEditingRole] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletedId, setDeletedId] = useState<number | null>(roles[0].id);
    const [isEditingPerm, setIsEditingPerm] = useState(false);
    const [tempPermissions, setTempPermissions] = useState<Permission[]>([]);

    useEffect(() => {
        // Auto select first role
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
        }
    }, [roles, selectedRole]);

    const handleDeleteConfirm = () => {
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (deletedId !== null) {
            setRoles(roles.filter((r) => r.id !== deletedId));
            toast.success('Role deleted successfully!');
        }
        setShowDeleteModal(false);
    };

    const handleEditPermissions = () => {
        const rolePerms = permissions.filter(
            (p) => p.roleId === selectedRole?.id
        );
        setTempPermissions(rolePerms);
        setIsEditingPerm(true);
    };

    const handleSavePermissions = () => {
        const updated = permissions.map(
            (p) => tempPermissions.find((tp) => tp.id === p.id) || p
        );
        setPermissions(updated);
        setIsEditingPerm(false);
    };

    const handleCancelPermissions = () => {
        setIsEditingPerm(false);
        setTempPermissions([]);
    };

    const handleCreateRole = () => {
        setEditingRole(false);
        setFormRoleData({
            id: 0,
            name: '',
        });
        setShowFormModal(true);
    };

    const handleEditRole = () => {
        setEditingRole(true);
        setShowFormModal(true);
    };

    const handleSaveRole = () => {
        if (!formRoleData.name.trim()) {
            toast.error('Role name is required');
            return;
        }
        if (editingRole) {
            setRoles(
                roles.map((r) => (r.id === formRoleData.id ? formRoleData : r))
            );
            toast.success('Role updated successfully!');
        } else {
            setRoles([
                ...roles,
                {
                    ...formRoleData,
                    id: roles.length ? roles[roles.length - 1].id + 1 : 1,
                },
            ]);
            toast.success('Role created successfully!');
        }
        setShowFormModal(false);
    };

    const togglePermission = (id: number) => {
        setTempPermissions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
        );
    };

    const assignedUsers = users.filter((u) => u.roleId === selectedRole?.id);
    const rolePermissions = isEditingPerm
        ? tempPermissions
        : permissions.filter((p) => p.roleId === selectedRole?.id);

    return (
        <div className="pb-24 space-y-6 min-h-screen">
            {/* ---------------- Header ---------------- */}
            <div className="flex items-center justify-between border-b pb-1">
                <h3 className="text-2xl font-semibold mb-0">User Roles</h3>

                <div className="flex gap-2">
                    <button onClick={handleCreateRole} className="btn-blue">
                        <FiPlus />
                        Create New Role
                    </button>
                    <button
                        onClick={handleEditRole}
                        disabled={!selectedRole}
                        className={`btn-green ${selectedRole ? '' : ' cursor-not-allowed'}`}
                    >
                        <FiEdit /> Rename Role
                    </button>
                    <button
                        onClick={handleDeleteConfirm}
                        disabled={!selectedRole}
                        className={`btn-red ${selectedRole ? '' : ' cursor-not-allowed'}`}
                    >
                        <FiTrash /> Delete Role
                    </button>
                </div>
            </div>

            {/* ---------------- Roles List ---------------- */}
            <div className="flex flex-wrap gap-1">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        onClick={() => {
                            if (selectedRole?.id !== role.id) {
                                setSelectedRole(role);
                                setIsEditingPerm(false);
                                setTempPermissions([]);
                            } else {
                                setSelectedRole(role);
                            }
                            setDeletedId(role.id);
                            setFormRoleData({
                                ...formRoleData,
                                id: role.id,
                                name: role.name,
                            });
                        }}
                        className={`flex items-center justify-center px-4 py-1 min-w-max rounded-lg  cursor-pointer transition
              ${
                  selectedRole?.id === role.id
                      ? 'bg-blue-500 text-black hover:bg-blue-200'
                      : 'bg-gray-200 hover:bg-blue-300'
              }`}
                    >
                        <span className="inline-flex flex-wrap justify-center text-center font-medium">
                            {role.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* ---------------- Users & Permissions ---------------- */}
            {selectedRole ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
                    {/* ---- Left: Assigned Users ---- */}
                    <div className="border rounded-lg  ml-10bg-white">
                        <h4 className=" px-3 py-1 top-0 text-white font-semibold   header-bg">
                            Assigned Users ({assignedUsers.length})
                        </h4>
                        <div className="">
                            {assignedUsers.length > 0 ? (
                                <ul className="space-y-1">
                                    {assignedUsers.map((user) => (
                                        <li key={user.id}>
                                            <Link
                                                //href={`/american/user/${user.id}`}
                                                href="#"
                                                className="flex items-center justify-between px-3 py-1 font-semibold text-[var(--header-bg)] hover:!text-green-700 border-2 border-[var(--header-bg)] hover:!border-green-700 rounded-md"
                                            >
                                                <FiUser className="w-5 h-5" />

                                                <span className="flex-1 text-center">
                                                    {user.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No users assigned
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ---- Right: Permissions ---- */}
                    <div className="border rounded  bg-white">
                        <h4 className="px-3 py-1 top-0 text-white font-semibold   header-bg">
                            Permissions ({rolePermissions.length})
                        </h4>
                        <div className="">
                            {rolePermissions.length > 0 ? (
                                <ul className="">
                                    {rolePermissions.map((perm, index) => (
                                        <li
                                            key={perm.id}
                                            className={`px-3 py-2  flex items-center justify-between p-2 border ${index % 2 === 0 ? 'bg-white' : 'table-row-bg'}`}
                                        >
                                            <span>
                                                {index + 1}.) {perm.name}
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={perm.checked}
                                                disabled={!isEditingPerm}
                                                onChange={() =>
                                                    togglePermission(perm.id)
                                                }
                                                className={` h-4 w-4  switch ${isEditingPerm ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No permissions set
                                </p>
                            )}
                        </div>
                        {rolePermissions.length > 0 && (
                            <div className="mt-4 flex gap-3 justify-end pb-2 pr-2">
                                {isEditingPerm ? (
                                    <>
                                        <button
                                            onClick={handleCancelPermissions}
                                            className="btn-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSavePermissions}
                                            className="btn-blue px-4"
                                        >
                                            Save Change
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditPermissions}
                                        className="btn-green"
                                    >
                                        Edit Permissions
                                        {/*className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"*/}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 italic">
                    Select a role to view users and permissions
                </p>
            )}

            {/* Create / Update Modal */}
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={editingRole ? 'Update Role' : 'Create Role'}
                onSave={handleSaveRole}
                size="md"
                actionType={editingRole ? 'update' : 'create'}
            >
                <div className="flex justify-center mb-3">
                    <label className="w-[20%] mr-5">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formRoleData.name}
                        placeholder="System Name"
                        onChange={(e) =>
                            setFormRoleData({
                                ...formRoleData,
                                name: e.target.value,
                            })
                        }
                        className="w-[80%]"
                        required
                    />
                </div>
            </FormModal>

            <DeleteModal
                title="Confirm Delete This System"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this role?"
                size="md"
            />
        </div>
    );
}
