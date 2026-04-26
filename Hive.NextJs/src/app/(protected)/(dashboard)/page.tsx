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
//import { loadStausTableMap } from '@/features/load/constants';
//import { toDisplayDateString } from '@/utils/dateHelper';
import { toast } from 'react-hot-toast';
import { LeaderboardItem, OfficeLeaderboardItem, LoadFilter, LeaderboardFilter, LoadCreate } from '@/features/dashboard/types';
import { LeaderboardTable } from '@/features/dashboard/components/LeaderboardTable';
import CreateQuoteModal from '@/features/Quote/components/modals/CreateQuoteModal';
import QuickRateModal from '@/features/quickRate/components/modals/QuickRateModal';
//import { getStatusColor } from '@/features/dashboard/constants';
import { getLeaderboard, getOfficeLeaderboard } from '@/features/dashboard/services/dashboard';
import { useLoads } from '@/features/dashboard/hook/useLoads';
import { useDropdowns } from '@/features/dashboard/hook/useDropdowns';
import CreateLoadForm from '@/features/dashboard/components/forms/CreateLoadForm';
import LoadTable from '../../../features/dashboard/components/LoadTable';


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

    //const [customerIdForCreateLoad, setCustomerIdForCreatLoad] = useState('');
    //const [loadTypeForCreateLoad, setLoadTypeForCreateLoad] = useState('');
    const [salesRepLoadData, setSalesRepLoadData] = useState<LeaderboardItem[]>([]);
    const [operatorLoadData, setOperatorLoadData] = useState<LeaderboardItem[]>([]);
    const [officeLoadData, setOfficeLoadData] = useState<OfficeLeaderboardItem[]>([]);
    const [activeLoadTypeTab, setActiveLoadTypeTab] = useState<'truckload' | 'drayage'>('truckload');

    // Filtering State
    //const [tableData, setTableData] = useState<LoadFilter[]>([]);
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

    const tableData = useLoads(loadFilter);
    const { dropdowns } = useDropdowns();

    useEffect(() => {
        fetchSalesRepLoadData(salesDateRange);
    }, [salesDateRange]);

    useEffect(() => {
        fetchOperatorLoadData(operationsDateRange);
    }, [operationsDateRange]);

    useEffect(() => {
        fetchOfficeLoadData(officeDateRange);
    }, [officeDateRange]);

    const fetchSalesRepLoadData = async (dateFilter: string) => {
        setSalesLoading(true);
        try {
            const tempLeaderboardFilter = { ...leaderboardFilter };
            tempLeaderboardFilter.type = "sales";
            if (dateFilter) tempLeaderboardFilter.dateFilterType = dateFilter;
            const { data } = await getLeaderboard(tempLeaderboardFilter);
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
            const { data } = await getLeaderboard(tempLeaderboardFilter);
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
            const { data } = await getOfficeLeaderboard(tempLeaderboardFilter);
            if (data) {
                setOfficeLoadData(data);
            }
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        } finally {
            setOfficeLoading(false);
        }
    };

    const handleOpenCreateLoadModal = async () => {
        setIsOpenCreateLoadModal(true);
    };

    const handleOpenQuickRateModal = async () => {
        setIsOpenQuickRate(true);
    };

    const handleOpenCreateQuoteModal = async () => {
        setIsOpenCreateQuoteModal(true);
    };

    const handleCreateLoad = async () => {
        console.log("loadCreateFormData : ", loadCreateFormData);
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
                                dateRangeOptions={dropdowns.dateRange}
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
                                dateRangeOptions={dropdowns.dateRange}
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
                                dateRangeOptions={dropdowns.dateRange}
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
                            options={dropdowns.pickupDelivery}
                            value={loadFilter.dateFilterType}
                            placeholder="Select Date Filter"
                            className="border-none !py-4 !rounded-md md:w-[120px] sm:w-[100px]"
                            dropdownWidth=""
                            onSelect={(val) => setLoadFilter({ ...loadFilter, dateFilterType: val })}
                        />

                        <Select
                            options={dropdowns.salesRep}
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
                            {/* FORM AS CHILDREN */}
                            <CreateLoadForm
                                dropdowns={dropdowns}
                                setLoadCreateFormData={setLoadCreateFormData}
                            />

                            {/* ACTION */}
                            <div className="flex justify-center mt-2">
                                <button className="btn-primary" onClick={handleCreateLoad}>
                                    Create
                                </button>
                            </div>
                        </FormModal>
                    </div>
                </div>

                <LoadTable
                    tableData={tableData}
                    activeLoadTypeTab={activeLoadTypeTab}
                    handleCarrierClick={handleCarrierClick}
                    handleCustomerClick={handleCustomerClick}
                    handleEmployeeClick={handleEmployeeClick}
                />

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
