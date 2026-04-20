'use client';

import { useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

interface Column<T> {
    key: keyof T;
    label: string;
}

interface CommonTableProps<T extends { id: number }> {
    title: string;
    addButtonTitle: string;
    columns: Column<T>[];
    data: T[];
    onAdd: () => void;
    onEdit: (row: T) => void;
    onDelete: (id: number) => void;
}

export default function CommonTable<T extends { id: number }>({
    title,
    addButtonTitle,
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
}: CommonTableProps<T>) {
    const [searchText, setSearchText] = useState('');

    // Filtered rows based on search
    const filteredData = useMemo(() => {
        if (!searchText) return data;

        return data.filter((row) =>
            columns.some((col) =>
                String(row[col.key])
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            )
        );
    }, [searchText, data, columns]);

    return (
        <div>
            {/* Header with Add button and Search */}
            <div className="flex justify-between items-center mb-2.5 gap-2 flex-wrap">
                <div className="text-2xl font-semibold text-black/70">
                    {title}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="search"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="!h-[38px]"
                    />
                    <button
                        onClick={onAdd}
                        className="flex btn-blue items-center gap-2 text-white px-4 h-10 rounded-lg transition"
                    >
                        <FiPlus /> {addButtonTitle}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead className="header-bg text-white">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="px-3 border-b"
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className="p-2.5 border-b text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-[var(--table-row-bg)]"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className="p-3 border-b"
                                        >
                                            {String(row[col.key])}
                                        </td>
                                    ))}
                                    <td className="p-3 border-b text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FiEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(row.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="text-center py-6 text-gray-500"
                                >
                                    Loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
