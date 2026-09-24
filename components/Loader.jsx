export default function Loader({ label = 'Loading...' }) {
    return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border bg-white shadow-sm" role="status" aria-live="polite">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-brand" aria-hidden="true" />
                <span>{label}</span>
            </div>
        </div>
    );
}
