'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
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

const api = createApiClient();
export default function EmployeeModal({ id, isOpen, position, onClose }: Props) {
    
    const [employee, setEmployee] = useState<Employee | null>(null);
    // const [loading, setLoading] = useState(true);
    const ref = useRef<HTMLDivElement>(null);

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

    // Data Fetching
    useEffect(() => {
        if (!isOpen) return;

        const fetchEmployee = async () => {
            try {
                // setLoading(true);
                const response = await api.get<Employee>(`/users/${id}`);
                setEmployee(response.data);
            } catch (error) {
                console.error("Failed to fetch employee details", error);
                setEmployee(null);
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
                                <span>{employee.reportsName}</span>
                            </div>
                            <div className="flex gap-2.5">
                                <span className="font-bold w-28 text-right">Employee #:</span>
                                <span>{employee.id}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex gap-2.5">
                                <span className="font-bold w-28 text-right">Role:</span>
                                <span>{employee.roleName}</span>
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