/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { DynamicBarChart } from '@/components/ui/Dashboard/DynamicBarChart';
import Select from '@/components/modal/Select';
import EmployeeModal from '@/components/modal/EmployeeModal';
import CarrierModal from '@/components/modal/CarrierModal';
import CustomerModal from '@/components/modal/CustomerModal';
import FormModal from '@/components/modal/FormModal';
import { createApiClient } from '@/services/apiClient';
import { useRouter } from "next/navigation";
import { loadStausTableMap } from '@/features/load/constants';
import { toDisplayDateString } from '@/utils/dateHelper';
import { toast } from 'react-hot-toast';
import { LeaderboardItem, OfficeLeaderboardItem, LoadFilter, LeaderboardFilter, LoadCreate, Customer } from '@/features/dashboard/types';
import { LeaderboardTable } from '@/features/dashboard/components/LeaderboardTable';
import CreateQuoteModal from '@/features/Quote/components/modals/CreateQuoteModal';
import QuickRateModal from '@/features/quickRate/components/modals/QuickRateModal';
import { SelectOption } from '@/types/common';
import { getStatusColor } from '@/features/dashboard/constants';


// Main Dashboard Component
const Dashboard: React.FC = () => {
    const api = createApiClient();
    const [salesDateRange, setSalesDateRange] = useState('month_to_date');
    const [operationsDateRange, setOperationsDateRange] = useState('month_to_date');
    const [officeDateRange, setOfficeDateRange] = useState('month_to_date');
    const [salesLoading, setSalesLoading] = useState(false);
    const [operatorLoading, setOperatorLoading] = useState(false);
    const [officeLoading, setOfficeLoading] = useState(false);
    const [isOpenEmployeeModal, setIsOpenEmployeeModal] = useState(false);
    const [isOpenCarrierModal, setIsOpenCarrierModal] = useState(false);
    const [isOpenCustomerModal, setIsOpenCustomerModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('1');
    const [selectedCarrierId, setSelectedCarrierId] = useState<string>('1');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('1');
    const [isOpenQuickRate, setIsOpenQuickRate] = useState(false);
    const [isOpenCreateQuoteModal, setIsOpenCreateQuoteModal] = useState(false);
    const [isOpenCreateLoadModal, setIsOpenCreateLoadModal] = useState(false);
    const [customerDropdownOptions, setCustomerDropdownOptions] = useState<SelectOption[]>([]);
    const [loadTypeOptions, setLoadTypeOptions] = useState<SelectOption[]>([]);
    const [anchorPos, setAnchorPos] = useState<{
        top: number;
        left: number;
    } | null>(null);
    const [loadCreateFormData, setLoadCreateFormData] = useState<LoadCreate>({
        id: 0,
        customerId: 0,
        loadType: "",
        salesRepId: 3,
        operatorId: 3,
    });
    const router = useRouter();

    const [customerIdForCreateLoad, setCustomerIdForCreatLoad] = useState('');
    const [loadTypeForCreateLoad, setLoadTypeForCreateLoad] = useState('');
    const [salesRepDropdownOptions, setSalesRepDropdownOptions] = useState<SelectOption[]>([]);
    const [pickupDeliveryDropdown, setPickupDeliveryDropdown] = useState<SelectOption[]>([]);
    const [dateRangeDropdown, setDateRangeDropdown] = useState<SelectOption[]>([]);
    const [salesRepLoadData, setSalesRepLoadData] = useState<LeaderboardItem[]>([]);
    const [operatorLoadData, setOperatorLoadData] = useState<LeaderboardItem[]>([]);
    const [officeLoadData, setOfficeLoadData] = useState<OfficeLeaderboardItem[]>([]);
    const [activeLoadTypeTab, setActiveLoadTypeTab] = useState<'truckload' | 'drayage'>('truckload');

    // Filtering State
    const [tableData, setTableData] = useState<LoadFilter[]>([]);
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

    const [leaderboardFilter, setLeaderboardFilter] = useState<LeaderboardFilter>({
        type: "",
        dateFilterType: ""
    });

    useEffect(() => {
        const fetchAllDropdown = async () => {
            try {
                await Promise.allSettled([
                    fetchPickupDeliveryDropdown(),
                    fetchSalesRepDropdown(),
                    fetchDateRangeDropdown(),
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
                const response = await api.get<any>("/loads", { params: loadFilter });
                console.log(response.data);
                if (response.data) {
                    if (response.data.items != null && response.data.items != undefined) {
                        setTableData(response.data.items);
                    }
                }
            } catch (error) {
                console.error("Error fetching loads:", error);
            }
        };

        fetchFilteredLoads();
    }, [loadFilter]);

    useEffect(() => {
        fetchSalesRepLoadData(salesDateRange);
    }, [salesDateRange]);

    useEffect(() => {
        fetchOperatorLoadData(operationsDateRange);
    }, [operationsDateRange]);

    useEffect(() => {
        fetchOfficeLoadData(officeDateRange);
    }, [officeDateRange]);


    const fetchPickupDeliveryDropdown = async () => {
        try {
            const { data } = await api.get<SelectOption[]>(
                "/service-tables/dropdown-by-table-name/Pickup Delivery Filter"
            );
            if (data && data.length > 0) {
                setPickupDeliveryDropdown(data);
                return;
            }
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        }
    };
    const fetchDateRangeDropdown = async () => {
        try {
            const { data } = await api.get<SelectOption[]>(
                "/service-tables/dropdown-by-table-name/Date Range Type"
            );
            if (data && data.length > 0) {
                setDateRangeDropdown(data);
                return;
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
                return;
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
            console.log(response.data);
            return response.data;
        } catch {
            return null;
        }
    };

    const fetchSalesRepLoadData = async (dateFilter: string) => {
        setSalesLoading(true);
        try {
            const tempLeaderboardFilter = { ...leaderboardFilter };
            tempLeaderboardFilter.type = "sales";
            if (dateFilter) tempLeaderboardFilter.dateFilterType = dateFilter;
            const { data } = await api.get<LeaderboardItem[]>("/dashboards/leaderboard", { params: tempLeaderboardFilter });
            if (data) {
                setSalesRepLoadData(data);
            }
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        } finally {
            setSalesLoading(false);
        }
    };
    const fetchOperatorLoadData = async (dateFilter: string) => {
        setOperatorLoading(true);
        try {
            const tempLeaderboardFilter = { ...leaderboardFilter };
            tempLeaderboardFilter.type = "operator";
            if (dateFilter) tempLeaderboardFilter.dateFilterType = dateFilter;
            const { data } = await api.get<LeaderboardItem[]>("/dashboards/leaderboard", { params: tempLeaderboardFilter });
            if (data) {
                setOperatorLoadData(data);
            }
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        } finally {
            setOperatorLoading(false);
        }
    };
    const fetchOfficeLoadData = async (dateFilter: string) => {
        setOfficeLoading(true);
        try {
            const tempLeaderboardFilter = { ...leaderboardFilter };
            tempLeaderboardFilter.type = "office";
            if (dateFilter) tempLeaderboardFilter.dateFilterType = dateFilter;
            const { data } = await OfficeleaderboardApiCall(tempLeaderboardFilter);
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        } finally {
            setOfficeLoading(false);
        }
    };

    // helper for the office api
    const OfficeleaderboardApiCall = async (filter: any) => {
        const response = await api.get<OfficeLeaderboardItem[]>("/dashboards/leaderboard", { params: filter });
        if (response.data) {
            setOfficeLoadData(response.data);
        }
        return response;
    }

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

    const handleOpenQuickRateModal = async () => {
        setIsOpenQuickRate(true);
    };

    const handleOpenCreateQuoteModal = async () => {
        setIsOpenCreateQuoteModal(true);
        //const data = await fetchCustomerDropdownOptions();
        //if (data) {
        //    const options: SelectOption[] = data.map((customer) => ({
        //        label: customer.name,
        //        value: customer.id.toString(),
        //    }));
        //    setCustomerDropdownOptions(options);
        //};

        //const loadTypeOptionsData = await fetchLoadTypeOptions();
        //if (loadTypeOptionsData) {
        //    setLoadTypeOptions(loadTypeOptionsData);
        //}
    };

    const handleCreateLoad = async () => {
        try {
            const response = await api.post<LoadCreate>("/loads", loadCreateFormData);
            if (response.data != null) {
                router.push(`/load/edit/${response.data.id}`);
            }
            setIsOpenCreateLoadModal(false);
            toast.success(response.message);
            return response.data;
        } catch (error) {
            console.error(error);
            toast.error("Failed to create load");
            return null;
        }
    };

    const handleNameClick = (
        id: number,
        e: React.MouseEvent<HTMLSpanElement>
    ) => {
        console.log(id, e);
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setSelectedEmployeeId(id.toString());
        setIsOpenEmployeeModal(true);
        setIsOpenCarrierModal(false);
        setIsOpenCustomerModal(false);

        setAnchorPos({
            top: rect.top + 6,
            left: rect.left + rect.width + 6 + window.scrollX,
        });
    };

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

    

    const salesLoadTop5 = salesRepLoadData.filter((x) => x.rank <= 5);
    const operationsLoadTop5 = operatorLoadData.filter((x) => x.rank <= 5);
    const oficesLoadTop5 = officeLoadData.filter((x) => x.rank <= 5);

    return (
        <div className="rounded-md">
            <div className="">
                <div className="p-2.5 rounded-lg bg-segment-bg mb-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        <div className="relative">
                            {salesLoading && <div className="absolute inset-0 bg-bg opacity-70 flex items-center justify-center z-10"><span className="text-sm font-medium">Loading...</span></div>}
                            <LeaderboardTable
                                data={salesRepLoadData}
                                title="Sales Leaderboard"
                                dateRange={salesDateRange}
                                onDateRangeChange={setSalesDateRange}
                                dateRangeOptions={dateRangeDropdown}
                                onNameClick={handleNameClick}
                                containerHeight={220}
                            />
                        </div>
                        <div className="relative">
                            {operatorLoading && <div className="absolute inset-0 bg-bg opacity-70 flex items-center justify-center z-10"><span className="text-sm font-medium">Loading...</span></div>}
                            <LeaderboardTable
                                data={operatorLoadData}
                                title="Operations Leaderboard"
                                dateRange={operationsDateRange}
                                onDateRangeChange={setOperationsDateRange}
                                dateRangeOptions={dateRangeDropdown}
                                onNameClick={handleNameClick}
                                containerHeight={220}
                            />
                        </div>
                        <div className="relative">
                            {officeLoading && <div className="absolute inset-0 bg-bg opacity-70 flex items-center justify-center z-10"><span className="text-sm font-medium">Loading...</span></div>}
                            <LeaderboardTable
                                data={officeLoadData}
                                title="Office Leaderboard"
                                dateRange={officeDateRange}
                                onDateRangeChange={setOfficeDateRange}
                                dateRangeOptions={dateRangeDropdown}
                                isOffice={true}
                                onNameClick={handleNameClick}
                                containerHeight={220}
                            />
                        </div>
                    </div>
                </div>

                {/*  Charts */}
                <div className="p-2.5 rounded-lg bg-segment-bg mb-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        <div className="relative">
                            {salesLoading && <div className="absolute inset-0 bg-bg opacity-70 flex items-center justify-center z-10"><span className="text-sm font-medium">Loading...</span></div>}
                            <DynamicBarChart
                                title="Sales Leaderboard"
                                data={salesLoadTop5}
                                nameKey="fullName"
                                containerHeight={250}
                                onNameClick={handleNameClick}
                                bars={[
                                    {
                                        key: 'revenue',
                                        label: 'Revenue',
                                        color: 'var(--color-primary)',
                                    },
                                    {
                                        key: 'grossMargin',
                                        label: 'Gross Margin ($)',
                                        color: 'var(--color-secondary-hover)',
                                    },
                                ]}
                            />
                        </div>
                        <div className="relative">
                            {operatorLoading && <div className="absolute inset-0 bg-bg opacity-70 flex items-center justify-center z-10"><span className="text-sm font-medium">Loading...</span></div>}
                            <DynamicBarChart
                                title="Operations Leaderboard"
                                data={operationsLoadTop5}
                                nameKey="fullName"
                                containerHeight={250}
                                onNameClick={handleNameClick}
                                bars={[
                                    {
                                        key: 'loadCount',
                                        label: 'Load ct.',
                                        color: 'var(--color-primary)',
                                    },
                                ]}
                            />
                        </div>
                        <div className="relative">
                            {officeLoading && <div className="absolute inset-0 bg-bg opacity-70 flex items-center justify-center z-10"><span className="text-sm font-medium">Loading...</span></div>}
                            <DynamicBarChart
                                title="Office  Leaderboard"
                                data={oficesLoadTop5}
                                nameKey="fullName"
                                containerHeight={250}
                                bars={[
                                    {
                                        key: 'revenue',
                                        label: 'Revenue',
                                        color: 'var(--color-primary)',
                                    },
                                    {
                                        key: 'grossMargin',
                                        label: 'Gross Margin ($)',
                                        color: 'var(--color-secondary-hover)',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Loads Table */}
            <div className="p-2.5 rounded-lg bg-segment-bg mb-2">
                <div className="mb-2.5 py-2 flex justify-between gap-1 lg:flex-row md:flex-col sm:flex-col flex-col ">
                    <div className="flex gap-3 lg:!w-[50%] md:!w-[100%]">
                        <Select
                            options={pickupDeliveryDropdown}
                            value={loadFilter.dateFilterType}
                            placeholder="Select Date Filter"
                            className="border-none !py-4 !rounded-md md:w-[120px] sm:w-[100px]"
                            dropdownWidth=""
                            onSelect={(val) => setLoadFilter({ ...loadFilter, dateFilterType: val })}
                        />

                        <Select
                            options={salesRepDropdownOptions}
                            value={loadFilter.salesRepId?.toString() || ""}
                            placeholder="Select Sales Rep"
                            className="border-none !py-4 !rounded-md md:w-[120px] sm:w-[100px]"
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
                        <button onClick={handleOpenQuickRateModal} className="btn-secondary">Quick Rate</button>
                        <button onClick={handleOpenCreateQuoteModal} className="btn-secondary">Create Quote</button>
                        <button
                            onClick={handleOpenCreateLoadModal}
                            className="btn-secondary"
                        >
                            Create Load
                        </button>
                        <CreateQuoteModal
                            isOpen={isOpenCreateQuoteModal}
                            onClose={() => setIsOpenCreateQuoteModal(false)}
                            headline={'Create Quote'} />
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
                                    {activeLoadTypeTab != "truckload" && (
                                        <th>
                                            <span>Container #</span>
                                        </th>
                                    )}
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
                                        {/* <td className="">{toDisplayDateString(load.pickups?.[0]?.pickupDate)}</td> */}
                                        {activeLoadTypeTab == "truckload" && (
                                            <td className="">{toDisplayDateString(load.pickups?.[0]?.pickupDate)}</td>
                                        )}
                                        {activeLoadTypeTab != "truckload" && (
                                            <td className="">{toDisplayDateString(load.pickups?.[0]?.erd)}</td>
                                        )}
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
                                        {activeLoadTypeTab != "truckload" && (
                                            <td className="">{load.container}</td>
                                        )}
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

            {isOpenQuickRate &&
                <QuickRateModal
                    isOpen={isOpenQuickRate}
                    onClose={() => setIsOpenQuickRate(false)} />}
        </div>
    );
};

export default Dashboard;
