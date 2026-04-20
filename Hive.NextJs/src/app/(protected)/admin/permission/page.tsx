'use client';
import { useState } from 'react';
import CommonTable from '@/components/ui/CommonTable';
import FormModal from '@/components/ui/FormModal';
import toast from 'react-hot-toast';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';

export interface Permission {
    id: number;
    name: string;
    projectName: string;
}

const columns: { key: keyof Permission; label: string }[] = [
    { key: 'name', label: 'Permission Name' },
    { key: 'projectName', label: 'Project Name' },
];

export default function PermissionListPage() {
    const [permissions, setPermissions] = useState<Permission[]>([
        {
            id: 1,
            name: 'ChangePassword',
            projectName: 'American',
        },
        {
            id: 2,
            name: 'DeleteRole',
            projectName: 'HRM',
        },
    ]);

    const [permissionFormData, setPermissionFormData] = useState<Permission>({
        id: 0,
        name: '',
        projectName: '',
    });

    const [showPermissionFormModal, setShowPermissionFormModal] =
        useState(false);
    const [showPermissionDeleteModal, setShowPermissionDeleteModal] =
        useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [permissionDeleteId, setPermissionDeleteId] = useState<number | null>(
        null
    );

    const handleAddPermission = () => {
        setIsEditing(false);
        setShowPermissionFormModal(true);
        setPermissionFormData({ id: 0, name: '', projectName: '' });
    };

    const handleEditPermission = (permission: Permission) => {
        setIsEditing(true);
        setShowPermissionFormModal(true);
        setPermissionFormData(permission);
    };

    const handleSavePermission = () => {
        if (isEditing) {
            setPermissions(
                permissions.map((p) =>
                    p.id === permissionFormData.id ? permissionFormData : p
                )
            );
            toast.success('Permission updated successfully!');
        } else {
            setPermissions([
                ...permissions,
                {
                    ...permissionFormData,
                    id: permissions.length
                        ? permissions[permissions.length - 1].id + 1
                        : 1,
                },
            ]);
            toast.success('Permission created successfully!');
        }
        setShowPermissionFormModal(false);
    };

    const handleDeleteConfirmPermission = (id: number) => {
        setPermissionDeleteId(id);
        setShowPermissionDeleteModal(true);
    };

    const handleDeletePermission = () => {
        if (permissionDeleteId !== null) {
            setPermissions(
                permissions.filter((p) => p.id !== permissionDeleteId)
            );
            toast.success('System deleted successfully!');
        }
        setShowPermissionDeleteModal(false);
    };

    return (
        <>
            <CommonTable
                title="Permissions"
                addButtonTitle="Add Permission"
                columns={columns}
                data={permissions}
                onAdd={handleAddPermission}
                onEdit={handleEditPermission}
                onDelete={handleDeleteConfirmPermission}
            />

            <FormModal
                isOpen={showPermissionFormModal}
                onClose={() => setShowPermissionFormModal(false)}
                title={isEditing ? 'Update Permission' : 'Create Permission'}
                onSave={handleSavePermission}
                size="lg"
                actionType={isEditing ? 'update' : 'create'}
            >
                <div className="flex justify-center mb-3">
                    <label className="w-[20%] mr-5">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={permissionFormData.name}
                        placeholder="Permission Name"
                        className="w-[80%]"
                        onChange={(e) =>
                            setPermissionFormData({
                                ...permissionFormData,
                                name: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="flex justify-center mb-3">
                    <label className="w-[20%] mr-5">Expiration Type:</label>
                    <select
                        name="expirationType"
                        value={permissionFormData.projectName}
                        className="w-[80%]"
                        onChange={(e) =>
                            setPermissionFormData({
                                ...permissionFormData,
                                projectName: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">-- Select Project --</option>
                        <option value="American">American</option>
                        <option value="HRM">Human Resource Management</option>
                    </select>
                </div>
            </FormModal>

            <DeleteModal
                title="Confirm Delete This Permission"
                isOpen={showPermissionDeleteModal}
                onClose={() => setShowPermissionDeleteModal(false)}
                onDelete={handleDeletePermission}
                message="Are you sure want to delete this permission?"
                size="lg"
            />
        </>
    );
}
