import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_enabled: boolean;
}

interface Device {
    id: number;
    name: string;
    type: 'mac' | 'ios' | 'android' | 'windows';
    identifier: string | null;
    created_at: string;
}

interface Asset {
    id: number;
    asset_number: string;
    name: string;
    type: string;
    status: string;
    serial_number: string | null;
}

interface AvailableAsset {
    id: number;
    asset_number: string;
    name: string;
    type: string;
    device_platform: string | null;
}

interface Props {
    user: User;
    devices: Device[];
    assets: Asset[];
    availableAssets: AvailableAsset[];
}

interface PageProps {
    auth: { user: { role: string; id: number } };
    [key: string]: unknown;
}

const DEVICE_ICONS: Record<string, JSX.Element> = {
    mac:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    ios:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>,
    android: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16a7 7 0 0114 0"/><line x1="12" y1="16" x2="12" y2="21"/><circle cx="8" cy="16" r=".5"/><circle cx="16" cy="16" r=".5"/></svg>,
    windows: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>,
};

const DEVICE_COLORS: Record<string, string> = {
    mac:     'rgba(100,180,255,0.12)',
    ios:     'rgba(120,200,120,0.12)',
    android: 'rgba(100,220,140,0.12)',
    windows: 'rgba(100,140,255,0.12)',
};

const STATUS_COLOR: Record<string, string> = {
    available: '#64dc8c', assigned: '#6ab4ff',
    'in-repair': '#f5c842', retired: 'rgba(255,255,255,0.3)',
};

