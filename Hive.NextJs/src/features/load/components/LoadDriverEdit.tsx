/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IoAddCircle } from 'react-icons/io5';
import FormModal from '@/components/modal/FormModal';
import Select from '@/components/modal/Select';

interface LoadDriverEditProps {
    isOpenAddDriverModal: boolean;
    setIsOpenAddDriverModal: (isOpen: boolean) => void;
    newDriver: any;
    setNewDriver: (driver: any) => void;
    handleDriverSave: () => void;
    driverNameSearch: string;
    handleDriverSearch: (search: string) => void;
    autoPlacedDriver: any;
    load: any;
    isDriverSuggestionOpen: boolean;
    setIsDriverSuggestionOpen: (isOpen: boolean) => void;
    driverSuggestions: any[];
    handleDriverSelect: (driver: any) => void;
    portTerminalOptions: any[];
}

export const LoadDriverEdit: React.FC<LoadDriverEditProps> = ({
    isOpenAddDriverModal,
    setIsOpenAddDriverModal,
    newDriver,
    setNewDriver,
    handleDriverSave,
    driverNameSearch,
    handleDriverSearch,
    autoPlacedDriver,
    load,
    isDriverSuggestionOpen,
    setIsDriverSuggestionOpen,
    driverSuggestions,
    handleDriverSelect,
    portTerminalOptions,
}) => {
    return (
        <div className="flex gap-3 justify-between mt-5 mb-5">
            <div
                className="flex flex-col gap-2"
                style={
                    {
                        '--size': '165px',
                    } as React.CSSProperties
                }
            >
                <div className="text-center w-[var(--size)] !text-[13px] xl:!text-[14px]">
                    Driver Info
                </div>
                <div className='w-[var(--size)]'>
                    <button
                        onClick={() =>
                            setIsOpenAddDriverModal(true)
                        }
                        className="relative w-full btn-secondary !py-[5px] !pl-5 !pr-0.5 !rounded-2xl flex items-center justify-center gap-2"
                    >
                        <div className="text-center">Add Driver</div>
                        <IoAddCircle className="absolute right-0.5 w-[26px] h-[26px] text-primary" />
                    </button>

                    <FormModal
                        isOpen={isOpenAddDriverModal}
                        onClose={() =>
                            setIsOpenAddDriverModal(false)
                        }
                        headline="Add Driver"
                        className="!text-[16px] xl:!text-lg"
                    >
                        <div className="flex flex-col w-[600px] gap-3 mb-2 px-4 mt-2">
                            <div className="flex justify-between items-center gap-5">
                                <div className="w-[50%] !font-normal text-right">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Name:
                                    <input
                                        type="text"
                                        value={newDriver.name}
                                        onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                        placeholder="Driver Name"
                                        className="ml-2"
                                    />
                                </div>
                                <div className="w-[50%] !font-normal flex items-center justify-end">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Phone:
                                    <input
                                        type="text"
                                        value={newDriver.phone}
                                        onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                                        placeholder="Phone"
                                        className="ml-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center gap-5">
                                <div className="w-[50%] text-right !font-normal">
                                    Truck #:
                                    <input
                                        type="text"
                                        value={newDriver.truckNumber}
                                        onChange={(e) => setNewDriver({ ...newDriver, truckNumber: e.target.value })}
                                        placeholder="Truck Number"
                                        className="ml-2"
                                    />
                                </div>
                                <div className="w-[50%] !font-normal flex items-center justify-end">
                                    Trailer #:
                                    <input
                                        type="text"
                                        value={newDriver.trailerNumber}
                                        onChange={(e) => setNewDriver({ ...newDriver, trailerNumber: e.target.value })}
                                        placeholder="Trailer Number"
                                        className="ml-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleDriverSave}
                                className="btn-primary !h-8 px-6 !rounded-md text-[13px] xl:text-sm"
                            >
                                Save
                            </button>
                        </div>
                    </FormModal>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center">
                    <div className="2xl:w-[90px] xl:w-[70] w-[60px] text-right">
                        Driver Name:
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Driver Name"
                            className=""
                            value={driverNameSearch !== '' ? driverNameSearch : (autoPlacedDriver?.name || load?.drivers?.[0]?.name || '')}
                            onChange={(e) => handleDriverSearch(e.target.value)}
                            onFocus={() => { if (driverSuggestions.length > 0) setIsDriverSuggestionOpen(true); }}
                            onBlur={() => setTimeout(() => setIsDriverSuggestionOpen(false), 200)}
                        />
                        {isDriverSuggestionOpen && driverSuggestions.length > 0 && (
                            <ul className="absolute z-10 w-[var(--size)] bg-bg border border-secondary rounded-md shadow-lg max-h-60 overflow-auto">
                                {driverSuggestions.map((driver) => (
                                    <li
                                        key={driver.id}
                                        className="px-3 py-2 hover:bg-segment-bg cursor-pointer"
                                        onMouseDown={() => handleDriverSelect(driver)}
                                    >
                                        {driver.name} {driver.phone ? `- ${driver.phone}` : ''}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="2xl:w-[90px] xl:w-[70] w-[60px] text-right">
                        Cell Phone #:
                    </div>
                    <input
                        type="text"
                        placeholder="Cell #"
                        className="bg-transparent"
                        value={autoPlacedDriver?.phone || load?.drivers?.[0]?.phone || ''}
                        readOnly
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center">
                    <div className="2xl:w-[60px] w-[50px] text-right">
                        Truck #:
                    </div>
                    <input
                        type="text"
                        placeholder="Truck #"
                        className="bg-transparent"
                        value={autoPlacedDriver?.truckNumber || load?.drivers?.[0]?.truckNumber || ''}
                        readOnly
                    />
                </div>
                <div className="flex items-center">
                    <div className="2xl:w-[60px] w-[50px] text-right">
                        Trailer #:
                    </div>
                    <input
                        type="text"
                        placeholder="Trailer #"
                        className="bg-transparent"
                        value={autoPlacedDriver?.trailerNumber || load?.drivers?.[0]?.trailerNumber || ''}
                        readOnly
                    />
                </div>
            </div>

            <div
                className="flex flex-col gap-2"
                style={
                    {
                        '--size': '125px',
                    } as React.CSSProperties
                }
            >
                <div className="flex justify-center gap-2">
                    <Select
                        options={portTerminalOptions}
                        value=""
                        placeholder="Select"
                        className="!w-[125px]"
                        isModal={false}
                    />
                </div>

                <div className="flex justify-center gap-2">
                    <button className="w-[var(--size)] text-center btn-primary !rounded-xl !py-0.5">
                        Truck
                    </button>
                </div>
                <div className="flex justify-center gap-2">
                    <button className="w-[var(--size)] text-center btn-secondary !rounded-xl !py-0.5 !text-border-field">
                        Digital Tracking
                    </button>
                </div>
            </div>

            <div
                className=""
                style={
                    {
                        '--size': '125px',
                    } as React.CSSProperties
                }
            >
                <div className="flex justify-left w-[var(--size)] gap-2">
                    Last Ping:
                </div>
            </div>
        </div>
    );
};