interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'yellow' | 'purple';
}

export default function StatsCard({
    title,
    value,
    icon,
    trend,
    color = 'blue',
}: StatsCardProps) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p
                            className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {trend.isPositive ? '?' : '?'} {trend.value}
                        </p>
                    )}
                </div>
                <div className={`p-4 rounded-full ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
