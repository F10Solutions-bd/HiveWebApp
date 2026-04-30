import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
    pageSizeOptions = [10, 15, 25, 50],
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                        (page) =>
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                    )
                    .map((page, i, arr) => {
                        const prevPage = arr[i - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        return (
                            <React.Fragment key={page}>
                                {showEllipsis && (
                                    <span className="px-2 text-gray-400">
                                        ...
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        if (currentPage !== page) {
                                            onPageChange(page);
                                        }
                                    }}
                                    className={`px-3 py-1 border rounded-md ${currentPage === page
                                        ? 'bg-[#008ca8] text-white'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        );
                    })}

                <button
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages || totalItems === 0}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            <div className="flex flex-1 justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) =>
                            onItemsPerPageChange(Number(e.target.value))
                        }
                        className="px-2  w-16"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-600">items</span>
                </div>
            </div>

            <div>
                <span className="text-sm text-gray-600">
                    {totalItems === 0
                        ? '0 items'
                        : `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems} items`}
                </span>
            </div>
        </div>
    );
};

export default Pagination;
