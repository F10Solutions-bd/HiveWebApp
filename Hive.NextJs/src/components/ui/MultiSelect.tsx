import { useState } from 'react';

interface MultiSelectOption {
    label: string;
    value: number;
}
interface MultiSelectProps {
    options: MultiSelectOption[];
    value: number[];
    onChange: (selectedValues: number[]) => void;
    placeholder?: string;
    maxHeight?: number;
    className?: string;
}
export default function MultiSelect({
    options,
    value,
    onChange,
    placeholder = '--Select Option--',
    maxHeight = 200,
    className = '',
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedLabels = options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label)
        .join(',');

    const toggleOption = (optValue: number) => {
        if (value.includes(optValue)) {
            onChange(value.filter((v) => v !== optValue));
        } else {
            onChange([...value, optValue]);
        }
    };

    return (
        <div className={`relative w-full ${className}`}>
            <div
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-teal-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span
                    className={
                        selectedLabels ? 'text-gray-900' : 'text-gray-400'
                    }
                >
                    {selectedLabels || placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div
                        className="absolute z-20 w-full  !max-h-100  overflow-auto mt-1 bg-white border border-gray-300 rounded-lg "
                        style={{ maxHeight }}
                    >
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                No options available
                            </div>
                        ) : (
                            options.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="px-4 py-2 hover:bg-teal-50 cursor-pointer flex items-center gap-3 transition-colors"
                                    onClick={() => toggleOption(opt.value)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.includes(opt.value)}
                                        readOnly
                                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 pointer-events-none"
                                    />
                                    <span className="text-sm">{opt.label}</span>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
