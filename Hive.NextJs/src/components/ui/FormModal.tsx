'use client';

import { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onSave: () => void;
    size?: 'sm' | 'md' | 'lg' | '2lg';
    actionType: string;
}

export default function FormModal({
    isOpen,
    onClose,
    title,
    children,
    onSave,
    size = 'md',
    actionType,
}: FormModalProps) {
    if (!isOpen) return null;

    const sizeClass =
        size === 'sm'
            ? 'max-w-sm'
            : size === 'md'
              ? 'max-w-md'
              : size === 'lg'
                ? 'max-w-2xl'
                : 'max-w-5xl';

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
            <div
                className={`bg-white/100 rounded-lg border-1 border-gray-200 !z-10 mx-4 text-nowrap !max-h-[90%] overflow-auto relative scroll-auto`}
            >
                {/* Header */}
                <div className="flex items-center justify-center rounded-t px-3 py-2.5">
                    <h4 className="w-full flex justify-center text-2xl mb-0 !text-black tracking-wide">
                        {title}
                    </h4>
                    <button
                        onClick={onClose}
                        className="w-5 text-red-600 hover:text-red-700 px-5"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/*Body*/}
                <div className="p-4">{children}</div>

                {/*Footer*/}
                <div className="px-4 pb-2.5 flex justify-end gap-3">
                    <button onClick={onClose} className="btn-white px-4">
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className={`${actionType === 'create' ? 'btn-green' : 'btn-blue'} px-4`}
                    >
                        {actionType === 'create' ? 'Save' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
}
