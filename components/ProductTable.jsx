import Link from 'next/link';
import Image from 'next/image';

function ProductImage({ product }) {
    return (
        <Image
            className="h-12 w-12 rounded-lg bg-slate-100 object-cover"
            src={product.thumbnail}
            alt=""
            width={48}
            height={48}
        />
    );
}

export default function ProductTable({ products }) {
    return (
        <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
            <table className="w-full text-left">
                <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-5 py-4 font-semibold">Product</th>
                        <th className="px-5 py-4 font-semibold">Category</th>
                        <th className="px-5 py-4 font-semibold">Price</th>
                        <th className="px-5 py-4 font-semibold">Rating</th>
                        <th className="px-5 py-4 font-semibold">Stock</th>
                        <th className="px-5 py-4" />
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {products.map((product) => (
                        <tr key={product.id} className="text-sm text-slate-600">
                            <td className="px-5 py-4">
                                <Link
                                    className="flex items-center gap-3 font-semibold text-slate-900 hover:text-brand"
                                    href={`/products/${product.id}`}
                                >
                                    <ProductImage product={product} />
                                    {product.title}
                                </Link>
                            </td>
                            <td className="px-5 py-4">{product.category}</td>
                            <td className="px-5 py-4">${product.price.toFixed(2)}</td>
                            <td className="px-5 py-4">★ {product.rating}</td>
                            <td className="px-5 py-4">{product.stock}</td>
                            <td className="px-5 py-4 text-right">
                                <Link
                                    className="rounded-lg bg-indigo-50 px-3 py-2 font-semibold text-indigo-700 hover:bg-indigo-100"
                                    href={`/products/${product.id}/edit`}
                                >
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
