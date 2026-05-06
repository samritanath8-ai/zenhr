import { FormEventHandler } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const deleteUser = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout header="Edit User">
            <Head title="Edit User" />
            <style>{`
                .form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 560px; }
                .field { margin-bottom: 22px; }
                .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit; }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus { border-color: rgba(245,200,66,0.5); background: rgba(245,200,66,0.04); box-shadow: 0 0 0 3px rgba(245,200,66,0.08); }
                .field-error { font-size: 12px; color: #ff6b6b; margin-top: 6px; }
                .btn-row { display: flex; gap: 12px; margin-top: 8px; align-items: center; }
                .btn-primary { background: #f5c842; color: #080b14; border: none; border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .btn-primary:hover:not(:disabled) { background: #ffd54f; transform: translateY(-1px); }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-cancel { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; }
                .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }
                .btn-delete { background: rgba(255,80,80,0.1); color: #ff6b6b; border: 1px solid rgba(255,80,80,0.2); border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; margin-left: auto; }
                .btn-delete:hover { background: rgba(255,80,80,0.2); }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Edit user</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Update account details for {user.name}.</p>
                </div>

                <div className="form-card">
                    <form onSubmit={submit}>
                        <div className="field">
                            <label className="field-label">Full name</label>
                            <input className="field-input" type="text" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <p className="field-error">{errors.name}</p>}
                        </div>

                        <div className="field">
                            <label className="field-label">Email address</label>
                            <input className="field-input" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <p className="field-error">{errors.email}</p>}
                        </div>

                        <div className="field">
                            <label className="field-label">Role</label>
                            <input className="field-input" type="text" placeholder="e.g. Admin, Manager, Employee" value={data.role} onChange={e => setData('role', e.target.value)} />
                            {errors.role && <p className="field-error">{errors.role}</p>}
                        </div>

                        <div className="btn-row">
                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? 'Saving...' : 'Save changes'}
                            </button>
                            <Link href={route('users.index')} className="btn-cancel">Cancel</Link>
                            <button type="button" className="btn-delete" onClick={deleteUser}>
                                Delete user
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}