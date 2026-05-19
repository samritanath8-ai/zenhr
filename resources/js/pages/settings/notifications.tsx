import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Props {
    preferences: {
        asset_assigned: boolean;
        warranty_expiry: boolean;
        request_reviewed: boolean;
        transfer_reviewed: boolean;
    };
}

export default function NotificationPreferences({ preferences }: Props) {
    const { data, setData, patch, processing } = useForm({
        asset_assigned:    preferences.asset_assigned    ?? true,
        warranty_expiry:   preferences.warranty_expiry   ?? true,
        request_reviewed:  preferences.request_reviewed  ?? true,
        transfer_reviewed: preferences.transfer_reviewed ?? true,
    });

    const PREFS = [
        { key: 'asset_assigned'    as const, label: 'Asset assigned to me',          sub: 'When an admin assigns an asset to your account' },
        { key: 'warranty_expiry'   as const, label: 'Warranty expiry alerts',         sub: 'When an asset warranty is expiring within 30 days' },
        { key: 'request_reviewed'  as const, label: 'Asset request reviewed',         sub: 'When your asset request is approved or rejected' },
        { key: 'transfer_reviewed' as const, label: 'Transfer request reviewed',      sub: 'When a transfer you requested is approved or rejected' },
    ];

    return (
        <AuthenticatedLayout header="Notification Preferences">
            <Head title="Notification Preferences" />
            <style>{`
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 560px; }
                .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .pref-row:last-child { border-bottom: none; }
                .toggle-track { width: 44px; height: 24px; border-radius: 999px; position: relative; transition: background 0.25s; flex-shrink: 0; cursor: pointer; border: none; }
                .toggle-track.on { background: #4caf50; }
                .toggle-track.off { background: rgba(255,255,255,0.15); }
                .toggle-thumb { position: absolute; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: left 0.25s; }
                .toggle-track.on .toggle-thumb { left: 22px; }
                .toggle-track.off .toggle-thumb { left: 2px; }
                .btn-save { background: #f5c842; color: #080b14; border: none; border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 24px; }
                .btn-save:hover { background: #ffd54f; }
                .btn-save:disabled { opacity: 0.5; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Notification Preferences</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Choose which email notifications you receive.</p>
                </div>

                <div className="panel">
                    {PREFS.map(pref => (
                        <div key={pref.key} className="pref-row">
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 3 }}>{pref.label}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{pref.sub}</div>
                            </div>
                            <button
                                type="button"
                                className={`toggle-track ${data[pref.key] ? 'on' : 'off'}`}
                                onClick={() => setData(pref.key, !data[pref.key])}
                            >
                                <div className="toggle-thumb" />
                            </button>
                        </div>
                    ))}

                    <button
                        className="btn-save"
                        disabled={processing}
                        onClick={() => patch(route('profile.notifications.update'))}
                    >
                        {processing ? 'Saving…' : 'Save preferences'}
                    </button>
                </div>

                <div style={{ marginTop: 16 }}>
                    <Link href="/profile" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                        ← Back to profile
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}