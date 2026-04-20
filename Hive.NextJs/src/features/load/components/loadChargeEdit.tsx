import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import { Charge, Load } from '@/features/load/types';

// 1. Define Responsive Width Constants for the Grid Columns
// Label | Qty | Customer | Carrier | (Actions)
const GRID_TEMPLATE = "grid-cols-[120px_40px_60px_60px_40px] lg:grid-cols-[120px_40px_60px_60px_40px] xl:grid-cols-[120px_40px_60px_60px_40px] 2xl:grid-cols-[120px_50px_100px_100px_40px]";

interface LoadChargeEditProps {
    charges: Partial<Charge>[];
    handleChargeChange: <K extends keyof Charge>(index: number, field: K, value: Charge[K]) => void;
    handleChargeRemove: (index: number) => void;
    isAddingCharge: boolean;
    setIsAddingCharge: (val: boolean) => void;
    newChargeLabel: string;
    setNewChargeLabel: (val: string) => void;
    handleChargeAdd: () => void;
    setTotalModalPosition: (pos: { top: number, left: number }) => void;
    setIsTotalModalOpen: (val: boolean) => void;
    load: Load | null;
    setLoad: React.Dispatch<React.SetStateAction<Load | null>>;
    setIsOptionsModalOpen: (val: boolean) => void;
    setOfferModalPosition: (pos: { top: number, left: number }) => void;
    setIsOfferModalOpen: (val: boolean) => void;
    setPayUpToModalPosition: (pos: { top: number, left: number }) => void;
    setIsPayUpToModalOpen: (val: boolean) => void;
}

