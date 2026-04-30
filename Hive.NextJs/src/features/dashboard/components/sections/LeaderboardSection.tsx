import { LeaderboardTable } from "@/features/dashboard/components/LeaderboardTable";
import { SelectOption } from "@/types/common";
import { LeaderboardItem } from "../../types";

type Props = {
    dropdowns: { dateRange: SelectOption[] };
    salesDateRange: string;
    opsDateRange: string;
    officeDateRange: string;
    onSalesDateChange: (v: string) => void;
    onOpsDateChange: (v: string) => void;
    onOfficeDateChange: (v: string) => void;
    openModal: (
        type: "employee" | "office" | "customer",
        id: number,
        e: React.MouseEvent<HTMLElement>
    ) => void;

    salesData: LeaderboardItem[];
    opsData: LeaderboardItem[];
    officeData: LeaderboardItem[];
    loading: {
        sales: boolean;
        operations: boolean;
        offices: boolean;
    };
};

export const LeaderboardSection = ({
    dropdowns,
    salesDateRange,
    opsDateRange,
    officeDateRange,
    onSalesDateChange,
    onOpsDateChange,
    onOfficeDateChange,
    openModal,

    salesData,
    opsData,
    officeData,
    loading,
}: Props) => {

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

                <LeaderboardTable
                    data={salesData}
                    title="Sales Leaderboard"
                    label="Sales Rep"
                    dateRange={salesDateRange}
                    onDateRangeChange={onSalesDateChange}
                    dateRangeOptions={dropdowns.dateRange}
                    onNameClick={handleEmployeeClick}
                    containerHeight={220}
                    loading={loading.sales}
                />

                <LeaderboardTable
                    data={opsData}
                    title="Operations Leaderboard"
                    label="Ops Rep"
                    dateRange={opsDateRange}
                    onDateRangeChange={onOpsDateChange}
                    dateRangeOptions={dropdowns.dateRange}
                    onNameClick={handleEmployeeClick}
                    containerHeight={220}
                    loading={loading.operations}
                />

                <LeaderboardTable
                    data={officeData}
                    title="Office Leaderboard"
                    label="Office"
                    dateRange={officeDateRange}
                    onDateRangeChange={onOfficeDateChange}
                    dateRangeOptions={dropdowns.dateRange}
                    onNameClick={handleOfficeClick}
                    containerHeight={220}
                    loading={loading.offices}
                />
            </div>
        </div>
    );
};