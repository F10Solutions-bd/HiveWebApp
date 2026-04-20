// Leaderboard Table Component
// css design

import Select from '@/components/modal/Select';
import { LeaderboardItem, OfficeLeaderboardItem } from '../types';
import { SelectOption } from '@/types/common';

export const LeaderboardTable: React.FC<{
    data: LeaderboardItem[] | OfficeLeaderboardItem[];
    title: string;
    dateRange: string;
    onDateRangeChange: (value: string) => void;
    dateRangeOptions: SelectOption[];
    onNameClick?: (id: number, e: React.MouseEvent<HTMLSpanElement>) => void;
    isOffice?: boolean;
    containerHeight?: number;
}> = ({
    data,
    title,
    dateRange,
    onDateRangeChange,
    dateRangeOptions,
    onNameClick,
    isOffice = false,
    containerHeight = 350,
}) => {
        return (
            <div className="bg-bg rounded-lg p-2 flex flex-col" style={{ height: `${containerHeight}px` }}>
                <div className="relative flex items-center justify-end h-8">
                    <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-fg w-max">
                        {title}
                    </h2>
                    <div className="">
                        <Select
                            options={dateRangeOptions}
                            value={dateRange}
                            placeholder="Select Date Filter"
                            className="border-none !py-4 !rounded-md !text-sm !w-[100px] xl:!w-[110px] 2xl:!w-[130px] !bg-secondary"
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
                                        {isOffice ? 'Office' : title.includes('Sales') ? 'Sales Rep' : 'Ops Rep'}
                                    </span>

                                </th>
                                <th className='!py-[3px]'><span>Load Ct.</span></th>
                                <th className='!py-[3px]'><span>Revenue</span></th>
                                <th className='!py-[3px]'><span>Gross Margin ($)</span></th>
                                <th className='!py-[3px]'><span>Gross Margin (%)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`${index === 5 ? "border-t border-border" : ""}`}
                                    >
                                        <td className="!text-center !py-[3px]">{item.rank}.</td>
                                        <td className=" text-sm !py-[3px]">
                                            {onNameClick && !isOffice ? (
                                                <button
                                                    onClick={(e) =>
                                                        onNameClick((item as LeaderboardItem).id, e)
                                                    }
                                                    className="text-primary underline cursor-pointer  font-sm"
                                                >
                                                    {(item as LeaderboardItem).fullName}
                                                </button>
                                            ) : (
                                                <span className="text-primary underline font-sm cursor-pointer ">
                                                    {isOffice
                                                        ? (
                                                            item as OfficeLeaderboardItem
                                                        ).fullName
                                                        : (item as LeaderboardItem)
                                                            .fullName}
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
                            ) : (
                                <tr>
                                    <td colSpan={6} className="!text-center !py-15">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