export const LoadChargeEdit: React.FC<LoadChargeEditProps> = ({
    charges,
    handleChargeChange,
    handleChargeRemove,
    isAddingCharge,
    setIsAddingCharge,
    newChargeLabel,
    setNewChargeLabel,
    handleChargeAdd,
    setTotalModalPosition,
    setIsTotalModalOpen,
    load,
    setLoad,
    setIsOptionsModalOpen,
    setOfferModalPosition,
    setIsOfferModalOpen,
    setPayUpToModalPosition,
    setIsPayUpToModalOpen
}) => {
    const activeChargesCount = charges.reduce((count, c) => count + (c.isDeleted ? 0 : 1), 0);
    let lastActiveChargeIndex = -1;
    charges.forEach((c, i) => { if (!c.isDeleted) lastActiveChargeIndex = i; });

    return (
        <div className="w-fit ml-auto flex flex-col gap-1.5 -mt-6">
            {/* Header Row */}
            <div className={`grid ${GRID_TEMPLATE} gap-1 items-center text-center`}>
                <div></div> {/* Empty Label Space */}
                <div>Qty</div>
                <div>Customer</div>
                <div>Carrier</div>
                <div></div> {/* Action Space */}
            </div>

            {/* Charge Rows */}
            {charges.map((charge, index) => {
                if (charge.isDeleted) return null;
                return (
                    <div key={`charge-${index}`} className={`grid ${GRID_TEMPLATE} gap-1 items-center`}>
                        <div className="flex justify-end truncate">
                            {charge.chargeLabel}:
                        </div>
                        <input
                            type="text"
                            value={charge.chargeQuantity || ''}
                            onChange={(e) => handleChargeChange(index, 'chargeQuantity', Number(e.target.value) || 0)}
                            className="!w-full text-center"
                        />
                        <input
                            type="text"
                            placeholder="$"
                            value={charge.customerCharge || ''}
                            onChange={(e) => handleChargeChange(index, 'customerCharge', Number(e.target.value) || 0)}
                            className="!w-full"
                        />
                        <input
                            type="text"
                            placeholder="$"
                            value={charge.carrierCharge || ''}
                            onChange={(e) => handleChargeChange(index, 'carrierCharge', Number(e.target.value) || 0)}
                            className="!w-full"
                        />
                        <div className="flex items-center gap-1 pl-1">
                            {activeChargesCount > 1 && (
                                <IoRemoveCircle
                                    size={16}
                                    color="var(--color-danger)"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                    onClick={() => handleChargeRemove(index)}
                                />
                            )}
                            {index === lastActiveChargeIndex && (
                                <IoAddCircle
                                    size={16}
                                    color="var(--color-primary)"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                    onClick={() => setIsAddingCharge(!isAddingCharge)}
                                />
                            )}
                        </div>
                    </div>
                )
            })}

            {/* Adding Charge UI */}
            {isAddingCharge && (
                <div className={`flex gap-1 items-center flex justify-end mt-1 mr-5.5`}>
                    <input
                        type="text"
                        value={newChargeLabel}
                        onChange={(e) => setNewChargeLabel(e.target.value)}
                        placeholder="Label"
                        className="px-1 border rounded"
                    />
                    <div className="flex gap-1">
                        <button
                            className="bg-primary text-white px-3 h-6 rounded text-xs cursor-pointer"
                            onClick={handleChargeAdd}
                        >
                            Add
                        </button>
                        <IoRemoveCircle
                            size={16}
                            color="var(--color-danger)"
                            className="cursor-pointer transition-opacity hover:opacity-80"
                            onClick={() => setIsAddingCharge(false)}
                        />
                    </div>
                </div>
            )}

            {/* Total Row */}
            <div className={`grid ${GRID_TEMPLATE} gap-1 items-center`}>
                <div className="flex justify-end items-center">
                    <FiInfo
                        size={14}
                        color="var(--color-primary)"
                        className="mr-1 cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTotalModalPosition({ top: rect.bottom + 5, left: rect.left });
                            setIsTotalModalOpen(true);
                        }}
                    />
                    Total:
                </div>
                <div></div> {/* Empty Qty Cell */}
                <input
                    type="text"
                    placeholder="$"
                    className="!w-full"
                    value={load?.customerTotal || ''}
                    onChange={(e) => setLoad(prev => prev ? { ...prev, customerTotal: Number(e.target.value) || 0 } : null)}
                />
                <input
                    type="text"
                    placeholder="$"
                    className="!w-full"
                    value={load?.carrierTotal || ''}
                    onChange={(e) => setLoad(prev => prev ? { ...prev, carrierTotal: Number(e.target.value) || 0 } : null)}
                />
                <div></div>
            </div>

            {/* Offer Row */}
            <div className={`grid ${GRID_TEMPLATE} gap-1 items-center`}>
                <div className="flex justify-end items-center">
                    <span className="text-primary underline mr-2 cursor-pointer text-[10px]" onClick={() => setIsOptionsModalOpen(true)}>
                        Options (5)
                    </span>
                    <FiInfo size={14} color="var(--color-primary)" className="mr-1 cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setOfferModalPosition({ top: rect.bottom + 5, left: rect.left });
                            setIsOfferModalOpen(true);
                        }}
                    />
                    Offer:
                </div>
                <div></div>
                <div></div> {/* Empty Customer Cell */}
                <input
                    type="text"
                    placeholder="$"
                    className="!w-full !h-6"
                    value={load?.carrierOffer || ''}
                    onChange={(e) => setLoad(prev => prev ? { ...prev, carrierOffer: Number(e.target.value) || 0 } : null)}
                />
                <div></div>
            </div>

            {/* Pay Up To Row */}
            <div className={`grid ${GRID_TEMPLATE} gap-1 items-center`}>
                <div className="flex justify-end items-center">
                    <FiInfo size={14} color="var(--color-primary)" className="mr-1 cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setPayUpToModalPosition({ top: rect.bottom + 5, left: rect.left });
                            setIsPayUpToModalOpen(true);
                        }}
                    />
                    Pay Up To:
                </div>
                <div></div>
                <div></div>
                <input
                    type="text"
                    placeholder="$"
                    className="!w-full !h-6"
                    value={load?.carrierPayUpTo || ''}
                    onChange={(e) => setLoad(prev => prev ? { ...prev, carrierPayUpTo: Number(e.target.value) || 0 } : null)}
                />
                <div></div>
            </div>
        </div>
    );
};