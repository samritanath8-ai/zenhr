import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Asset {
    id: number; asset_number: string; name: string; type: string;
    device_platform: string | null;
    serial_number: string | null; vendor: string | null;
    department: string | null; location: string | null;
    purchase_price: string | null; purchase_date: string | null;
    warranty_expiry: string | null; status: string; notes: string | null;
    user_id: number | null;
}
interface User { id: number; name: string; email: string; }
interface AssetLog {
    id: number;
    action: string;
    detail: string | null;
    created_at: string;
    user: { name: string } | null;
}
interface MaintenanceLog {
    id: number;
    type: string;
    maintenance_date: string;
    next_due: string | null;
    technician: string | null;
    cost: string | null;
    notes: string | null;
    logger: { name: string };
    created_at: string;
}
interface AssetDocument {
    id: number;
    label: string;
    file_name: string;
    mime_type: string | null;
    file_size: number | null;
    created_at: string;
    uploader: { name: string } | null;
}
interface Props {
    asset: Asset;
    users: User[];
    logs: AssetLog[];
    maintenanceLogs: MaintenanceLog[];
    documents: AssetDocument[];
}
interface PageProps { auth: { user: { role: string } }; [key: string]: unknown; }

const MIME_ICON: Record<string, string> = {
    'application/pdf': '📄',
    'image/png': '🖼️',
    'image/jpeg': '🖼️',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
};

function formatBytes(bytes: number | null): string {
    if (!bytes) return '';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
}

