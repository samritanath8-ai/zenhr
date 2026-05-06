import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
    };
}

export default function Index({ users }: Props) {
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
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Users</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{users.data.length} total users</p>
                    </div>
                    <Link href={route('users.create')} className="btn-add">
                        + Add user
                    </Link>
                </div>

                <div className="panel">
                    {users.data.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                            No users yet. <Link href={route('users.create')} style={{ color: '#f5c842' }}>Add one</Link>
                        </div>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 500, color: '#fff' }}>{user.name}</td>
                                        <td style={{ color: 'rgba(255,255,255,0.5)' }}>{user.email}</td>
                                        <td><span className="badge">{user.role || 'employee'}</span></td>
                                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <Link href={route('users.edit', user.id)} style={{ fontSize: '13px', color: '#f5c842', textDecoration: 'none' }}>
                                                Edit
                                            </Link>
                                        </td>
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