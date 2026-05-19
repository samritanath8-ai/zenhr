import React from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useState } from 'react';

interface Asset { id: number; name: string; asset_number: string; type: string; }
interface User  { id: number; name: string; email: string; }
interface AssetRequest {
    id: number;
    asset: Asset;
    user: User;
    status: 'pending' | 'approved' | 'rejected';
    reason: string | null;
    rejection_reason: string | null;
    reviewer: User | null;
    reviewed_at: string | null;
    created_at: string;
}
interface Props { requests: AssetRequest[]; availableAssets: Asset[]; }
interface PageProps { auth: { user: { role: string; name: string } }; [key: string]: unknown; }

const STATUS_COLOR = { pending: '#f5c842', approved: '#64dc8c', rejected: '#ff6b6b' };
const STATUS_BG    = { pending: 'rgba(245,200,66,0.1)', approved: 'rgba(100,220,140,0.1)', rejected: 'rgba(255,107,107,0.1)' };

export default function RequestsIndex({ requests, availableAssets }: Props) {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.role;
    const isAdmin = ['admin', 'manager'].includes(role);

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        asset_id: '',
        reason: '',
    });

    const [rejectingId, setRejectingId]       = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const submit = () => {
        post('/requests', { onSuccess: () => reset() });
    };

    const approve = (id: number) => {
        router.patch(`/requests/${id}/approve`);
    };

    const reject = (id: number) => {
        router.patch(`/requests/${id}/reject`, { rejection_reason: rejectionReason }, {
            onSuccess: () => { setRejectingId(null); setRejectionReason(''); },
        });
    };

    const pending  = requests.filter(r => r.status === 'pending');
    const resolved = requests.filter(r => r.status !== 'pending');

    return (
        <AuthenticatedLayout header="Requests">
            <Head title="Asset Requests" />
            <style>{`
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; margin-bottom: 20px; }
                .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #fff; outline: none; font-family: inherit; box-sizing: border-box; transition: border-color 0.2s; }
                .field-input:focus { border-color: rgba(245,200,66,0.4); }
                .field-input option { background: #1a1f2e; }
                .btn { border: none; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .btn-primary { background: #f5c842; color: #080b14; }
                .btn-primary:hover:not(:disabled) { background: #ffd54f; }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-approve { background: rgba(100,220,140,0.15); color: #64dc8c; border: 1px solid rgba(100,220,140,0.25); padding: 6px 14px; font-size: 12px; }
                .btn-approve:hover { background: rgba(100,220,140,0.25); }
                .btn-reject  { background: rgba(255,107,107,0.1); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.2); padding: 6px 14px; font-size: 12px; }
                .btn-reject:hover  { background: rgba(255,107,107,0.2); }
                .btn-cancel  { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); padding: 6px 14px; font-size: 12px; }
                .req-row { padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .req-row:last-child { border-bottom: none; }
                .badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 500; }
                .section-header { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px; }
                .empty { text-align: center; padding: 28px; color: rgba(255,255,255,0.25); font-size: 14px; }
                .reject-box { margin-top: 10px; display: flex; gap: 8px; align-items: flex-start; }
                .field-error { font-size: 12px; color: #ff6b6b; margin-top: 4px; }
                .success-msg { background: rgba(91,219,143,0.1); border: 1px solid rgba(91,219,143,0.25); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #5bdb8f; margin-bottom: 16px; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Asset Requests</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                        {isAdmin ? 'Review and action asset requests from your team.' : 'Request an asset or check your request status.'}
                    </p>
                </div>

                {/* Submit request form — all users */}
                {availableAssets.length > 0 && (
                    <div className="panel">
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Request an asset</div>
                        {wasSuccessful && <div className="success-msg">Request submitted successfully.</div>}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label className="field-label">Asset</label>
                                <select className="field-input" value={data.asset_id} onChange={e => setData('asset_id', e.target.value)}>
                                    <option value="">Select an available asset…</option>
                                    {availableAssets.map(a => (
                                        <option key={a.id} value={a.id}>{a.name} ({a.asset_number})</option>
                                    ))}
                                </select>
                                {errors.asset_id && <p className="field-error">{errors.asset_id}</p>}
                            </div>
                            <div>
                                <label className="field-label">Reason <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                                <input className="field-input" type="text" placeholder="Why do you need this asset?" value={data.reason} onChange={e => setData('reason', e.target.value)} />
                            </div>
                        </div>
                        <button className="btn btn-primary" disabled={processing || !data.asset_id} onClick={submit}>
                            {processing ? 'Submitting…' : 'Submit request'}
                        </button>
                    </div>
                )}

                {/* Pending requests */}
                <div className="panel">
                    <div className="section-header">Pending · {pending.length}</div>
                    {pending.length === 0 ? (
                        <div className="empty">No pending requests.</div>
                    ) : pending.map(req => (
                        <div key={req.id} className="req-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{req.asset.name}</span>
                                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f5c842' }}>{req.asset.asset_number}</span>
                                        <span className="badge" style={{ background: STATUS_BG.pending, color: STATUS_COLOR.pending, border: `1px solid ${STATUS_COLOR.pending}40` }}>Pending</span>
                                    </div>
                                    {isAdmin && (
                                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                                            Requested by <span style={{ color: '#e0e0e0' }}>{req.user.name}</span>
                                        </div>
                                    )}
                                    {req.reason && (
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>"{req.reason}"</div>
                                    )}
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                {isAdmin && rejectingId !== req.id && (
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button className="btn btn-approve" onClick={() => approve(req.id)}>Approve</button>
                                        <button className="btn btn-reject"  onClick={() => { setRejectingId(req.id); setRejectionReason(''); }}>Reject</button>
                                    </div>
                                )}
                            </div>
                            {isAdmin && rejectingId === req.id && (
                                <div className="reject-box">
                                    <input
                                        className="field-input"
                                        style={{ flex: 1 }}
                                        placeholder="Rejection reason (optional)…"
                                        value={rejectionReason}
                                        onChange={e => setRejectionReason(e.target.value)}
                                        autoFocus
                                    />
                                    <button className="btn btn-reject"  onClick={() => reject(req.id)}>Confirm</button>
                                    <button className="btn btn-cancel"  onClick={() => setRejectingId(null)}>Cancel</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Resolved requests */}
                {resolved.length > 0 && (
                    <div className="panel">
                        <div className="section-header">History · {resolved.length}</div>
                        {resolved.map(req => (
                            <div key={req.id} className="req-row">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{req.asset.name}</span>
                                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f5c842' }}>{req.asset.asset_number}</span>
                                            <span className="badge" style={{ background: STATUS_BG[req.status], color: STATUS_COLOR[req.status], border: `1px solid ${STATUS_COLOR[req.status]}40` }}>
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </div>
                                        {isAdmin && (
                                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                                                Requested by <span style={{ color: '#e0e0e0' }}>{req.user.name}</span>
                                            </div>
                                        )}
                                        {req.reason && (
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>"{req.reason}"</div>
                                        )}
                                        {req.status === 'rejected' && req.rejection_reason && (
                                            <div style={{ fontSize: 12, color: '#ff6b6b', marginTop: 4 }}>Rejected: {req.rejection_reason}</div>
                                        )}
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>
                                            {req.reviewer ? `Reviewed by ${req.reviewer.name} · ` : ''}
                                            {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString() : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}