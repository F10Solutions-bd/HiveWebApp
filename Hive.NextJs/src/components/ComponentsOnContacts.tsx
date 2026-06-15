'use client';

import { IconType } from 'react-icons';

interface TabButtonProps {
    label: string;
    count?: number;
    active: boolean;
    Icon: IconType;
    onClick: () => void;
}

export default function TabButton({
    label,
    count,
    active,
    Icon,
    onClick,
}: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            style={
                active
                    ? {
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-bg)",
                        fontWeight: '500',
                        fontSize: '12px',
                        letterSpacing: 0.5,
                    }
                    : {
                        backgroundColor: 'var(--color-primary-light)', // inactive background
                        fontWeight: 500,
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                    }
            }
            className={`flex items-center gap-1 px-4 py-2 transition-colors duration-200
             ${!active ? 'hover:bg-blue-700' : ''}
         `}
        >
            <Icon />
            {label} {count !== undefined && `(${count})`}
        </button>
    );
}
