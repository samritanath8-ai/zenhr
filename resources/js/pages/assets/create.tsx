import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface User { id: number; name: string; email: string; }
interface Props { users: User[]; }

export default function CreateAsset({ users }: Props) {
    const params = new URLSearchParams(window.location.search);
    const prefilledUserId = params.get('user_id') ?? '';

    const { data, setData, post, processing, errors } = useForm({
        asset_number: '', name: '', type: '', serial_number: '', device_platform: '',
        vendor: '', department: '', location: '', purchase_price: '', purchase_date: '',
        warranty_expiry: '', status: 'available', notes: '', user_id: prefilledUserId,
    });

    return (
        <AuthenticatedLayout header="Add Asset">
            <Head title="Add Asset" />
            <style>{`
                .form-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 720px; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 6px; }
                .form-group.full { grid-column: 1 / -1; }
                label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; }
                .form-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; font-size: 14px; color: #fff; outline: none; transition: all 0.2s; font-family: inherit; width: 100%; }
                .form-input:focus { border-color: rgba(245,200,66,0.4); background: rgba(255,255,255,0.07); }
                .form-input option { background: #1a1f2e; color: #fff; }
                .form-input::placeholder { color: rgba(255,255,255,0.2); }
                .error { font-size: 12px; color: #ff6b6b; }
                .btn-save { background: #f5c842; color: #080b14; border: none; border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .btn-save:hover { background: #ffd54f; }
                .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Add Asset</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Fill in the asset details below</p>
                </div>

                <div className="form-panel">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Asset Number *</label>
                            <input className="form-input" placeholder="AST-001" value={data.asset_number} onChange={e => setData('asset_number', e.target.value)} />
                            {errors.asset_number && <span className="error">{errors.asset_number}</span>}
                        </div>
                        <div className="form-group">
                            <label>Name *</label>
                            <input className="form-input" placeholder="MacBook Pro 14" value={data.name} onChange={e => setData('name', e.target.value)} />
                            {errors.name && <span className="error">{errors.name}</span>}
                        </div>
                    <div className="form-group">
                        <label>Type *</label>
                        <select className="form-input" value={data.type} onChange={e => setData('type', e.target.value)}>
                            <option value="">Select type</option>
                            {['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Phone', 'Tablet', 'Chair', 'Desk', 'Other'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.type && <span className="error">{errors.type}</span>}
                        </div>
                        {['Laptop', 'Phone', 'Tablet'].includes(data.type) && (
                            <div className="form-group">
                                <label>Platform *</label>
                                <select className="form-input" value={data.device_platform} onChange={e => setData('device_platform', e.target.value)}>
                                    <option value="">Select platform</option>
                                    {data.type === 'Laptop' && <><option value="mac">Mac</option><option value="windows">Windows</option></>}
                                    {data.type === 'Phone' && <><option value="ios">iOS</option><option value="android">Android</option></>}
                                    {data.type === 'Tablet' && <><option value="ios">iOS</option><option value="android">Android</option></>}
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Serial Number</label>
                            <input className="form-input" placeholder="SN-XXXXXXXX" value={data.serial_number} onChange={e => setData('serial_number', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Vendor</label>
                            <input className="form-input" placeholder="Apple, Dell, etc." value={data.vendor} onChange={e => setData('vendor', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <select className="form-input" value={data.department} onChange={e => setData('department', e.target.value)}>
                                <option value="">Select department</option>
                                {['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'IT', 'Legal', 'Design', 'Other'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input className="form-input" placeholder="e.g. Floor 2, Desk 14" value={data.location} onChange={e => setData('location', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Purchase Price</label>
                            <input className="form-input" type="number" placeholder="0.00" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Purchase Date</label>
                            <input className="form-input" type="date" value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Warranty Expiry</label>
                            <input className="form-input" type="date" value={data.warranty_expiry} onChange={e => setData('warranty_expiry', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Status *</label>
                            <select className="form-input" value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="available">Available</option>
                                <option value="assigned">Assigned</option>
                                <option value="in-repair">In Repair</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Assign To</label>
                            <select className="form-input" value={data.user_id} onChange={e => setData('user_id', e.target.value)}>
                                <option value="">Unassigned</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group full">
                            <label>Notes</label>
                            <textarea className="form-input" rows={3} placeholder="Any notes about this asset..." value={data.notes} onChange={e => setData('notes', e.target.value)} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                        <button className="btn-save" disabled={processing} onClick={() => post(route('assets.store'))}>
                            {processing ? 'Saving…' : 'Save Asset'}
                        </button>
                        <Link href="/assets" style={{ padding: '11px 24px', fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Cancel</Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}