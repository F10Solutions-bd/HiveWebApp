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
    isModal?: boolean;
    placeholder?: string;
    className?: string;
    parentClassName?: string;
    dropdownWidth?: string;
    onSelect?: (optionValue: string) => void;
};

export default function Select({
    options,
    value = '',
    isModal = true,
    placeholder = '',
    className = '',
    parentClassName = '',
    dropdownWidth = '',
    onSelect,
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
        onSelect?.(optionValue);
    };

    const selectedOption = options.find((option) => option.value === selected);

    return (
        <>
            {open && isModal && (
                <div
                    className="fixed inset-0 bg-black/10 z-80 transition-opacity duration-150"
                    onClick={() => setOpen(false)}
                />
            )}
            <div className={`relative ${parentClassName}`} ref={ref}>
                <button
                    onClick={() => {
                        if (ref.current) {
                            const rect = ref.current.getBoundingClientRect();
                            const dropdownHeight = Math.min(options.length * 36, 310);
                            const spaceBelow = window.innerHeight - rect.bottom;
                            setOpenUpward(spaceBelow < dropdownHeight);
                        }
                        setOpen((prev) => !prev);
                    }}
                    className={`
                        rounded-[2px] ml-1 relative px-2 py-1.5 flex cursor-pointer text-left items-center bg-bg border-1 border-border-field h-[22px] overflow-hidden 
                        w-[80px] sm:w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px] 2xl:w-[180px] 
                        ${className}
                    `}
                >
                    <span
                        className={`
        flex-1 mr-4 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis
        ${selected ? 'text-black' : 'text-secondary'}
    `}
                    >
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <FiChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-primary text-lg" />
                </button>

                {open && (
                    <div
                        className={`
                            absolute ml-1 bg-white border border-secondary rounded-lg shadow-sm z-100 
                            max-h-[400px] overflow-x-hidden overflow-y-auto
                            ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}
                        `}
                    >
                        {options.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`mx-1.5 ${index !== options.length - 1 ? 'border-b border-secondary' : ''
                                    }`}
                            >
                                <div
                                    title={option.label}
                                    className="my-1 px-3 py-[3px] rounded-[9px] text-[0.79rem] 
                                               font-normal tracking-[-0.03rem] cursor-pointer 
                                               hover:bg-dropdown-hover-bg whitespace-nowrap"
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