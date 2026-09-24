export default function BrandLogo({ compact = false, light = false }) {
    return (
        <span className="inline-flex items-center gap-2.5">
            <svg
                className="h-9 w-9 shrink-0"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="nexgensis-mark" x1="7" y1="38" x2="40" y2="7" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#1475D1" />
                        <stop offset="0.62" stopColor="#159FE8" />
                        <stop offset="1" stopColor="#24C7A7" />
                    </linearGradient>
                </defs>
                <path d="M4 39V31H12V39H4Z" fill="url(#nexgensis-mark)" />
                <path d="M15 39V22H23V39H15Z" fill="url(#nexgensis-mark)" />
                <path d="M26 39V13H34V39H26Z" fill="url(#nexgensis-mark)" />
                <path d="M37 39V4H45V39H37Z" fill="url(#nexgensis-mark)" />
                <path
                    d="M5 29L12 34L16 20L23 26L27 11L34 17L38 2"
                    stroke="#19B8C7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
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
