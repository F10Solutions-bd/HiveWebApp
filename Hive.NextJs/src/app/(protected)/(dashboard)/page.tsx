'use client';

import React, { useState, useMemo } from 'react';
import Select from '@/components/modal/Select';
import EmployeeModal from '@/components/modal/EmployeeModal';
import CarrierModal from '@/components/modal/CarrierModal';
import CustomerModal from '@/components/modal/CustomerModal';
import FormModal from '@/components/modal/FormModal';
import { useRouter } from "next/navigation";
//import { loadStausTableMap } from '@/features/load/constants';
//import { toDisplayDateString } from '@/utils/dateHelper';
import { toast } from 'react-hot-toast';
import { LoadFilter, LoadCreate } from '@/features/dashboard/types';
import CreateQuoteModal from '@/features/Quote/components/modals/CreateQuoteModal';
import QuickRateModal from '@/features/quickRate/components/modals/QuickRateModal';
import { useLoads } from '@/features/dashboard/hook/useLoads';
import { useDropdowns } from '@/features/dashboard/hook/useDropdowns';
import CreateLoadForm from '@/features/dashboard/components/forms/CreateLoadForm';
import LoadTable from '@/features/dashboard/components/LoadTable';
import { LeaderboardSection } from '@/features/dashboard/components/sections/LeaderboardSection';
import OfficeModal from '@/features/dashboard/components/modals/OfficeModal';
import { getTop5 } from '@/features/dashboard/utils/formatters';
import { LeaderboardChartSection } from '@/features/dashboard/components/sections/LeaderboardChartSection';
import { useLeaderboard } from '@/features/dashboard/hook/useLeaderboard';
import { useModalManager } from '@/features/dashboard/hook/useModalManager';
import { createLoadSchema } from '@/features/dashboard/schema/createLoad.schema';
import { createLoad } from '@/features/dashboard/services/dashboard';

import axios from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateLoadFormData } from '@/features/load/types/createLoadFormData';
import { zodResolver } from '@hookform/resolvers/zod';

const DEFAULT_RANGE = "month_to_date";

