'use client';

export default function ConfirmDialog({ title, description, onCancel, onConfirm, isConfirming }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={onCancel}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-lg text-red-600">
                    !
                </div>
                <h2 className="mt-5 text-lg font-bold text-slate-900" id="confirm-dialog-title">
                    {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        onClick={onCancel}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
