'use client';

import { FiX } from 'react-icons/fi';
import Button from './Button';

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
                    <FiX className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
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
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={isConfirming}
                    >
                        {isConfirming ? 'Deleting...' : 'Delete product'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
