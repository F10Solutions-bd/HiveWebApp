'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

type Props = {
    isOpen: boolean;
    position: {
        top: number;
        left: number;
    };
    onClose: () => void;
    children: ReactNode;
    className?: string;
};

export default function PositionalModal({
    isOpen,
    position,
    onClose,
    children,
    className = "",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handler);
        }

        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed bg-black/10 inset-0 z-70 transition-opacity duration-150">
            {/* Modal */}
            <div
                ref={ref}
                style={{
                    top: position.top,
                    left: position.left,
                }}
                className={`absolute bg-bg p-5 rounded-lg shadow-lg z-10 ${className}`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-1 mr-1 text-danger cursor-pointer"
                >
                    <FiX size={18} />
                </button>
                {children}
            </div>
        </div>
    );
}
