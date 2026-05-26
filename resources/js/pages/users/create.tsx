import { Head, useForm, Link } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout header="Add User">
            <Head title="Add User" />
            <style>{`
                .form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 560px; }
                .field { margin-bottom: 22px; }
                .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit; }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus { border-color: rgba(245,200,66,0.5); background: rgba(245,200,66,0.04); box-shadow: 0 0 0 3px rgba(245,200,66,0.08); }
                .field-error { font-size: 12px; color: #ff6b6b; margin-top: 6px; }
                .btn-row { display: flex; gap: 12px; margin-top: 8px; }
                .btn-primary { background: #f5c842; color: #080b14; border: none; border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .btn-primary:hover:not(:disabled) { background: #ffd54f; transform: translateY(-1px); }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-cancel { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; }
                .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Add new user</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Create a new account for your team.</p>
                </div>
                <div className="form-card">
                    <form onSubmit={submit}>
                        <div className="field">
                            <label className="field-label">Full name</label>
                            <input className="field-input" type="text" placeholder="Jane Smith" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <p className="field-error">{errors.name}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">Email address</label>
                            <input className="field-input" type="email" placeholder="jane@example.com" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <p className="field-error">{errors.email}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">Role</label>
                            <input className="field-input" type="text" placeholder="e.g. Admin, Manager, Employee" value={data.role} onChange={e => setData('role', e.target.value)} />
                            {errors.role && <p className="field-error">{errors.role}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">Password</label>
                            <input className="field-input" type="password" placeholder="••••••••" value={data.password} onChange={e => setData('password', e.target.value)} required />
                            {errors.password && <p className="field-error">{errors.password}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">Confirm password</label>
                            <input className="field-input" type="password" placeholder="••••••••" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                        </div>
                        <div className="btn-row">
                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? 'Creating...' : 'Create user'}
                            </button>
                            <Link href={route('users.index')} className="btn-cancel">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}