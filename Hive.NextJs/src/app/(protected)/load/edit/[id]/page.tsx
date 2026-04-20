/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
'use client';

import { useParams } from 'next/navigation';
import { FiEdit } from 'react-icons/fi';
import { FiCopy } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Select from '@/components/modal/Select';
import { DatePicker } from '@/components/modal/DatePicker';
import { toISOString } from '@/utils/dateHelper';
import { createApiClient } from '@/services/apiClient';
import PositionalModal from '@/components/modal/PositionalModal';
import { Load } from '@/features/load/types/load';
import { loadTypeTableMap, LOAD_TYPE_CONFIG } from '@/features/load/constants';
import UploadDocumentModal, { Document } from '@/components/modal/UploadDocumentModal';
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal';
import EmployeeModal from '@/components/modal/EmployeeModal';
import OptionsModal from '@/components/modal/OptionsModal';
import { useLoadData } from '@/features/load/hooks/useLoadData';
import { useLoadEntities } from '@/features/load/hooks/useLoadEntities';
import { useLoadFinancials } from '@/features/load/hooks/useLoadFinancials';
import { useLoadModals } from '@/features/load/hooks/useLoadModals';
import { useLoadNotes } from '@/features/load/hooks/useLoadNotes';
import { useLoadStops } from '@/features/load/hooks/useLoadStops';
import { LoadChargeEdit } from '@/features/load/components/loadChargeEdit';
import { LoadCommodityEdit } from '@/features/load/components/LoadCommodityEdit';
import { LoadCarrierEdit } from '@/features/load/components/LoadCarrierEdit';
import { LoadDriverEdit } from '@/features/load/components/LoadDriverEdit';
import { LoadNoteEdit } from '@/features/load/components/LoadNoteEdit';
import { LoadPickupSection } from '@/features/load/components/LoadPickupSection';
import { LoadDeliverySection } from '@/features/load/components/LoadDeliverySection';
import { LoadReturnSection } from '@/features/load/components/LoadReturnSection';
import DocumentCategoryList from '@/components/ui/Load/DocumentCategoryList';
import api from '@/services/apiClient';

export type SelectOption = {
    label: string;
    value: string;
};


// options.ts (or inside page.tsx)
const portTerminalOptions: SelectOption[] = [
    { label: 'Port-1', value: '1' },
    { label: 'Port-2', value: '2' },
    { label: 'Port-3', value: '3' },
    { label: 'Port-4', value: '4' },
    { label: 'Port-5', value: '5' },
    { label: 'Port-6', value: '6' },
];

