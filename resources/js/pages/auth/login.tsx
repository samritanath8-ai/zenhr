import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import './login.css';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.store'));
    };

    return (
        <>
            <Head title="Sign in — ZenHR" />

            <div className="login-root">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />

                <div className="login-wrap">
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                                <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#080b14"/>
                                <rect x="15" y="2" width="9" height="9" rx="2.5" fill="#080b14"/>
                                <rect x="2" y="15" width="9" height="9" rx="2.5" fill="#080b14"/>
                                <rect x="15" y="15" width="9" height="9" rx="2.5" fill="#080b14"/>
                            </svg>
                        </div>
                        <div className="logo-name">ZenHR</div>
                    </div>

                    <div className="card">
                        <h1 className="card-title">Welcome back</h1>
                        <p className="card-sub">Sign in to your account to continue</p>

                        {status && <div className="status-msg">{status}</div>}

                        <form onSubmit={submit}>
                            <div className="field">
                                <label className="field-label">Email address</label>
                                <div className="field-wrap">
                                    <input
                                        className="field-input"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>

                            <div className="field">
                                <label className="field-label">Password</label>
                                <div className="field-wrap">
                                    <input
                                        className="field-input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        autoComplete="current-password"
                                        style={{ paddingRight: '44px' }}
                                        required
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="field-error">{errors.password}</p>}
                            </div>

                            <div className="row-between">
                                <label className="remember-label">
                                    <input
                                        type="checkbox"
                                        className="remember-cb"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                    />
                                    Remember me
                                </label>
                            
                                    <Link href="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            
                            </div>

                            <button type="submit" className="btn-submit" disabled={processing}>
                                {processing && <span className="spinner" />}
                                {processing ? 'Signing in…' : 'Sign in →'}
                            </button>
                        </form>
                    </div>

                    <p className="login-footer">
                        Don't have an account?{' '}
                        <Link href="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </>
    );
}