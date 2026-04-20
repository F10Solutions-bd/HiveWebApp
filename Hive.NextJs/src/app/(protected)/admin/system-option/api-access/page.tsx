'use client';

import { useState } from 'react';
import CommonTable from '@/components/ui/CommonTable';
import FormModal from '@/components/ui/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import toast from 'react-hot-toast';
interface ApiBlock {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export default function ApiBlockPage() {
    //Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editApiBlock, setEditApiBlock] = useState<ApiBlock | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [apiBlocks, setApiBlocks] = useState<ApiBlock[]>([
        {
            id: 1,
            name: 'ABC Traders',
            email: 'abc@email.com',
            phone: '123456789',
            address: 'Dhaka',
        },
        {
            id: 2,
            name: 'XYZ Ltd',
            email: 'xyz@email.com',
            phone: '987654321',
            address: 'Chittagong',
        },
    ]);

    const columns: { key: keyof ApiBlock; label: string }[] = [
        { key: 'id', label: 'Id' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'address', label: 'Address' },
    ];

    // Form Data
    const [formData, setFormData] = useState<ApiBlock>({
        id: 0,
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleAdd = () => {
        setIsEditing(false);
        setEditApiBlock(null);
        setFormData({ id: 0, name: '', email: '', phone: '', address: '' });
        setShowFormModal(true);
    };
    const handleEdit = (apiBlock: ApiBlock) => {
        setIsEditing(true);
        setEditApiBlock(apiBlock);
        setFormData(apiBlock);
        setShowFormModal(true);
    };

    const handleSave = () => {
        if (isEditing && editApiBlock) {
            setApiBlocks(
                apiBlocks.map((api) =>
                    api.id === editApiBlock.id ? formData : api
                )
            );
        } else {
            setApiBlocks([
                ...apiBlocks,
                { ...formData, id: apiBlocks.length + 1 },
            ]);
        }
        setShowFormModal(false);
    };

    const handleDeleteConfirm = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (deleteId !== null) {
            setApiBlocks(apiBlocks.filter((api) => api.id !== deleteId));
            toast.success('Delete Api Blocks successfully!');
        }
        setShowDeleteModal(false);
    };

    return (
        <>
            <CommonTable
                title="Api Block"
                addButtonTitle="Add Api"
                columns={columns}
                data={apiBlocks}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDeleteConfirm}
            />
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={isEditing ? 'Update ApiBlock' : 'Create APIBlock'}
                onSave={handleSave}
                actionType={isEditing ? 'update' : 'create'}
            >
                <label>Vendor Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full mb-2"
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full mb-2"
                />

                <label>Phone</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full mb-2"
                />

                <label>Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full border"
                />
            </FormModal>

            <DeleteModal
                title="Confirm Delete This Api Block"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this Api?"
                size="lg"
            />
        </>
    );
}
