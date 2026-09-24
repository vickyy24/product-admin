'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout } from '../../../lib/auth';
import { getProduct, removeProduct } from '../../../lib/products';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { if (!isAuthenticated()) router.replace('/'); else getProduct(id).then(setProduct).catch((err) => setError(err.message)); }, [id, router]);
  if (!isAuthenticated()) return null;
  if (error) return <main className="container"><div className="card"><h1>Product not found</h1><p className="muted">{error}</p><Link className="secondary button" href="/products">Back to products</Link></div></main>;
  if (!product) return <main className="container"><div className="card">Loading product...</div></main>;
  async function deleteProduct() {
    if (!window.confirm('Delete this product?')) return;
    try { await removeProduct(product.id); router.replace('/products'); } catch (err) { setError(err.message); }
  }
  return <><header className="topbar"><Link className="brand" href="/products">Product Admin</Link><button className="ghost" onClick={() => { logout(); router.replace('/'); }}>Log out</button></header><main className="container">
    <div className="row"><div><Link className="muted" href="/products">← Products</Link><h1>{product.title}</h1></div><div className="actions"><Link className="secondary button" href={`/products/${product.id}/edit`}>Edit</Link><button className="danger" onClick={deleteProduct}>Delete</button></div></div>
    {error && <div className="error">{error}</div>}<div className="detail-grid card"><div><img className="hero-image" src={product.images?.[0] || product.thumbnail} alt={product.title} /></div><div><p>{product.description}</p><h2>${product.price}</h2><p>Category: {product.category}</p><p>Rating: ★ {product.rating} · Stock: {product.stock}</p><h3>Reviews</h3>{(product.reviews || []).map((review) => <div className="review" key={`${review.reviewerName}-${review.date}`}><b>{review.reviewerName}</b> · ★ {review.rating}<p>{review.comment}</p></div>)}</div></div>
  </main></>;
}
