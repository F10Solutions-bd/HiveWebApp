'use client';

import { useEffect, useState, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import Link from 'next/link';
import { Office } from '@/app/(protected)/admin/office/page';
import { getOffice } from '../../services/dashboard';

type Props = {
    id: string;
    isOpen: boolean;
    position: {
        top: number;
        left: number;
    };
    onClose: () => void;
};

// simple in-memory cache
const officeCache = new Map<string, Office>();

export default function OfficeModal({ id, isOpen, position, onClose }: Props) {
    const [office, setOffice] = useState<Office | null>(null);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    // Position logic (unchanged)
    useEffect(() => {
        if (isOpen && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const { innerWidth: windowW, innerHeight: windowH } = window;

            let newLeft = position.left;
            let newTop = position.top;

            if (position.left + rect.width > windowW) {
                newLeft = position.left - rect.width;
            }
            if (newLeft < 0) newLeft = position.left;

            if (position.top + rect.height > windowH) {
                newTop = position.top - rect.height;
            }
            if (newTop < 0) newTop = position.top;

            const finalLeft = Math.max(10, Math.min(newLeft, windowW - rect.width - 10));
            const finalTop = Math.max(10, Math.min(newTop, windowH - rect.height - 10));

            setAdjustedPosition({ top: finalTop, left: finalLeft });
        }
    }, [isOpen, position]);


    useEffect(() => {
        if (!isOpen) return;

        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

  
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;

        const cached = officeCache.get(id);
        if (cached) {
            setOffice(cached);
        }

        const fetchOffice = async () => {
            try {
                setLoading(true);
                const response = await getOffice(id);

                if (!isMounted) return;

                if (response.data) {
                    officeCache.set(id, response.data);
                    setOffice(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch office details", error);
                if (!cached) setOffice(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchOffice();

        return () => {
            isMounted = false;
        };
    }, [id, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed bg-black/10 inset-0 z-70">
            <div
                ref={ref}
                style={{
                    top: adjustedPosition.top,
                    left: adjustedPosition.left,
                }}
                className="absolute bg-bg p-5 pl-2 pb-6 rounded-lg shadow-lg min-w-[350px]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-1 right-1 text-danger cursor-pointer"
                >
                    <FiX size={18} />
                </button>

                {loading && !office && <div>Loading...</div>}

                {office && (
                    <div className="flex justify-between gap-5 text-[12px]">
                        <div className="space-y-1">
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Name:</span>
                                <span>{office.name}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Phone #:</span>
                                <span>{office.phone}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Email:</span>
                                <span>{office.email}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Office #:</span>
                                <span>{office.id}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Address:</span>
                                <span>{office.address}</span>
                            </div>
                        </div>

                        <div className="absolute right-0 -bottom-4 underline text-primary">
                            <Link href={`/office/${office.id}`}>See Details</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}