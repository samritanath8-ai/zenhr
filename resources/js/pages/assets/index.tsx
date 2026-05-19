import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useState, useMemo } from 'react';

interface Asset {
    id: number;
    asset_number: string;
    name: string;
    type: string;
    serial_number: string | null;
    vendor: string | null;
    department: string | null;
    location: string | null;
    purchase_price: string | null;
    purchase_date: string | null;
    warranty_expiry: string | null;
    status: 'available' | 'assigned' | 'in-repair' | 'retired';
    notes: string | null;
    user: { id: number; name: string; email: string } | null;
}

interface Props { assets: Asset[]; status: string | null; }
interface PageProps { auth: { user: { role: string } }; [key: string]: unknown; }

const STATUS_COLORS: Record<string, string> = {
    available: '#64dc8c', assigned: '#6ab4ff',
    'in-repair': '#f5c842', retired: 'rgba(255,255,255,0.3)',
};
const STATUS_BG: Record<string, string> = {
    available: 'rgba(100,220,140,0.1)', assigned: 'rgba(100,180,255,0.1)',
    'in-repair': 'rgba(245,200,66,0.1)', retired: 'rgba(255,255,255,0.05)',
};
const TABS = [
    { label: 'All', key: null },
    { label: 'Available', key: 'available' },
    { label: 'Assigned', key: 'assigned' },
    { label: 'In Repair', key: 'in-repair' },
    { label: 'Retired', key: 'retired' },
];

