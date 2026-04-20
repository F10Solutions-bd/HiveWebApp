'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiArrowUp } from 'react-icons/fi';

// ---------------- Types ----------------
// ---------------- Types ----------------
interface Role {
    id: number;
    name: string;
    count: number;
}

interface UserType {
    id: number;
    name: string;
    roleId: number;
}

interface Permission {
    id: number;
    name: string;
    roleId: number;
    checked: boolean;
}

export default function UserRolesPage() {
    // ---------------- Data ----------------
    const [roles, setRoles] = useState<Role[]>([
        { id: 1, name: 'Admin', count: 4 },
        { id: 2, name: 'Lead', count: 2 },
        { id: 3, name: 'Manager1', count: 6 },
        { id: 4, name: 'Manager2', count: 6 },
        /* { id: 5, name: "Manager2", count: 6 },
         { id: 6, name: "Manager2", count: 2 },
         { id: 7, name: "Manager2", count: 2 },
         { id: 8, name: "Manager2", count: 1 },
         { id: 9, name: "Manager2", count: 6 },
         { id: 10, name: "Manager2", count:1 },
         { id: 11, name: "Manager2", count: 2 },
         { id: 12, name: "Manager2", count:3 },
         { id: 13, name: "Manager13", count: 5 },*/
    ]);

    const users: UserType[] = [
        { id: 1, name: 'John Doe', roleId: 1 },
        { id: 2, name: 'Jane Smith', roleId: 1 },
        { id: 3, name: 'Michael Brown', roleId: 2 },
        { id: 4, name: 'Sarah Lee', roleId: 3 },
        { id: 5, name: 'Sarah Lee', roleId: 3 },
        { id: 6, name: 'Sarah Lee', roleId: 3 },
        { id: 7, name: 'Sarah Lee', roleId: 3 },
        { id: 8, name: 'Sarah Lee', roleId: 3 },
        { id: 9, name: 'Sarah Lee', roleId: 3 },
        { id: 10, name: 'Sarah Lee', roleId: 3 },
        /*     { id: 11, name: "Sarah Lee", roleId: 3 },
             { id: 12, name: "Sarah Lee", roleId: 3 },
             { id: 13, name: "Sarah Lee", roleId: 3 },
             { id: 14, name: "Sarah Lee", roleId: 3 },
             { id: 15, name: "Sarah Lee", roleId: 3 },
             { id: 16, name: "Sarah Lee", roleId: 3 },
             { id: 17, name: "Sarah Lee", roleId: 3 },
             { id: 18, name: "Sarah Lee", roleId: 3 },
             { id: 19, name: "Sarah Lee", roleId: 3 },*/
    ];

    const [permissions, setPermissions] = useState<Permission[]>([
        { id: 1, name: 'View Reports', roleId: 1, checked: true },
        { id: 2, name: 'Edit Users', roleId: 1, checked: false },
        { id: 3, name: 'Delete Projects', roleId: 2, checked: true },
        { id: 4, name: 'Assign Tasks', roleId: 3, checked: false },
        { id: 5, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 6, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 7, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 8, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 9, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 10, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 11, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 12, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 13, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 14, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 15, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 16, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 17, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 18, name: 'Sarah Lee', roleId: 3, checked: true },
        { id: 19, name: 'Sarah Lee', roleId: 3, checked: true },
    ]);

    // ---------------- State ----------------
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [modalType, setModalType] = useState<
        'create' | 'rename' | 'delete' | null
    >(null);
    const [roleName, setRoleName] = useState('');

    // Permission editing mode
    const [isEditingPerm, setIsEditingPerm] = useState(false);
    const [tempPermissions, setTempPermissions] = useState<Permission[]>([]);

    // ---------------- Effects ----------------
    useEffect(() => {
        // By default select first role
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
        }
    }, [roles, selectedRole]);

    // ---------------- Handlers ----------------
    const handleCreate = () => {
        if (roleName.trim() === '') return;
        const newRole: Role = { id: Date.now(), name: roleName, count: 0 };
        setRoles([...roles, newRole]);
        setRoleName('');
        setModalType(null);
    };

    const handleRename = () => {
        if (!selectedRole || roleName.trim() === '') return;
        setRoles(
            roles.map((r) =>
                r.id === selectedRole.id ? { ...r, name: roleName } : r
            )
        );
        setSelectedRole({ ...selectedRole, name: roleName });
        setRoleName('');
        setModalType(null);
    };

    const handleDelete = () => {
        if (!selectedRole) return;
        setRoles(roles.filter((r) => r.id !== selectedRole.id));
        setSelectedRole(null);
        setModalType(null);
    };

    const handleEditPermissions = () => {
        // Copy current permissions for this role into temp state
        const rolePerms = permissions.filter(
            (p) => p.roleId === selectedRole?.id
        );
        setTempPermissions(rolePerms);
        setIsEditingPerm(true);
    };

    const handleSavePermissions = () => {
        // Update main permissions with temp changes
        const updated = permissions.map(
            (p) => tempPermissions.find((tp) => tp.id === p.id) || p
        );
        setPermissions(updated);
        setIsEditingPerm(false);
    };

    const handleCancelPermissions = () => {
        setIsEditingPerm(false);
        setTempPermissions([]); // discard changes
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

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300); // show button after 300px
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        /* className = "p-6 pb-24 space-y-6 min-h-screen overflow-y-scroll"*/
        <div className="p-6 pb-24 space-y-6 min-h-screen">
            {/* ---------------- Header ---------------- */}
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-semibold">User Roles</h1>

                <div className="flex  gap-2">
                    <button
                        onClick={() => {
                            setModalType('create');
                            setRoleName('');
                        }}
                        className="px-8 py-2 rounded-lg bg-blue-600 text-white hover:white"
                    >
                        Create
                    </button>
                    <button
                        onClick={() => {
                            if (selectedRole) {
                                setModalType('rename');
                                setRoleName(selectedRole.name);
                            }
                        }}
                        disabled={!selectedRole}
                        className={`px-8 py-2 rounded-lg text-white ${
                            selectedRole
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Rename
                    </button>
                    <button
                        onClick={() => {
                            if (selectedRole) setModalType('delete');
                        }}
                        disabled={!selectedRole}
                        className={`px-8 py-2 rounded-lg text-white ${
                            selectedRole
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* ---------------- Roles List ---------------- */}
            {/* className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"*/}
            <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={`flex items-center justify-center px-4 py-1 min-w-max rounded-lg shadow cursor-pointer transition
              ${
                  selectedRole?.id === role.id
                      ? 'bg-blue-500 text-black hover:bg-blue-200'
                      : 'bg-gray-200 hover:bg-blue-300'
              }`}
                    >
                        <span className="inline-flex flex-wrap justify-center text-center font-medium">
                            {role.name}
                        </span>{' '}
                        <span className="ml-1 text-sm opacity-80">
                            ({role.count})
                        </span>
                    </div>
                ))}
            </div>

            {/* ---------------- Users & Permissions ---------------- */}
            {selectedRole ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
                    {/* ---- Left: Assigned Users ---- */}
                    <div className="border rounded-lg shadow bg-white">
                        <h4 className="sticky p-1 top-0 text-white font-semibold text-center shadow-sm z-10 bg-[#337ab7]">
                            Assigned Users ({assignedUsers.length})
                        </h4>
                        {/*className="overflow-y-auto max-h-[calc(100vh-400px)] pr-2"*/}
                        <div className="pr-2">
                            {assignedUsers.length > 0 ? (
                                <ul className="space-y-2">
                                    {assignedUsers.map((user) => (
                                        <li
                                            key={user.id}
                                            className="flex items-center space-x-3 p-2 border rounded-md hover:bg-gray-50"
                                        >
                                            <FiUser className="w-5 h-5 text-gray-500" />
                                            <span>{user.name}</span>
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
                    <div className="border rounded-lg shadow bg-white">
                        <h4 className="sticky top-0  p-1 text-white  font-semibold text-center shadow-sm z-10  bg-[#337ab7]">
                            Permissions ({rolePermissions.length})
                        </h4>
                        {/*className="max-h-64 overflow-y-auto pr-2"*/}
                        <div className="pr-2">
                            {rolePermissions.length > 0 ? (
                                <ul className="space-y-2">
                                    {rolePermissions.map((perm, index) => (
                                        <li
                                            key={perm.id}
                                            className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50"
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
                                                className={`h-4 w-4 ${
                                                    isEditingPerm
                                                        ? 'cursor-pointer'
                                                        : 'cursor-not-allowed'
                                                }`}
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
                        {/* ---- Permission Edit Buttons ---- */}
                        {rolePermissions.length > 0 && (
                            <div className="mt-4 flex gap-3 justify-end pb-2 pr-2 space-x-2">
                                {isEditingPerm ? (
                                    <>
                                        <button
                                            onClick={handleCancelPermissions}
                                            className="px-10 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSavePermissions}
                                            className="px-10 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditPermissions}
                                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Edit Permissions
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

            {/* ---------------- Modals (Create, Rename, Delete) ---------------- */}
            {modalType && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6 space-y-4">
                        {/* Create / Rename */}
                        {(modalType === 'create' || modalType === 'rename') && (
                            <>
                                <h2 className="text-xl font-semibold">
                                    {modalType === 'create'
                                        ? 'Create Role'
                                        : 'Rename Role'}
                                </h2>
                                <input
                                    type="text"
                                    value={roleName}
                                    onChange={(e) =>
                                        setRoleName(e.target.value)
                                    }
                                    placeholder="Enter role name"
                                    className="w-full border rounded-lg p-2"
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setModalType(null)}
                                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={
                                            modalType === 'create'
                                                ? handleCreate
                                                : handleRename
                                        }
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        {modalType === 'create'
                                            ? 'Create'
                                            : 'Save'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Delete */}
                        {modalType === 'delete' && (
                            <>
                                <h2 className="text-xl font-semibold text-red-600">
                                    Delete Role
                                </h2>
                                <p>
                                    Are you sure you want to delete{' '}
                                    <span className="font-bold">
                                        {selectedRole?.name}
                                    </span>
                                    ?
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setModalType(null)}
                                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* ---------------- Scroll-to-Top Button ---------------- */}
            {showScrollTop && (
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className={`fixed bottom-6 right-12 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 
                    transition-all duration-1000 ease-in-out
                    ${showScrollTop ? 'opacity-70 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
                >
                    <FiArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
