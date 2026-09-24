export default function BrandLogo({ compact = false, light = false }) {
    return (
        <span className="inline-flex items-center gap-2.5">
            <img
                src="/icon.svg"
                alt=""
                className="h-9 w-9 shrink-0"
            />
            {!compact ? (
                <span className={light ? 'text-white' : 'text-slate-900'}>
                    <span className="block text-[15px] font-extrabold leading-none tracking-tight">
                        Nexgensis
                    </span>
                    <span
                        className={`mt-1 block text-[7px] font-bold uppercase leading-none tracking-[0.24em] ${
                            light ? 'text-slate-300' : 'text-slate-500'
                        }`}
                    >
                        Technologies
                    </span>
                </span>
            ) : null}
        </span>
    );
}
