/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowLeft, Edit } from 'lucide-react';
import { FiTrash2 } from 'react-icons/fi';
import FormModal from '@/components/ui/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import { useParams } from 'next/navigation';
import { createApiClient } from '@/services/apiClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export interface ServiceVariable {
    id: number;
    serviceTableId: number;
    serviceTableName?: string;
    variableName: string;
    variableValue: string;
}

type CreateServiceVariableDto = {
    serviceTableId: number;
    variableName: string;
    variableValue: string;
};

type UpdateServiceVariableDto = {
    id: number;
    serviceTableId: number;
    variableName: string;
    variableValue: string;
};

export default function ServiceTableVariablesPage() {
    const [serviceTableVariables, setServiceTableVariables] = useState<
        ServiceVariable[]
    >([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteServiceVariableModal, setShowDeleteServiceVariableModal] =
        useState(false);
    const [
        showDeleteAllServiceVariableModal,
        setShowDeleteAllServiceVariableModal,
    ] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [formData, setFormData] = useState({
        serviceVariableName: '',
        serviceVariableValue: '',
        serviceTableName: '',
    });

    const params = useParams();
    const id = Array.isArray(params?.id)
        ? params.id[0]
        : params?.id || '';
    const api = createApiClient();

    useEffect(() => {
        fetchServiceTables();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchServiceTables = async () => {
        try {
            const res = await api.get<ServiceVariable[]>(
                `/service-tables/table-variables/${id}`
            );
            const data = res?.data ?? [];
            setServiceTableVariables(data);
            setShowDeleteServiceVariableModal(false);
        } catch (err) {
            console.error('Error fetching service tables:', err);
            setServiceTableVariables([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        const payload: CreateServiceVariableDto = {
            serviceTableId: Number(id),
            variableName: formData.serviceVariableName,
            variableValue: formData.serviceVariableValue,
        };

        try {
            const res = await api.post<object>(
                `/service-tables/variables/${payload.serviceTableId}`,
                payload
            );

            if (res.data) {
                toast.success('Service variable created successfully');
                setShowFormModal(false);
                fetchServiceTables();
            }
        } catch (error) {
            console.error('Error saving variable:', error);
            toast.error('Error creating variable');
        }
    };

    const handleEdit = (editId: number) => {
        const record = serviceTableVariables.find((item) => item.id === editId);
        if (record) {
            setEditingId(editId);
            setFormData({
                serviceVariableName: record.variableName,
                serviceVariableValue: record.variableValue,
                serviceTableName: record.serviceTableName || '',
            });
            setShowFormModal(true);
        }
    };

    const handleUpdate = async () => {
        if (!editingId) return;

        const payload: UpdateServiceVariableDto = {
            id: editingId,
            serviceTableId: Number(id),
            variableName: formData.serviceVariableName,
            variableValue: formData.serviceVariableValue,
        };

        try {
            const res = await api.put<object>(
                `/service-tables/variables/${payload.serviceTableId}`,
                payload
            );

            if (res.data) {
                toast.success('Service variable updated successfully');
                setShowFormModal(false);
                setEditingId(null);
                fetchServiceTables();
            }
        } catch (error) {
            console.error('Error updating variable:', error);
            toast.error('Error updating variable');
        }
    };

    const handleConfirmDeleteServiceVariable = (id: number) => {
        setDeletingId(id);
        setShowDeleteServiceVariableModal(true);
    };

    const handleDeleteServiceVariable = async () => {
        try {
            const res = await api.delete<object>(
                `/service-tables/variables/${deletingId}`
            );

            if (res.data) {
                toast.success('Variable deleted successfully');
                fetchServiceTables();
            }
        } catch (error) {
            console.error('Error deleting variable:', error);
            toast.error('Error deleting variable');
        }
    };

    const handleDeleteAllServiceVariable = async () => {
        try {
            await api.delete<any>(`/service-tables/all-variables/${id}`);
            toast.success('All variables deleted successfully');
            setShowDeleteAllServiceVariableModal(false);
            fetchServiceTables();
        } catch (err) {
            console.error(err);
            toast.error('Error deleting service table');
        }
    };

    const handleSave = () => {
        if (editingId) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    return (
        <>
            <div>
                <p className="text-sm text-center p-2 font-semibold !text-[#008ca8]">
                    TOTAL RECORD FOUND [{serviceTableVariables.length}]
                </p>
            </div>

            <div className="p-2.5 bg-[#efefef] rounded-md">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-2">
                    <Link
                        href="/admin/service-table"
                        className="flex items-center gap-2 bg-[#d9d9d9] hover:bg-[#d9d9d0] text-black px-4 py-2.5 rounded-md text-sm font-medium transition"
                    >
                        <ArrowLeft size={18} />
                        Back to Service Table
                    </Link>

                    <div className="flex justify-between items-center gap-2">
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({
                                    serviceVariableName: '',
                                    serviceVariableValue: '',
                                    serviceTableName: '',
                                });
                                setShowFormModal(true);
                            }}
                            className="flex items-center gap-2 bg-[#008ca8] hover:bg-sky-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition"
                        >
                            <PlusCircle size={18} />
                            Add Service Table Type
                        </button>
                        <button
                            onClick={() =>
                                setShowDeleteAllServiceVariableModal(true)
                            }
                            className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-md text-sm font-medium transition text-red-500 hover:text-red-700"
                        >
                            <FiTrash2 size={18} />
                            Delete All
                        </button>
                    </div>
                </div>

                {/* Conditional Rendering Section */}
                {loading ? (
                    <div className="flex justify-center items-center bg-white p-3 rounded-md">
                        <p>Loading...</p>
                    </div>
                ) : serviceTableVariables.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                        No service variables found.
                    </div>
                ) : (
                    <div className="bg-white p-3 rounded-md">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                        ID #
                                    </th>
                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                        Name
                                    </th>
                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                        Value
                                    </th>
                                    <th className="w-21 py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceTableVariables.map(
                                    (serviceTableVariable) => (
                                        <tr key={serviceTableVariable.id}>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {serviceTableVariable.id}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {
                                                    serviceTableVariable.variableName
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {
                                                    serviceTableVariable.variableValue
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500 flex justify-between gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            serviceTableVariable.id
                                                        )
                                                    }
                                                    className="text-sky-500 hover:text-sky-700"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleConfirmDeleteServiceVariable(
                                                            serviceTableVariable.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={editingId ? 'Edit Variable' : 'Create Variable'}
                onSave={handleSave}
                size="lg"
                actionType={editingId ? 'edit' : 'create'}
            >
                <div className="mb-3 items-center">
                    <div className="flex justify-end mb-4 items-center">
                        <label className="mr-1">Variable Name:</label>
                        <div>
                            <input
                                type="text"
                                name="serviceVariableName"
                                value={formData.serviceVariableName}
                                onChange={handleChange}
                                placeholder="Variable Name"
                                className="border rounded px-2 py-1"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mb-4 items-center">
                        <label className="mr-1">Variable Value:</label>
                        <input
                            type="text"
                            name="serviceVariableValue"
                            value={formData.serviceVariableValue}
                            onChange={handleChange}
                            placeholder="Variable Value"
                            className="border rounded px-2 py-1"
                        />
                    </div>
                </div>
            </FormModal>

            <DeleteModal
                title="Confirm Delete This Service Variable"
                isOpen={showDeleteServiceVariableModal}
                onClose={() => setShowDeleteServiceVariableModal(false)}
                onDelete={handleDeleteServiceVariable}
                message="Are you sure you want to delete this variable?"
                size="md"
            />

            <DeleteModal
                title="Confirm Delete All of this Service Table"
                isOpen={showDeleteAllServiceVariableModal}
                onClose={() => setShowDeleteAllServiceVariableModal(false)}
                onDelete={handleDeleteAllServiceVariable}
                message="Are you sure you want to delete this service table?"
                size="md"
            />
        </>
    );
}
