"use client";

import { useCallback, useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { createApiClient } from '@/services/apiClient';
import DynamicHeaderTitle from "@/components/features/contact-and-vendors-details/DynamicHeaderTitle";

/* ===== Interface ===== */
interface ActiveUser {
    userId: number;
    systemId: number;
    userName: string;
    systemName: string;
    loginAccessTime: string;
    token: string;
}

export default function ActiveUsersPage() {
    const api = createApiClient();

    const [users, setUsers] = useState<ActiveUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const fetchActiveUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get<ActiveUser[]>("/users/active-users");
            setUsers(res.data ?? []);
        } catch (error) {
            console.error("Failed to load active users", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActiveUsers();
    }, [fetchActiveUsers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, pageSize]);

    const filteredUsers = users.filter((u) =>
        u.userName.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const tableHeaderCell =
        "px-6 py-3 text-left text-sm font-semibold uppercase bg-primary text-white";

    /* ===== Copy Token Function ===== */
    const copyToken = (token: string) => {
        navigator.clipboard.writeText(token).then(() => {
            alert("Token copied to clipboard!");
        });
    };

    return (
        <div className="min-h-screen bg-segment">
            {/* <DynamicHeaderTitle title="Active Users" /> */}
            <div className="bg-segment rounded-lg">
                <div className="flex flex-wrap gap-4 items-center p-2.5">
                    <div className="flex-1 min-w-[300px]">
                        <h1 className="text-3xl font-bold text-gray-900 p-5">Active Users</h1>
                    </div>
                </div>
            </div>
            <div className="pt-6 px-6">
                {/* Search */}
                <div className="bg-white rounded-lg p-4 mb-4 flex justify-end">
                    <div className="w-full max-w-xs rounded-2xl">
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-3 rounded-md p-5
                            focus:outline-none focus:ring-2 focus:ring-[#008ca8]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="max-h-[600px] overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr>
                                    <th className={tableHeaderCell}>User ID</th>
                                    <th className={tableHeaderCell}>Full Name</th>
                                    <th className={tableHeaderCell}>System ID</th>
                                    <th className={tableHeaderCell}>System Name</th>
                                    <th className={tableHeaderCell}>Login Time</th>
                                    <th className={tableHeaderCell}>Token</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center">
                                            <div className="flex justify-center">
                                                <ThreeDot color="#0085ad" size="medium" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No active users found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((u) => (
                                        <tr
                                            key={u.token}
                                            className="hover:bg-gray-50 even:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-3">{u.userId}</td>
                                            <td className="px-6 py-3">{u.userName}</td>
                                            <td className="px-6 py-3">{u.systemId}</td>
                                            <td className="px-6 py-3">{u.systemName}</td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {new Date(u.loginAccessTime).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3 max-w-[250px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate" title={u.token}>
                                                        {u.token}
                                                    </span>
                                                    <button
                                                        onClick={() => copyToken(u.token)}
                                                        className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                                    >
                                                        Copy
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && filteredUsers.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-secondary">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Rows per page:</span>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => setPageSize(Number(e.target.value))}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className="px-4 py-1.5 rounded bg-primary text-white text-sm font-medium hover:bg-[#00718a] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                                >
                                    Prev
                                </button>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className="px-4 py-1.5 rounded bg-primary text-white text-sm font-medium hover:bg-[#00718a] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
