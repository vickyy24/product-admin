'use client';

export default function ConfirmDialog({ title, description, onCancel, onConfirm, isConfirming }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]"
            role="presentation"
            onMouseDown={onCancel}
        >
            <div
                className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    className="group absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition duration-200 hover:scale-105 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md active:scale-95"
                    onClick={onCancel}
                    type="button"
                    aria-label="Close delete confirmation"
                >
                    <svg
                        className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                    >
                        <path d="m7 7 10 10M17 7 7 17" />
                    </svg>
                </button>

                <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600 shadow-inner shadow-red-200/80">
                        !
                    </div>
                </div>

                <h2 className="mt-5 text-center text-2xl font-bold text-slate-900" id="confirm-dialog-title">
                    {title}
                </h2>
                <p className="mt-3 text-center text-sm leading-6 text-slate-500">{description}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
                        onClick={onCancel}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={onConfirm}
                        type="button"
                        disabled={isConfirming}
                    >
                        {isConfirming ? 'Deleting...' : 'Delete product'}
                    </button>
                </div>
            </div>
        </div>
    );
}
