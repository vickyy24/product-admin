export default function Pagination({
    page,
    totalPages,
    pageSize,
    total,
    pageSizes,
    onPageChange,
    onPageSizeChange,
}) {
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    const visiblePages = Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-slate-500">
                    Showing {start}-{end} of {total}
                </p>
                <label className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Rows</span>
                    <select
                        className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand"
                        value={pageSize}
                        onChange={onPageSizeChange}
                    >
                        {pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="flex max-w-full flex-wrap items-center gap-1 sm:justify-end">
                <button
                    className="shrink-0 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    type="button"
                >
                    Previous
                </button>
                {visiblePages.map((pageNumber) => (
                    <button
                        className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                            pageNumber === page
                                ? 'shrink-0 bg-brand text-white'
                                : 'shrink-0 border bg-white text-slate-600'
                        }`}
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        type="button"
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    className="shrink-0 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    type="button"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