// Main Dashboard Component
const Dashboard: React.FC = () => {
    const [salesDateRange, setSalesDateRange] = useState(DEFAULT_RANGE);
    const [operationsDateRange, setOperationsDateRange] = useState(DEFAULT_RANGE);
    const [officeDateRange, setOfficeDateRange] = useState(DEFAULT_RANGE);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('1');
    const [selectedCarrierId, setSelectedCarrierId] = useState<string>('1');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('1');
    const [selectedOfficeId, setSelectedOfficeId] = useState<string>('1');

    const sales = useLeaderboard("sales", salesDateRange);
    const operator = useLeaderboard("operator", operationsDateRange);
    const office = useLeaderboard("office", officeDateRange);

    const leaderboardData = useMemo(() => ({
        sales: getTop5(sales.data),
        operations: getTop5(operator.data),
        offices: getTop5(office.data),
    }), [sales.data, operator.data, office.data]);

    const leaderboardLoading = {
        sales: sales.loading,
        operations: operator.loading,
        offices: office.loading,
    };

    const router = useRouter();

    const [activeLoadTypeTab, setActiveLoadTypeTab] = useState<'truckload' | 'drayage'>('truckload');

    // Filtering State
    const [loadFilter, setLoadFilter] = useState<LoadFilter>({
        status: null,
        customerId: null,
        salesRepId: null,
        operatorId: null,
        fromDate: null,
        toDate: null,
        loadType: 'truckload',
        equipmentType: undefined,
        dateFilterType: "",
        pageIndex: 1,
        pageSize: 10
    });

    const { data: tableData, totalCount, loading: tableLoading } = useLoads(loadFilter);
    // console.log("tabledata", tableData);
    const { dropdowns } = useDropdowns();

    const {
        popoverModal,
        anchorPos,
        openPopover,
        closePopover,
        globalModal,
        openModal,
        closeModal,
    } = useModalManager();

    const handleCloseCreateLoadModal = () => {
        methods.reset();
        closeModal();
    };

    const methods = useForm<CreateLoadFormData>({
        resolver: zodResolver(createLoadSchema),
        defaultValues: {
            customerId: null,
            loadType: "",
        }
    });

    const handleCreateLoad = methods.handleSubmit(
        async (data) => {
            try {
                const payload: LoadCreate = {
                    customerId: data.customerId!,
                    loadType: data.loadType,
                    id: 0,
                    salesRepId: 3,
                    operatorId: 3,
                };
                const response = await createLoad(payload);

                if (response?.data?.id) {
                    toast.success(response?.message || "Load created successfully");
                    router.push(`/load/edit/${response.data.id}`);
                    return response.data;
                }

                toast.error("Invalid response from server");
                return null;

            } catch (error) {
                console.error(error);

                if (axios.isAxiosError(error)) {
                    toast.error(
                        error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        "Failed to create load"
                    );
                } else {
                    toast.error("Failed to create load");
                }

                return null;
            }
        },
        (errors) => {
            console.log("validation errors:", errors);
        }
    );

    const handleEntitySelection = (
        type: "employee" | "office" | "customer",
        id: number
    ) => {
        switch (type) {
            case "employee":
                setSelectedEmployeeId(String(id));
                break;
            case "office":
                setSelectedOfficeId(String(id));
                break;
            case "customer":
                setSelectedCustomerId(String(id));
                break;
        }
    };

    return (
        <div className="rounded-md">
            <div className="">
                <LeaderboardSection
                    dropdowns={dropdowns}
                    salesDateRange={salesDateRange}
                    opsDateRange={operationsDateRange}
                    officeDateRange={officeDateRange}
                    onSalesDateChange={setSalesDateRange}
                    onOpsDateChange={setOperationsDateRange}
                    onOfficeDateChange={setOfficeDateRange}
                    openModal={(type, id, e) => {
                        openPopover(type, e);
                        handleEntitySelection(type, id);
                    }}
                    salesData={sales.data}
                    opsData={operator.data}
                    officeData={office.data}
                    loading={leaderboardLoading}
                />

                {/*  Charts */}
                <LeaderboardChartSection
                    data={leaderboardData}
                    loading={leaderboardLoading}
                    openModal={(type, id, e) => {
                        openPopover(type, e);
                        handleEntitySelection(type, id);
                    }}
                />
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
                        <button onClick={() => openModal("quickRate")} className="btn-secondary">Quick Rate</button>
                        <button onClick={() => openModal("quote")} className="btn-secondary">Create Quote</button>
                        <button onClick={() => openModal("load")} className="btn-secondary">Create Load</button>
                    </div>
                </div>

                <LoadTable
                    tableData={tableData}
                    activeLoadTypeTab={activeLoadTypeTab}
                    handleCarrierClick={(id, e) => {
                        setSelectedCarrierId(String(id));
                        openPopover("carrier", e);
                    }}
                    handleCustomerClick={(id, e) => {
                        setSelectedCustomerId(String(id));
                        openPopover("customer", e);
                    }}
                    handleEmployeeClick={(id, e) => {
                        setSelectedEmployeeId(String(id));
                        openPopover("employee", e);
                    }}
                    totalCount={totalCount}
                    currentPage={loadFilter.pageIndex || 1}
                    itemsPerPage={loadFilter.pageSize || 10}
                    loading={tableLoading}
                    onPageChange={(page) => setLoadFilter(prev => ({ ...prev, pageIndex: page }))}
                    onItemsPerPageChange={(count) => setLoadFilter({ ...loadFilter, pageSize: count, pageIndex: 1 })}
                />
            </div>


            {popoverModal === "employee" && anchorPos && (
                <EmployeeModal
                    id={selectedEmployeeId}
                    isOpen={true}
                    position={anchorPos}
                    onClose={closePopover}
                />
            )}

            {popoverModal === "carrier" && anchorPos && (
                <CarrierModal
                    id={selectedCarrierId}
                    isOpen={true}
                    position={anchorPos}
                    onClose={closePopover}
                />
            )}

            {popoverModal === "customer" && anchorPos && (
                <CustomerModal
                    id={selectedCustomerId}
                    isOpen={true}
                    position={anchorPos}
                    onClose={closePopover}
                />
            )}

            {popoverModal === "office" && anchorPos && (
                <OfficeModal
                    id={selectedOfficeId}
                    isOpen={true}
                    position={anchorPos}
                    onClose={closePopover}
                />
            )}

            {globalModal === "quickRate" && (
                <QuickRateModal
                    isOpen={true}
                    onClose={closeModal}
                />
            )}

            {globalModal === "quote" && (
                <CreateQuoteModal
                    isOpen={true}
                    onClose={closeModal}
                    headline="Create Quote"
                />
            )}

            {globalModal === "load" && (
                <FormProvider {...methods}>
                    <FormModal
                        isOpen={true}
                        onClose={handleCloseCreateLoadModal}
                        headline="Create Load"
                    >
                        <CreateLoadForm
                            dropdowns={dropdowns}
                        />

                        <div className="flex justify-center mt-2">
                            <button className="btn-primary" onClick={handleCreateLoad}> Create </button>
                        </div>
                    </FormModal>
                </FormProvider>
            )}
        </div>
    );
};

export default Dashboard;