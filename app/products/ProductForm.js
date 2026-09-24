'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';
import { getProduct, saveProduct } from '../../lib/products';

export default function ProductForm() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [form, setForm] = useState({ title: '', price: '', stock: '', description: '', category: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!isAuthenticated()) router.replace('/'); else if (id) getProduct(id).then((product) => setForm({ title: product.title, price: product.price, stock: product.stock, description: product.description, category: product.category })).catch((err) => setError(err.message)); }, [id, router]);
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    if (!form.title.trim() || Number(form.price) < 0 || Number(form.stock) < 0) { setError('Enter a title and valid non-negative price and stock.'); return; }
    setBusy(true); setError('');
    try { const product = await saveProduct({ ...form, price: Number(form.price), stock: Number(form.stock) }, id); localStorage.setItem(`product_override_${product.id}`, JSON.stringify(product)); router.replace(`/products/${product.id}`); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  if (!isAuthenticated()) return null;
  return <main className="container"><div className="form"><Link className="muted" href="/products">← Products</Link><h1>{id ? 'Edit product' : 'Add product'}</h1><form className="card form-grid" onSubmit={submit}>{error && <div className="error full">{error}</div>}<label>Title<input name="title" value={form.title} onChange={change} /></label><label>Category<input name="category" value={form.category} onChange={change} /></label><label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} /></label><label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={change} /></label><label className="full">Description<textarea name="description" value={form.description} onChange={change} /></label><div className="full actions"><Link className="ghost button" href="/products">Cancel</Link><button className="primary" disabled={busy}>{busy ? 'Saving...' : 'Save product'}</button></div></form></div></main>;
}
