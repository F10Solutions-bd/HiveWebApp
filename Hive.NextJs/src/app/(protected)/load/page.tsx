'use client';

import React, { useState, useEffect } from 'react';
import Select from '@/components/modal/Select';
import EmployeeModal from '@/components/modal/EmployeeModal';
import CarrierModal from '@/components/modal/CarrierModal';
import CustomerModal from '@/components/modal/CustomerModal';
import FormModal from '@/components/modal/FormModal';
import api from '@/services/apiClient';
import { useRouter } from "next/navigation";
import { loadStausTableMap } from '@/features/load/constants';
import { toDisplayDateString } from '@/utils/dateHelper';
import { toast } from 'react-hot-toast';
import { LoadFilter, LoadCreate, Customer } from '@/features/dashboard/types';
import { SelectOption } from '@/types/common';

export default function Loads() {
    const router = useRouter();

    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [pickupDeliveryDropdown, setPickupDeliveryDropdown] = useState<SelectOption[]>([]);
    const [salesRepDropdownOptions, setSalesRepDropdownOptions] = useState<SelectOption[]>([]);
    const [customerDropdownOptions, setCustomerDropdownOptions] = useState<SelectOption[]>([]);
    const [loadTypeOptions, setLoadTypeOptions] = useState<SelectOption[]>([]);
    const [activeLoadTypeTab, setActiveLoadTypeTab] = useState<'truckload' | 'drayage'>('truckload');

    // Filtering State
    const [tableData, setTableData] = useState<any[]>([]); // Dynamic database data
    const [loadFilter, setLoadFilter] = useState<LoadFilter>({
        status: null,
        customerId: null,
        salesRepId: null,
        operatorId: null,
        fromDate: null,
        toDate: null,
        loadType: 'truckload',
        equipmentType: undefined,
        dateFilterType: ""
    });

    const [isOpenCreateLoadModal, setIsOpenCreateLoadModal] = useState(false);
    const [loadCreateFormData, setLoadCreateFormData] = useState<LoadCreate>({
        id: 0,
        customerId: 0,
        loadType: "",
        salesRepId: 3,
        operatorId: 3,
    });

    // Modal States
    const [isOpenEmployeeModal, setIsOpenEmployeeModal] = useState(false);
    const [isOpenCarrierModal, setIsOpenCarrierModal] = useState(false);
    const [isOpenCustomerModal, setIsOpenCustomerModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('1');
    const [selectedCarrierId, setSelectedCarrierId] = useState<string>('1');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('1');
    const [anchorPos, setAnchorPos] = useState<{ top: number; left: number; } | null>(null);

    useEffect(() => {
        const fetchAllDropdown = async () => {
            try {
                await Promise.allSettled([
                    fetchPickupDeliveryDropdown(),
                    fetchSalesRepDropdown()
                ]);

            } catch (error) {
                console.error(error);
            }
        };

        fetchAllDropdown();
    }, []);

    useEffect(() => {
        const fetchFilteredLoads = async () => {
            try {
                const filter = { ...loadFilter };
                if (statusFilter !== 'All') {
                    filter.status = statusFilter;
                }
                const response = await api.get<any>("/loads", { params: filter });
                if (response.data?.items) {
                    setTableData(response.data.items);
                }
            } catch (error) {
                console.error("Error fetching loads:", error);
            }
        };

        fetchFilteredLoads();
    }, [loadFilter, statusFilter]);

    const fetchPickupDeliveryDropdown = async () => {
        try {
            const { data } = await api.get<SelectOption[]>(
                "/service-tables/dropdown-by-table-name/Pickup Delivery Filter"
            );
            if (data && data.length > 0) {
                setPickupDeliveryDropdown(data);
            }
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        }
    };

    const fetchSalesRepDropdown = async () => {
        try {
            const { data } = await api.get<SelectOption[]>("/users/sales-representative")

            if (data && data.length > 0) {
                setSalesRepDropdownOptions(data);
            }
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        }
    };

    const fetchCustomerDropdownOptions = async (): Promise<Customer[] | null> => {
        try {
            const response = await api.get<Customer[]>("/customers");
            return response.data;
        } catch {
            return null;
        }
    };

    const fetchLoadTypeOptions = async (): Promise<SelectOption[] | null> => {
        try {
            const response = await api.get<SelectOption[]>("/loads/load-types");
            return response.data;
        } catch {
            return null;
        }
    };

    const handleOpenCreateLoadModal = async () => {
        setIsOpenCreateLoadModal(true);
        const data = await fetchCustomerDropdownOptions();
        if (data) {
            const options: SelectOption[] = data.map((customer) => ({
                label: customer.name,
                value: customer.id.toString(),
            }));
            setCustomerDropdownOptions(options);
        };

        const loadTypeOptionsData = await fetchLoadTypeOptions();
        if (loadTypeOptionsData) {
            setLoadTypeOptions(loadTypeOptionsData);
        }
    };

    const handleCreateLoad = async () => {
        try {
            const response = await api.post<LoadCreate>("/loads", loadCreateFormData);
            if (response.data != null) {
                router.push(`/load/edit/${response.data.id}`);
            }
            setIsOpenCreateLoadModal(false);
            toast.success(response.message || "Load created successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create load");
        }
    };

    // Click Handlers for Modals
    const handleCarrierClick = (id: string, e: React.MouseEvent<HTMLElement>) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setSelectedCarrierId(id);
        setIsOpenCarrierModal(true);
        setIsOpenEmployeeModal(false);
        setIsOpenCustomerModal(false);

        setAnchorPos({
            top: rect.top + 6,
            left: rect.left + rect.width + 6 + window.scrollX,
        });
    };

    const handleCustomerClick = (id: string, e: React.MouseEvent<HTMLElement>) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setSelectedCustomerId(id);
        setIsOpenCustomerModal(true);
        setIsOpenCarrierModal(false);
        setIsOpenEmployeeModal(false);

        setAnchorPos({
            top: rect.top + 6,
            left: rect.left + rect.width + 6 + window.scrollX,
        });
    };

    const handleEmployeeClick = (id: string, e: React.MouseEvent<HTMLElement>) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setSelectedEmployeeId(id);
        setIsOpenEmployeeModal(true);
        setIsOpenCarrierModal(false);
        setIsOpenCustomerModal(false);

        setAnchorPos({
            top: rect.top + 6,
            left: rect.left + rect.width + 6 + window.scrollX,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'booked': return '!bg-booked-bg !text-bg';
            case 'covered': return '!bg-covered-bg !text-bg';
            case 'dispatched': return '!bg-dispatched-bg !text-bg';
            case 'in_transit': return '!bg-intransit-bg !text-bg';
            case 'delivered': return '!bg-delivered-bg !text-bg';
            default: return '!bg-secondary !text-fg';
        }
    };

    return (
        <div className="">
            {/* Filters */}
            <div className="bg-segment rounded-lg mb-2">
                <div className="flex flex-wrap gap-4 items-center p-2.5">
                    <div className="flex-1 min-w-[300px]">
                        <div className="">
                            <h1 className="text-3xl font-bold text-left text-gray-900">Loads Management</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loads Table */}
            <div className="p-2.5 rounded-lg bg-segment-bg mb-2">
                <div className="mb-2.5 py-2 flex justify-between">
                    <div className="flex gap-3 !w-[50%]">
                        <Select
                            options={pickupDeliveryDropdown}
                            value={loadFilter.dateFilterType}
                            placeholder="Select Date Filter"
                            className="border-none !py-4 !rounded-md !text-sm !w-[180px]"
                            dropdownWidth=""
                            onSelect={(val) => setLoadFilter({ ...loadFilter, dateFilterType: val })}
                        />

                        <Select
                            options={salesRepDropdownOptions}
                            value={loadFilter.salesRepId?.toString() || ""}
                            placeholder="Select Sales Rep"
                            className="border-none !py-4 !rounded-md !text-sm !w-[180px]"
                            dropdownWidth=""
                            onSelect={(val) => setLoadFilter({ ...loadFilter, salesRepId: val ? parseInt(val) : null })}
                        />

                        <div className="bg-secondary p-1 rounded-md">
                            <button
                                onClick={() => {
                                    setActiveLoadTypeTab('truckload');
                                    setLoadFilter({ ...loadFilter, loadType: 'truckload' });
                                }}
                                className={` text-sm !py-0.5 ${activeLoadTypeTab === 'truckload'
                                    ? 'btn-primary'
                                    : 'btn-secondary'
                                    }`}
                            >
                                Truckload
                            </button>

                            <button
                                onClick={() => {
                                    setActiveLoadTypeTab('drayage');
                                    setLoadFilter({ ...loadFilter, loadType: 'drayage' });
                                }}
                                className={` text-sm !py-0.5 ${activeLoadTypeTab === 'drayage'
                                    ? 'btn-primary'
                                    : 'btn-secondary'
                                    }`}
                            >
                                Drayage
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 text-[15px]">
                        <button className="btn-secondary">Quick Rate</button>
                        <button className="btn-secondary">Create Quote</button>
                        <button
                            onClick={handleOpenCreateLoadModal}
                            className="btn-secondary"
                        >
                            Create Load
                        </button>
                        <FormModal
                            isOpen={isOpenCreateLoadModal}
                            onClose={() => setIsOpenCreateLoadModal(false)}
                            headline="Create Load"
                        >
                            <div className="flex justify-end items-center gap-2 mb-2">
                                <div className='!text-[21px] !font-normal'>
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Customer:
                                </div>
                                <Select
                                    options={customerDropdownOptions}
                                    value=''
                                    placeholder="Select"
                                    className="!rounded-[5px] border-secondary w-[230px] !h-8.5 text-xl"
                                    dropdownWidth="230px"
                                    onSelect={(optionValue) =>
                                        setLoadCreateFormData((prev) => ({
                                            ...prev,
                                            customerId: Number(optionValue),
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex justify-end items-center gap-2 mb-2">
                                <label className='!text-[21px] !font-normal'>
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Mode:
                                </label>
                                <Select
                                    options={loadTypeOptions}
                                    value=''
                                    placeholder="Select"
                                    className="!rounded-[5px] border-secondary w-[230px] !h-8.5 text-xl"
                                    dropdownWidth="230px"
                                    onSelect={(optionValue) =>
                                        setLoadCreateFormData((prev) => ({
                                            ...prev,
                                            loadType: optionValue,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-10">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="single"
                                        className=""
                                    />
                                    <span className='!text-[20px] !font-normal'>Single</span>
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="batch"
                                        className=""
                                    />
                                    <span className='!text-[20px] !font-normal'>Batch</span>
                                    <input
                                        className="!w-18 !h-6"
                                        type="number"
                                    />
                                </label>
                            </div>
                            <div className="flex justify-center mt-2">
                                <button className="btn-primary" onClick={handleCreateLoad}>Create</button>
                            </div>
                        </FormModal>
                    </div>
                </div>

                <div className="bg-bg rounded-lg overflow-hidden px-6 py-3">
                    <div className="overflow-x-auto">
                        <table className="datatable">
                            <thead className="">
                                <tr className="">
                                    <th className="!text-center">
                                        <span>Status</span>
                                    </th>
                                    <th>
                                        <span>Load #</span>
                                    </th>
                                    <th>
                                        <span>Pick Up Date</span>
                                    </th>
                                    <th>
                                        <span>Ship City</span>
                                    </th>
                                    <th>
                                        <span>Ship State</span>
                                    </th>
                                    <th>
                                        <span>Delivery City</span>
                                    </th>
                                    <th>
                                        <span>Delivery State</span>
                                    </th>
                                    <th>
                                        <span>Delivery Date</span>
                                    </th>
                                    <th>
                                        <span>Carrier Name</span>
                                    </th>
                                    <th>
                                        <span>Customer</span>
                                    </th>
                                    <th>
                                        <span>PO #</span>
                                    </th>
                                    <th>
                                        <span>Equipment</span>
                                    </th>
                                    <th>
                                        <span>Container #</span>
                                    </th>
                                    <th>
                                        <span>Billed</span>
                                    </th>
                                    <th>
                                        <span>Cost</span>
                                    </th>
                                    <th>
                                        <span>Margin</span>
                                    </th>
                                    <th>
                                        <span>Sales Rep</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {tableData.map((load: any) => (
                                    <tr key={load.id} className="hover:bg-gray-50">
                                        <td className="!text-center">
                                            <span className={`inline-flex px-3 py-1 w-20 items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ${getStatusColor(load.status)}`}>
                                                {loadStausTableMap[load?.status || ""]}
                                            </span>
                                        </td>
                                        <td
                                            className="!text-primary font-medium"
                                        >
                                            <span onClick={() => router.push(`/load/edit/${load.id}`)} className=' cursor-pointer border-b border-primary'>{String(load.id).padStart(6, '0')}</span>
                                        </td>
                                        <td className="">{toDisplayDateString(load.pickups?.[0]?.pickupDate)}</td>
                                        <td className="">{load.pickups?.[0]?.city}</td>
                                        <td className="">{load.pickups?.[0]?.state}</td>
                                        <td className="">{load.deliveries?.[0]?.city}</td>
                                        <td className="">{load.deliveries?.[0]?.state}</td>
                                        <td className="">{toDisplayDateString(load.deliveries?.[0]?.deliveryDate)}</td>
                                        <td
                                            className="!text-primary font-medium"
                                        >
                                            <span onClick={(e) => handleCarrierClick(String(load.carriers?.[0]?.id), e)} className='cursor-pointer border-b border-primary'>{load.carriers?.[0]?.name}</span>
                                        </td>
                                        <td
                                            className="!text-primary font-medium"
                                        >
                                            <span onClick={(e) => handleCustomerClick(String(load.customerId), e)} className='cursor-pointer border-b border-primary'>{load.customerName}</span>
                                        </td>
                                        <td className="">{load.po}</td>
                                        <td className="">{load.equipmentType}</td>
                                        <td className="">{load.container}</td>
                                        <td className="font-medium text-fg">${load.billed?.toLocaleString() || 0}</td>
                                        <td className="">${load.cost?.toLocaleString() || 0}</td>
                                        <td className="font-medium text-success">${load.margin?.toLocaleString() || 0}</td>
                                        <td
                                            className="!text-primary font-medium"
                                        >
                                            <span onClick={(e) => handleEmployeeClick(String(load.salesRepId), e)} className='cursor-pointer border-b border-primary'>{load.salesRepName}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {anchorPos && (
                <>
                    <EmployeeModal
                        id={selectedEmployeeId}
                        isOpen={isOpenEmployeeModal}
                        position={anchorPos}
                        onClose={() => setIsOpenEmployeeModal(false)}
                    />
                    <CarrierModal
                        id={selectedCarrierId}
                        isOpen={isOpenCarrierModal}
                        position={anchorPos}
                        onClose={() => setIsOpenCarrierModal(false)}
                    />
                    <CustomerModal
                        id={selectedCustomerId}
                        isOpen={isOpenCustomerModal}
                        position={anchorPos}
                        onClose={() => setIsOpenCustomerModal(false)}
                    />
                </>
            )}
        </div>
    );
}