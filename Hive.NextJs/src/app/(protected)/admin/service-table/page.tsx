/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createApiClient } from '@/services/apiClient';
//import { ThreeDot } from "react-loading-indicators";
import FormModal from '@/components/ui/FormModal';
import { toast } from 'react-hot-toast';

type ServiceTable = {
    id: number;
    name: string;
    count: number;
};

type ServiceTableCreate = {
    serviceTableName: string;
};

export interface ServiceTableOptions {
    name: string;
    id: number;
}

export interface ServiceVariable {
    serviceTableId: number;
    serviceTableName: string;
    variableName: string;
    variableValue: string;
}

export default function ServiceTablePage() {
    const [tables, setTables] = useState<ServiceTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [serviceTableName, setServiceTableName] = useState('');
    const router = useRouter();
    const api = createApiClient();

    useEffect(() => {
        fetchServiceTables();
    }, []);

    const fetchServiceVariables = async (serviceTableId: number) => {
        const res = await api.get<ServiceVariable[]>(
            `/service-tables/table-variables/${serviceTableId}`
        );
        return res.data;
    };

    const fetchServiceTables = async () => {
        try {
            const res = await api.get<ServiceTableOptions[]>('/service-tables');
            const data = res?.data ?? [];

            const counts: Record<string, { id: number; count: number }> = {};

            for (const item of data) {
                const name = item.name?.trim() || 'Unknown';
                const id = item.id;

                const result = await fetchServiceVariables(id);
                const count = result?.length ?? 0;

                if (!counts[name]) {
                    counts[name] = { id, count: 0 };
                }

                counts[name].count += count;
            }

            const tableArray: ServiceTable[] = Object.entries(counts).map(
                ([name, value]) => ({
                    id: value.id,
                    name,
                    count: value.count,
                })
            );

            setTables(tableArray);
        } catch (err) {
            console.error('Error fetching service tables:', err);
            setTables([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const payload = {
                Name: serviceTableName, // matches backend DTO
            };

            const res = await api.post<{ data: any; message: string }>('/service-tables', payload);

            setShowFormModal(false);
            toast.success(res.data?.message || 'Service table created successfully');
            fetchServiceTables();
        } catch (err) {
            console.error(err);
            toast.error('Error creating service table');
        }
    };

    const handleTableClick = (name: string) => {
        router.push(`/admin/service-table/variables/${name}`);
    };

    return (
        <div className="p-2 bg-gray-200 rounded-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Service Table Management
                </h1>
                <button
                    onClick={() => setShowFormModal(true)}
                    className="flex items-center gap-2 bg-[#008ca8] hover:bg-sky-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition"
                >
                    <PlusCircle size={18} />
                    Add Service Table Type
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center bg-white p-3 rounded-md">
                    {/*<ThreeDot color="#0085ad" size="medium" text="" textColor="" />*/}
                    <p>Loading...</p>
                </div>
            ) : tables.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    No service tables found.
                </div>
            ) : (
                <div className="bg-white p-3 rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className="border border-sky-400 rounded-md text-center py-2 px-3 text-sky-800 hover:bg-sky-50 transition cursor-pointer shadow-sm"
                            onClick={() => handleTableClick(table.id.toString())}
                        >
                            <span className="font-medium">{table.name}</span>{' '}
                            <span className="text-gray-500 text-sm">
                                ({table.count})
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/*Service Table Create Modal*/}
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title="Create Service Table"
                onSave={handleCreate}
                size="lg"
                actionType="create"
            >
                <div className="mb-3 items-center">
                    <div className="flex justify-end mb-4 items-center">
                        <label className="mr-1">Service Table Name:</label>
                        <div className="">
                            <input
                                type="text"
                                name="serviceTableName"
                                placeholder="Service Table Name"
                                onChange={(e) =>
                                    setServiceTableName(e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </FormModal>
        </div>
    );
}