export default function Page() {
    const { id } = useParams();

    const [locationInputs, setLocationInputs] = useState<Record<string, string>>({});

    // Hooks
    const {
        loading, setLoading,
        load, setLoad,
        dropdownOptions, fetchAllDropDown,
        handleLoadSave: saveLoadData
    } = useLoadData(id as string | string[]);

    const {
        isTotalModalOpen, setIsTotalModalOpen,
        totalModalPosition, setTotalModalPosition,
        isOfferModalOpen, setIsOfferModalOpen,
        offerModalPosition, setOfferModalPosition,
        isPayUpToModalOpen, setIsPayUpToModalOpen,
        payUpToModalPosition, setPayUpToModalPosition,
        isEmployeeModalOpen, setIsEmployeeModalOpen, selectedEmployeeId,
        anchorPos, handleEmployeeClick, activeNoteTab, setActiveNoteTab,
        isDocumentUploadModalOpen, setIsDocumentUploadModalOpen,
        handleDocumentUpload, handleDocumentSave,
        isOpenAddCarrierModal, setIsOpenAddCarrierModal,
        isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen,
        isDriverSuggestionOpen, setIsDriverSuggestionOpen,
        isOpenAddDriverModal, setIsOpenAddDriverModal,
        isOpenTaskModal, setIsOpenTaskModal,
        isOptionsModalOpen, setIsOptionsModalOpen
    } = useLoadModals();

    const {
        mcDotType, setMcDotType,
        mcDotValue, setMcDotValue,
        autoPlacedCarrier, setAutoPlacedCarrier,
        newCarrier, setNewCarrier,
        handleCarrierInfoAutoPlace, handleCarrierSave,
        driverNameSearch,
        driverSuggestions,
        autoPlacedDriver,
        newDriver, setNewDriver,
        handleDriverSearch, handleDriverSelect, handleDriverSave
    } = useLoadEntities(
        load,
        setLoad,
        setIsOpenAddCarrierModal,
        setIsOpenAddDriverModal,
        setIsDriverSuggestionOpen
    );

    const {
        charges,
        isAddingCharge, setIsAddingCharge,
        newChargeLabel, setNewChargeLabel,
        handleChargeAdd, handleChargeChange, handleChargeRemove,
        fetchLoadChareData,
        commodities,
        handleCommodityAdd, handleCommodityRemove, handleCommodityChange,
        fetchLoadCommoditiesData
    } = useLoadFinancials(id as string | string[]);

    const {
        setCurrentTaskContext,
        newTask, setNewTask,
        handleTaskSave,
        generalNoteForms,
        handleGeneralNoteFormAdd, handleGeneralNoteFormRemove, handleGeneralNoteFormUpdate,
        fetchLoadNotificationData
    } = useLoadNotes(id as string | string[], load);

    const {
        pickups, deliveries,
        addPickup, handlePickupChange, handlePickupSave,
        handleDeliveryAdd, handleDeliveryChange, handleDeliverySave,
        retruns: returns,
        handleReturnChange, handleReturnSave,
        fetchLoadPickupData, fetchLoadDeliveryData, fetchLoadReturnData
    } = useLoadStops(id as string | string[]);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);

                const fetchLoadData = async () => {
                    try {
                        const { data: loadData } = await api.get<Load>(`/loads/${id}`);
                        setLoad(loadData);
                        console.log(loadData);
                        setAutoPlacedCarrier(loadData?.carriers?.[0] ?? null);

                    } catch { }
                };

                await Promise.allSettled([
                    fetchLoadData(),
                    fetchLoadChareData(),
                    fetchLoadCommoditiesData(),
                    fetchLoadNotificationData(),
                    fetchAllDropDown(),
                    fetchLoadPickupData(),
                    fetchLoadDeliveryData(),
                    fetchLoadReturnData()
                ]);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();

    }, []);

    const loadType = load?.loadType;

    const sectionText =
        LOAD_TYPE_CONFIG[
        (load?.loadType as keyof typeof LOAD_TYPE_CONFIG) ?? 'truckload'
        ];

    const handleLoadSave = async () => {
        await saveLoadData(charges, commodities, generalNoteForms);
    };

    const [UploadedFileData, setUploadedFileData] = useState<Document[]>([]);
    const fetchAllUploadedData = async () => {
        try {
            const { data } = await api.get<Document[] | null>("/documents");
            console.log("data", data);
            setUploadedFileData(data ?? []);
        } catch (error) {
            console.error("Error Fetching UploadedDocument");
            setUploadedFileData([]);
        }
    };
    useEffect(() => {
        fetchAllUploadedData()
    }, []);

    return (
        <>
            <div className="p-4 pt-1 rounded-lg bg-segment-bg mb-2 font-light">
                {/*<div className="mb-1 flex justify-start gap-4">*/}
                <div className="mb-1 flex gap-4 flex-row">
                    {/*<div className="w-[80%]">*/}
                    {/*className="flex lg:flex-col md:flex-row gap-4 lg:w-[20%] md:w-full"*/}
                    <div className="flex flex-col w-[80%]">
                        {/* Header Start */}
                        {/*<div className="flex items-center w-[100%]">*/}
                        <div className="flex flex-row gap-3 justify-between items-center">
                            <div className="flex justify-center">
                                <h2 className="!text-[17px] xl:!text-xl mr-3">
                                    {loadTypeTableMap[load?.loadType || ""]}:
                                    <span className="ml-3 text-primary">
                                        {id}
                                    </span>
                                </h2>
                                <Select
                                    options={dropdownOptions.loadStatus}
                                    value={load?.status}
                                    onSelect={(val) => setLoad(prev => prev ? { ...prev, status: val } : null)}
                                    placeholder=""
                                    parentClassName=""
                                    className="bg-secondary border-none !text-center !rounded-[11px] !h-7 2xl:!w-[120px] xl:!w-[110px] lg:!w-[100px] !px-3"
                                />
                            </div>

                            <div className="flex flex-col !text-[12px] lg:!text-[12px] xl:!text-[15px]">
                                <div className="font-medium flex justify-center gap-2">
                                    <div className="w-[50px] xl:w-[100px] flex text-nowrap justify-end">
                                        Sales Rep:
                                    </div>
                                    <div className="w-[90px] xl:w-[120px] text-primary font-normal underline">
                                        <span className="cursor-pointer" onClick={(e) => handleEmployeeClick(String(load?.salesRepId), e)}>
                                            {load?.salesRepName}
                                        </span>
                                    </div>

                                </div>
                                <div className="font-medium flex justify-center gap-2">
                                    <div className="w-[50px] xl:w-[100px] flex justify-end">
                                        Operator:
                                    </div>
                                    <div className="w-[90px] xl:w-[120px] text-primary font-normal underline">
                                        <span className="cursor-pointer" onClick={(e) => handleEmployeeClick(String(load?.operatorId), e)}>
                                            {load?.operatorName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row justify-end gap-2">
                                <button
                                    className="btn-primary !h-7 !rounded-[11px] !px-8 flex items-center justify-center"
                                    onClick={handleLoadSave}
                                >
                                    Save
                                </button>
                                <div className="hover:opacity-60 transition-opacity 2xl:!w-[150px] !w-[110px]  duration-300 flex justify-center">
                                    <button className="bg-secondary w-[100%] h-7 rounded-[11px] cursor-pointer flex items-center justify-center">
                                        Coca-cola
                                    </button>
                                    <FiEdit className="h-9 w-9 p-1.5 text-bg bg-primary cursor-pointer !rounded-[50%] -ml-5 -mt-[3px]" />
                                </div>
                                <div className="hover:opacity-60 transition-opacity 2xl:!w-[150px] !w-[110px] duration-300 flex justify-center">
                                    <button className="bg-secondary w-[100%] h-7 rounded-[11px] cursor-pointer flex items-center justify-center">
                                        Duplicate
                                    </button>
                                    <FiCopy className="h-9 w-9 p-1.5 text-bg bg-primary cursor-pointer !rounded-[50%] -ml-5 -mt-[3px]" />
                                </div>
                            </div>
                        </div>
                        {/* Header End */}

                        {/* First Section Start */}
                        <div className="w-full bg-bg p-4 rounded-lg flex flex-col">
                            {/* Load Basic Start */}
                            <div className="w-full flex flex-row gap-5 justify-between pt-3">
                                {/* Equipment Start */}
                                <div className="w-[30%] flex flex-col h-full gap-1">

                                    {loadType === 'drayage_import' && (
                                        <>
                                            <div className="flex items-center">
                                                <div className="w-[80px] flex justify-end">
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    MBOL:

                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="MBOL #"
                                                    className=""
                                                    value={load?.mbol || ''}
                                                    onChange={(e) => setLoad(prev => prev ? { ...prev, mbol: e.target.value } : null)}
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-[80px] flex justify-end">

                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    CTNR:

                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Container #"
                                                    className=""
                                                    value={load?.ctnr || ''}
                                                    onChange={(e) => setLoad(prev => prev ? { ...prev, ctnr: e.target.value } : null)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {(loadType === 'drayage_export') && (
                                        <>
                                            <div className="flex items-center">
                                                <div className="w-[80px] flex justify-end">
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    BKG #:
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="BKG #"
                                                    className=""
                                                    value={load?.bkg || ''}
                                                    onChange={(e) => setLoad(prev => prev ? { ...prev, bkg: e.target.value } : null)}
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-[80px] flex justify-end">
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <span className="">
                                                        CTNR:
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Container #"
                                                    className=""
                                                    value={load?.ctnr || ''}
                                                    onChange={(e) => setLoad(prev => prev ? { ...prev, ctnr: e.target.value } : null)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-center">
                                        <div className="w-[80px] flex justify-end">
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <span className="">
                                                Equipment:
                                            </span>
                                        </div>
                                        <Select
                                            options={
                                                dropdownOptions.equipmentType
                                            }
                                            value={load?.equipmentType || ""}
                                            onSelect={(val) => {
                                                setLoad((prev) => prev ? { ...prev, equipmentType: val } : null);
                                            }}
                                            placeholder="Type"
                                            parentClassName=""
                                            className=""
                                            dropdownWidth=""
                                        />
                                    </div>

                                    <div className={`flex items-center ${!load?.equipmentType ? 'opacity-50' : ''}`}>
                                        <div className="w-[80px] flex justify-end">
                                            <span className="">
                                                * Temp:
                                            </span>
                                        </div>
                                        <div className="w-[100px] flex justify-start items-center gap-1">
                                            <input
                                                type="text"
                                                placeholder="Min"
                                                className="!w-[42px] lg:!w-[52px] xl:!w-[66px] 2xl:!w-[81px] px-2 border border-fg rounded"
                                                disabled={!load?.equipmentType}
                                                value={load?.minimumTemperature || ''}
                                                onChange={(e) => setLoad(prev => prev ? { ...prev, minimumTemperature: Number(e.target.value) || undefined } : null)}
                                            />
                                            <span>-</span>
                                            <input
                                                type="text"
                                                placeholder="Max"
                                                className="!w-[42px] lg:!w-[52px] xl:!w-[67px] 2xl:!w-[81px] px-2 border border-fg rounded"
                                                disabled={!load?.equipmentType}
                                                value={load?.maximumTemperature || ''}
                                                onChange={(e) => setLoad(prev => prev ? { ...prev, maximumTemperature: Number(e.target.value) || undefined } : null)}
                                            />
                                            <span>
                                                <span className="mr-1 -mt-1">
                                                    °
                                                </span>
                                                F
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-20 justify-center pt-2">
                                        <button className="px-3 py-1 bg-gray-200 rounded">
                                            Issue Advance
                                        </button>
                                        <button className="px-3 py-1 bg-gray-200 rounded">
                                            Add Addendum
                                        </button>
                                    </div>
                                </div>
                                {/* Equipment End */}

                                {/* Middle Section Start */}
                                <div className="w-[30%] flex flex-col gap-1.5">
                                    {(loadType === 'drayage_import' || loadType === 'drayage_export') && (
                                        <>
                                            <div className="flex items-center">
                                                <div className="w-[100px] flex justify-end">
                                                    SSL:
                                                </div>
                                                <Select
                                                    options={
                                                        dropdownOptions.loadStatus
                                                    }
                                                    value={load?.ssl || ""}
                                                    onSelect={(val) => {
                                                        setLoad((prev) => prev ? { ...prev, ssl: val } : null);
                                                    }}
                                                    placeholder="SSL"
                                                    parentClassName=""
                                                    className=""
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-[100px] flex justify-end">
                                                    ETA:
                                                </div>
                                                <DatePicker
                                                    value={load?.eta ? new Date(load.eta) : null}
                                                    parentClassName=""
                                                    className=""
                                                    placeholder='ETA'
                                                    onChange={(d) => setLoad(prev => prev ? { ...prev, eta: d ? toISOString(d) ?? undefined : undefined } : null)}
                                                />
                                            </div>

                                            {loadType === 'drayage_import' && (
                                                <div className="flex items-center">
                                                    <div className="w-[100px] flex justify-end">
                                                        LFD:
                                                    </div>
                                                    <DatePicker
                                                        value={load?.lfd ? new Date(load.lfd) : null}
                                                        parentClassName=""
                                                        className=""
                                                        placeholder='LFD'
                                                        onChange={(d) => setLoad(prev => prev ? { ...prev, lfd: d ? toISOString(d) ?? undefined : undefined } : null)}
                                                    />
                                                </div>
                                            )}
                                            {loadType === 'drayage_export' && (
                                                <div className="flex items-center">
                                                    <div className="w-[100px] flex justify-end">
                                                        CUT:
                                                    </div>

                                                    <DatePicker
                                                        value={load?.cut ? new Date(load.cut) : null}
                                                        parentClassName=""
                                                        className=""
                                                        placeholder='CUT'
                                                        onChange={(d) => setLoad(prev => prev ? { ...prev, cut: d ? toISOString(d) ?? undefined : undefined } : null)}
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center">
                                                <div className="w-[100px] flex justify-end">
                                                    Seal:
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Seal #"
                                                    className=""
                                                    value={load?.seal || ''}
                                                    onChange={(e) => setLoad(prev => prev ? { ...prev, seal: e.target.value } : null)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-center">
                                        <div className="w-[100px] flex justify-end">
                                            PO #:
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Purchase Order #"
                                            className=""
                                            value={load?.po || ''}
                                            onChange={(e) => setLoad(prev => prev ? { ...prev, po: e.target.value } : null)}
                                        />
                                    </div>

                                    {(loadType === 'truckload') && (
                                        <>
                                            <div className="flex items-center">
                                                <div className="w-[100px] flex justify-end">
                                                    Delivery #:
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Delivery #"
                                                    className=""
                                                    value={load?.delivery || ''}
                                                    onChange={(e) => setLoad(prev => prev ? { ...prev, delivery: e.target.value } : null)}
                                                />
                                            </div>


                                            <div className="flex items-center">
                                                <div className="w-[100px] flex justify-end">
                                                    Pickup #:
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Pickup #"
                                                    className=""
                                                    value={load?.pickup || ''}
                                                    onChange={(e) => setLoad(prev => prev ? { ...prev, pickup: e.target.value } : null)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-center">
                                        <div className="w-[100px] flex justify-end items-center">
                                            Loaded Miles
                                            <span>:</span>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Loaded Miles"
                                            className=""
                                            value={load?.loadedMiles || ''}
                                            onChange={(e) => setLoad(prev => prev ? { ...prev, loadedMiles: Number(e.target.value) || undefined } : null)}
                                        />
                                    </div>



                                </div>
                                {/* Middle Section End */}

                                {/* Charge Section */}
                                <LoadChargeEdit
                                    charges={charges}
                                    handleChargeChange={handleChargeChange}
                                    handleChargeRemove={handleChargeRemove}
                                    isAddingCharge={isAddingCharge}
                                    setIsAddingCharge={setIsAddingCharge}
                                    newChargeLabel={newChargeLabel}
                                    setNewChargeLabel={setNewChargeLabel}
                                    handleChargeAdd={handleChargeAdd}
                                    setTotalModalPosition={setTotalModalPosition}
                                    setIsTotalModalOpen={setIsTotalModalOpen}
                                    load={load}
                                    setLoad={setLoad}
                                    setIsOptionsModalOpen={setIsOptionsModalOpen}
                                    setOfferModalPosition={setOfferModalPosition}
                                    setIsOfferModalOpen={setIsOfferModalOpen}
                                    setPayUpToModalPosition={setPayUpToModalPosition}
                                    setIsPayUpToModalOpen={setIsPayUpToModalOpen}
                                />
                            </div>
                            {/*<div className="flex gap-3 justify-start pt-2">*/}
                            {/*    <button className="px-3 py-1 bg-gray-200 rounded-md">*/}
                            {/*        Issue Advance*/}
                            {/*    </button>*/}
                            {/*    <button className="px-3 py-1 bg-gray-200 rounded-md">*/}
                            {/*        Add Addendum*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                            {/* Load Basic End */}

                            {/* Commodity Section */}
                            <LoadCommodityEdit
                                commodities={commodities}
                                handleCommodityChange={handleCommodityChange}
                                dropdownOptions={dropdownOptions}
                                handleCommodityRemove={handleCommodityRemove}
                                handleCommodityAdd={handleCommodityAdd}
                            />

                            <hr className="text-secondary mt-5" />

                            {/* Carrier Section */}
                            <LoadCarrierEdit
                                mcDotType={mcDotType}
                                setMcDotType={setMcDotType}
                                mcDotValue={mcDotValue}
                                setMcDotValue={setMcDotValue}
                                handleCarrierInfoAutoPlace={handleCarrierInfoAutoPlace}
                                isOpenAddCarrierModal={isOpenAddCarrierModal}
                                setIsOpenAddCarrierModal={setIsOpenAddCarrierModal}
                                newCarrier={newCarrier}
                                setNewCarrier={setNewCarrier}
                                handleCarrierSave={handleCarrierSave}
                                autoPlacedCarrier={autoPlacedCarrier}
                            />

                            <hr className="text-secondary mt-5" />

                            {/* Driver Section */}
                            <LoadDriverEdit
                                isOpenAddDriverModal={isOpenAddDriverModal}
                                setIsOpenAddDriverModal={setIsOpenAddDriverModal}
                                newDriver={newDriver}
                                setNewDriver={setNewDriver}
                                handleDriverSave={handleDriverSave}
                                driverNameSearch={driverNameSearch}
                                handleDriverSearch={handleDriverSearch}
                                autoPlacedDriver={autoPlacedDriver}
                                load={load}
                                isDriverSuggestionOpen={isDriverSuggestionOpen}
                                setIsDriverSuggestionOpen={setIsDriverSuggestionOpen}
                                driverSuggestions={driverSuggestions}
                                handleDriverSelect={handleDriverSelect}
                                portTerminalOptions={portTerminalOptions}
                            />
                        </div>
                        {/* First Section End */}

                        {/* Note Section */}
                        <LoadNoteEdit
                            activeNoteTab={activeNoteTab}
                            setActiveNoteTab={setActiveNoteTab}
                            generalNoteForms={generalNoteForms}
                            handleGeneralNoteFormUpdate={handleGeneralNoteFormUpdate}
                            handleGeneralNoteFormRemove={handleGeneralNoteFormRemove}
                            handleGeneralNoteFormAdd={handleGeneralNoteFormAdd}
                            setCurrentTaskContext={setCurrentTaskContext}
                            setIsOpenTaskModal={setIsOpenTaskModal}
                            isOpenTaskModal={isOpenTaskModal}
                            newTask={newTask}
                            setNewTask={setNewTask}
                            handleTaskSave={handleTaskSave}
                            load={load}
                            setLoad={setLoad}
                        />

                        {/* Pickup Section */}
                        <LoadPickupSection
                            loading={loading}
                            pickups={pickups}
                            handlePickupChange={handlePickupChange}
                            handlePickupSave={handlePickupSave}
                            addPickup={addPickup}
                            sectionText={sectionText}
                            loadType={loadType}
                            dropdownOptions={dropdownOptions}
                            locationInputs={locationInputs}
                            setLocationInputs={setLocationInputs}
                        />

                        {/* Delivery Section */}
                        <LoadDeliverySection
                            loading={loading}
                            deliveries={deliveries}
                            handleDeliveryChange={handleDeliveryChange}
                            handleDeliverySave={handleDeliverySave}
                            handleDeliveryAdd={handleDeliveryAdd}
                            sectionText={sectionText}
                            loadType={loadType}
                            dropdownOptions={dropdownOptions}
                            portTerminalOptions={portTerminalOptions}
                            locationInputs={locationInputs}
                            setLocationInputs={setLocationInputs}
                        />

                        {/* Return Section */}
                        <LoadReturnSection
                            loading={loading}
                            returns={returns}
                            pickups={pickups}
                            handleReturnChange={handleReturnChange}
                            handleReturnSave={handleReturnSave}
                            loadType={loadType}
                            portTerminalOptions={portTerminalOptions}
                            locationInputs={locationInputs}
                            setLocationInputs={setLocationInputs}
                        />
                    </div>

                    <div className="flex flex-col gap-4 w-[20%]">
                        {/* Upload Documents Start */}
                        {/*<div className="flex flex-col gap-5 w-full bg-bg p-3 rounded-lg mt-[46px]">*/}
                        <div className="flex flex-col gap-5 w-full bg-bg p-3 rounded-lg mt-[46px]">
                            <h3 className="w-full text-center !text-[15px] xl:!text-[16px] font-normal mb-2">
                                Documents
                            </h3>

                            {/* Document Category Start */}
                            <DocumentCategoryList
                                categories={dropdownOptions.documentCategory}
                                uploadedFiles={UploadedFileData}
                            ></DocumentCategoryList>
                            {/* Document Category End */}

                            <div className="text-center mt-3">
                                <button onClick={handleDocumentUpload} className="btn-primary !rounded-xl !py-1">
                                    Upload Document
                                </button>
                            </div>
                        </div>
                        {/* Upload Documents End */}

                        {/* Carrier Pay Start */}
                        <div className="w-full bg-bg p-2 rounded-lg">
                            <h3 className="w-full text-center !text-[15px] xl:!text-[16px] font-normal mb-2">
                                Carrier Pay
                            </h3>

                            <div className="flex flex-col gap-2 p-2 w-full">
                                <div className="flex justify-end items-center w-full">
                                    <div className="mr-1.5 text-right">
                                        Due Date:
                                    </div>
                                    <DatePicker
                                        value={load?.carrierDueDate ? new Date(load.carrierDueDate) : null}
                                        className="xl:!w-[110px] 2xl:!w-[150px] !rounded-[2px]"
                                        onChange={(d) => setLoad(prev => prev ? { ...prev, carrierDueDate: d ? toISOString(d) ?? undefined : undefined } : null)}
                                    />
                                </div>

                                <div className="flex justify-end items-center w-full">
                                    <div className="mr-1.5 text-right">
                                        Paid Date:
                                    </div>
                                    <DatePicker
                                        value={load?.carrierPaidDate ? new Date(load.carrierPaidDate) : null}
                                        className="xl:!w-[110px] 2xl:!w-[150px] !rounded-[2px]"
                                        onChange={(d) => setLoad(prev => prev ? { ...prev, carrierPaidDate: d ? toISOString(d) ?? undefined : undefined } : null)}
                                    />
                                </div>

                                <div className="flex justify-end items-center w-full">
                                    <div className="mr-1.5 text-right">
                                        Payment Type:
                                    </div>
                                    <Select
                                        options={dropdownOptions.paymentType}
                                        value={load?.carrierPaymentType ?? ''}
                                        placeholder="Select"
                                        onSelect={(val) => setLoad(prev => prev ? { ...prev, carrierPaymentType: val } : null)}
                                        className="xl:!w-[110px] 2xl:!w-[150px] !rounded-[2px]"
                                        dropdownWidth=""
                                    />
                                </div>

                                <div className="flex justify-end items-center w-full">
                                    <div className="mr-1.5 text-right">
                                        Amount Paid:
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="$"
                                        className="xl:!w-[110px] 2xl:!w-[150px]"
                                        value={load?.carrierAmountPaid ?? ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setLoad(prev => prev ? { ...prev, carrierAmountPaid: val === '' ? undefined : Number(val) } : null);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Carrier Pay End */}
                    </div>
                </div>
            </div>

            {anchorPos && (
                <EmployeeModal
                    id={selectedEmployeeId}
                    isOpen={isEmployeeModalOpen}
                    position={anchorPos}
                    onClose={() => setIsEmployeeModalOpen(false)}
                />
            )}

            <PositionalModal
                isOpen={isTotalModalOpen}
                position={totalModalPosition}
                onClose={() => setIsTotalModalOpen(false)}
            >
                <div className='text-[10px] xl:text-[11px] font-medium px-2'>
                    Line haul + Fuel Surcharge + Additional Accessorials (If any)
                </div>
            </PositionalModal>

            <PositionalModal
                isOpen={isOfferModalOpen}
                position={offerModalPosition}
                onClose={() => setIsOfferModalOpen(false)}
            >
                <div className='text-[10px] font-semibold max-w-[280px]'>
                    Options Offered by carriers to cover this load. Anyone
                    assigned to this customer can accept or reject options
                    (Sales Reps, Operators, and Admin Users).
                </div>
            </PositionalModal>

            <PositionalModal
                isOpen={isPayUpToModalOpen}
                position={payUpToModalPosition}
                onClose={() => setIsPayUpToModalOpen(false)}
            >
                <div className='text-[10px] font-semibold max-w-[280px]'>
                    Maximum limit payout to a carrier for a load. This maximum
                    can only be bypassed by admins and those with user specific permissions.
                </div>
            </PositionalModal>

            <UploadDocumentModal
                isOpen={isDocumentUploadModalOpen}
                onClose={() => setIsDocumentUploadModalOpen(false)}
                title={'Load Document Extract/Upload'}
                onSave={handleDocumentSave}
                data={dropdownOptions.documentCategory}
                onUploadSuccess={fetchAllUploadedData}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteModalOpen}
                onClose={() => setIsConfirmDeleteModalOpen(false)}
                onDelete={() => setIsConfirmDeleteModalOpen(false)}
                title="Confirm Delete"
                message="Are you sure you want to delete this item?"
                size="md"
            />

            <OptionsModal
                isOpen={isOptionsModalOpen}
                onClose={() => setIsOptionsModalOpen(false)}
            />
        </>
    );
}