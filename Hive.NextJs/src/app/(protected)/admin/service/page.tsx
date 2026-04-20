'use client';

import { useEffect, useState } from 'react';
import CommonTable from '@/components/ui/CommonTable';
import FormModal from '@/components/ui/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import { toast } from 'react-hot-toast';
import { createApiClient } from '@/services/apiClient';

export interface System {
    id: number;
    name: string;
    phone: string;
    expirationType: string;
    /*    expiredDate: Date;*/
    remainingDays: number;
    timeZone: string;
}

export default function SystemListPage() {
    const api = createApiClient();
    const [systems, setSystems] = useState<System[]>([]);

    // Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editSystem, setEditSystem] = useState<System | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form Data
    const [formData, setFormData] = useState<System>({
        id: 0,
        name: '',
        phone: '',
        expirationType: '',
        /*        expiredDate: new Date(),*/
        remainingDays: 0,
        timeZone: '',
    });

    // Columns for table display
    const columns: { key: keyof System; label: string }[] = [
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'expirationType', label: 'Expiration Type' },
        /*        { key: "expiredDate", label: "Expired Date" },*/
        { key: 'remainingDays', label: 'Remaining Days' },
        { key: 'timeZone', label: 'Time Zone' },
    ];

    useEffect(() => {
        fetchSystems();
    }, []);

    // const useEffect = async () => {
    //     fetchSystems();
    // };

    const fetchSystems = async () => {
        try {
            //const api1 = await createApiClient();
            const res = await api.get<System[]>('/systems');
            setSystems(res.data ?? []);
            //toast.success(res.message);
        } catch (err) {
            console.log(err);
            //throw (err);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setEditSystem(null);
        setFormData({
            id: 0,
            name: '',
            phone: '',
            expirationType: '',
            /*expiredDate: new Date(),*/
            remainingDays: 0,
            timeZone: '',
        });
        setShowFormModal(true);
    };

    const handleEdit = (system: System) => {
        setIsEditing(true);
        setEditSystem(system);
        setFormData(system);
        setShowFormModal(true);
    };

    const handleSave = async () => {
        if (isEditing && editSystem) {
            try {
                const res = await api.put<number>('/systems/update', {
                    ...formData,
                });

                console.log(res);
                if (systems != null) {
                    setSystems(
                        systems.map((s) => (s.id === res.data ? formData : s))
                    );
                    setShowFormModal(false);

                    toast.success(res.message);
                } else {
                    toast.error('The system is not found to edit');
                }
            } catch (err) {
                throw err;
            }
        } else {
            try {
                const res = await api.post<number>('/systems/create', {
                    ...formData,
                });

                console.log(res);

                setSystems((systems) => [
                    ...systems,
                    { ...formData, id: res.data! },
                ]);
                setShowFormModal(false);

                toast.success(res.message);
            } catch (err) {
                throw err;
            }
        }
    };

    const handleDeleteConfirm = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (deleteId !== null) {
            console.log(deleteId);
            try {
                const res = await api.delete<number>(
                    `/systems/delete/${deleteId}`
                );

                setSystems(systems.filter((s) => s.id !== deleteId));
                setShowDeleteModal(false);

                toast.success(res.message);
            } catch (err) {
                throw err;
            }
        }
    };

    return (
        <>
            <CommonTable
                title="Systems"
                addButtonTitle="Add System"
                columns={columns}
                data={systems}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDeleteConfirm}
            />

            {/* Create / Update Modal */}
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={isEditing ? 'Update System' : 'Create System'}
                onSave={handleSave}
                size="lg"
                actionType={isEditing ? 'update' : 'create'}
            >
                <div className="flex justify-end mb-3">
                    <label className="mr-1">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="System Name"
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-80"
                        required
                    />
                </div>

                <div className="flex justify-end mb-3">
                    <label className="mr-1">Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-80"
                        required
                    />
                </div>

                <div className="flex justify-end mb-3">
                    <label className="mr-1">Expiration Type:</label>
                    <select
                        name="expirationType"
                        value={formData.expirationType}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                expirationType: e.target.value,
                            })
                        }
                        className="w-80"
                        required
                    >
                        <option value="">-- Select Expiration Type --</option>
                        <option value="Normal Expiration">
                            Normal Expiration
                        </option>
                        <option value="Non-Expiring Services">
                            Non-Expiring Services
                        </option>
                    </select>
                </div>

                {/*<div className="flex justify-center mb-3">*/}
                {/*    <label className="w-[20%] mr-5">Expiration Date:</label>*/}
                {/*    <input*/}
                {/*        type="date"*/}
                {/*        name="expiredDate"*/}
                {/*        value={formData.expiredDate}*/}
                {/*        onChange={(e) =>*/}
                {/*            setFormData({ ...formData, expiredDate: e.target.value })*/}
                {/*        }*/}
                {/*        className="w-[80%]"*/}
                {/*        required*/}
                {/*    />*/}
                {/*</div>*/}

                <div className="flex justify-end mb-3">
                    <label className="mr-1">Time Zone:</label>
                    <select
                        name="timeZone"
                        value={formData.timeZone}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                timeZone: e.target.value,
                            })
                        }
                        className="w-80"
                        required
                    >
                        <option value="">-- Select Time Zone --</option>
                        <option value="(GMT-05:00) Eastern Time (US & Canada)">
                            (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-09:00) Alaska">
                            (GMT-09:00) Alaska
                        </option>
                        <option value="(GMT-07:00) Arizona">
                            (GMT-07:00) Arizona
                        </option>
                    </select>
                </div>
            </FormModal>

            {/* Delete Modal */}
            <DeleteModal
                title="Confirm Delete This System"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this system?"
                size="md"
            />
        </>
    );
}
