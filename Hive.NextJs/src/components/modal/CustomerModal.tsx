'use client';

import { useEffect, useState, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { createApiClient } from '@/services/apiClient';
import Link from 'next/link';

type CustomerDto = {
    id: number;
    name: string;
    billingAddress: string;
    lastLoadDate?: string;
    availableCredit: number;
    mainPOC: string;
    phone: string;
    salesRepresentativeId: number;
    salesRepresentativeName?: string;
    operatorName?: string;
    operatorId: number;
    isActive: boolean;
};

type Props = {
    id: string;
    isOpen: boolean;
    position: {
        top: number;
        left: number;
    };
    onClose: () => void;
};

export default function CustomerModal({
    id,
    isOpen,
    position,
    onClose,
}: Props) {
    const api = createApiClient();
    const [customer, setCustomer] = useState<CustomerDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true);
    const ref = useRef<HTMLDivElement>(null);

    // Dynamic positioning state
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    useEffect(() => {
        if (isOpen && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            let newLeft = position.left;

            if (position.left + rect.width > window.innerWidth) {
                newLeft = window.innerWidth - rect.width - 20;
            }
            if (newLeft < 0) newLeft = 20;

            setAdjustedPosition({ top: position.top, left: newLeft });
        } else {
            setAdjustedPosition(position);
        }
    }, [isOpen, position, customer]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return; // Only attach listener if open

        const handler = (e: MouseEvent) => {
            // Check if the click was outside the modal ref
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose(); // Just tell the parent to close
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchCustomer = async () => {
            try {
                setLoading(true);
                const response = await api.get<CustomerDto>(`/customers/${id}`);
                setCustomer(response.data);
            } catch (error) {
                console.error("Failed to fetch customer details", error);
                setCustomer(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id, isOpen]);

    useEffect(() => {
        if (isOpen) {
            // Disable scrolling
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scrolling
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to ensure scrolling is re-enabled 
        // if the component unmounts unexpectedly
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {open && (
                <div className="fixed bg-black/10 inset-0 z-70 transition-opacity duration-150">
                    {/* Modal */}
                    <div
                        ref={ref}
                        style={{
                            top: adjustedPosition.top,
                            left: adjustedPosition.left,
                        }}
                        className="absolute bg-bg p-5 pl-2 pb-6 rounded-lg shadow-lg z-10 min-w-[350px]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-1 right-1 text-danger cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>
                        {/* 
                        {loading && <p>Loading...</p>}
                        {!loading && !customer && (
                            <p className="text-red-500">Customer not found</p>
                        )} */}

                        {customer && (
                            <div className="flex justify-between relative gap-5 !text-[12px]">
                                <div className="space-y-1">
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Name:
                                        </span>
                                        <span className='text-primary cursor-pointer underline w-30'>{customer.name}</span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Billing Address:
                                        </span>
                                        <span className='w-30'>{customer.billingAddress}</span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Phone:
                                        </span>
                                        <span className='w-30'>{customer.phone}</span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Assigned To:
                                        </span>
                                        <span className='w-30'>{customer.salesRepresentativeName}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex flex gap-2.5">
                                        <span className="font-bold w-28 text-right">
                                            Status:
                                        </span>
                                        <span className='w-30'>{customer.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <div className="flex flex gap-2.5">
                                        <span className="font-bold w-28 text-right">
                                            Last Load Date:
                                        </span>
                                        <span className='w-30'>{customer.lastLoadDate || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex gap-2.5">
                                        <span className="font-bold w-28 text-right">
                                            Available Credit:
                                        </span>
                                        <span className='w-30'>${customer.availableCredit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex gap-2.5">
                                        <span className="font-bold w-28 text-right">
                                            Main POC:
                                        </span>
                                        <span className='w-30'>{customer.mainPOC || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="absolute right-0 -bottom-4 underline text-primary cursor-pointer">
                                    <Link href={`/customer/${customer.id}`}>Go to Profile</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
