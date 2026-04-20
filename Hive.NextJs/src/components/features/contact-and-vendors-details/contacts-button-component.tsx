'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface DynamicButtonProps {
    text: string;
    icon?: React.ReactNode;
    bgColor?: string;
    hoverColor?: string;
    textColor?: string;
    onClick?: () => void;
}

export default function VendorsAndDetailsDynamicButton({
    text,
    icon,
    bgColor = 'bg-cyan-600',
    hoverColor = 'hover:bg-cyan-700',
    textColor = 'text-white',
    onClick,
}: DynamicButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={onClick ?? (() => router.back())}
            className={`${bgColor} ${hoverColor} ${textColor} font-medium px-4 py-2 rounded shadow flex items-center gap-2`}
        >
            {icon}
            {text}
        </button>
    );
}
