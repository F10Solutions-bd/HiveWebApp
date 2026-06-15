/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { createApiClient } from '@/services/apiClient';
import { FiSearch, FiTrash2, FiEye, FiHelpCircle, FiX } from 'react-icons/fi';
import { ThreeDot } from 'react-loading-indicators';
import { toDisplayDateString } from '@/utils/dateHelper';
import { ODataQueryBuilder } from '@/utils/oDataQueryBuilder';
import toast from 'react-hot-toast';
import { DatePicker } from '@/components/modal/DatePicker';
import Select from '@/components/modal/Select';
import { SelectOption } from '@/types/common';

interface LogListItemDto {
    Id: number;
    LogLevel: string;
    ShortMessage: string;
    FullMessage: string;
    CreatedOn: string;
    SystemId?: number;
    SystemName?: string;
    UserId?: number;
    FullName?: string;
    IpAddress?: string;
    PageUrl?: string;
    ReferrerUrl?: string;
}

interface LogDetailsDto {
    id: number;
    logLevel: string;
    shortMessage: string;
    fullMessage: string;
    createdOn: string;
    systemId?: number;
    systemName?: string;
    userId?: number;
    fullName?: string;
    ipAddress?: string;
    pageUrl?: string;
    referrerUrl?: string;
}




// interface LogItemDto {
//     Id: number;
//     LogLevel: string;
//     ShortMessage: string;
//     FullMessage: string;
//     CreatedOn: string;
//     SystemId?: number;
//     SystemName?: string;
//     ProjectId?: number;
//     ProjectName?: string;
//     UserId?: number;
//     FullName?: string;
//     IpAddress?: string;
//     PageUrl?: string;
//     ReferrerUrl?: string;
// }
interface LogSearchDto {
    CreatedFrom?: string;
    CreatedTo?: string;
    Level?: string;
    Message?: string;
    PageIndex: number;
    PageSize: number;
    SortColumn?: string;
    SortDirection?: string;
}

// const logLevels = ['All', 'Debug', 'Information', 'Warning', 'Error', 'Fatal'];
const logLevels: SelectOption[] = [
    { label: 'All', value: 'All' },
    { label: 'Debug', value: 'Debug' },
    { label: 'Information', value: 'Information' },
    { label: 'Warning', value: 'Warning' },
    { label: 'Error', value: 'Error' },
    { label: 'Fatal', value: 'Fatal' },
];

