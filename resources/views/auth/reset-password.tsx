import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function ResetPassword({ token, email }: { token: string; email?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <>
            <Head title="Reset Password — ZenHR" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #080b14; }
                .root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #080b14; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
                .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; pointer-events: none; }
                .blob-1 { width: 600px; height: 600px; background: #f5c842; top: -200px; right: -100px; }
                .blob-2 { width: 400px; height: 400px; background: #3b5bdb; bottom: -150px; left: -100px; }
                .wrap { position: relative; z-index: 10; width: 100%; max-width: 420px; padding: 24px; animation: fadeUp 0.5s ease both; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                .logo-area { text-align: center; margin-bottom: 32px; }
                .logo-icon { width: 52px; height: 52px; background: #f5c842; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; box-shadow: 0 0 40px rgba(245,200,66,0.35); }
                .logo-name { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
                .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; padding: 36px; backdrop-filter: blur(20px); box-shadow: 0 24px 80px rgba(0,0,0,0.4); }
                .card-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 8px; }
                .card-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin-bottom: 28px; }
                .field { margin-bottom: 18px; }
                .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus { border-color: rgba(245,200,66,0.5); background: rgba(245,200,66,0.04); box-shadow: 0 0 0 3px rgba(245,200,66,0.08); }
                .field-error { font-size: 12px; color: #ff6b6b; margin-top: 6px; }
                .btn { width: 100%; background: #f5c842; color: #080b14; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; margin-top: 8px; box-shadow: 0 4px 24px rgba(245,200,66,0.25); }
                .btn:hover:not(:disabled) { background: #ffd54f; transform: translateY(-1px); }
                .btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .footer { text-align: center; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.35); }
                .footer a { color: #f5c842; text-decoration: none; font-weight: 600; }
            `}</style>
            <div className="root">
                <div className="blob blob-1" /><div className="blob blob-2" />
                <div className="wrap">
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
                        <h1 className="card-title">Reset password</h1>
                        <p className="card-sub">Choose a new password for your account.</p>
                        <form onSubmit={submit}>
                            <div className="field">
                                <label className="field-label">Email address</label>
                                <input className="field-input" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>
                            <div className="field">
                                <label className="field-label">New password</label>
                                <input className="field-input" type="password" placeholder="••••••••" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                {errors.password && <p className="field-error">{errors.password}</p>}
                            </div>
                            <div className="field">
                                <label className="field-label">Confirm password</label>
                                <input className="field-input" type="password" placeholder="••••••••" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                            </div>
                            <button className="btn" type="submit" disabled={processing}>
                                {processing ? 'Resetting…' : 'Reset password'}
                            </button>
                        </form>
                    </div>
                    <p className="footer"><a href="/login">← Back to sign in</a></p>
                </div>
            </div>
        </>
    );
}