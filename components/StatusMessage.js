export default function StatusMessage({ title, description, action }) {
    return (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    );
}
