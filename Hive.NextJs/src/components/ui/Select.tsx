'use client';

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export type SelectOption = {
    label: string;
    value: string;
};

type SelectProps = {
    options: SelectOption[];
    value?: string;
    placeholder?: string;
    className?: string;
    dropdownWidth?: string;
};

export default function Select({
    options,
    value = '',
    placeholder = '',
    className = '',
    dropdownWidth = '',
}: SelectProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const [openUpward, setOpenUpward] = useState(false);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Sync external value
    useEffect(() => {
        const hasValue = value !== '' && value != null;
        const hasPlaceholder = placeholder !== '' && placeholder != null;

        if (hasValue) {
            setSelected(value);
        } else if (!hasPlaceholder && options.length > 0) {
            setSelected(options[0].value);
        } else {
            setSelected(null);
        }
    }, [value, placeholder, options]);

    const handleSelect = (optionValue: string) => {
        setSelected(optionValue);
        setOpen(false);
    };

    const selectedOption = options.find((option) => option.value === selected);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/10 z-70 transition-opacity duration-150"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className="relative" ref={ref}>
                <button
                    onClick={() => {
                        if (ref.current) {
                            const rect = ref.current.getBoundingClientRect();
                            const dropdownHeight = Math.min(
                                options.length * 36,
                                310
                            );
                            const spaceBelow = window.innerHeight - rect.bottom;

                            setOpenUpward(spaceBelow < dropdownHeight);
                        }
                        setOpen((prev) => !prev);
                    }}
                    className={`rounded-sm px-2 py-1.5 text-sm text-left flex justify-between cursor-pointer items-center ${className}`}
                >
                    <span
                        className={`${
                            selected ? 'text-black' : 'text-gray-300'
                        }`}
                    >
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <FiChevronDown className="text-primary text-xl ml-2" />
                </button>

                {open && (
                    <div
                        className={`absolute bg-white border border-secondary rounded-lg shadow-sm z-80 max-h-[300px] overflow-y-auto hide-scrollbar ${
                            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
                        }`}
                        style={{
                            width:
                                dropdownWidth && dropdownWidth.trim() !== ''
                                    ? dropdownWidth
                                    : 'auto',
                        }}
                    >
                        {options.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`ml-1.5 mr-1.5 ${
                                    index !== options.length - 1
                                        ? 'border-b border-secondary'
                                        : ''
                                }`}
                            >
                                <div
                                    data-value={option.value}
                                    className="my-1 px-3 py-[3px] rounded-[9px] text-[0.79rem] tracking-[-0.03rem] cursor-pointer hover:bg-dropdown-hover-bg whitespace-nowrap overflow-hidden text-ellipsis"
                                >
                                    {option.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
