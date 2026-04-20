'use client';

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

interface TwoColProps {
    label: string;
    value?: string | number | null;
    showBorder?: boolean;
}

interface SectionPropsWithButton {
    title: string;
    buttonName: string;
    onClick: () => void;
    icon?: React.ElementType;
    children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
    return (
        <div className="bg-white shadow rounded">
            <h2 className="bg-cyan-700 text-white px-4 py-2 font-semibold">
                {title}
            </h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

export function TwoCol({ label, value, showBorder = true }: TwoColProps) {
    return (
        <div
            className={`flex justify-start gap-4 pb-1 ${showBorder ? 'border-b' : ''}`}
        >
            <span className="font-bold text-cyan-700">{label}:</span>
            <span className="text-black font-semibold">{value || 'None'}</span>
        </div>
    );
}

export function SectionWithButton({
    title,
    children,
    buttonName,
    onClick,
    icon: Icon,
}: SectionPropsWithButton) {
    return (
        <div className="bg-white shadow rounded">
            <div className="bg-teal-600 flex justify-between items-center px-4 py-2">
                <h2 className="text-white px-1 py-2 font-semibold">{title}</h2>
                <button
                    onClick={() => onClick}
                    className="bg-gray-700 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow flex item-center gap-2"
                >
                    {Icon && <Icon className="text-white text-lg" />}
                    {buttonName}
                </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}