const LogViewer: React.FC = () => {
    const api = createApiClient();

    // -----------------------------
    // State
    // -----------------------------
    const [logs, setLogs] = useState<LogListItemDto[]>([]);
    const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
    const [selectedLog, setSelectedLog] = useState<LogDetailsDto | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchDto, setSearchDto] = useState<LogSearchDto>({
        CreatedFrom: '',
        CreatedTo: '',
        Level: 'All',
        Message: '',
        PageIndex: 1,
        PageSize: 10,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchExpanded, setSearchExpanded] = useState(false);

    // Pagination calculation
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const currentLogs = logs;

    // -----------------------------
    // Build OData query based on search DTO
    // -----------------------------
    const buildODataQuery = async (
        dto: LogSearchDto,
        currentPage: number,
        itemPerpage: number
    ) => {
        const builder = new ODataQueryBuilder();

        /// builder.select(["Id", "CreatedOn","LogLevel"]); sample how can filter specefic column

        if (dto.CreatedFrom) {
            builder.filter({
                field: 'CreatedOn',
                operator: 'ge',
                value: dto.CreatedFrom,
            });
        }

        if (dto.CreatedTo) {
            builder.filter({
                field: 'CreatedOn',
                operator: 'le',
                value: dto.CreatedTo,
            });
        }

        if (dto.Level && dto.Level !== 'All') {
            builder.filter({
                field: 'LogLevel',
                operator: 'eq',
                value: dto.Level,
            });
        }

        if (dto.Message) {
            builder.filter({
                field: 'ShortMessage',
                operator: 'contains',
                value: dto.Message,
            });
        }

        if (dto.SortColumn) {
            builder.orderBy({ field: 'CreatedOn', direction: 'desc' });
        }

        builder.paginate(currentPage, itemPerpage);

        builder.count(true);

        return builder.build();
    };

    // -----------------------------
    // Effects
    // -----------------------------
    useEffect(() => {
        handleSearch();
    }, [currentPage, itemsPerPage]);

    // -----------------------------
    // Search / Filter logs
    // -----------------------------
    const handleSearch = async () => {
        try {
            setLoading(true);

            const filterQuery = await buildODataQuery(
                searchDto,
                currentPage,
                itemsPerPage
            );

            const filterResult = await api.getRaw(
                `/odata/LogItems?${filterQuery}`
            );

            setLogs(filterResult.data.value ?? []);
            setTotalCount(filterResult.data['@odata.count'] ?? 0);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Selection handlers
    // -----------------------------

    // Select / deselect all logs
    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const ids = currentLogs.map((log) => log.Id);
            setSelectedLogs(ids);

            setTimeout(() => {
                console.log('selectedLog (after update)', ids);
            }, 0);
        } else {
            setSelectedLogs([]);
        }
    };

    // Select / deselect individual log
    const handleSelectLog = (logId: number) => {
        if (selectedLogs.includes(logId)) {
            setSelectedLogs(selectedLogs.filter((id) => id !== logId));
        } else {
            setSelectedLogs([...selectedLogs, logId]);
        }
    };

    // -----------------------------
    // Delete / Clear logs
    // -----------------------------

    // Delete selected logs
    const handleDeleteSelected = async () => {
        if (selectedLogs.length === 0) return;

        try {
            await api.post<void>('/logs/delete-selected', selectedLogs);
            toast.success("Log deleted successfully.");
            const newLogs = logs.filter(
                (log) => !selectedLogs.includes(log.Id)
            );

            setLogs(newLogs);
            const deletedCount = selectedLogs.length;
            setTotalCount((prev) => prev - deletedCount);
            setSelectedLogs([]);

            // Adjust page if needed
            if (newLogs.length === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                handleSearch();
            }
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    // Clear all logs
    const handleClearLog = async () => {
        if (window.confirm('Are you sure you want to clear all logs?')) {
            try {
                //const response = await api.delete("/logs/clear");
            } catch { }
            setLogs([]);
            setSelectedLogs([]);
        }
    };

    // View log details
    const handleViewLog = async (id: number) => {
        console.log("inside handle view : ", id);
        if (id <= 0) return;

        // try {
            const res = await api.get<LogDetailsDto>(`/logs/${id}`);

            // if (res.isSuccess && res.data) {
                console.log("Log details inside : ", res);
                setSelectedLog(res.data);
                setShowModal(true);
        //     }
        // } catch { }
    };
    console.log("logs", logs);
    console.log("selected log : ", selectedLog);

    // Get log level badge color
    const getLogLevelColor = (level: any) => {
        switch (level) {
            case 'Error':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Information':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Debug':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Fatal':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // === Class name constants ===
    const headerBtnClass = 'text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors';
    const searchLabel = 'flex items-center justify-end text-sm font-medium text-gray-700 w-[25%]';
    // const inputBase = 'w-[60%] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
    const tooltipIcon = 'text-gray-400 h-5 w-5 cursor-pointer';
    const tooltipBox = 'absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded-md px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10';
    const tableHeaderCell = 'py-3 text-left text-lg font-medium text-gray-500 tracking-wider';

    //if(loader) return <div><p> Loading</p></div>

    const DetailRow = ({ label, value }: { label: string; value: any }) => (
        <div className="flex justify-between border-b py-2">
            <span className="font-semibold text-gray-700">{label}:</span>
            <span className="text-gray-800 text-right ml-4 max-w-[65%] break-words">
                {value ?? '-'}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#008ca8] px-6 py-2 text-white ">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Log</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDeleteSelected}
                            disabled={selectedLogs.length === 0}
                            className={` ${headerBtnClass} bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed`}
                        >
                            <FiTrash2 size={16} />
                            Delete selected
                        </button>
                        <button
                            onClick={handleClearLog}
                            className={` ${headerBtnClass} bg-red-700 hover:bg-red-800 `}
                        >
                            <FiTrash2 size={16} />
                            Clear log
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white mx-6 mt-6 rounded-lg bg-segment-bg">
                <button
                    onClick={() => setSearchExpanded(!searchExpanded)}
                    className={`w-full px-6 py-4 flex items-center justify-between hover:bg-secondary bg-segment-bg ${searchExpanded ? 'rounded-t-lg' : 'rounded-lg'}`}
                >
                    <div className="flex items-center gap-2">
                        <FiSearch size={20} />
                        <span className="font-semibold">Search</span>
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${searchExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {searchExpanded && (
                    <div className="px-6 pb-3 border border-secondary rounded-b-lg">
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            {/* Created From */}
                            <div className="flex justify-center items-center gap-3">
                                <label className={`${searchLabel}`}>
                                    Created from
                                    <div className="relative group ml-1">
                                        <FiHelpCircle className={tooltipIcon} />
                                        <span className={tooltipBox}>
                                            To the log create search date
                                        </span>
                                    </div>
                                </label>
                                <DatePicker
                                    placeholder="Start date"
                                    onChange={(date) =>
                                        setSearchDto({
                                            ...searchDto,
                                            CreatedFrom: date?.toDateString(),
                                        })
                                    }
                                />
                            </div>

                            {/* Message */}
                            <div className="flex items-center gap-3">
                                <label className={`${searchLabel}`}>
                                    Message
                                    <div className="relative group ml-1">
                                        <FiHelpCircle className={tooltipIcon} />
                                        <span className={tooltipBox}>
                                            Search by log message text
                                        </span>
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    className="w-full w-[80px] sm:w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px] 2xl:w-[180px] px-2 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-1 focus:ring-[#008ca8]"
                                    placeholder="Message"
                                    value={searchDto.Message}
                                    onChange={(e) =>
                                        setSearchDto({
                                            ...searchDto,
                                            Message: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Created To */}
                            <div className="flex justify-center items-center gap-3">
                                <label className={`${searchLabel}`}>
                                    Created to
                                    <div className="relative group ml-1">
                                        <FiHelpCircle className={tooltipIcon} />
                                        <span className={tooltipBox}>
                                            To the log end search date
                                        </span>
                                    </div>
                                </label>
                                <DatePicker
                                    placeholder="End date"
                                    onChange={(date) => setSearchDto({
                                        ...searchDto,
                                        CreatedTo: date?.toDateString(),
                                    })}
                                />
                            </div>

                            {/* Log Level */}
                            <div className="flex items-center gap-3">
                                <label className={`${searchLabel}`}>
                                    Log level
                                    <div className="relative group ml-1">
                                        <FiHelpCircle className={tooltipIcon} />
                                        <span className={tooltipBox}>
                                            Select the log severity level
                                        </span>
                                    </div>
                                </label>
                                <Select
                                    className="w-full"
                                    options={logLevels}
                                    value={searchDto.Level}
                                    onSelect={(value) => setSearchDto({
                                        ...searchDto,
                                        Level: value,
                                    })}
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex justify-center">
                            <button
                                onClick={() => {
                                    if (currentPage === 1) {
                                        handleSearch();
                                    } else {
                                        setCurrentPage(1);
                                    }
                                }}
                                className="bg-[#008ca8] hover:bg-sky-700 px-5 py-2  text-white rounded-md flex items-center gap-2 transition-colors"
                            >
                                <FiSearch size={16} />
                                Search
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className="mx-6 mt-6 rounded-lg overflow-hidden bg-segment-bg p-2">
                <div className="bg-white rounded-md">
                    <div className="overflow-x-auto py-2">
                        <table className="bg-white w-full rounded-lg">
                            <thead className="border-b border-secondary">
                                <tr>
                                    <th className="text-left !pl-5">
                                        <input
                                            type="checkbox"
                                            checked={
                                                currentLogs.length > 0 &&
                                                selectedLogs.length === currentLogs.length
                                            }
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300 m-0 !w-auto"
                                        />
                                    </th>
                                    <th className={tableHeaderCell}>Log level</th>
                                    <th className={tableHeaderCell}>
                                        Short message
                                    </th>
                                    <th className={tableHeaderCell}>User</th>
                                    <th className={tableHeaderCell}>System</th>
                                    <th className={tableHeaderCell}>Created on</th>
                                    <th className={tableHeaderCell}>View</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-10 text-center"
                                        >
                                            <div className="flex justify-center items-center">
                                                <ThreeDot
                                                    color="#0085ad"
                                                    size="medium"
                                                    text=""
                                                    textColor=""
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentLogs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No data available in table
                                        </td>
                                    </tr>
                                ) : (
                                    currentLogs.map((log) => (
                                        <tr
                                            key={log.Id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="py-3 pl-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLogs.includes(
                                                        log.Id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectLog(log.Id)
                                                    }
                                                    className="rounded border-gray-300 flex items-center !w-auto"
                                                />
                                            </td>
                                            <td className="">
                                                <span
                                                    className={`p-2 rounded-full text-sm font-medium border ${getLogLevelColor(log.LogLevel)}`}
                                                >
                                                    {log.LogLevel}
                                                </span>
                                            </td>
                                            <td className="text-sm text-gray-900">
                                                {log.ShortMessage}
                                            </td>
                                            <td className="text-sm text-gray-900">
                                                {log.FullName}
                                            </td>
                                            <td className="text-sm text-gray-900">
                                                {log.SystemName}
                                            </td>
                                            <td className="text-sm text-gray-500">
                                                {toDisplayDateString(log.CreatedOn)}
                                            </td>
                                            <td className="">
                                                <button
                                                    onClick={() =>
                                                        handleViewLog(log.Id)
                                                    }
                                                    className="text-[#008ca8] hover:text-blue-800 flex items-center gap-1 text-sm"
                                                >
                                                    <FiEye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalCount}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                        }}
                        onItemsPerPageChange={(count) => {
                            setItemsPerPage(count);
                            setCurrentPage(1);
                        }}
                        pageSizeOptions={[10, 15, 20, 50]}
                    />
                </div>
            </div>

            {/*Modal*/}
            {showModal && selectedLog && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50  flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            <FiX size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Log Details (ID: {selectedLog.id})
                        </h2>

                        <div className="space-y-3">
                            <DetailRow
                                label="Log Level"
                                value={selectedLog.logLevel}
                            />
                            <DetailRow
                                label="Short Message"
                                value={selectedLog.shortMessage}
                            />
                            <DetailRow
                                label="Full Message"
                                value={selectedLog.fullMessage}
                            />
                            <DetailRow
                                label="Full Message"
                                value={selectedLog.fullMessage}
                            />
                            <DetailRow
                                label="IP Address"
                                value={selectedLog.ipAddress}
                            />
                            <DetailRow
                                label="Page URL"
                                value={selectedLog.pageUrl}
                            />
                            <DetailRow
                                label="Referrer URL"
                                value={selectedLog.referrerUrl}
                            />
                            <DetailRow
                                label="System"
                                value={selectedLog.systemName}
                            />
                            <DetailRow
                                label="SystemId"
                                value={selectedLog.systemId}
                            />
                            <DetailRow
                                label="User"
                                value={selectedLog.fullName}
                            />
                            <DetailRow
                                label="UserId"
                                value={selectedLog.userId}
                            />
                            <DetailRow
                                label="Created On"
                                value={new Date(
                                    selectedLog.createdOn
                                ).toLocaleString()}
                            />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-[#008ca8] text-white rounded-md hover:bg-sky-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default LogViewer;
