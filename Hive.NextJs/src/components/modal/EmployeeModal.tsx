'use client';

import { useEffect, useState, useRef } from 'react';
import { Employee } from '@/types/common';
import { FiX } from 'react-icons/fi';
import { createApiClient } from '@/services/apiClient';
import Link from 'next/link';

type Props = {
    id: string;
    isOpen: boolean;
    position: {
        top: number;
        left: number;
    };
    onClose: () => void;
};

export default function EmployeeModal({ id, isOpen, position, onClose }: Props) {
    const api = createApiClient();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const ref = useRef<HTMLDivElement>(null);

    const [adjustedPosition, setAdjustedPosition] = useState(position);

    // Dynamic positioning
    useEffect(() => {
        if (isOpen && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const { innerWidth: windowW, innerHeight: windowH } = window;

            let newLeft = position.left;
            let newTop = position.top;

            // --- Horizontal Positioning (Right/Left) ---
            // If it overflows the right edge, move it to the left of the click point
            if (position.left + rect.width > windowW) {
                newLeft = position.left - rect.width;
            }
            // If it overflows the left edge, move it to the right
            if (newLeft < 0) {
                newLeft = position.left; // Fallback to original or add padding
            }

            // --- Vertical Positioning (Bottom/Top) ---
            // If it overflows the bottom edge, move it above the click point
            if (position.top + rect.height > windowH) {
                newTop = position.top - rect.height;
            }
            // If it overflows the top edge, move it below the click point
            if (newTop < 0) {
                newTop = position.top; // Fallback to original
            }

            // Final safety check: ensure it doesn't go off-screen entirely
            const finalLeft = Math.max(10, Math.min(newLeft, windowW - rect.width - 10));
            const finalTop = Math.max(10, Math.min(newTop, windowH - rect.height - 10));

            setAdjustedPosition({ top: finalTop, left: finalLeft });
        }
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

    // Data Fetching
    useEffect(() => {
        if (!isOpen) return;

        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const response = await api.get<Employee>(`/users/user/${id}`);
                setEmployee(response.data);
            } catch (error) {
                console.error("Failed to fetch employee details", error);
                setEmployee(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed bg-black/10 inset-0 z-70 transition-opacity duration-150">
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

                {employee && (
                    <div className="flex justify-between relative gap-5 !text-[12px]">
                        <div className="space-y-1">
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Name:</span>
                                <span>{`${employee.firstName} ${employee.lastName}`}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Office:</span>
                                <span>{employee.officeName}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Office Phone #:</span>
                                <span>{employee.officePhone}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Reports To:</span>
                                <span>{employee.reportsTo}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Employee #:</span>
                                <span>{employee.id}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex gap-2.5">
                                <span className="font-bold w-28 text-right">Role:</span>
                                <span>{employee.roleNames?.[0]}</span>
                            </div>
                            <div className="flex flex gap-2.5">
                                <span className="font-bold w-28 text-right">Cell Phone:</span>
                                <span>{employee.phone}</span>
                            </div>
                            <div className="flex flex gap-2.5">
                                <span className="font-bold w-28 text-right">Email:</span>
                                <span>{employee.email}</span>
                            </div>
                        </div>

                        <div className="absolute right-0 -bottom-4 underline text-primary cursor-pointer">
                            <Link href={`/employee/${employee.id}`}>Go to Profile</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}