export default function EditAsset({ asset, users, logs, maintenanceLogs, documents }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user.role === 'admin';

    const { data, setData, put, processing, errors } = useForm({
        asset_number: asset.asset_number, name: asset.name, type: asset.type,
        serial_number: asset.serial_number ?? '', vendor: asset.vendor ?? '',
        device_platform: asset.device_platform ?? '',
        department: asset.department ?? '', location: asset.location ?? '',
        purchase_price: asset.purchase_price ?? '', purchase_date: asset.purchase_date ?? '',
        warranty_expiry: asset.warranty_expiry ?? '', status: asset.status,
        notes: asset.notes ?? '', user_id: asset.user_id ? String(asset.user_id) : '',
    });

    const [showMaintForm, setShowMaintForm] = useState(false);
    const maintForm = useForm({
        type: 'service',
        maintenance_date: new Date().toISOString().split('T')[0],
        next_due: '', technician: '', cost: '', notes: '',
    });

    const submitMaint = () => {
        maintForm.post(`/assets/${asset.id}/maintenance`, {
            onSuccess: () => { maintForm.reset(); setShowMaintForm(false); },
        });
    };

    const [showDocForm, setShowDocForm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const docForm = useForm<{ document: File | null; label: string }>({
        document: null,
        label: '',
    });

    const submitDoc = () => {
        if (!docForm.data.document) return;
        docForm.post(`/assets/${asset.id}/documents`, {
            forceFormData: true,
            onSuccess: () => {
                docForm.reset(); setShowDocForm(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const deleteDoc = (docId: number) => {
        if (!confirm('Delete this document?')) return;
        router.delete(`/assets/${asset.id}/documents/${docId}`, { preserveScroll: true });
    };

    // Helper: read-only display value
    const roVal = (val: string | null | undefined) => val || '—';

    return (
        <AuthenticatedLayout header="Edit Asset">
            <Head title="Edit Asset" />
            <style>{`
                .form-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; max-width: 720px; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 6px; }
                .form-group.full { grid-column: 1 / -1; }
                label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; }
                .form-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; font-size: 14px; color: #fff; outline: none; transition: all 0.2s; font-family: inherit; width: 100%; box-sizing: border-box; }
                .form-input:focus { border-color: rgba(245,200,66,0.4); background: rgba(255,255,255,0.07); }
                .form-input option { background: #1a1f2e; color: #fff; }
                .ro-val { font-size: 14px; color: #e0e0e0; padding: 10px 0; }
                .error { font-size: 12px; color: #ff6b6b; }
                .btn-save { background: #f5c842; color: #080b14; border: none; border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .btn-save:hover { background: #ffd54f; }
                .btn-save:disabled { opacity: 0.5; }
                .btn-delete { background: rgba(255,80,80,0.1); color: #ff6b6b; border: 1px solid rgba(255,80,80,0.2); border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-left: auto; }
                .btn-delete:hover { background: rgba(255,80,80,0.2); }
                .btn-add { background: #f5c842; color: #080b14; border: none; border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .btn-add:hover { background: #ffd54f; }
                .btn-add:disabled { opacity: 0.5; }
                .log-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .log-item:last-child { border-bottom: none; }
                .log-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
                .log-action-created { background: #64dc8c; }
                .log-action-updated { background: #6ab4ff; }
                .log-action-assigned { background: #f5c842; }
                .log-action-unassigned { background: #f97316; }
                .log-action-deleted { background: #ff6b6b; }
                .log-action-document_uploaded { background: #a78bfa; }
                .log-action-transferred { background: #60a5fa; }
                .maint-row { padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .maint-row:last-child { border-bottom: none; }
                .maint-type-badge { display: inline-block; padding: 2px 10px; border-radius: 100px; font-size: 11px; font-weight: 500; background: rgba(100,180,255,0.1); color: #6ab4ff; border: 1px solid rgba(100,180,255,0.2); }
                .maint-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }
                .doc-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
                .doc-row:last-child { border-bottom:none; }
                .doc-icon { font-size:22px; flex-shrink:0; }
                .doc-info { flex:1; min-width:0; }
                .doc-name { font-size:13px; color:#fff; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .doc-meta { font-size:11px; color:rgba(255,255,255,0.3); margin-top:2px; }
                .doc-actions { display:flex; gap:8px; flex-shrink:0; }
                .doc-btn { padding:5px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-flex; align-items:center; gap:4px; }
                .doc-btn-dl { background:rgba(245,200,66,0.1); color:#f5c842; }
                .doc-btn-dl:hover { background:rgba(245,200,66,0.2); }
                .doc-btn-del { background:rgba(255,107,107,0.1); color:#ff6b6b; }
                .doc-btn-del:hover { background:rgba(255,107,107,0.2); }
                .doc-upload-area { border:1px dashed rgba(255,255,255,0.15); border-radius:10px; padding:20px; background:rgba(255,255,255,0.02); }
                .doc-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
                .file-input-wrap { position:relative; }
                .file-input-wrap input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; }
                .file-input-display { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 14px; font-size:13px; color:rgba(255,255,255,0.5); display:flex; align-items:center; gap:8px; }
                .file-input-display.has-file { color:#fff; }
            `}</style>

            <div style={{ color: '#fff' }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Edit Asset</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>#{asset.asset_number}</p>
                </div>

                {/* ── Main form: admin editable, manager read-only ── */}
                <div className="form-panel">
                    {isAdmin ? (
                        <>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Asset Number *</label>
                                    <input className="form-input" value={data.asset_number} onChange={e => setData('asset_number', e.target.value)} />
                                    {errors.asset_number && <span className="error">{errors.asset_number}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input className="form-input" value={data.name} onChange={e => setData('name', e.target.value)} />
                                    {errors.name && <span className="error">{errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select className="form-input" value={data.type} onChange={e => setData('type', e.target.value)}>
                                        {['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Phone', 'Tablet', 'Chair', 'Desk', 'Other'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                {['Laptop', 'Phone', 'Tablet'].includes(data.type) && (
                                    <div className="form-group">
                                        <label>Platform</label>
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
                                    <input className="form-input" value={data.serial_number} onChange={e => setData('serial_number', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Vendor</label>
                                    <input className="form-input" value={data.vendor} onChange={e => setData('vendor', e.target.value)} />
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
                                    <input className="form-input" type="number" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)} />
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
                                    <textarea className="form-input" rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center' }}>
                                <button className="btn-save" disabled={processing} onClick={() => put(route('assets.update', asset.id))}>
                                    {processing ? 'Saving…' : 'Save Changes'}
                                </button>
                                <Link href="/assets" style={{ padding: '11px 24px', fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Cancel</Link>
                                <Link href={route('assets.destroy', asset.id)} method="delete" as="button" className="btn-delete">
                                    Delete Asset
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* Manager: read-only view */
                        <>
                            <div className="form-grid">
                                {[
                                    ['Asset Number', asset.asset_number],
                                    ['Name', asset.name],
                                    ['Type', asset.type],
                                    ['Platform', asset.device_platform],
                                    ['Serial Number', asset.serial_number],
                                    ['Vendor', asset.vendor],
                                    ['Department', asset.department],
                                    ['Location', asset.location],
                                    ['Purchase Price', asset.purchase_price],
                                    ['Purchase Date', asset.purchase_date],
                                    ['Warranty Expiry', asset.warranty_expiry],
                                    ['Status', asset.status],
                                ].map(([lbl, val]) => (
                                    <div className="form-group" key={lbl}>
                                        <label>{lbl}</label>
                                        <div className="ro-val">{roVal(val)}</div>
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label>Assigned To</label>
                                    <div className="ro-val">
                                        {users.find(u => u.id === asset.user_id)?.name ?? 'Unassigned'}
                                    </div>
                                </div>
                                <div className="form-group full">
                                    <label>Notes</label>
                                    <div className="ro-val">{roVal(asset.notes)}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <Link href="/assets" style={{ padding: '11px 24px', fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Back to Assets</Link>
                            </div>
                        </>
                    )}
                </div>

                {/* ── Documents: everyone can download, only admin can upload/delete ── */}
                <div style={{ marginTop: 32, maxWidth: 720 }}>
                    <div className="form-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>Documents</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                                    {documents.length} file{documents.length !== 1 ? 's' : ''} — invoices, warranty cards, contracts
                                </div>
                            </div>
                            {isAdmin && (
                                <button className="btn-add" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => setShowDocForm(v => !v)}>
                                    {showDocForm ? 'Cancel' : '+ Upload'}
                                </button>
                            )}
                        </div>

                        {isAdmin && showDocForm && (
                            <div className="doc-upload-area" style={{ marginBottom: 20 }}>
                                <div className="doc-form-row">
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 6 }}>File *</label>
                                        <div className="file-input-wrap">
                                            <div className={`file-input-display ${docForm.data.document ? 'has-file' : ''}`}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                                    <polyline points="17 8 12 3 7 8"/>
                                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                                </svg>
                                                {docForm.data.document ? docForm.data.document.name : 'Choose file…'}
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                                onChange={e => {
                                                    const f = e.target.files?.[0] ?? null;
                                                    docForm.setData('document', f as any);
                                                    if (f && !docForm.data.label) docForm.setData('label', f.name.replace(/\.[^.]+$/, ''));
                                                }}
                                            />
                                        </div>
                                        {docForm.errors.document && <span className="error">{docForm.errors.document}</span>}
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>PDF, Word, Excel, PNG, JPG — max 10 MB</div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 6 }}>Label</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g. Invoice, Warranty Card"
                                            value={docForm.data.label}
                                            onChange={e => docForm.setData('label', e.target.value)}
                                        />
                                        {docForm.errors.label && <span className="error">{docForm.errors.label}</span>}
                                    </div>
                                </div>
                                <button
                                    className="btn-add"
                                    style={{ fontSize: 13, padding: '8px 18px' }}
                                    disabled={docForm.processing || !docForm.data.document}
                                    onClick={submitDoc}
                                >
                                    {docForm.processing ? 'Uploading…' : 'Upload'}
                                </button>
                            </div>
                        )}

                        {documents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 28, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                                No documents uploaded yet.
                            </div>
                        ) : documents.map(doc => (
                            <div key={doc.id} className="doc-row">
                                <div className="doc-icon">{MIME_ICON[doc.mime_type ?? ''] ?? '📎'}</div>
                                <div className="doc-info">
                                    <div className="doc-name">{doc.label}</div>
                                    <div className="doc-meta">
                                        {doc.file_name}
                                        {doc.file_size ? ` · ${formatBytes(doc.file_size)}` : ''}
                                        {` · Uploaded by ${doc.uploader?.name ?? 'unknown'}`}
                                        {` · ${new Date(doc.created_at).toLocaleDateString()}`}
                                    </div>
                                </div>
                                <div className="doc-actions">
                                    <a href={`/assets/${asset.id}/documents/${doc.id}/download`} className="doc-btn doc-btn-dl" target="_blank" rel="noreferrer">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                            <polyline points="7 10 12 15 17 10"/>
                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                        Download
                                    </a>
                                    {isAdmin && (
                                        <button className="doc-btn doc-btn-del" onClick={() => deleteDoc(doc.id)}>Delete</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Maintenance log: admin can add/delete, manager can view ── */}
                <div style={{ marginTop: 32, maxWidth: 720 }}>
                    <div className="form-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>Maintenance history</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{maintenanceLogs.length} record{maintenanceLogs.length !== 1 ? 's' : ''}</div>
                            </div>
                            {isAdmin && (
                                <button className="btn-add" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => setShowMaintForm(v => !v)}>
                                    {showMaintForm ? 'Cancel' : '+ Log maintenance'}
                                </button>
                            )}
                        </div>

                        {isAdmin && showMaintForm && (
                            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                                <div className="maint-form-grid">
                                    <div>
                                        <label>Type</label>
                                        <select className="form-input" value={maintForm.data.type} onChange={e => maintForm.setData('type', e.target.value)}>
                                            {['service','repair','inspection','upgrade','other'].map(t => (
                                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Date</label>
                                        <input className="form-input" type="date" value={maintForm.data.maintenance_date} onChange={e => maintForm.setData('maintenance_date', e.target.value)} />
                                        {maintForm.errors.maintenance_date && <span className="error">{maintForm.errors.maintenance_date}</span>}
                                    </div>
                                    <div>
                                        <label>Next due (optional)</label>
                                        <input className="form-input" type="date" value={maintForm.data.next_due} onChange={e => maintForm.setData('next_due', e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Technician</label>
                                        <input className="form-input" type="text" placeholder="Name or company" value={maintForm.data.technician} onChange={e => maintForm.setData('technician', e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Cost</label>
                                        <input className="form-input" type="number" placeholder="0.00" step="0.01" value={maintForm.data.cost} onChange={e => maintForm.setData('cost', e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Notes</label>
                                        <input className="form-input" type="text" placeholder="Optional notes" value={maintForm.data.notes} onChange={e => maintForm.setData('notes', e.target.value)} />
                                    </div>
                                </div>
                                <button className="btn-add" style={{ fontSize: 13, padding: '8px 18px' }} disabled={maintForm.processing} onClick={submitMaint}>
                                    {maintForm.processing ? 'Saving…' : 'Save log'}
                                </button>
                            </div>
                        )}

                        {maintenanceLogs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 28, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>No maintenance records yet.</div>
                        ) : maintenanceLogs.map(log => (
                            <div key={log.id} className="maint-row">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                            <span className="maint-type-badge">{log.type}</span>
                                            <span style={{ fontSize: 13, color: '#e0e0e0', fontWeight: 500 }}>
                                                {new Date(log.maintenance_date).toLocaleDateString()}
                                            </span>
                                            {log.next_due && (
                                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                                                    → next: {new Date(log.next_due).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                            {log.technician && <span>👤 {log.technician}</span>}
                                            {log.cost       && <span>💰 ₹{parseFloat(log.cost).toLocaleString()}</span>}
                                            {log.notes      && <span>📝 {log.notes}</span>}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>
                                            Logged by {log.logger.name}
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <button
                                            onClick={() => router.delete(`/maintenance/${log.id}`, { preserveScroll: true })}
                                            style={{ background: 'none', border: 'none', color: 'rgba(255,107,107,0.5)', cursor: 'pointer', fontSize: 12, padding: '4px 8px', borderRadius: 6, transition: 'color 0.15s' }}
                                            onMouseOver={e => (e.currentTarget.style.color = '#ff6b6b')}
                                            onMouseOut={e  => (e.currentTarget.style.color = 'rgba(255,107,107,0.5)')}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Activity log: visible to all ── */}
                {logs.length > 0 && (
                    <div style={{ marginTop: 24, maxWidth: 720 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#fff' }}>Activity Log</h3>
                        <div className="form-panel" style={{ padding: '16px 24px' }}>
                            {logs.map(log => (
                                <div key={log.id} className="log-item">
                                    <div className={`log-dot log-action-${log.action}`} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{log.detail ?? log.action}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 100,
                                        background: log.action === 'created'           ? 'rgba(100,220,140,0.1)' :
                                                    log.action === 'assigned'          ? 'rgba(245,200,66,0.1)'  :
                                                    log.action === 'unassigned'        ? 'rgba(249,115,22,0.1)'  :
                                                    log.action === 'deleted'           ? 'rgba(255,107,107,0.1)' :
                                                    log.action === 'document_uploaded' ? 'rgba(167,139,250,0.1)' :
                                                    log.action === 'transferred'       ? 'rgba(96,165,250,0.1)'  :
                                                    'rgba(100,180,255,0.1)',
                                        color: log.action === 'created'           ? '#64dc8c' :
                                               log.action === 'assigned'          ? '#f5c842' :
                                               log.action === 'unassigned'        ? '#f97316' :
                                               log.action === 'deleted'           ? '#ff6b6b' :
                                               log.action === 'document_uploaded' ? '#a78bfa' :
                                               log.action === 'transferred'       ? '#60a5fa' :
                                               '#6ab4ff',
                                    }}>
                                        {log.action}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}