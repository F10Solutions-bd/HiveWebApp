import React from 'react';
import { FiX } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

interface GlobalConfirmModalProps {
    isOpen: boolean;
    title?: string;
    width?: number;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function GlobalConfirmModal({
    isOpen,
    title = 'Confirm Action',
    width = 560,
    loading = false,
    onConfirm,
    onCancel,
}: GlobalConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-lg shadow-lg max-w-full relative"
                style={{ width }}
            >
                {/*w-140*/}

                <div className="flex items-center justify-between bg-gray-100 rounded-t-md h-15">
                    <h2 className="text-lg font-semibold text-center flex-1">
                        {title}
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 text-lg px-4"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        <FiX className="h-6 w-6 text-gray-700" />
                    </button>
                </div>

                <div className="p-6 pt-4">
                    <div className="flex items-start gap-2 mb-6">
                        {/* Optional icon */}
                        <MdDelete className="h-7 w-7 text-red-500 -mt-1" />
                        <p className="text-lm text-gray-700">
                            Are you sure, you want to delete this?
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading && (
                                <span className="loader-border h-4 w-4"></span>
                            )}
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
