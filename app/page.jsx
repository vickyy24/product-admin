'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    function handleInputChange(event) {
        const { name, value } = event.target;
        setCredentials((currentCredentials) => ({
            ...currentCredentials,
            [name]: value,
        }));
        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [name]: '',
        }));
        setErrorMessage('');
    }

    function validateCredentials() {
        const errors = {};

        if (!credentials.username.trim()) {
            errors.username = 'Username is required.';
        }

        if (!credentials.password) {
            errors.password = 'Password is required.';
        } else if (credentials.password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        return errors;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const validationErrors = validateCredentials();

        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const { data } = await api.post('/auth/login', {
                ...credentials,
                expiresInMins: 30,
            });

            localStorage.setItem('auth_token', data.accessToken);
            localStorage.setItem('auth_user', JSON.stringify(data));
            router.replace('/products');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
            <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
                        Product Admin
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-slate-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to manage your product catalog.
                    </p>
                </div>

                {errorMessage ? (
                    <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <label className="block text-sm font-semibold text-slate-700">
                        Username
                        <input
                            className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            autoComplete="username"
                            required
                        />
                        {fieldErrors.username ? (
                            <span className="mt-1 text-xs font-normal text-red-600">
                                {fieldErrors.username}
                            </span>
                        ) : null}
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                        Password
                        <input
                            className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            autoComplete="current-password"
                            required
                        />
                        {fieldErrors.password ? (
                            <span className="mt-1 text-xs font-normal text-red-600">
                                {fieldErrors.password}
                            </span>
                        ) : null}
                    </label>

                    <button
                        className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </section>
        </main>
    );
}