function ResetPasswordForm({ userId }: { userId: number }) {
    const { data, setData, patch, processing, errors, wasSuccessful, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = () => {
        patch(`/users/${userId}/reset-password`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div>
            {wasSuccessful && (
                <div style={{ background: 'rgba(91,219,143,0.1)', border: '1px solid rgba(91,219,143,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#5bdb8f', marginBottom: 16 }}>
                    Password reset successfully.
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                    <label className="field-label">New password</label>
                    <input className="field-input" type="password" placeholder="••••••••" value={data.password} onChange={e => setData('password', e.target.value)} />
                    {errors.password && <p className="field-error">{errors.password}</p>}
                </div>
                <div>
                    <label className="field-label">Confirm password</label>
                    <input className="field-input" type="password" placeholder="••••••••" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                </div>
            </div>
            <button className="btn-primary" style={{ fontSize: 13, padding: '9px 20px' }} disabled={processing || !data.password} onClick={submit}>
                {processing ? 'Resetting…' : 'Reset password'}
            </button>
        </div>
    );
}

export default function Edit({ user, devices, assets, availableAssets }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { data, setData, put, processing, errors } = useForm({
        name:       user.name,
        email:      user.email,
        role:       user.role || '',
        is_enabled: user.is_enabled ?? true,
    });

    const isAdmin   = auth.user.role === 'admin';
    const isManager = auth.user.role === 'manager';
    const isSelf    = auth.user.id === user.id;

    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [assigning, setAssigning] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const removeDevice = (id: number) => {
        if (confirm('Remove this device?')) {
            router.delete(route('devices.destroy', id));
        }
    };

    const assignAsset = () => {
        if (!selectedAssetId) return;
        setAssigning(true);
        router.post(route('users.assign-asset', user.id), { asset_id: selectedAssetId }, {
            onFinish: () => { setAssigning(false); setShowAssignPanel(false); setSelectedAssetId(''); },
        });
    };

    return (
        <AuthenticatedLayout header="Edit User">
            <Head title="Edit User" />
            <style>{`
                .form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 560px; }
                .field { margin-bottom: 22px; }
                .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit; box-sizing: border-box; }
                .field-input::placeholder { color: rgba(255,255,255,0.2); }
                .field-input:focus { border-color: rgba(245,200,66,0.5); background: rgba(245,200,66,0.04); box-shadow: 0 0 0 3px rgba(245,200,66,0.08); }
                .field-input option { background: #1a1f2e; color: #fff; }
                .field-error { font-size: 12px; color: #ff6b6b; margin-top: 6px; }
                .btn-row { display: flex; gap: 12px; margin-top: 8px; align-items: center; }
                .btn-primary { background: #f5c842; color: #080b14; border: none; border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .btn-primary:hover:not(:disabled) { background: #ffd54f; transform: translateY(-1px); }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-cancel { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 28px; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; }
                .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }
                .toggle-switch { display: flex; align-items: center; gap: 10px; margin-left: auto; cursor: pointer; background: none; border: none; padding: 0; }
                .toggle-track { width: 56px; height: 30px; border-radius: 999px; position: relative; transition: background 0.25s; flex-shrink: 0; }
                .toggle-track.on { background: #4caf50; }
                .toggle-track.off { background: #e05555; }
                .toggle-thumb { position: absolute; top: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: left 0.25s; }
                .toggle-track.on .toggle-thumb { left: 29px; }
                .toggle-track.off .toggle-thumb { left: 3px; }
                .toggle-label { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.6); }
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; max-width: 560px; margin-top: 24px; }
                .device-row { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 8px; }
                .device-row:last-child { margin-bottom: 0; }
                .device-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .asset-row { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 8px; }
                .asset-row:last-child { margin-bottom: 0; }
                .btn-sm { background: rgba(255,80,80,0.08); color: #ff6b6b; border: 1px solid rgba(255,80,80,0.15); border-radius: 8px; padding: 5px 12px; font-size: 12px; cursor: pointer; transition: all 0.15s; margin-left: auto; }
                .btn-sm:hover { background: rgba(255,80,80,0.18); }
                .btn-add-device { display: inline-flex; align-items: center; gap: 6px; background: rgba(245,200,66,0.08); color: #f5c842; border: 1px solid rgba(245,200,66,0.2); border-radius: 10px; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; margin-top: 14px; text-decoration: none; font-family: inherit; }
                .btn-add-device:hover { background: rgba(245,200,66,0.14); }
                .assign-panel { margin-top: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; }
                .btn-assign { background: #f5c842; color: #080b14; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
                .btn-assign:hover:not(:disabled) { background: #ffd54f; }
                .btn-assign:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-ghost { background: none; border: none; color: rgba(255,255,255,0.35); font-size: 13px; cursor: pointer; font-family: inherit; padding: 9px 12px; }
                .btn-ghost:hover { color: #fff; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Edit user</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Update account details for {user.name}.</p>
                </div>

                {/* ── Role-based form block ── */}
                {(isAdmin || isSelf) ? (
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
                            {isAdmin && (
                                <div className="field">
                                    <label className="field-label">Role</label>
                                    <select className="field-input" value={data.role} onChange={e => setData('role', e.target.value)}>
                                        <option value="">Select role</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="user">User</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                    {errors.role && <p className="field-error">{errors.role}</p>}
                                </div>
                            )}
                            <div className="btn-row">
                                <button type="submit" className="btn-primary" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save changes'}
                                </button>
                                <Link href={route('users.index')} className="btn-cancel">Cancel</Link>
                                {isAdmin && (
                                    <button
                                        type="button"
                                        className="toggle-switch"
                                        onClick={() => setData('is_enabled', !data.is_enabled)}
                                    >
                                        <div className={`toggle-track ${data.is_enabled ? 'on' : 'off'}`}>
                                            <div className="toggle-thumb" />
                                        </div>
                                        <span className="toggle-label">{data.is_enabled ? 'Enabled' : 'Disabled'}</span>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="form-card">
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Name</div>
                        <div style={{ fontSize: 15, color: '#fff', marginBottom: 16 }}>{user.name}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Email</div>
                        <div style={{ fontSize: 15, color: '#fff', marginBottom: 16 }}>{user.email}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Role</div>
                        <div style={{ fontSize: 15, color: '#fff' }}>{user.role}</div>
                    </div>
                )}

                {/* Devices panel */}
                <div className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>Devices</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                                {devices.length} device{devices.length !== 1 ? 's' : ''} linked to this user
                            </div>
                        </div>
                    </div>

                    {devices.length === 0 && !showAssignPanel ? (
                        <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                            No devices linked yet
                        </div>
                    ) : (
                        devices.map(device => (
                            <div key={device.id} className="device-row">
                                <div className="device-icon" style={{ background: DEVICE_COLORS[device.type] }}>
                                    {DEVICE_ICONS[device.type]}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: '#e0e0e0' }}>{device.name}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                                        {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                                        {device.identifier ? ` · ${device.identifier}` : ''}
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button className="btn-sm" onClick={() => removeDevice(device.id)}>Remove</button>
                                )}
                            </div>
                        ))
                    )}

                    {showAssignPanel && (
                        <div className="assign-panel">
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
                                Assign an available asset
                            </div>
                            {availableAssets.length === 0 ? (
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                                    No available assets. <Link href="/assets/create" style={{ color: '#f5c842' }}>Create one</Link>
                                </div>
                            ) : (
                                <select
                                    className="field-input"
                                    style={{ marginBottom: 12 }}
                                    value={selectedAssetId}
                                    onChange={e => setSelectedAssetId(e.target.value)}
                                >
                                    <option value="">Select an asset…</option>
                                    {availableAssets.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} — #{a.asset_number} ({a.type}{a.device_platform ? ` / ${a.device_platform}` : ''})
                                        </option>
                                    ))}
                                </select>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn-assign" disabled={!selectedAssetId || assigning} onClick={assignAsset}>
                                    {assigning ? 'Assigning…' : 'Assign'}
                                </button>
                                <button className="btn-ghost" onClick={() => { setShowAssignPanel(false); setSelectedAssetId(''); }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                        {(isAdmin || isManager) && !showAssignPanel && (
                            <button className="btn-add-device" onClick={() => setShowAssignPanel(true)}>
                                + Assign existing asset
                            </button>
                        )}
                        {isAdmin && (
                            <Link href={`/assets/create?user_id=${user.id}`} className="btn-add-device">
                                + Create new asset
                            </Link>
                        )}
                    </div>
                </div>

                {/* Assets panel */}
                <div className="panel">
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>Assigned Assets</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                            {assets.length} asset{assets.length !== 1 ? 's' : ''} assigned to this user
                        </div>
                    </div>
                    {assets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                            No assets assigned yet
                        </div>
                    ) : (
                        assets.map(asset => (
                            <div key={asset.id} className="asset-row">
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: '#e0e0e0' }}>{asset.name}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                                        #{asset.asset_number} · {asset.type}
                                        {asset.serial_number ? ` · ${asset.serial_number}` : ''}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100,
                                    color: STATUS_COLOR[asset.status] ?? 'rgba(255,255,255,0.4)',
                                    background: `${STATUS_COLOR[asset.status]}18`,
                                    border: `1px solid ${STATUS_COLOR[asset.status]}40`,
                                }}>
                                    {asset.status}
                                </span>
                                {isAdmin && (
                                    <Link
                                        href={route('assets.edit', asset.id)}
                                        style={{ fontSize: 12, color: '#f5c842', textDecoration: 'none', marginLeft: 12 }}
                                    >
                                        Edit
                                    </Link>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}