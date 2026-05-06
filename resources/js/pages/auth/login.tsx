import { useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

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
        post(route('login'));
    };

    return (
        <>
            <Head title="Sign in — ZenHR" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .login-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #080b14;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; pointer-events: none; }
                .blob-1 { width: 600px; height: 600px; background: #f5c842; top: -200px; right: -100px; }
                .blob-2 { width: 400px; height: 400px; background: #3b5bdb; bottom: -150px; left: -100px; }
                .blob-3 { width: 300px; height: 300px; background: #f5c842; bottom: 100px; right: 200px; opacity: 0.08; }
                .noise { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; opacity: 0.4; }
                .login-wrap { position: relative; z-index: 10; width: 100%; max-width: 420px; padding: 24px; animation: fadeUp 0.6s ease both; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .logo-area { text-align: center; margin-bottom: 36px; }
                .logo-icon { width: 52px; height: 52px; background: #f5c842; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; box-shadow: 0 0 40px rgba(245,200,66,0.35); }
                .logo-name { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
                .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; padding: 36px; backdrop-filter: blur(20px); box-shadow: 0 24px 80px rgba(0,0,0,0.4); }
                .card-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 6px; }
                .card-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin-bottom: 32px; }
                .status-msg { background: rgba(91,219,143,0.1); border: 1px solid rgba(91,219,143,0.25); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #5bdb8f; margin-bottom: 20px; }
                .field { margin-bottom: 20px; }
                .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
                .field-wrap { position: relative; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus { border-color: rgba(245,200,66,0.5); background: rgba(245,200,66,0.04); box-shadow: 0 0 0 3px rgba(245,200,66,0.08); }
                .field-error { font-size: 12px; color: #ff6b6b; margin-top: 6px; }
                .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3); display: flex; align-items: center; padding: 4px; transition: color 0.15s; }
                .eye-btn:hover { color: rgba(255,255,255,0.6); }
                .row-between { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
                .remember-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: rgba(255,255,255,0.45); user-select: none; }
                .remember-cb { width: 16px; height: 16px; accent-color: #f5c842; cursor: pointer; }
                .forgot-link { font-size: 13px; color: rgba(245,200,66,0.7); text-decoration: none; transition: color 0.15s; }
                .forgot-link:hover { color: #f5c842; }
                .btn-submit { width: 100%; background: #f5c842; color: #080b14; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: -0.01em; box-shadow: 0 4px 24px rgba(245,200,66,0.25); }
                .btn-submit:hover:not(:disabled) { background: #ffd54f; box-shadow: 0 6px 32px rgba(245,200,66,0.4); transform: translateY(-1px); }
                .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .login-footer { text-align: center; margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.35); }
                .login-footer a { color: #f5c842; text-decoration: none; font-weight: 600; transition: opacity 0.15s; }
                .login-footer a:hover { opacity: 0.8; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner { width: 16px; height: 16px; border: 2px solid rgba(8,11,20,0.3); border-top-color: #080b14; border-radius: 50%; animation: spin 0.7s linear infinite; }
            `}</style>

            <div className="login-root">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
                <div className="noise" />

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
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="forgot-link">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <button type="submit" className="btn-submit" disabled={processing}>
                                {processing && <span className="spinner" />}
                                {processing ? 'Signing in…' : 'Sign in →'}
                            </button>
                        </form>
                    </div>

                    <p className="login-footer">
                        Don't have an account?{' '}
                        <Link href={route('register')}>Create one</Link>
                    </p>
                </div>
            </div>
        </>
    );
}