export default function Pagination({ page, totalPages, pageSize, total, onPageChange }) {
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    const visiblePages = Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
                Showing {start}-{end} of {total}
            </p>
            <div className="flex items-center gap-1">
                <button
                    className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                                ? 'bg-brand text-white'
                                : 'border bg-white text-slate-600'
                        }`}
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        type="button"
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
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
