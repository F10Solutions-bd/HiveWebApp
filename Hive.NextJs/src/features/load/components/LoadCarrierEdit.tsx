/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IoAddCircle } from 'react-icons/io5';
import FormModal from '@/components/modal/FormModal';

interface LoadCarrierEditProps {
    mcDotType: 'MC' | 'DOT';
    setMcDotType: React.Dispatch<React.SetStateAction<'MC' | 'DOT'>>;
    mcDotValue: string;
    setMcDotValue: (value: string) => void;
    handleCarrierInfoAutoPlace: () => void;
    isOpenAddCarrierModal: boolean;
    setIsOpenAddCarrierModal: (isOpen: boolean) => void;
    newCarrier: any;
    setNewCarrier: (carrier: any) => void;
    handleCarrierSave: () => void;
    autoPlacedCarrier: any;
}

export const LoadCarrierEdit: React.FC<LoadCarrierEditProps> = ({
    mcDotType,
    setMcDotType,
    mcDotValue,
    setMcDotValue,
    handleCarrierInfoAutoPlace,
    isOpenAddCarrierModal,
    setIsOpenAddCarrierModal,
    newCarrier,
    setNewCarrier,
    handleCarrierSave,
    autoPlacedCarrier
}) => {
    return (
        <div className="flex gap-5 justify-between mt-5">
            <div className="flex flex-col gap-2"
                style={
                    {
                        '--size': '165px',
                    } as React.CSSProperties
                }
            >
                <div className="flex justify-between !items-center w-[var(--size)]">
                    <div className="flex justify-start !items-center gap-2">
                        <input type="radio" name="mcdot" checked={mcDotType === 'MC'} onChange={() => setMcDotType('MC')} />{' '}
                        <span>MC #</span>
                    </div>
                    <div className="flex justify-start !items-center gap-2">
                        <input type="radio" name="mcdot" checked={mcDotType === 'DOT'} onChange={() => setMcDotType('DOT')} />{' '}
                        DOT #
                    </div>
                </div>
                <div>
                    <input
                        type="text"
                        className="ml-0 flex justify-center items-center w-[var(--size)] !h-[28px] text-center"
                        placeholder={mcDotType === 'MC' ? 'MC #' : 'DOT #'}
                        value={mcDotValue}
                        onChange={(e) => setMcDotValue(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={handleCarrierInfoAutoPlace}
                        className="btn-primary w-[var(--size)] !py-1 !rounded-2xl"
                    >
                        Book
                    </button>
                </div>
                <div className='w-[var(--size)]'>
                    <button
                        onClick={() =>
                            setIsOpenAddCarrierModal(true)
                        }
                        className="relative w-full btn-secondary !py-[4px] !pl-5 !pr-0.5 !rounded-2xl flex items-center justify-center gap-2"
                    >
                        <div className="text-center">Add Carrier</div>
                        <IoAddCircle className="absolute right-0.5 w-[26px] h-[26px] text-primary" />
                    </button>

                    <FormModal
                        isOpen={isOpenAddCarrierModal}
                        onClose={() =>
                            setIsOpenAddCarrierModal(false)
                        }
                        headline="Add Carrier"
                        className="!text-[16px] xl:!text-lg"
                    >
                        <div className="flex flex-col gap-1.5 w-[850px]" style={
                            {
                                '--size-input': 'clamp(150px, 100%, 250px)',
                            } as React.CSSProperties
                        }>
                            <div className="flex justify-center items-center gap-5">
                                <div className="w-[50%] !font-normal text-right">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Name:
                                    <input
                                        type="text"
                                        value={newCarrier.name}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                                        placeholder="name"
                                        className="ml-2"
                                    />
                                </div>
                                <div className="w-[50%] !font-normal flex items-center justify-end">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Email:
                                    <input
                                        type="text"
                                        value={newCarrier.email}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, email: e.target.value })}
                                        placeholder="email"
                                        className="ml-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center gap-5">
                                <div className="w-[50%] text-right !font-normal">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    MC:
                                    <input
                                        type="text"
                                        value={newCarrier.mc}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, mc: e.target.value })}
                                        placeholder="MC"
                                        className="ml-2"
                                    />
                                </div>
                                <div className="w-[50%] !font-normal flex items-center justify-end">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    DOT:
                                    <input
                                        type="text"
                                        value={newCarrier.dot}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, dot: e.target.value })}
                                        placeholder="DOT"
                                        className="ml-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center gap-5">
                                <div className="w-[50%] text-right !font-normal">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Phone:
                                    <input
                                        type="text"
                                        value={newCarrier.officePhone}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, officePhone: e.target.value })}
                                        placeholder="Phone"
                                        className="ml-2"
                                    />
                                </div>
                                <div className="w-[50%] !font-normal flex items-center justify-end">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Main POC:
                                    <input
                                        type="text"
                                        value={newCarrier.mainPOC}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, mainPOC: e.target.value })}
                                        placeholder="Main POC"
                                        className="ml-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center gap-5">
                                <div className="w-[50%] text-right !font-normal">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Terminal:
                                    <input
                                        type="text"
                                        value={newCarrier.terminal}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, terminal: e.target.value })}
                                        placeholder="Terminal"
                                        className="ml-2"
                                    />
                                </div>
                                <div className="w-[50%] !font-normal flex items-center justify-end">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    <span className=''>Dispatcher:</span>
                                    <input
                                        type="text"
                                        value={newCarrier.dispatcher}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, dispatcher: e.target.value })}
                                        placeholder="Dispatcher"
                                        className="ml-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center gap-5">
                                <div className="w-[50%] !font-normal flex items-center justify-end">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    <span className=''>Dispatcher Phone:</span>
                                    <input
                                        type="text"
                                        value={newCarrier.dispatcherPhone}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, dispatcherPhone: e.target.value })}
                                        placeholder="Dispatcher Phone"
                                        className="ml-2"
                                    />
                                </div>
                                <div className="w-[50%] text-right !font-normal">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Dispatcher Email:
                                    <input
                                        type="text"
                                        value={newCarrier.dispatcherEmail}
                                        onChange={(e) => setNewCarrier({ ...newCarrier, dispatcherEmail: e.target.value })}
                                        placeholder="Dispatcher Email"
                                        className="ml-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-2 mt-2">
                                <div className="!font-normal flex items-center gap-2 justify-end">
                                    <span className="text-danger mr-1 -mt-1">
                                        *
                                    </span>
                                    Address:
                                </div>
                                <textarea
                                    value={newCarrier.address}
                                    onChange={(e) => setNewCarrier({ ...newCarrier, address: e.target.value })}
                                    placeholder="Address"
                                    className="!w-[var(--size-input)]"
                                />
                            </div>

                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handleCarrierSave}
                                    className="btn-primary !h-8 px-6 !rounded-md text-[13px] xl:text-sm"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </FormModal>
                </div>
            </div>
            <div className=""
                style={
                    {
                        '--size': '130px',
                    } as React.CSSProperties
                }
            >
                <div className="flex gap-2">
                    <div className="w-[var(--size)] text-right font-normal">
                        Carrier Name:
                    </div>
                    <span>{autoPlacedCarrier?.name || ''}</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-[var(--size)] text-right h-[50px] font-normal">
                        Address:
                    </div>
                    <span>{autoPlacedCarrier?.address || ''}</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-[var(--size)] text-right font-normal">
                        Phone:
                    </div>
                    <span>{autoPlacedCarrier?.officePhone || ''}</span>
                </div>
            </div>
            <div className="w-[30%]"
                style={
                    {
                        '--size': '120px',
                    } as React.CSSProperties
                }
            >
                <div className="flex gap-2">
                    <div className="w-[var(--size)] text-right font-normal">
                        Terminal:
                    </div>
                    <span>{autoPlacedCarrier?.terminal || ''}</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-[var(--size)] text-right font-normal">
                        Dispatcher:
                    </div>
                    <span>{autoPlacedCarrier?.dispatcher || ''}</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-[var(--size)] text-right font-normal">
                        Phone:
                    </div>
                    <span>{autoPlacedCarrier?.dispatcherPhone || ''}</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-[var(--size)] text-right font-normal">
                        Email:
                    </div>
                    <span>{autoPlacedCarrier?.dispatcherEmail || autoPlacedCarrier?.email || ''}</span>
                </div>
            </div>
        </div>
    );
};