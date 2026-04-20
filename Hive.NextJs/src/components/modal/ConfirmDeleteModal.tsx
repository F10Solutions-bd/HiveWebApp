'use client';

import { FiX } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    title?: string;
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function DeleteModal({
    isOpen,
    onClose,
    onDelete,
    title = 'Confirm Delete',
    message = 'Are you sure want to delete this item?',
    size = 'md',
}: DeleteModalProps) {
    if (!isOpen) return null;

    const sizeClass =
        size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-md';

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-80">
            <div
                className={`bg-white rounded-lg shadow-lg w-full ${sizeClass} mx-4 relative`}
            >
                {/* Header */}
                <div className="flex items-center justify-center rounded-t px-3 py-2.5">
                    <h4 className="w-full flex justify-center text-2xl mb-0 tracking-wide">
                        {title}
                    </h4>
                    <button
                        onClick={onClose}
                        className="w-5 text-danger cursor-pointer px-5"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex justify-start">
                    <button className="text-danger cursor-pointer mb-3">
                        <FiTrash2 size={18} />
                    </button>
                    <p className="ml-2">{message}</p>
                </div>

                {/* Common Footer */}
                <div className="px-4 pb-2.5 flex justify-end gap-3">
                    <button onClick={onClose} className="btn-white px-4 cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="btn-red px-4 text-white cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
