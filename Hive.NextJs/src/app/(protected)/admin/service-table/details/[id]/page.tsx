'use client';
import React, { useState } from 'react';
import { PlusCircle, ArrowLeft, Edit } from 'lucide-react';
import { FiTrash2 } from 'react-icons/fi';
import FormModal from '@/components/ui/FormModal';

type ServiceTableVariable = {
    id: number;
    name: string;
    value: string;
};

const initialServiceTableVariables: ServiceTableVariable[] = [
    { id: 1, name: 'Booked', value: 'Booked' },
    { id: 2, name: 'Dispatched', value: 'Dispatched' },
    { id: 3, name: 'In-Transit', value: 'In-Transit' },
    { id: 4, name: 'Delivered', value: 'Delivered' },
];

export default function ServiceTableDetailsPage() {
    const [serviceTableVariables, setServiceTableVariables] = useState<
        ServiceTableVariable[]
    >(initialServiceTableVariables);
    const [isOpenFormModal, setIsOpenFormModal] = useState(false);

    const handleSave = () => {
        // Logic for adding a new service table
    };

    const handleEdit = (id: number) => {
        // Logic for editing a service table
        alert(`Editing table with ID: ${id}`);
    };

    const handleDelete = (id: number) => {
        // Logic for deleting a service table
        setServiceTableVariables(
            serviceTableVariables.filter(
                (serviceTableVariable) => serviceTableVariable.id !== id
            )
        );
    };

    return (
        <>
            <div>
                <p className="text-sm text-center p-2 font-semibold !text-[#008ca8]">
                    TOTAL RECORD FOUND[10]
                </p>
            </div>

            <div className="p-2.5 bg-[#efefef] rounded-md">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-[#d9d9d9] hover:bg-[#d9d9d0] text-black px-4 py-2.5 rounded-md text-sm font-medium transition"
                    >
                        <ArrowLeft size={18} />
                        Back to Service Table
                    </button>
                    <div className="flex justify-between items-center gap-2">
                        <button
                            onClick={() => setIsOpenFormModal(true)}
                            className="flex items-center gap-2 bg-[#008ca8] hover:bg-sky-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition"
                        >
                            <PlusCircle size={18} />
                            Add Service Table Type
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-md text-red-500 hover:text-red-700 text-sm font-medium transition"
                        >
                            <FiTrash2 size={18} className="" />
                            Delete All
                        </button>
                    </div>
                </div>

                {/* Service Tables Table */}
                <div className="bg-white p-3 rounded-md">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="">
                            <tr className="">
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                    <span className="border-b-1">ID #</span>
                                </th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                    <span className="border-b-1">Name</span>
                                </th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                    <span className="border-b-1">Value</span>
                                </th>
                                <th className="w-21 py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                    <span className="border-b-1">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {serviceTableVariables.map(
                                (serviceTableVariable) => (
                                    <tr
                                        key={serviceTableVariable.id}
                                        className=""
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {serviceTableVariable.id}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {serviceTableVariable.name}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {serviceTableVariable.value}
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
                                                    handleDelete(
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
            </div>

            {/*User Create Modal*/}
            <FormModal
                isOpen={isOpenFormModal}
                onClose={() => setIsOpenFormModal(false)}
                title="Create Variable"
                onSave={handleSave}
                size="lg"
                actionType="create"
            >
                <div className="mb-3 items-center">
                    <div className="flex justify-end mb-4 items-center">
                        <label className="mr-1">Variable Name:</label>
                        <div className="">
                            <input
                                type="text"
                                name="name"
                                placeholder="Variable Name "
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mb-4 items-center">
                        <label className="mr-1">Variable Value:</label>
                        <input
                            type="text"
                            name="value"
                            placeholder="Variable Value"
                        />
                    </div>
                </div>
            </FormModal>
        </>
    );
}
