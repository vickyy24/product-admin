const variantClasses = {
    primary:
        'bg-brand text-white hover:bg-[#0b5d57] hover:shadow-md',
    secondary:
        'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900',
    danger:
        'bg-red-600 text-white hover:bg-red-700 hover:shadow-md',
};

export default function Button({
    children,
    variant = 'primary',
    className = '',
    type = 'button',
    ...props
}) {
    return (
        <button
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
}
