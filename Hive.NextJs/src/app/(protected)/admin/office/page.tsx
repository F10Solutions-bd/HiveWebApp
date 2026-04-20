'use client';

import { useEffect, useState } from 'react';
import CommonTable from '@/components/ui/CommonTable';
import FormModal from '@/components/modal/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import { toast } from 'react-hot-toast';
import { createApiClient } from '@/services/apiClient';

export interface System {
    id: number;
    name: string;
    phone: string;
    expirationType: string;
    remainingDays: number;
    timeZone: string;
}

export interface Office {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
}

export default function SystemListPage() {
    const api = createApiClient();
    const [offices, setOffices] = useState<Office[]>([]);

    const [isOpenCreateOfficeModal, setIsOpenCreateOfficeModal] =
        useState(false);

    // Form Data
    const [formData, setFormData] = useState<Office>({
        id: 0,
        name: '',
        email: '',
        phone: '',
        address: '',
        isActive: true,
    });

    useEffect(() => {
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
        try {
            const officesRes = await api.get<Office[]>('/offices');
            setOffices(officesRes.data ?? []);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSave = async () => {
        try {
            const res = await api.post<number>('/offices', {
                ...formData,
            });

            console.log(res);
            setIsOpenCreateOfficeModal(false);
            toast.success(res.message);
        } catch (err) {
            throw err;
        }
    };

    return (
        <>
            <div className="p-2.5 rounded-lg bg-segment-bg mb-2">
                <div className="mb-2.5 py-2 flex justify-between">
                    <h2 className="text-xl">Office List</h2>
                    <div className="flex gap-2 text-[15px]">
                        <button
                            onClick={() => setIsOpenCreateOfficeModal(true)}
                            className="btn-secondary !py-1.5"
                        >
                            Create Office
                        </button>
                        <FormModal
                            isOpen={isOpenCreateOfficeModal}
                            onClose={() => setIsOpenCreateOfficeModal(false)}
                            headline="Create Office"
                        >
                            <div className="flex justify-end gap-2 mb-2">
                                <label>Name:</label>
                                <input
                                    name="email"
                                    type="text"
                                    placeholder="Name"
                                    maxLength={50}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-2 mb-2">
                                <label>Email:</label>
                                <input
                                    name="email"
                                    type="text"
                                    placeholder="Email"
                                    maxLength={50}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-2 mb-2">
                                <label>Phone:</label>
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="Phone"
                                    maxLength={50}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-2 mb-3">
                                <label>Address:</label>
                                <textarea
                                    name="address"
                                    placeholder="Name"
                                    maxLength={50}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleSave}
                                    className="btn-primary"
                                >
                                    Save
                                </button>
                            </div>
                        </FormModal>
                    </div>
                </div>
                <div className="bg-bg rounded-lg overflow-hidden px-6 py-3">
                    <div className="overflow-x-auto">
                        <table className="datatable">
                            <thead>
                                <tr>
                                    <th>
                                        <span>ID</span>
                                    </th>
                                    <th>
                                        <span>Name</span>
                                    </th>
                                    <th>
                                        <span>Email</span>
                                    </th>
                                    <th>
                                        <span>Phone</span>
                                    </th>
                                    <th>
                                        <span>Address</span>
                                    </th>
                                    <th>
                                        <span>Active</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {offices.map((office) => (
                                    <tr key={office.id}>
                                        <td>{office.id}</td>
                                        <td>{office.name}</td>
                                        <td>{office.email}</td>
                                        <td>{office.phone}</td>
                                        <td>{office.address}</td>
                                        <td>
                                            {office.isActive ? 'Yes' : 'No'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
