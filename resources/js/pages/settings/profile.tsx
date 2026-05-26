import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Asset {
    id: number;
    asset_number: string;
    name: string;
    type: string;
    serial_number: string | null;
    vendor: string | null;
    department: string | null;
    location: string | null;
    warranty_expiry: string | null;
    status: 'available' | 'assigned' | 'in-repair' | 'retired';
    notes: string | null;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    assignedAssets: Asset[];
    [key: string]: unknown;
}

const STATUS_COLORS: Record<string, string> = {
    available: '#64dc8c', assigned: '#6ab4ff',
    'in-repair': '#f5c842', retired: 'rgba(255,255,255,0.3)',
};
const STATUS_BG: Record<string, string> = {
    available: 'rgba(100,220,140,0.1)', assigned: 'rgba(100,180,255,0.1)',
    'in-repair': 'rgba(245,200,66,0.1)', retired: 'rgba(255,255,255,0.05)',
};

const NOW = Date.now();

export default function Profile() {
    const { auth, assignedAssets } = usePage<PageProps>().props;

    const { data, setData, patch, processing, errors, wasSuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/profile');
    };

    return (
        <AuthenticatedLayout header="Profile">
            <Head title="Profile" />
            <style>{`
                .form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 560px; margin-bottom: 24px; }
                .field { margin-bottom: 22px; }
                .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit; box-sizing: border-box; }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus { border-color: rgba(245,200,66,0.5); background: rgba(245,200,66,0.04); box-shadow: 0 0 0 3px rgba(245,200,66,0.08); }
                .field-error { font-size: 12px; color: #ff6b6b; margin-top: 6px; }
                .btn-primary { background: #f5c842; color: #080b14; border: none; border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .btn-primary:hover:not(:disabled) { background: #ffd54f; transform: translateY(-1px); }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .success-msg { background: rgba(91,219,143,0.1); border: 1px solid rgba(91,219,143,0.25); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #5bdb8f; margin-bottom: 20px; }
                .section-title { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px; }
                .section-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 24px; }
                .assets-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 560px; }
                .asset-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .asset-row:last-child { border-bottom: none; }
                .asset-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(100,180,255,0.1); border: 1px solid rgba(100,180,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
                .asset-number { font-size: 11px; font-family: monospace; color: #f5c842; margin-bottom: 2px; }
                .asset-name { font-size: 14px; font-weight: 500; color: #e0e0e0; }
                .asset-meta { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
                .warranty-warn { font-size: 11px; color: #f5c842; margin-top: 2px; }
                .warranty-expired { font-size: 11px; color: #ff6b6b; margin-top: 2px; }
                .empty-state { text-align: center; padding: 32px 0; color: rgba(255,255,255,0.3); font-size: 14px; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Profile</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Manage your account details and view your assigned assets.</p>
                </div>

                {/* Account info form */}
                <div className="form-card">
                    <div className="section-title">Account information</div>
                    <div className="section-sub">Update your name and email address.</div>

                    {wasSuccessful && <div className="success-msg">Profile updated successfully.</div>}

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
                            <label className="field-label">Current password</label>
                            <input className="field-input" type="password" placeholder="••••••••" value={data.current_password} onChange={e => setData('current_password', e.target.value)} />
                            {errors.current_password && <p className="field-error">{errors.current_password}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">New password</label>
                            <input className="field-input" type="password" placeholder="••••••••" value={data.password} onChange={e => setData('password', e.target.value)} />
                            {errors.password && <p className="field-error">{errors.password}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">Confirm new password</label>
                            <input className="field-input" type="password" placeholder="••••••••" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Saving...' : 'Save changes'}
                        </button>
                    </form>
                </div>

                {/* Assigned assets */}
                <div className="assets-panel">
                    <div className="section-title">My assets</div>
                    <div className="section-sub">
                        {assignedAssets.length > 0
                            ? `${assignedAssets.length} asset${assignedAssets.length !== 1 ? 's' : ''} assigned to you.`
                            : 'Assets assigned to you will appear here.'}
                    </div>

                    {assignedAssets.length === 0 ? (
                        <div className="empty-state">No assets assigned.</div>
                    ) : (
                        <div>
                            {assignedAssets.map(asset => {
                                const typeIcon: Record<string, string> = {
                                    laptop: '💻', desktop: '🖥', phone: '📱', tablet: '📱',
                                    monitor: '🖥', keyboard: '⌨', mouse: '🖱', printer: '🖨',
                                };
                                const icon = typeIcon[asset.type?.toLowerCase()] ?? '📦';

                                let warrantyEl: React.ReactNode = null;

                                if (asset.warranty_expiry) {
                                    const expiry = new Date(asset.warranty_expiry);
                                    const daysLeft = Math.ceil((expiry.getTime() - NOW) / 86400000);

                                    if (daysLeft < 0) {
                                        warrantyEl = <div className="warranty-expired">Warranty expired {expiry.toLocaleDateString()}</div>;
                                    } else if (daysLeft <= 30) {
                                        warrantyEl = <div className="warranty-warn">Warranty expires in {daysLeft}d ({expiry.toLocaleDateString()})</div>;
                                    }
                                }

                                return (
                                    <div key={asset.id} className="asset-row">
                                        <div className="asset-icon">{icon}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="asset-number">{asset.asset_number}</div>
                                            <div className="asset-name">{asset.name}</div>
                                            <div className="asset-meta">
                                                {[asset.type, asset.vendor, asset.location].filter(Boolean).join(' · ')}
                                            </div>
                                            {warrantyEl}
                                        </div>
                                        <span style={{
                                            display: 'inline-block', padding: '3px 10px', borderRadius: 100,
                                            fontSize: 11, fontWeight: 500, flexShrink: 0,
                                            background: STATUS_BG[asset.status],
                                            color: STATUS_COLORS[asset.status],
                                            border: `1px solid ${STATUS_COLORS[asset.status]}40`,
                                        }}>
                                            {asset.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
