'use client';

import { useEffect, useState } from 'react';
import FormModal from '@/components/ui/FormModal';
import DeleteModal from '@/components/modal/ConfirmDeleteModal';
import { createApiClient } from '@/services/apiClient';
import { toast } from 'react-hot-toast';
import CommonTable from '../../../components/ui/CommonTable';
import Select from '../../../components/modal/Select';
import { SelectOption } from '../../../types/common';
import { DatePicker } from '../../../components/modal/DatePicker';

// --------------------
// Interfaces
// --------------------

export interface Customer {
    id: number;
    name: string;
    operatorId: number;
    operatorName?: string;
    salesRepresentativeId: number;
    salesRepresentativeName?: string;
    projectId: number;
    isActive: boolean;
    phone: string;
    mainPOC: string;
    billingAddress: string;
    availableCredit: number;
    lastLoadDate: Date;
}

// export interface CreateOrUpdateCustomer {
//     id: number;
//     name: string;
//     address: string;
//     phone: string;
//     operatorId: number;
//     salesRepresentativeId: number;
// }

// --------------------
// Main Component
// --------------------
export default function RoleListPage() {
    const api = createApiClient();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [operators, setOperators] = useState<SelectOption[]>([]);
    const [salesRep, setSalesRep] = useState<SelectOption[]>([]);

    // Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form Data
    const initialFormData = {
        id: 0,
        name: '',
        billingAddress: '',
        phone: '',
        operatorId: 0,
        salesRepresentativeId: 0,
        projectId: 0,
        isActive: true,
        mainPOC: '',
        availableCredit: 0,
        lastLoadDate: new Date(),
    }
    const [formData, setFormData] = useState<Customer>(initialFormData);

    // --------------------
    // Table Columns
    // --------------------
    const columns: { key: keyof Customer; label: string }[] = [
        { key: 'name', label: 'Customer Name' },
        { key: 'billingAddress', label: 'Billing Address' },
        { key: 'phone', label: 'Phone' },
        { key: 'availableCredit', label: 'Available Amount' },
        { key: 'mainPOC', label: 'Main POC' },
        { key: 'operatorName', label: 'Operator' },
        { key: 'salesRepresentativeName', label: 'Sales Representative' },
        { key: 'isActive', label: 'Status' },
    ];

    // --------------------
    // Fetch Data
    // --------------------


    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await api.get<Customer[]>('/customers');
            setCustomers(res.data ?? []);
        } catch (err) {
            console.error(err);
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    const fetchOperators = async () => {
        try {
            const res = await api.get<SelectOption[]>('/users/operators');
            setOperators(res.data ?? []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSalesRepo = async () => {
        try {
            const res = await api.get<SelectOption[]>('/users/operators');
            setSalesRep(res.data ?? []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchCustomers();
            await fetchOperators();
            await fetchSalesRepo();
        })();
    }, []);

    // --------------------
    // CRUD Handlers
    // --------------------
    const handleAdd = () => {
        setIsEditing(false);
        setEditCustomer(null);
        setFormData(initialFormData);
        setShowFormModal(true);
    };

    const handleEdit = (customer: Customer) => {
        setIsEditing(true);
        setEditCustomer(customer);
        setFormData(customer);
        setShowFormModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing && editCustomer) {
                await api.put(`/customers/${editCustomer.id}`, {
                    ...formData,
                });
                toast.success("Customer details updated successfully.");
            } else {
                const res = await api.post('/customers', {
                    ...formData,
                });
                toast.success(res.message);
            }
            setShowFormModal(false);
            await fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteConfirm = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (deleteId !== null) {
            try {
                await api.delete(`/customers/${deleteId}`);
                setCustomers(customers.filter((r) => r.id !== deleteId));
                setShowDeleteModal(false);
                toast.success("Customer deleted successfully.");
            } catch (err) {
                console.error(err);
            }
        }
    };

    const tableData = customers.map((customer) => ({
        ...customer,
        operatorName:
            operators.find((o) => Number(o.value) === customer.operatorId)?.label ?? '',
        salesRepresentativeName:
            salesRep.find((s) => Number(s.value) === customer.salesRepresentativeId)?.label ?? '',
    }));


    // --------------------
    // Search
    // --------------------
    // const [searchText, setSearchText] = useState('');

    // const filteredRoles = useMemo(() => {
    //     if (!searchText) return customers;
    //     return customers.filter((row) =>
    //         columns.some((col) =>
    //             String(row[col.key])
    //                 .toLowerCase()
    //                 .includes(searchText.toLowerCase())
    //         )
    //     );
    // }, [searchText, customers, columns]);

    // --------------------
    // JSX
    // --------------------

    return (
        <>
            <div>
                {/*<div className="bg-segment rounded-lg mb-2">
                    <div className="flex flex-wrap gap-4 items-center p-2.5">
                        <div className="flex-1 min-w-[300px]">
                            <div className="">
                                <h1 className="text-3xl font-bold text-left text-gray-900">Customers</h1>
                            </div>
                        </div>
                    </div>
                </div>*/}

                <div className="p-3.5 rounded-lg bg-segment-bg mb-2">
                    <CommonTable
                        title="Customers"
                        addButtonTitle="Add Customer"
                        columns={columns}
                        data={tableData}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDeleteConfirm}
                    />


                    {/*!loading && totalCount > 0 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(totalCount / itemsPerPage)}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalCount}
                                onPageChange={onPageChange}
                                onItemsPerPageChange={onItemsPerPageChange}
                                pageSizeOptions={[10, 15, 20, 50]}
                            />
                        </div>
                    )*/}
                </div>
            </div>

            {/* -------------------- Form Modal -------------------- */}
            <FormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={isEditing ? 'Update Customer' : 'Create Customer'}
                onSave={handleSave}
                actionType={isEditing ? 'update' : 'create'}
            >
                <div className="grid grid-cols-2 gap-5 p-3">
                    <div className="mr-5">
                        <div className="flex justify-end mb-3">
                            <label className="mr-2">Customer Name:</label>
                            <input
                                type="text"
                                value={formData.name}
                                placeholder="Customer Name"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.currentTarget.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="flex justify-end mb-3">
                            <label className="mr-2">Address:</label>
                            <input
                                type="text"
                                value={formData.billingAddress}
                                placeholder="Billing Address"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        billingAddress: e.currentTarget.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="flex justify-end mb-3">
                            <label className="mr-2">Main POC:</label>
                            <input
                                type="text"
                                value={formData.mainPOC}
                                placeholder="Main Preson of Contact"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        mainPOC: e.currentTarget.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="flex justify-end mb-3">
                            <label className="mr-2">Phone:</label>
                            <input
                                type="text"
                                value={formData.phone}
                                placeholder="Phone"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.currentTarget.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        <div className="flex justify-end mb-3">
                            <label className="mr-2">Available Credit:</label>
                            <input
                                type="number"
                                value={formData.availableCredit}
                                placeholder="Phone"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        availableCredit: Number(e.currentTarget.value),
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="flex justify-end mb-3 w-full">
                            <label className="mr-2">Operator:</label>
                            <Select
                                options={operators}
                                value={formData.operatorId.toString()}
                                onSelect={(e) =>
                                    setFormData({
                                        ...formData,
                                        operatorId: Number(e),
                                    })
                                }
                            />

                        </div>
                        <div className="flex justify-end mb-3 w-full">
                            <label className="mr-2">Sales Representative:</label>
                            <Select
                                options={salesRep}
                                value={formData.salesRepresentativeId.toString()}
                                onSelect={(e) =>
                                    setFormData({
                                        ...formData,
                                        salesRepresentativeId: Number(e),
                                    })
                                }
                            />

                        </div>
                        <div className="flex justify-end mb-3 w-full">
                            <label className="mr-2">Last Load Date:</label>
                            <DatePicker
                                placeholder="Date"
                                parentClassName=""
                                className=""
                                onChange={(date) => setFormData({
                                    ...formData,
                                    lastLoadDate: date ?? new Date(),
                                })}
                            />
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* -------------------- Delete Modal -------------------- */}
            <DeleteModal
                title="Confirm Delete This Customer"
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                message="Are you sure you want to delete this customer?"
                size="lg"
            />
        </>
    );
}
