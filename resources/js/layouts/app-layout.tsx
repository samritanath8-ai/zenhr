import { Link, router, usePage } from '@inertiajs/react';
import {  useState } from 'react';
import type {ReactNode} from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Props {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const NAV = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
        ),
    },
    {
        href: '/users',
        label: 'Users',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
];

export default function AppLayout({ children, breadcrumbs }: Props) {
    const { url } = usePage();
    const { auth } = usePage().props as any;
    const [collapsed, setCollapsed] = useState(false);

    const logout = () => {
        router.post('/logout');
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#0b0d17',
            fontFamily: "'DM Sans', sans-serif",
            color: '#fff',
        }}>
            {/* Sidebar */}
            <aside style={{
                width: collapsed ? '64px' : '220px',
                background: '#0f1120',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.25s ease',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{
                    padding: '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    flexShrink: 0,
                }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '9px',
                        background: '#f5c842', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M3 10L10 3L17 10" stroke="#0b0d17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 8V17H9V13H11V17H15V8" stroke="#0b0d17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    {!collapsed && (
                        <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>ZenHR</span>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {NAV.map(item => {
                        const active = url.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '9px 12px',
                                    borderRadius: '9px',
                                    textDecoration: 'none',
                                    color: active ? '#f5c842' : 'rgba(255,255,255,0.5)',
                                    background: active ? 'rgba(245,200,66,0.08)' : 'transparent',
                                    fontWeight: active ? 600 : 400,
                                    fontSize: '14px',
                                    transition: 'all 0.15s ease',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={e => {
                                    if (!active) {
(e.currentTarget as HTMLElement).style.color = '#fff';
}

                                    if (!active) {
(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
}
                                }}
                                onMouseLeave={e => {
                                    if (!active) {
(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
}

                                    if (!active) {
(e.currentTarget as HTMLElement).style.background = 'transparent';
}
                                }}
                            >
                                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + logout */}
                <div style={{
                    padding: '12px 10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    flexShrink: 0,
                }}>
                    {!collapsed && auth?.user && (
                        <div style={{ padding: '8px 12px', marginBottom: '6px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{auth.user.name}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{auth.user.email}</div>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        style={{
                            width: '100%', padding: '9px 12px',
                            background: 'transparent', border: 'none',
                            borderRadius: '9px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            color: 'rgba(255,255,255,0.4)', fontSize: '14px',
                            transition: 'all 0.15s ease', textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.color = '#ff6b6b';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,107,107,0.08)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)';
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        {!collapsed && <span>Sign out</span>}
                    </button>
                </div>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    style={{
                        position: 'absolute', top: '20px', right: '-12px',
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: '#1e2235', border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.5)', zIndex: 10,
                        transition: 'all 0.2s',
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {collapsed
                            ? <><polyline points="9 18 15 12 9 6"/></>
                            : <><polyline points="15 18 9 12 15 6"/></>
                        }
                    </svg>
                </button>
            </aside>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top bar */}
                <header style={{
                    height: '56px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center',
                    padding: '0 28px', gap: '8px',
                    background: '#0b0d17',
                    flexShrink: 0,
                }}>
                    {breadcrumbs?.map((b, i) => (
                        <span key={b.href} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {i > 0 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>/</span>}
                            <span style={{ fontSize: '13px', color: i === breadcrumbs.length - 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>
                                {b.title}
                            </span>
                        </span>
                    ))}
                </header>

                <main style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
