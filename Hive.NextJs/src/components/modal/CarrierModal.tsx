'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { createApiClient } from '@/services/apiClient';
import Link from 'next/link';

type CarrierDto = {
    id: number;
    name: string;
    mc: string;
    dot: string;
    mainPOC?: string;
    office?: string;
    email: string;
    officePhone: string;
    address?: string;
    terminal?: string;
    dispatcher?: string;
    dispatcherPhone?: string;
    dispatcherEmail?: string;
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

const api = createApiClient();
export default function CarrierModal({
    id,
    isOpen,
    position,
    onClose,
}: Props) {
    // const api = createApiClient();
    const [carrier, setCarrier] = useState<CarrierDto | null>(null);
    const [loading, setLoading] = useState(true);
    const ref = useRef<HTMLDivElement>(null);

    // Dynamic positioning state
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    useLayoutEffect(() => {
        if (!isOpen || !ref.current) return;

        const updatePosition = () => {
            const rect = ref.current!.getBoundingClientRect();

            let left = position.left;
            let top = position.top;

            if (left + rect.width > window.innerWidth) {
                left = window.innerWidth - rect.width - 10;
            }

            if (top + rect.height > window.innerHeight) {
                top = window.innerHeight - rect.height - 10;
            }

            setAdjustedPosition({ left, top });
        };

        updatePosition();

        const observer = new ResizeObserver(updatePosition);
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [isOpen, position]);
   

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

        const fetchCarrier = async () => {
            try {
                setLoading(true);
                const response = await api.get<CarrierDto>(`/carriers/${id}`);
                setCarrier(response.data);
            } catch (error) {
                console.error("Failed to fetch carrier details", error);
                setCarrier(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCarrier();
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
            {isOpen && (
                <div className="fixed bg-black/10 inset-0 z-70 transition-opacity duration-150">
                    {/* Modal */}
                    <div
                        ref={ref}
                        style={{
                            top: adjustedPosition.top,
                            left: adjustedPosition.left,
                        }}
                        className="absolute bg-bg p-5 pl-3 pb-6 rounded-lg shadow-lg z-10 min-w-[350px]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-1 right-1 text-danger cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>

                        {loading && <p>Loading...</p>}
                        {!loading && !carrier && (
                            <p className="text-red-500">Carrier not found</p>
                        )}

                        {carrier && (
                            <div className="flex justify-between relative gap-10 !text-[12px]">
                                <div className="space-y-1">
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Name:
                                        </span>
                                        <span className='text-primary cursor-pointer underline'>{carrier.name}</span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Office:
                                        </span>
                                        <span className=''>{carrier.office}</span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Office Phone:
                                        </span>
                                        <span className=''>{carrier.officePhone}</span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <span className="font-bold w-25 text-right">
                                            Main POC:
                                        </span>
                                        <span className=''>{carrier.mainPOC}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex flex gap-2.5">
                                        <span className="font-bold w-12 text-right">
                                            MC #:
                                        </span>
                                        <span className='text-primary cursor-pointer underline'><Link href={`/carrier/${carrier.id}`}>{carrier.mc}</Link></span>
                                    </div>
                                    <div className="flex flex gap-2.5">
                                        <span className="font-bold w-12 text-right">
                                            DOT #:
                                        </span>
                                        <span className=''><Link href={`/carrier/${carrier.id}`}>{carrier.dot}</Link></span>
                                    </div>
                                    <div className="flex flex gap-2.5">
                                        <span className="font-bold w-12 text-right">
                                            Email:
                                        </span>
                                        <span className=''>{carrier.email}</span>
                                    </div>
                                </div>

                                <div className="absolute right-0 -bottom-4 underline text-primary cursor-pointer">
                                    <Link href={`/carrier/${carrier.id}`}>Go to Profile</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
