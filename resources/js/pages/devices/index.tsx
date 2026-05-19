import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Device {
    id: number;
    name: string;
    type: 'mac' | 'ios' | 'android' | 'windows';
    identifier: string | null;
    created_at: string;
    user: { id: number; name: string; email: string };
}

interface Props {
    devices: Device[];
    type: string | null;
}

const DEVICE_ICONS: Record<string, JSX.Element> = {
    mac:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    ios:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>,
    android: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16a7 7 0 0114 0"/><line x1="12" y1="16" x2="12" y2="21"/><circle cx="8" cy="16" r=".5"/><circle cx="16" cy="16" r=".5"/></svg>,
    windows: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>,
};
const DEVICE_COLORS: Record<string, string> = {
    mac: 'rgba(100,180,255,0.12)', ios: 'rgba(120,200,120,0.12)',
    android: 'rgba(100,220,140,0.12)', windows: 'rgba(100,140,255,0.12)',
};
const TABS = [
    { label: 'All',     href: '/devices',              key: null },
    { label: 'Mac',     href: '/devices?type=mac',     key: 'mac' },
    { label: 'iOS',     href: '/devices?type=ios',     key: 'ios' },
    { label: 'Android', href: '/devices?type=android', key: 'android' },
    { label: 'Windows', href: '/devices?type=windows', key: 'windows' },
];

export default function DevicesIndex({ devices, type }: Props) {
    return (
        <AuthenticatedLayout header="Devices">
            <Head title="Devices" />
            <style>{`
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; }
                .tab { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; text-decoration: none; color: rgba(255,255,255,0.45); transition: all 0.15s; border: 1px solid transparent; }
                .tab:hover { color: #fff; background: rgba(255,255,255,0.05); }
                .tab.active { color: #f5c842; background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.2); }
                .device-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .device-row:last-child { border-bottom: none; }
                .device-row:hover { background: rgba(255,255,255,0.02); border-radius: 10px; }
                .device-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 500; background: rgba(245,200,66,0.1); color: #f5c842; border: 1px solid rgba(245,200,66,0.2); }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Devices</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                            {devices.length} device{devices.length !== 1 ? 's' : ''} {type ? `· ${type}` : 'total'}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                    {TABS.map(tab => (
                        <Link key={tab.label} href={tab.href} className={`tab ${type === tab.key ? 'active' : ''}`}>
                            {tab.key && <span>{DEVICE_ICONS[tab.key]}</span>}
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <div className="panel">
                    {devices.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
                            No {type ?? ''} devices found. Add them from a{' '}
                            <Link href="/users" style={{ color: '#f5c842' }}>user's profile</Link>.
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
                                        {device.identifier ?? 'No identifier'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Link
                                        href={route('users.edit', device.user.id)}
                                        style={{ fontSize: 13, color: '#f5c842', textDecoration: 'none', display: 'block', marginBottom: 4 }}
                                    >
                                        {device.user.name}
                                    </Link>
                                    <span className="badge">{device.type}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}