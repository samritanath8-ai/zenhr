import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://hrm.test';
const REFRESH_INTERVAL = 30_000;

interface Metrics {
    total_users: number;
    active_sessions: number;
    requests_today: number;
}

interface ActivityDay {
    day: string;
    date: string;
    count: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    initials: string;
    joined: string;
}

interface ServiceStatus {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    latency_ms: number;
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

const BAR_COLORS = ['#7f77dd','#6ecfaa','#378add','#f5c518','#e07bb5','#5bc5f5','#f08060'];

const STATUS_COLOR: Record<string, string> = {
    operational: '#5bdb8f',
    degraded:    '#f5c518',
    down:        '#f87171',
};

export default function Dashboard() {
    const { auth, totalUsers, totalAssets, assignedAssets, availableAssets, inRepairAssets, expiringAssets } = usePage().props as any;
    const role = auth?.user?.role;

    const [metrics,     setMetrics]     = useState<Metrics | null>(null);
    const [activity,    setActivity]    = useState<ActivityDay[] | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[] | null>(null);
    const [sysStatus,   setSysStatus]   = useState<ServiceStatus[] | null>(null);
    const [loading,     setLoading]     = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const load = useCallback(async () => {
        try {
            const [m, a, u, s] = await Promise.all([
                fetch(`${API_BASE}/api/dashboard/metrics`).then(r => r.json()),
                fetch(`${API_BASE}/api/dashboard/activity`).then(r => r.json()),
                fetch(`${API_BASE}/api/dashboard/recent-users`).then(r => r.json()),
                fetch(`${API_BASE}/api/dashboard/status`).then(r => r.json()),
            ]);
            setMetrics(m);
            setActivity(a);
            setRecentUsers(u);
            setSysStatus(s);
            setLastUpdated(new Date());
        } catch (e) {
            console.error('Dashboard fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
        const interval = setInterval(load, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [load]);

    const maxCount = Math.max(...(activity?.map(d => d.count) ?? [1]), 1);

    const stats = [
        { label: 'Total Users',     value: metrics?.total_users     ?? totalUsers, icon: '👥' },
        { label: 'Active Sessions', value: loading ? '…' : (metrics?.active_sessions ?? '-'), icon: '🟢' },
        { label: 'Requests Today',  value: loading ? '…' : (metrics?.requests_today  ?? '-'), icon: '📈' },
    ];

    const assetStats = [
        { label: 'Total Assets',  value: totalAssets,     color: '#f5c842', bg: 'rgba(245,200,66,0.1)' },
        { label: 'Assigned',      value: assignedAssets,  color: '#6ab4ff', bg: 'rgba(100,180,255,0.1)' },
        { label: 'Available',     value: availableAssets, color: '#64dc8c', bg: 'rgba(100,220,140,0.1)' },
        { label: 'In Repair',     value: inRepairAssets,  color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
        { label: 'Expiring Soon', value: expiringAssets,  color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
    ];

    const quickActions = [
        ...((['admin', 'manager'].includes(role)) ? [
            { href: '/users/create', icon: '+',  bg: 'rgba(245,200,66,0.12)',  title: 'Add user',     sub: 'Create a new account' },
            { href: '/users',        icon: '👥', bg: 'rgba(100,120,255,0.12)', title: 'Manage users', sub: 'View all registered users' },
            { href: '/assets/create',icon: '📦', bg: 'rgba(100,220,140,0.12)', title: 'Add asset',    sub: 'Register a new asset' },
            { href: '/assets',       icon: '🗂', bg: 'rgba(100,180,255,0.12)', title: 'View assets',  sub: 'Browse all assets' },
        ] : []),
        { href: '/profile', icon: '⚙', bg: 'rgba(255,100,100,0.1)', title: 'Settings', sub: 'Profile & preferences' },
        ...(expiringAssets > 0 && ['admin', 'manager'].includes(role) ? [
            { href: '/assets?status=assigned', icon: '⚠', bg: 'rgba(255,107,107,0.12)', title: `${expiringAssets} expiring`, sub: 'Warranties expiring soon' },
        ] : []),
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />
            <style>{`
                .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; transition: all 0.25s ease; }
                .stat-card:hover { background: rgba(255,255,255,0.055); border-color: rgba(245,200,66,0.15); transform: translateY(-2px); }
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; }
                .shimmer-bar { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.8s infinite; border-radius: 6px; }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .quick-link { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); text-decoration: none; transition: all 0.2s ease; color: #fff; }
                .quick-link:hover { background: rgba(255,255,255,0.06); border-color: rgba(245,200,66,0.2); }
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to {opacity:1;transform:translateY(0);} }
                .fade-up   { animation: fadeUp 0.5s ease both; }
                .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
                .fade-up-2 { animation: fadeUp 0.5s 0.12s ease both; }
                .fade-up-3 { animation: fadeUp 0.5s 0.2s ease both; }
                .live-bar  { transition: height 0.6s ease; border-radius: 5px 5px 0 0; width: 100%; }
                .user-row:hover { background: rgba(255,255,255,0.04); border-radius: 10px; }
                .alert-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; border-radius: 12px; background: rgba(255,107,107,0.06); border: 1px solid rgba(255,107,107,0.2); margin-bottom: 20px; }
            `}</style>

            <div style={{ color: '#fff' }}>

                <div className="fade-up" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h2 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                            Good {getGreeting()}, {auth?.user?.name?.split(' ')[0] ?? 'there'} 👋
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Here's what's happening today.</p>
                    </div>
                    {lastUpdated && (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                            Updated {lastUpdated.toLocaleTimeString()} · refreshes every 30s
                        </span>
                    )}
                </div>

                {/* Expiring warranty alert */}
                {expiringAssets > 0 && ['admin', 'manager'].includes(role) && (
                    <div className="alert-banner fade-up">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#ff6b6b' }}>
                                {expiringAssets} asset{expiringAssets !== 1 ? 's' : ''} with warranty expiring within 30 days
                            </span>
                        </div>
                        <a href="/assets" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', whiteSpace: 'nowrap' }}>View assets →</a>
                    </div>
                )}

                {/* User stats */}
                <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</span>
                                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                            </div>
                            {loading && i > 0
                                ? <div className="shimmer-bar" style={{ height: '38px', width: '70px' }} />
                                : <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em' }}>{s.value}</div>
                            }
                        </div>
                    ))}
                </div>

                {/* Asset stats */}
                {['admin', 'manager'].includes(role) && (
                    <div className="fade-up-1" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Asset Overview</span>
                            <a href="/assets" style={{ fontSize: '13px', color: '#f5c842', textDecoration: 'none', fontWeight: 500 }}>View all →</a>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                            {assetStats.map((s, i) => (
                                <div key={i} className="stat-card" style={{ padding: '18px' }}>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: '12px' }}>{s.label}</div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value ?? 0}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', marginBottom: '20px' }}>
                    <div className="panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>Activity Overview</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                                    {activity ? 'API requests per day' : 'Loading…'}
                                </div>
                            </div>
                            <span style={{ padding: '5px 12px', borderRadius: '100px', background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.2)', fontSize: '12px', color: '#f5c842', fontWeight: 500 }}>Last 7 days</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                            {(activity ?? Array.from({ length: 7 }, (_, i) => ({ day: '', date: String(i), count: 0, skeleton: true }))).map((d: any, i: number) => {
                                const height = d.skeleton ? [40,65,30,80,55,70,45][i] : Math.max(Math.round((d.count / maxCount) * 75), d.count > 0 ? 8 : 3);
                                return (
                                    <div key={d.date} style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }} title={!d.skeleton ? `${d.day}: ${d.count} requests` : undefined}>
                                        <div
                                            className={d.skeleton ? 'shimmer-bar' : 'live-bar'}
                                            style={{
                                                height: `${height}px`, width: '100%',
                                                background: d.skeleton ? undefined : (d.count > 0 ? BAR_COLORS[i % BAR_COLORS.length] : 'rgba(255,255,255,0.07)'),
                                                opacity: d.skeleton ? 1 : (d.count > 0 ? 0.85 : 0.4),
                                                borderRadius: '5px 5px 0 0',
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            {(activity ?? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({ day: d }))).map((d: any, i: number) => (
                                <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{d.day}</span>
                            ))}
                        </div>
                        {activity && (
                            <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                                Total: {activity.reduce((s, d) => s + d.count, 0).toLocaleString()} requests
                            </div>
                        )}
                    </div>

                    <div className="panel">
                        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '20px' }}>Quick actions</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {quickActions.map(item => (
                                <a key={item.href + item.title} href={item.href} className="quick-link">
                                    <span style={{ width: '34px', height: '34px', borderRadius: '8px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{item.sub}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="panel">
                        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '20px' }}>Recent users</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {loading || !recentUsers
                                ? [1,2,3].map(i => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0' }}>
                                        <div className="shimmer-bar" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="shimmer-bar" style={{ height: '12px', width: '60%', marginBottom: '6px' }} />
                                            <div className="shimmer-bar" style={{ height: '10px', width: '40%' }} />
                                        </div>
                                        <div className="shimmer-bar" style={{ height: '22px', width: '55px', borderRadius: '100px' }} />
                                    </div>
                                ))
                                : recentUsers.map(user => (
                                    <div key={user.id} className="user-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                                            background: 'linear-gradient(135deg, #7f77dd, #378add)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '13px', fontWeight: 700, color: '#fff',
                                        }}>{user.initials}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                                        </div>
                                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{user.joined}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <a href="/users" style={{ display: 'block', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#f5c842', textDecoration: 'none', fontWeight: 500 }}>
                            View all users →
                        </a>
                    </div>

                    <div className="panel">
                        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '20px' }}>System status</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {loading || !sysStatus
                                ? ['API','Database','Auth service'].map(name => (
                                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{name}</span>
                                        <div className="shimmer-bar" style={{ height: '20px', width: '80px', borderRadius: '100px' }} />
                                    </div>
                                ))
                                : sysStatus.map(svc => (
                                    <div key={svc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{svc.name}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>{svc.latency_ms}ms</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: STATUS_COLOR[svc.status] ?? '#aaa', fontWeight: 500 }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLOR[svc.status] ?? '#aaa', display: 'inline-block' }} />
                                                {svc.status.charAt(0).toUpperCase() + svc.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {sysStatus && (
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                                Checked {lastUpdated?.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}