export default function AssetsIndex({ assets, status }: Props) {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.role;

    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterLocation, setFilterLocation] = useState('');

    const types = useMemo(() => [...new Set(assets.map(a => a.type).filter(Boolean))].sort(), [assets]);
    const departments = useMemo(() => [...new Set(assets.map(a => a.department).filter(Boolean))].sort(), [assets]);
    const locations = useMemo(() => [...new Set(assets.map(a => a.location).filter(Boolean))].sort(), [assets]);

    const filtered = useMemo(() => assets.filter(a => {
        const q = search.toLowerCase();
        const matchSearch = !q || a.asset_number.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || (a.serial_number ?? '').toLowerCase().includes(q) || (a.vendor ?? '').toLowerCase().includes(q) || (a.user?.name ?? '').toLowerCase().includes(q);
        const matchType = !filterType || a.type === filterType;
        const matchDept = !filterDept || a.department === filterDept;
        const matchLoc  = !filterLocation || a.location === filterLocation;
        return matchSearch && matchType && matchDept && matchLoc;
    }), [assets, search, filterType, filterDept, filterLocation]);

    const hasFilters = search || filterType || filterDept || filterLocation;

    return (
        <AuthenticatedLayout header="Assets">
            <Head title="Assets" />
            <style>{`
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; }
                .tab { display: inline-flex; align-items: center; padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; text-decoration: none; color: rgba(255,255,255,0.45); transition: all 0.15s; border: 1px solid transparent; cursor: pointer; background: none; font-family: inherit; }
                .tab:hover { color: #fff; background: rgba(255,255,255,0.05); }
                .tab.active { color: #f5c842; background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.2); }
                .assets-table { width: 100%; border-collapse: collapse; }
                .assets-table th { text-align: left; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; padding: 0 14px 12px; border-bottom: 1px solid rgba(255,255,255,0.07); }
                .assets-table td { padding: 13px 14px; font-size: 13px; color: rgba(255,255,255,0.75); border-bottom: 1px solid rgba(255,255,255,0.05); }
                .assets-table tr:hover td { background: rgba(255,255,255,0.02); }
                .btn-add { display: inline-flex; align-items: center; gap: 8px; background: #f5c842; color: #080b14; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; }
                .btn-add:hover { background: #ffd54f; transform: translateY(-1px); }
                .search-wrap { position: relative; }
                .search-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 14px 9px 36px; font-size: 13px; color: #fff; outline: none; transition: all 0.2s; font-family: inherit; width: 220px; }
                .search-input:focus { border-color: rgba(245,200,66,0.4); background: rgba(255,255,255,0.07); }
                .search-input::placeholder { color: rgba(255,255,255,0.25); }
                .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
                .filter-select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 14px; font-size: 13px; color: #fff; outline: none; font-family: inherit; cursor: pointer; }
                .filter-select option { background: #1a1f2e; color: #fff; }
                .filter-select:focus { border-color: rgba(245,200,66,0.4); }
                .clear-btn { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 12px; padding: 6px 10px; border-radius: 8px; transition: all 0.15s; font-family: inherit; }
                .clear-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Assets</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                            {hasFilters ? `${filtered.length} of ${assets.length}` : assets.length} asset{assets.length !== 1 ? 's' : ''}{status ? ` · ${status}` : ' total'}
                        </p>
                    </div>
                    {['admin', 'manager'].includes(role) && (
                        <Link href="/assets/create" className="btn-add">+ Add asset</Link>
                    )}
                </div>

                {/* Status tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                    {TABS.map(tab => (
                        <Link
                            key={tab.label}
                            href={tab.key ? `/assets?status=${tab.key}` : '/assets'}
                            className={`tab ${status === tab.key ? 'active' : ''}`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                {/* Search & filters */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-wrap">
                        <span className="search-icon">
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </span>
                        <input className="search-input" placeholder="Search assets…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    {types.length > 0 && (
                        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                            <option value="">All types</option>
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    )}
                    {departments.length > 0 && (
                        <select className="filter-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                            <option value="">All departments</option>
                            {departments.map(d => <option key={d} value={d!}>{d}</option>)}
                        </select>
                    )}
                    {locations.length > 0 && (
                        <select className="filter-select" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                            <option value="">All locations</option>
                            {locations.map(l => <option key={l} value={l!}>{l}</option>)}
                        </select>
                    )}
                    {hasFilters && (
                        <button className="clear-btn" onClick={() => { setSearch(''); setFilterType(''); setFilterDept(''); setFilterLocation(''); }}>
                            Clear filters
                        </button>
                    )}
                </div>

                <div className="panel">
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
                            {hasFilters ? 'No assets match your filters.' : 'No assets found.'}{' '}
                            {!hasFilters && ['admin', 'manager'].includes(role) && (
                                <Link href="/assets/create" style={{ color: '#f5c842' }}>Add one</Link>
                            )}
                        </div>
                    ) : (
                        <table className="assets-table">
                            <thead>
                                <tr>
                                    <th>Asset #</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Serial</th>
                                    <th>Vendor</th>
                                    <th>Department</th>
                                    <th>Location</th>
                                    <th>Warranty</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Notes</th>
                                    {['admin', 'manager'].includes(role) && <th></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(asset => (
                                    <tr key={asset.id}>
                                        <td style={{ fontWeight: 600, color: '#f5c842', fontFamily: 'monospace' }}>{asset.asset_number}</td>
                                        <td style={{ color: '#fff', fontWeight: 500 }}>{asset.name}</td>
                                        <td>{asset.type}</td>
                                        <td style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 12 }}>{asset.serial_number ?? '—'}</td>
                                        <td>{asset.vendor ?? '—'}</td>
                                        <td>{asset.department ?? '—'}</td>
                                        <td>{asset.location ?? '—'}</td>
                                        <td style={{ fontSize: 12 }}>
                                            {asset.warranty_expiry ? (() => {
                                                const expiry = new Date(asset.warranty_expiry);
                                                const today = new Date();
                                                const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                                const color = daysLeft < 0 ? '#ff6b6b' : daysLeft <= 30 ? '#f5c842' : 'rgba(255,255,255,0.4)';
                                                const label = daysLeft < 0 ? ' (expired)' : daysLeft <= 30 ? ` (${daysLeft}d left)` : '';
                                                return <span style={{ color }}>{expiry.toLocaleDateString()}{label}</span>;
                                            })() : <span style={{ color: 'rgba(255,255,255,0.4)' }}>—</span>}
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-block', padding: '3px 10px', borderRadius: 100,
                                                fontSize: 11, fontWeight: 500,
                                                background: STATUS_BG[asset.status],
                                                color: STATUS_COLORS[asset.status],
                                                border: `1px solid ${STATUS_COLORS[asset.status]}40`,
                                            }}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td>
                                            {asset.user
                                                ? <Link href={route('users.edit', asset.user.id)} style={{ color: '#6ab4ff', textDecoration: 'none', fontSize: 13 }}>{asset.user.name}</Link>
                                                : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Unassigned</span>
                                            }
                                        </td>
                                        <td style={{ maxWidth: 200, color: 'rgba(255,255,255,0.4)', fontSize: 12, whiteSpace: 'normal', lineHeight: 1.5 }}>
                                            {asset.notes ?? '—'}
                                        </td>
                                        {['admin', 'manager'].includes(role) && (
                                            <td>
                                                <Link href={route('assets.edit', asset.id)} style={{ fontSize: 13, color: '#f5c842', textDecoration: 'none' }}>Edit</Link>
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