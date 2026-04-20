'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

interface DatePickerProps {
    value?: Date | null;
    parentClassName?: string;
    className?: string;
    childClassName?: string;
    placeholder?: string;
    onChange?: (date: Date | null) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DatePicker: React.FC<DatePickerProps> = ({
    value = null,
    parentClassName = '',
    className = '',
    childClassName = '',
    placeholder = 'Select',
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [currentMonth, setCurrentMonth] = useState<Date>(value ?? new Date());
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    // CLOSE ON OUTSIDE CLICK
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const today = new Date();

    const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );

    const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    );

    const startDay = startOfMonth.getDay();
    const totalDays = endOfMonth.getDate();

    const generateCalendarDays = () => {
        const days: (Date | null)[] = [];

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= totalDays; i++) {
            days.push(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
            );
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    // MM/DD/YYYY formatter
    const formatDate = (date: Date | null) => {
        if (!date) return placeholder;

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    const isSameDay = (a: Date | null, b: Date | null) =>
        a &&
        b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const handleSelect = (date: Date) => {
        setSelectedDate(date);
        onChange?.(date);
        setIsOpen(false);
    };

    const handleApply = () => {
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className={`relative inline-block ${parentClassName}`}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-2 ml-[4px] w-[80px] sm:w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px] 2xl:w-[180px] cursor-pointer flex items-center justify-between border rounded-[2px] border-border-field shadow-sm bg-bg ${className}`}
            >
                <span
                    className={`${!selectedDate
                        ? 'text-secondary'
                        : 'text-black'
                        }`}
                >
                    {formatDate(selectedDate)}
                </span>

                <FiCalendar className="text-primary w-4 h-4" />
            </button>

            {/* Popover */}
            {isOpen && (
                <div className={`absolute right-0 mt-2 w-72 bg-white rounded-xl shadow z-70 ${childClassName}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(
                                        currentMonth.getFullYear(),
                                        currentMonth.getMonth() - 1,
                                        1
                                    )
                                )
                            }
                        >
                            <FiChevronLeft className="w-5 h-5 text-secondary-dark" />
                        </button>

                        <h2 className="font-semibold text-primary">
                            {currentMonth.toLocaleString('default', {
                                month: 'short',
                                year: 'numeric',
                            })}
                        </h2>

                        <button
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(
                                        currentMonth.getFullYear(),
                                        currentMonth.getMonth() + 1,
                                        1
                                    )
                                )
                            }
                        >
                            <FiChevronRight className="w-5 h-5 text-secondary-dark" />
                        </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 text-center text-[11px] text-secondary-dark px-2">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-2 px-2 py-2">
                        {calendarDays.map((day, index) => (
                            <div key={index} className="flex justify-center">
                                {day ? (
                                    <button
                                        onClick={() => handleSelect(day)}
                                        className={`w-9 h-8 rounded-lg flex items-center justify-center text-sm
                      ${isSameDay(day, selectedDate)
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-primary-light'
                                            }
                      ${isSameDay(day, today)
                                                ? 'border border-primary'
                                                : ''
                                            }
                    `}
                                    >
                                        {day.getDate()}
                                    </button>
                                ) : (
                                    <div className="w-9 h-8" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="grid grid-cols-1 gap-3 w-full p-4">
                        <button
                            onClick={handleApply}
                            className="!py-1 !rounded-lg !w-full text-[11px] btn-primary"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
