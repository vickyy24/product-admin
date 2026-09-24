export default function Loader({ label = 'Loading...' }) {
    return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border bg-white shadow-sm" role="status" aria-live="polite">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <svg
                    className="h-5 w-5 animate-spin text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="opacity-90"
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
                <span>{label}</span>
            </div>
        </div>
    );
}
