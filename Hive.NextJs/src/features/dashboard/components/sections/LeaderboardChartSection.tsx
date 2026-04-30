import { DynamicBarChart } from "@/components/ui/Dashboard/DynamicBarChart";
import { LeaderboardItem } from "../../types";

type Props = {
    data: {
        sales: LeaderboardItem[];
        operations: LeaderboardItem[];
        offices: LeaderboardItem[];
    },
    loading?: {
        sales: boolean;
        operations: boolean;
        offices: boolean;
    },
    openModal: (
        type: "employee" | "office" | "customer",
        id: number,
        e: React.MouseEvent<HTMLElement>
    ) => void;
};

export const LeaderboardChartSection = ({ data, loading, openModal }: Props) => {
    const handleEmployeeClick = (
        id: number,
        e: React.MouseEvent<HTMLElement>
    ) => {
        openModal("employee", id, e);
    };

    const handleOfficeClick = (
        id: number,
        e: React.MouseEvent<HTMLElement>
    ) => {
        openModal("office", id, e);
    };

    return (
        <div className="p-2.5 rounded-lg bg-segment-bg mb-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                <div className="relative">
                    <DynamicBarChart
                        title="Sales Leaderboard"
                        data={data.sales}
                        loading={loading?.sales}
                        nameKey="fullName"
                        containerHeight={250}
                        onNameClick={handleEmployeeClick}
                        bars={[
                            {
                                key: 'revenue',
                                label: 'Revenue',
                                color: 'var(--color-primary)',
                            },
                            {
                                key: 'grossMargin',
                                label: 'Gross Margin ($)',
                                color: 'var(--color-secondary-hover)',
                            },
                        ]}
                    />
                </div>
                <div className="relative">
                    <DynamicBarChart
                        title="Operations Leaderboard"
                        data={data.operations}
                        loading={loading?.operations}
                        nameKey="fullName"
                        containerHeight={250}
                        onNameClick={handleEmployeeClick}
                        bars={[
                            {
                                key: 'loadCount',
                                label: 'Load ct.',
                                color: 'var(--color-primary)',
                            },
                        ]}
                    />
                </div>
                <div className="relative">
                    <DynamicBarChart
                        title="Office  Leaderboard"
                        data={data.offices}
                        loading={loading?.offices}
                        nameKey="fullName"
                        containerHeight={250}
                        onNameClick={handleOfficeClick}
                        bars={[
                            {
                                key: 'revenue',
                                label: 'Revenue',
                                color: 'var(--color-primary)',
                            },
                            {
                                key: 'grossMargin',
                                label: 'Gross Margin ($)',
                                color: 'var(--color-secondary-hover)',
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};