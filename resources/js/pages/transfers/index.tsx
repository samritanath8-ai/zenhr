import { useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface User { id: number; name: string; email: string; }
interface Asset { id: number; name: string; asset_number: string; type: string; user_id: number | null; user?: User; }
interface Transfer {
    id: number;
    asset: Asset;
    from_user: User | null;
    to_user: User;
    requester: User;
    reviewer: User | null;
    status: 'pending' | 'approved' | 'rejected';
    reason: string | null;
    rejection_reason: string | null;
    reviewed_at: string | null;
    created_at: string;
}

interface Props {
    transfers: Transfer[];
    assets: Asset[];
    users: User[];
}

const STATUS_STYLES: Record<string, React.CSSProperties> = {
    pending:  { background: '#2a2200', color: '#f5c842', border: '1px solid rgba(245,200,66,0.3)' },
    approved: { background: '#0a2a1a', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' },
    rejected: { background: '#2a0a0a', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' },
};

export default function TransfersIndex({ transfers, assets, users }: Props) {
    const { auth } = usePage<any>().props;
    const role = auth?.user?.role;

    const [showForm, setShowForm] = useState(false);
    const [rejectId, setRejectId] = useState<number | null>(null);

    const form = useForm({ asset_id: '', to_user_id: '', reason: '' });
    const rejectForm = useForm({ rejection_reason: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/transfers', { onSuccess: () => {
 form.reset(); setShowForm(false); 
} });
    }

    function approve(id: number) {
        if (!confirm('Approve this transfer?')) {
return;
}

        router.patch(`/transfers/${id}/approve`);
    }

    function reject(e: React.FormEvent) {
        e.preventDefault();

        if (!rejectId) {
return;
}

        rejectForm.patch(`/transfers/${rejectId}/reject`, {
            onSuccess: () => {
 rejectForm.reset(); setRejectId(null); 
},
        });
    }

    return (
        <AuthenticatedLayout header="Asset Transfers">
            <style>{`
                .tr-wrap { max-width: 1100px; }
                .tr-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
                .tr-title { font-size:22px; font-weight:700; color:#fff; font-family:'Syne',sans-serif; }
                .btn-primary { background:#f5c842; color:#080b14; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer; font-size:13px; }
                .btn-primary:hover { background:#f0be30; }
                .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
                .card { background:#10151f; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; }
                .form-card { background:#10151f; border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:24px; margin-bottom:24px; }
                .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
                .form-group { display:flex; flex-direction:column; gap:6px; }
                .form-group.full { grid-column:1/-1; }
                .form-label { font-size:11px; font-weight:600; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; }
                .form-input, .form-select, .form-textarea { background:#1a1f2e; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 12px; color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; width:100%; box-sizing:border-box; }
                .form-input:focus, .form-select:focus, .form-textarea:focus { outline:none; border-color:#f5c842; }
                .form-select option { background:#1a1f2e; color:#fff; }
                .form-actions { display:flex; gap:12px; margin-top:20px; }
                .btn-secondary { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.7); border:none; padding:10px 20px; border-radius:8px; font-weight:500; cursor:pointer; font-size:13px; }
                .btn-secondary:hover { background:rgba(255,255,255,0.1); }
                table { width:100%; border-collapse:collapse; }
                th { padding:12px 16px; text-align:left; font-size:11px; font-weight:600; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid rgba(255,255,255,0.06); }
                td { padding:14px 16px; font-size:13px; color:rgba(255,255,255,0.75); border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
                tr:last-child td { border-bottom:none; }
                tr:hover td { background:rgba(255,255,255,0.02); }
                .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
                .action-btn { padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; border:none; }
                .approve-btn { background:rgba(74,222,128,0.12); color:#4ade80; }
                .approve-btn:hover { background:rgba(74,222,128,0.2); }
                .reject-btn { background:rgba(248,113,113,0.12); color:#f87171; }
                .reject-btn:hover { background:rgba(248,113,113,0.2); }
                .actions { display:flex; gap:8px; }
                .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; display:flex; align-items:center; justify-content:center; }
                .modal { background:#10151f; border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:28px; width:460px; max-width:95vw; }
                .modal-title { font-size:16px; font-weight:700; color:#fff; margin-bottom:20px; font-family:'Syne',sans-serif; }
                .empty { padding:48px; text-align:center; color:rgba(255,255,255,0.25); font-size:14px; }
            `}</style>

            <div className="tr-wrap">
                <div className="tr-header">
                    <div className="tr-title">Transfer Requests</div>
                    {['admin', 'manager'].includes(role) && (
                        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Cancel' : '+ New Transfer'}
                        </button>
                    )}
                </div>

                {showForm && (
                    <form className="form-card" onSubmit={submit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Asset to Transfer</label>
                                <select className="form-select" value={form.data.asset_id} onChange={e => form.setData('asset_id', e.target.value)} required>
                                    <option value="">Select asset...</option>
                                    {assets.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} ({a.asset_number}) — {a.user?.name ?? 'Unassigned'}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.asset_id && <span style={{ color: '#f87171', fontSize: 12 }}>{form.errors.asset_id}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Transfer To</label>
                                <select className="form-select" value={form.data.to_user_id} onChange={e => form.setData('to_user_id', e.target.value)} required>
                                    <option value="">Select user...</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
                                </select>
                                {form.errors.to_user_id && <span style={{ color: '#f87171', fontSize: 12 }}>{form.errors.to_user_id}</span>}
                            </div>
                            <div className="form-group full">
                                <label className="form-label">Reason (optional)</label>
                                <textarea className="form-textarea" rows={2} value={form.data.reason} onChange={e => form.setData('reason', e.target.value)} placeholder="Why is this transfer needed?" />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={form.processing}>
                                {form.processing ? 'Submitting…' : 'Submit Transfer'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                )}

                <div className="card">
                    {transfers.length === 0 ? (
                        <div className="empty">No transfer requests yet.</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Requested By</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    {['admin', 'manager'].includes(role) && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.map(t => (
                                    <tr key={t.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>{t.asset.name}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.asset.asset_number}</div>
                                        </td>
                                        <td>{t.from_user?.name ?? <span style={{ color: 'rgba(255,255,255,0.25)' }}>Unassigned</span>}</td>
                                        <td>{t.to_user.name}</td>
                                        <td>{t.requester.name}</td>
                                        <td style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {t.reason ?? '—'}
                                        </td>
                                        <td>
                                            <span className="badge" style={STATUS_STYLES[t.status]}>{t.status}</span>
                                        </td>
                                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </td>
                                        {['admin', 'manager'].includes(role) && (
                                            <td>
                                                {t.status === 'pending' ? (
                                                    <div className="actions">
                                                        <button className="action-btn approve-btn" onClick={() => approve(t.id)}>Approve</button>
                                                        <button className="action-btn reject-btn" onClick={() => setRejectId(t.id)}>Reject</button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                                                        {t.reviewer ? `by ${t.reviewer.name}` : '—'}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {rejectId && (
                <div className="modal-backdrop" onClick={() => setRejectId(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Reject Transfer</div>
                        <form onSubmit={reject}>
                            <div className="form-group">
                                <label className="form-label">Rejection Reason (optional)</label>
                                <textarea
                                    className="form-textarea"
                                    rows={3}
                                    value={rejectForm.data.rejection_reason}
                                    onChange={e => rejectForm.setData('rejection_reason', e.target.value)}
                                    placeholder="Reason for rejection..."
                                />
                            </div>
                            <div className="form-actions" style={{ marginTop: 16 }}>
                                <button type="submit" className="action-btn reject-btn" style={{ padding: '10px 20px' }} disabled={rejectForm.processing}>
                                    {rejectForm.processing ? 'Rejecting…' : 'Confirm Reject'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => setRejectId(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}