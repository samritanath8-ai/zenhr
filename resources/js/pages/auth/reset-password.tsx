import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import './login.css';

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
                            <button className="btn-submit" type="submit" disabled={processing}>
                                {processing ? 'Resetting…' : 'Reset password'}
                            </button>
                        </form>
                    </div>
                    <p className="login-footer"><a href="/login">← Back to sign in</a></p>
                </div>
            </div>
        </>
    );
}