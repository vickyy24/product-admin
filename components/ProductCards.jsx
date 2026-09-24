import Link from 'next/link';
import Image from 'next/image';

export default function ProductCards({ products }) {
    return (
        <div className="grid gap-3 md:hidden">
            {products.map((product) => (
                <article
                    className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"
                    key={product.id}
                >
                    <Image
                        className="h-14 w-14 rounded-lg bg-slate-100 object-cover"
                        src={product.thumbnail}
                        alt=""
                        width={56}
                        height={56}
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate font-semibold text-slate-900">{product.title}</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            ${product.price} · ★ {product.rating}
                        </p>
                    </div>
                    <Link
                        className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700"
                        href={`/products/${product.id}`}
                    >
                        View
                    </Link>
                </article>
            ))}
        </div>
    );
}
