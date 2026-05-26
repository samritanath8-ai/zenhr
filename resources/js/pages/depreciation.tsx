import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface DepreciationRecord {
    id: number;
    asset_id: number;
    asset_number: string;
    asset_name: string;
    asset_type: string;
    method: 'straight_line' | 'declining_balance' | 'units_of_production';
    purchase_price: string;
    salvage_value: string;
    useful_life_years: number | null;
    declining_rate: string | null;
    total_units: number | null;
    units_used: number;
    depreciation_start: string;
    book_value: number;
    accumulated: number;
    percent_used: number;
}

interface AvailableAsset {
    id: number;
    name: string;
    asset_number: string;
    purchase_price: string | null;
    purchase_date: string | null;
}

interface Props { depreciations: DepreciationRecord[]; assets: AvailableAsset[]; }
interface PageProps { auth: { user: { role: string } }; [key: string]: unknown; }

const METHOD_LABEL: Record<string, string> = {
    straight_line: 'Straight-line',
    declining_balance: 'Declining balance',
    units_of_production: 'Units of production',
};
const METHOD_COLOR: Record<string, string> = {
    straight_line: '#6ab4ff',
    declining_balance: '#f5c842',
    units_of_production: '#6ecfaa',
};

function fmt(n: number) {
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DepreciationIndex({ depreciations, assets }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user.role === 'admin';

    const [showForm, setShowForm]   = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        asset_id: '',
        method: 'straight_line',
        purchase_price: '',
        salvage_value: '0',
        useful_life_years: '',
        declining_rate: '',
        total_units: '',
        units_used: '0',
        depreciation_start: '',
    });

    const editForm = useForm({
        units_used: '',
        declining_rate: '',
        useful_life_years: '',
        salvage_value: '',
    });

    const submit = () => {
        post('/depreciation', { onSuccess: () => { reset(); setShowForm(false); } });
    };

    const startEdit = (d: DepreciationRecord) => {
        setEditingId(d.id);
        editForm.setData({
            units_used: String(d.units_used),
            declining_rate: d.declining_rate ?? '',
            useful_life_years: d.useful_life_years ? String(d.useful_life_years) : '',
            salvage_value: d.salvage_value,
        });
    };

    const submitEdit = (id: number) => {
        editForm.patch(`/depreciation/${id}`, { onSuccess: () => setEditingId(null) });
    };

    const totalOriginal    = depreciations.reduce((s, d) => s + parseFloat(d.purchase_price), 0);
    const totalAccumulated = depreciations.reduce((s, d) => s + d.accumulated, 0);
    const totalBookValue   = depreciations.reduce((s, d) => s + d.book_value, 0);

    return (
        <AuthenticatedLayout header="Depreciation">
            <Head title="Depreciation" />
            <style>{`
                .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; margin-bottom: 20px; }
                .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 24px; }
                .field-label { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.4); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 6px; }
                .field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 13px; font-size: 13px; color: #fff; outline: none; font-family: inherit; box-sizing: border-box; transition: border-color 0.2s; }
                .field-input:focus { border-color: rgba(245,200,66,0.4); }
                .field-input option { background: #1a1f2e; }
                .field-error { font-size: 11px; color: #ff6b6b; margin-top: 3px; }
                .btn { border: none; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
                .btn-primary { background: #f5c842; color: #080b14; }
                .btn-primary:hover:not(:disabled) { background: #ffd54f; }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-ghost { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); }
                .btn-ghost:hover { background: rgba(255,255,255,0.09); color: #fff; }
                .btn-danger { background: rgba(255,107,107,0.1); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.2); }
                .btn-danger:hover { background: rgba(255,107,107,0.2); }
                .dep-row { padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .dep-row:last-child { border-bottom: none; }
                .progress-track { height: 6px; background: rgba(255,255,255,0.07); border-radius: 100px; overflow: hidden; margin-top: 8px; }
                .progress-fill { height: 100%; border-radius: 100px; transition: width 0.6s ease; }
                .method-badge { display: inline-block; padding: 2px 10px; border-radius: 100px; font-size: 11px; font-weight: 500; }
                .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
                .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
                .edit-inline { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; margin-top: 12px; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Depreciation</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Track asset value over time across all depreciation methods.</p>
                    </div>
                    {/* Add schedule: admin only */}
                    {isAdmin && assets.length > 0 && (
                        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
                            {showForm ? 'Cancel' : '+ Add schedule'}
                        </button>
                    )}
                </div>

                {/* Summary cards */}
                {depreciations.length > 0 && (
                    <div className="summary-grid">
                        <div className="stat-card">
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Original value</div>
                            <div style={{ fontSize: 26, fontWeight: 700, color: '#f5c842' }}>{fmt(totalOriginal)}</div>
                        </div>
                        <div className="stat-card">
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Total depreciated</div>
                            <div style={{ fontSize: 26, fontWeight: 700, color: '#ff6b6b' }}>{fmt(totalAccumulated)}</div>
                        </div>
                        <div className="stat-card">
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Current book value</div>
                            <div style={{ fontSize: 26, fontWeight: 700, color: '#64dc8c' }}>{fmt(totalBookValue)}</div>
                        </div>
                    </div>
                )}

                {/* Add form: admin only */}
                {isAdmin && showForm && (
                    <div className="panel" style={{ borderColor: 'rgba(245,200,66,0.15)' }}>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>New depreciation schedule</div>

                        <div style={{ marginBottom: 14 }}>
                            <label className="field-label">Asset</label>
                            <select className="field-input" value={data.asset_id} onChange={e => {
                                const a = assets.find(x => String(x.id) === e.target.value);
                                setData(d => ({
                                    ...d,
                                    asset_id: e.target.value,
                                    purchase_price: a?.purchase_price ?? '',
                                    depreciation_start: a?.purchase_date ?? '',
                                }));
                            }}>
                                <option value="">Select asset…</option>
                                {assets.map(a => (
                                    <option key={a.id} value={a.id}>{a.name} ({a.asset_number})</option>
                                ))}
                            </select>
                            {errors.asset_id && <p className="field-error">{errors.asset_id}</p>}
                        </div>

                        <div className="form-grid-3" style={{ marginBottom: 14 }}>
                            <div>
                                <label className="field-label">Method</label>
                                <select className="field-input" value={data.method} onChange={e => setData('method', e.target.value)}>
                                    <option value="straight_line">Straight-line</option>
                                    <option value="declining_balance">Declining balance</option>
                                    <option value="units_of_production">Units of production</option>
                                </select>
                            </div>
                            <div>
                                <label className="field-label">Purchase price (₹)</label>
                                <input className="field-input" type="number" step="0.01" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)} />
                                {errors.purchase_price && <p className="field-error">{errors.purchase_price}</p>}
                            </div>
                            <div>
                                <label className="field-label">Salvage value (₹)</label>
                                <input className="field-input" type="number" step="0.01" value={data.salvage_value} onChange={e => setData('salvage_value', e.target.value)} />
                            </div>
                        </div>

                        <div className="form-grid-3" style={{ marginBottom: 20 }}>
                            <div>
                                <label className="field-label">Start date</label>
                                <input className="field-input" type="date" value={data.depreciation_start} onChange={e => setData('depreciation_start', e.target.value)} />
                                {errors.depreciation_start && <p className="field-error">{errors.depreciation_start}</p>}
                            </div>
                            {data.method === 'straight_line' && (
                                <div>
                                    <label className="field-label">Useful life (years)</label>
                                    <input className="field-input" type="number" min="1" value={data.useful_life_years} onChange={e => setData('useful_life_years', e.target.value)} />
                                    {errors.useful_life_years && <p className="field-error">{errors.useful_life_years}</p>}
                                </div>
                            )}
                            {data.method === 'declining_balance' && (
                                <div>
                                    <label className="field-label">Depreciation rate (%)</label>
                                    <input className="field-input" type="number" step="0.01" min="0.01" max="100" value={data.declining_rate} onChange={e => setData('declining_rate', e.target.value)} />
                                    {errors.declining_rate && <p className="field-error">{errors.declining_rate}</p>}
                                </div>
                            )}
                            {data.method === 'units_of_production' && (<>
                                <div>
                                    <label className="field-label">Total units</label>
                                    <input className="field-input" type="number" min="1" value={data.total_units} onChange={e => setData('total_units', e.target.value)} />
                                    {errors.total_units && <p className="field-error">{errors.total_units}</p>}
                                </div>
                                <div>
                                    <label className="field-label">Units used so far</label>
                                    <input className="field-input" type="number" min="0" value={data.units_used} onChange={e => setData('units_used', e.target.value)} />
                                </div>
                            </>)}
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-primary" disabled={processing || !data.asset_id || !data.purchase_price} onClick={submit}>
                                {processing ? 'Saving…' : 'Save schedule'}
                            </button>
                            <button className="btn btn-ghost" onClick={() => { setShowForm(false); reset(); }}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Records */}
                <div className="panel">
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>
                        Schedules · {depreciations.length}
                    </div>

                    {depreciations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                            No depreciation schedules yet.{isAdmin ? ' Add one above.' : ''}
                        </div>
                    ) : depreciations.map(d => {
                        const depColor = d.percent_used > 80 ? '#ff6b6b' : d.percent_used > 50 ? '#f5c842' : '#64dc8c';

                        return (
                            <div key={d.id} className="dep-row">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{d.asset_name}</span>
                                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f5c842' }}>{d.asset_number}</span>
                                            <span className="method-badge" style={{ background: `${METHOD_COLOR[d.method]}18`, color: METHOD_COLOR[d.method], border: `1px solid ${METHOD_COLOR[d.method]}40` }}>
                                                {METHOD_LABEL[d.method]}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                                            <span>Original: <strong style={{ color: '#fff' }}>{fmt(parseFloat(d.purchase_price))}</strong></span>
                                            <span>Depreciated: <strong style={{ color: '#ff6b6b' }}>{fmt(d.accumulated)}</strong></span>
                                            <span>Book value: <strong style={{ color: '#64dc8c' }}>{fmt(d.book_value)}</strong></span>
                                            {d.method === 'units_of_production' && (
                                                <span>Units: <strong style={{ color: '#fff' }}>{d.units_used} / {d.total_units}</strong></span>
                                            )}
                                            {d.method === 'straight_line' && d.useful_life_years && (
                                                <span>Life: <strong style={{ color: '#fff' }}>{d.useful_life_years}yr</strong></span>
                                            )}
                                            {d.method === 'declining_balance' && d.declining_rate && (
                                                <span>Rate: <strong style={{ color: '#fff' }}>{d.declining_rate}%</strong></span>
                                            )}
                                            <span style={{ color: 'rgba(255,255,255,0.25)' }}>
                                                Since {new Date(d.depreciation_start).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="progress-track" style={{ flex: 1 }}>
                                                <div className="progress-fill" style={{ width: `${Math.min(d.percent_used, 100)}%`, background: depColor }} />
                                            </div>
                                            <span style={{ fontSize: 12, color: depColor, fontWeight: 600, minWidth: 36 }}>{d.percent_used}%</span>
                                        </div>
                                    </div>

                                    {/* Edit / Remove: admin only */}
                                    {isAdmin && (
                                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => editingId === d.id ? setEditingId(null) : startEdit(d)}>
                                                {editingId === d.id ? 'Cancel' : 'Edit'}
                                            </button>
                                            <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => router.delete(`/depreciation/${d.id}`)}>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Inline edit: admin only */}
                                {isAdmin && editingId === d.id && (
                                    <div className="edit-inline">
                                        <div className="form-grid-2" style={{ marginBottom: 14 }}>
                                            <div>
                                                <label className="field-label">Salvage value (₹)</label>
                                                <input className="field-input" type="number" step="0.01" value={editForm.data.salvage_value} onChange={e => editForm.setData('salvage_value', e.target.value)} />
                                            </div>
                                            {d.method === 'straight_line' && (
                                                <div>
                                                    <label className="field-label">Useful life (years)</label>
                                                    <input className="field-input" type="number" min="1" value={editForm.data.useful_life_years} onChange={e => editForm.setData('useful_life_years', e.target.value)} />
                                                </div>
                                            )}
                                            {d.method === 'declining_balance' && (
                                                <div>
                                                    <label className="field-label">Rate (%)</label>
                                                    <input className="field-input" type="number" step="0.01" value={editForm.data.declining_rate} onChange={e => editForm.setData('declining_rate', e.target.value)} />
                                                </div>
                                            )}
                                            {d.method === 'units_of_production' && (
                                                <div>
                                                    <label className="field-label">Units used</label>
                                                    <input className="field-input" type="number" min="0" value={editForm.data.units_used} onChange={e => editForm.setData('units_used', e.target.value)} />
                                                </div>
                                            )}
                                        </div>
                                        <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 16px' }} disabled={editForm.processing} onClick={() => submitEdit(d.id)}>
                                            {editForm.processing ? 'Saving…' : 'Save changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}