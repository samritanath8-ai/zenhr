import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface ReportCard {
    title: string;
    description: string;
    href: string;
    icon: string;
    color: string;
}

const REPORTS: ReportCard[] = [
    {
        title: 'Full Asset Inventory',
        description: 'All assets with status, assignment, purchase details, and warranty info.',
        href: '/reports/assets',
        icon: '📦',
        color: '#f5c842',
    },
    {
        title: 'Assigned Assets',
        description: 'All assets currently assigned to users, with contact details.',
        href: '/reports/assigned',
        icon: '👤',
        color: '#60a5fa',
    },
    {
        title: 'Warranty Expiry',
        description: 'Assets sorted by warranty expiry date — identify what needs attention.',
        href: '/reports/warranty',
        icon: '🛡️',
        color: '#f97316',
    },
    {
        title: 'Audit Log',
        description: 'Full history of all asset actions: assignments, updates, deletions, transfers.',
        href: '/reports/audit',
        icon: '📋',
        color: '#a78bfa',
    },
];

export default function ReportsIndex() {
    return (
        <AuthenticatedLayout header="Compliance Reports">
            <style>{`
                .rp-wrap { max-width: 900px; margin: 0 auto; }
                .rp-title { font-size:22px; font-weight:700; color:#fff; font-family:'Syne',sans-serif; margin-bottom:8px; }
                .rp-subtitle { color:rgba(255,255,255,0.4); font-size:14px; margin-bottom:32px; }
                .rp-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
                @media(max-width:640px){ .rp-grid{grid-template-columns:1fr;} }
                .rp-card { background:#10151f; border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:24px; display:flex; flex-direction:column; gap:12px; text-decoration:none; transition:all 0.15s; }
                .rp-card:hover { border-color:rgba(255,255,255,0.15); transform:translateY(-2px); background:#131820; }
                .rp-icon { font-size:28px; }
                .rp-card-title { font-size:16px; font-weight:700; color:#fff; font-family:'Syne',sans-serif; }
                .rp-card-desc { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.5; flex:1; }
                .rp-download { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:7px 14px; border-radius:7px; margin-top:4px; align-self:flex-start; }
                .rp-note { margin-top:32px; padding:16px 20px; background:rgba(245,200,66,0.06); border:1px solid rgba(245,200,66,0.15); border-radius:10px; font-size:13px; color:rgba(255,255,255,0.5); line-height:1.6; }
            `}</style>

            <div className="rp-wrap">
                <div className="rp-title">Export Reports</div>
                <div className="rp-subtitle">Download CSV reports for compliance, auditing, and asset tracking.</div>

                <div className="rp-grid">
                    {REPORTS.map(r => (
                        <a key={r.href} href={r.href} className="rp-card">
                            <div className="rp-icon">{r.icon}</div>
                            <div className="rp-card-title">{r.title}</div>
                            <div className="rp-card-desc">{r.description}</div>
                            <span
                                className="rp-download"
                                style={{ background: `${r.color}18`, color: r.color, border: `1px solid ${r.color}30` }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Download CSV
                            </span>
                        </a>
                    ))}
                </div>

                <div className="rp-note">
                    All reports are exported as <strong style={{color:'rgba(255,255,255,0.7)'}}>CSV files</strong> and reflect live data at the time of download.
                    Reports are restricted to <strong style={{color:'rgba(255,255,255,0.7)'}}>admin and manager</strong> roles only.
                </div>
            </div>
        </AuthenticatedLayout>
    );
}