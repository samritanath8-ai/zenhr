import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Device {
    id: number;
    type: 'mac' | 'ios' | 'android' | 'windows';
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    devices: Device[];
}

interface Props {
    users: {
        data: User[];
    };
}

interface PageProps {
    auth: { user: { role: string } };
    [key: string]: unknown;
}

export default function Index({ users }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user.role === 'admin';

    const [search, setSearch] = useState('');

    const filtered = users.data.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.role || 'employee').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout header="Users">
            <Head title="Users" />
            <style>{`
                .users-table { width: 100%; border-collapse: collapse; }
                .users-table th { text-align: left; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; padding: 0 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.07); }
                .users-table td { padding: 14px 16px; font-size: 14px; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.05); }
                .users-table tr:hover td { background: rgba(255,255,255,0.02); }
                .badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 500; background: rgba(245,200,66,0.1); color: #f5c842; border: 1px solid rgba(245,200,66,0.2); }
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; }
                .btn-add { display: inline-flex; align-items: center; gap: 8px; background: #f5c842; color: #080b14; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; }
                .btn-add:hover { background: #ffd54f; transform: translateY(-1px); }
                .search-wrap { position: relative; }
                .search-input { width: 260px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 16px 10px 38px; font-size: 14px; color: #fff; outline: none; transition: all 0.2s; }
                .search-input::placeholder { color: rgba(255,255,255,0.3); }
                .search-input:focus { border-color: rgba(245,200,66,0.4); background: rgba(255,255,255,0.07); }
                .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
                .clear-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 16px; padding: 2px 4px; line-height: 1; }
                .clear-btn:hover { color: rgba(255,255,255,0.7); }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Users</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                            {search ? `${filtered.length} of ${users.data.length} users` : `${users.data.length} total users`}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="search-wrap">
                            <span className="search-icon">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </span>
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search by name, email or role…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            {search && (
                                <button className="clear-btn" onClick={() => setSearch('')}>×</button>
                            )}
                        </div>
                        {/* Add user: admin only */}
                        {isAdmin && (
                            <Link href={route('users.create')} className="btn-add">
                                + Add user
                            </Link>
                        )}
                    </div>
                </div>

                <div className="panel">
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                            {search
                                ? <>No users match "<span style={{ color: '#f5c842' }}>{search}</span>"</>
                                : isAdmin ? <>No users yet. <Link href={route('users.create')} style={{ color: '#f5c842' }}>Add one</Link></> : <>No users found.</>
                            }
                        </div>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Devices</th>
                                    {/* Edit column header: admin only */}
                                    {isAdmin && <th></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 500, color: '#fff' }}>{user.name}</td>
                                        <td style={{ color: 'rgba(255,255,255,0.5)' }}>{user.email}</td>
                                        <td><span className="badge">{user.role || 'employee'}</span></td>
                                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                {user.devices && user.devices.length > 0
                                                    ? user.devices.map(device => (
                                                        <span key={device.id} style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                                            padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                                                            background: device.type === 'mac' ? 'rgba(100,180,255,0.12)' :
                                                                        device.type === 'ios' ? 'rgba(120,200,120,0.12)' :
                                                                        device.type === 'android' ? 'rgba(100,220,140,0.12)' :
                                                                        'rgba(100,140,255,0.12)',
                                                            color: device.type === 'mac' ? '#6ab4ff' :
                                                                   device.type === 'ios' ? '#78c878' :
                                                                   device.type === 'android' ? '#64dc8c' :
                                                                   '#648cff',
                                                            border: '1px solid currentColor',
                                                            opacity: 0.85,
                                                        }}>
                                                            {device.type === 'mac' ? (
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                                                            ) : device.type === 'ios' ? (
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>
                                                            ) : device.type === 'android' ? (
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16a7 7 0 0114 0"/><line x1="12" y1="16" x2="12" y2="21"/><circle cx="8" cy="16" r=".5"/><circle cx="16" cy="16" r=".5"/></svg>
                                                            ) : (
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                                                            )}
                                                            {device.type}
                                                        </span>
                                                    ))
                                                    : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>No devices</span>
                                                }
                                            </div>
                                        </td>
                                        {/* Edit link: admin only */}
                                        {isAdmin && (
                                            <td>
                                                <Link href={route('users.edit', user.id)} style={{ fontSize: '13px', color: '#f5c842', textDecoration: 'none' }}>
                                                    Edit
                                                </Link>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}