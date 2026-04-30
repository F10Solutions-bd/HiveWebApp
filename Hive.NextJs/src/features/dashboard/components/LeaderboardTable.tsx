// Leaderboard Table Component
// css design

import Select from '@/components/modal/Select';
import { LeaderboardItem } from '../types';
import { SelectOption } from '@/types/common';

export const LeaderboardTable: React.FC<{
    data: LeaderboardItem[];
    title: string;
    dateRange: string;
    onDateRangeChange: (value: string) => void;
    dateRangeOptions: SelectOption[];
    onNameClick?: (id: number, e: React.MouseEvent<HTMLSpanElement>) => void;
    label: string;
    containerHeight?: number;
    loading?: boolean;
}> = ({
    data,
    title,
    dateRange,
    onDateRangeChange,
    dateRangeOptions,
    onNameClick,
    label,
    containerHeight = 350,
    loading,
}) => {

        const isEmpty = !data.length;

        return (
            <div className="bg-bg rounded-lg p-2 flex flex-col" style={{ height: `${containerHeight}px` }}>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center h-8">
                    <div />
                    <h2 className="text-xl font-semibold text-fg text-center truncate">
                        {title}
                    </h2>
                    <div className="flex justify-end">
                        <Select
                            options={dateRangeOptions}
                            value={dateRange}
                            placeholder="Select Date Filter"
                            className="border-none !py-4 !rounded-md !text-sm !w-[100px] xl:!w-[110px] 2xl:!w-[120px] !bg-secondary"
                            dropdownWidth=""
                            onSelect={(val) => onDateRangeChange(val)}
                        />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full datatable">
                        <thead className="sticky bg-bg  top-0 z-10">
                            <tr className="">
                                <th className='!py-[3px]'> <span>Rank</span></th>
                                <th className="text-left  !py-[3px] text-sm font-sm text-fg">
                                    <span>
                                        {label}
                                    </span>
                                </th>
                                <th className='!py-[3px]'><span>Load Ct.</span></th>
                                <th className='!py-[3px]'><span>Revenue</span></th>
                                <th className='!py-[3px]'><span>Gross Margin ($)</span></th>
                                <th className='!py-[3px]'><span>Gross Margin (%)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                    <tr>
                                        <td colSpan={6} className="!text-center !py-15 text-sm text-fg">
                                            Loading...
                                        </td>
                                    </tr>
                            ) : isEmpty ? (
                                // Empty state
                                <tr>
                                    <td colSpan={6} className="!text-center !py-15 text-sm text-fg">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                // Data rows
                                data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={index === 5 ? "border-t border-border" : ""}
                                    >
                                        <td className="!text-center !py-[3px]">{item.rank}.</td>

                                        <td className="text-sm !py-[3px]">
                                            {onNameClick ? (
                                                <button
                                                    onClick={(e) => onNameClick(item.id, e)}
                                                    className="text-primary underline cursor-pointer"
                                                >
                                                    {item.fullName}
                                                </button>
                                            ) : (
                                                <span className="text-primary underline cursor-pointer">
                                                    {item.fullName}
                                                </span>
                                            )}
                                        </td>

                                        <td className="!text-center !py-[3px]">{item.loadCount}</td>

                                        <td className="!text-center !py-[3px]">
                                            ${item.revenue.toFixed(2)}
                                        </td>

                                        <td className="!text-center !py-[3px]">
                                            ${item.grossMargin.toFixed(2)}
                                        </td>

                                        <td className="!text-center !py-[3px]">
                                            {item.grossMarginPercent.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };