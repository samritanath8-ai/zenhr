import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    icon: ReactNode;
}

interface AuthenticatedLayoutProps {
    header?: ReactNode;
    children: ReactNode;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

const NAV: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
        ),
    },
    {
        label: 'Users',
        href: '/users',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
        ),
    },
    {
        label: 'Devices',
        href: '/devices',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>
            </svg>
        ),
    },
];

export default function AuthenticatedLayout({ header, children }: AuthenticatedLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const [collapsed, setCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const currentPath = window.location.pathname;
    const role = auth?.user?.role;

    const initials = auth?.user?.name?.charAt(0)?.toUpperCase() ?? 'U';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #0d1117; }
                .layout-root { display: flex; min-height: 100vh; font-family: 'DM Sans', sans-serif; background: #0d1117; }
                .sidebar { width: var(--sidebar-w); min-height: 100vh; background: #080b14; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; transition: width 0.25s ease; position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; overflow: hidden; }
                .sidebar-top { padding: 20px 16px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); min-height: 68px; }
                .logo-wrap { display: flex; align-items: center; gap: 10px; text-decoration: none; overflow: hidden; }
                .logo-box { width: 36px; height: 36px; background: #f5c842; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 20px rgba(245,200,66,0.3); }
                .logo-text { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: #fff; letter-spacing: -0.02em; white-space: nowrap; transition: opacity 0.2s; }
                .logo-text.hidden { opacity: 0; }
                .collapse-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3); display: flex; align-items: center; padding: 6px; border-radius: 6px; transition: all 0.15s; flex-shrink: 0; }
                .collapse-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
                .sidebar-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
                .nav-section-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; margin-top: 12px; white-space: nowrap; transition: opacity 0.2s; }
                .nav-section-label.hidden { opacity: 0; }
                .nav-link { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.45); transition: all 0.15s; white-space: nowrap; overflow: hidden; position: relative; }
                .nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
                .nav-link.active { color: #f5c842; background: rgba(245,200,66,0.1); }
                .nav-link.active::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 3px; background: #f5c842; border-radius: 0 3px 3px 0; }
                .nav-icon { flex-shrink: 0; display: flex; }
                .nav-label { transition: opacity 0.2s; }
                .nav-label.hidden { opacity: 0; }
                .sidebar-user { padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.05); position: relative; }
                .user-btn { display: flex; align-items: center; gap: 10px; width: 100%; background: none; border: none; cursor: pointer; padding: 10px; border-radius: 10px; transition: background 0.15s; overflow: hidden; font-family: 'DM Sans', sans-serif; }
                .user-btn:hover { background: rgba(255,255,255,0.05); }
                .avatar { width: 34px; height: 34px; background: linear-gradient(135deg, #f5c842, #f97316); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #080b14; flex-shrink: 0; }
                .user-info { text-align: left; overflow: hidden; transition: opacity 0.2s; }
                .user-info.hidden { opacity: 0; }
                .user-name { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .user-role { font-size: 11px; color: rgba(255,255,255,0.35); text-transform: capitalize; }
                .user-dropdown { position: absolute; bottom: 70px; left: 10px; right: 10px; background: #1a1f2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 6px; box-shadow: 0 16px 40px rgba(0,0,0,0.5); animation: fadeUp 0.15s ease; z-index: 100; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; cursor: pointer; transition: all 0.12s; background: none; border: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
                .dropdown-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
                .dropdown-item.danger:hover { background: rgba(255,68,68,0.1); color: #ff6b6b; }
                .dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
                .main-area { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left 0.25s ease; }
                .topbar { height: 68px; background: rgba(13,17,23,0.95); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); display: flex; align-items: center; padding: 0 28px; position: sticky; top: 0; z-index: 40; }
                .topbar-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.02em; flex: 1; }
                .page-content { flex: 1; padding: 28px; color: #fff; }
            `}</style>

            <div
                className="layout-root"
                style={{ ['--sidebar-w' as string]: collapsed ? '72px' : '240px' } as React.CSSProperties}
            >
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-top">
                        <Link href="/dashboard" className="logo-wrap">
                            <div className="logo-box">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#080b14"/>
                                    <rect x="11" y="1" width="6" height="6" rx="1.5" fill="#080b14"/>
                                    <rect x="1" y="11" width="6" height="6" rx="1.5" fill="#080b14"/>
                                    <rect x="11" y="11" width="6" height="6" rx="1.5" fill="#080b14"/>
                                </svg>
                            </div>
                            <span className={`logo-text ${collapsed ? 'hidden' : ''}`}>ZenHR</span>
                        </Link>
                        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {collapsed
                                    ? <path d="M9 18l6-6-6-6"/>
                                    : <path d="M15 18l-6-6 6-6"/>}
                            </svg>
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        <div className={`nav-section-label ${collapsed ? 'hidden' : ''}`}>Main</div>

                        <Link
                            href="/dashboard"
                            className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{NAV[0].icon}</span>
                            <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>Dashboard</span>
                        </Link>

                        {['admin', 'manager'].includes(role) && (
                            <Link
                                href="/users"
                                className={`nav-link ${currentPath === '/users' ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{NAV[1].icon}</span>
                                <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>Users</span>
                            </Link>
                        )}

                        {['admin', 'manager'].includes(role) && (
                            <Link
                                href="/assets"
                                className={`nav-link ${currentPath === '/assets' ? 'active' : ''}`}
                            >
                                <span className="nav-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2"/>
                                        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                                        <line x1="12" y1="12" x2="12" y2="16"/>
                                        <line x1="10" y1="14" x2="14" y2="14"/>
                                    </svg>
                                </span>
                                <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>Assets</span>
                            </Link>
                        )}

                        {/* FIX: Depreciation moved OUT of Requests link — was previously nested inside it */}
                        {['admin', 'manager'].includes(role) && (
                            <Link
                                href="/depreciation"
                                className={`nav-link ${currentPath === '/depreciation' ? 'active' : ''}`}
                            >
                                <span className="nav-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="2" x2="12" y2="22"/>
                                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                                    </svg>
                                </span>
                                <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>Depreciation</span>
                            </Link>
                        )}

                        <Link
                            href="/requests"
                            className={`nav-link ${currentPath === '/requests' ? 'active' : ''}`}
                        >
                            <span className="nav-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                                    <line x1="9" y1="12" x2="15" y2="12"/>
                                    <line x1="9" y1="16" x2="13" y2="16"/>
                                </svg>
                            </span>
                            <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>Requests</span>
                        </Link>

                        {['admin', 'manager'].includes(role) && (
                            <Link
                                href="/transfers"
                                className={`nav-link ${currentPath === '/transfers' ? 'active' : ''}`}
                            >
                                <span className="nav-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="17 1 21 5 17 9"/>
                                        <path d="M3 11V9a4 4 0 014-4h14"/>
                                        <polyline points="7 23 3 19 7 15"/>
                                        <path d="M21 13v2a4 4 0 01-4 4H3"/>
                                    </svg>
                                </span>
                                <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>Transfers</span>
                            </Link>
                        )}

                        {['admin', 'manager'].includes(role) && (
                            <Link
                                href="/reports"
                                className={`nav-link ${currentPath === '/reports' ? 'active' : ''}`}
                            >
                                <span className="nav-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                </span>
                                <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>Reports</span>
                            </Link>
                        )}
                        <div className={`nav-section-label ${collapsed ? 'hidden' : ''}`} style={{ marginTop: 16 }}>Devices</div>
                        <Link
                            href="/devices"
                            className={`nav-link ${currentPath === '/devices' ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{NAV[2].icon}</span>
                            <span className={`nav-label ${collapsed ? 'hidden' : ''}`}>All Devices</span>
                        </Link>
                    </nav>

                    {/* User */}
                    <div className="sidebar-user">
                        {profileOpen && (
                            <div className="user-dropdown">
                                <Link href="/profile" className="dropdown-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Profile
                                </Link>
                                <Link href="/profile/notifications" className="dropdown-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                                    Notifications
                                </Link>
                                <div className="dropdown-divider" />
                                <Link href={route('logout')} method="post" as="button" className="dropdown-item danger">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    Sign out
                                </Link>
                            </div>
                        )}
                        <button className="user-btn" onClick={() => setProfileOpen(!profileOpen)}>
                            <div className="avatar">{initials}</div>
                            <div className={`user-info ${collapsed ? 'hidden' : ''}`}>
                                <div className="user-name">{auth?.user?.name ?? 'User'}</div>
                                <div className="user-role">{role ?? 'user'}</div>
                            </div>
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <div className="main-area">
                    <header className="topbar">
                        <h1 className="topbar-title">{header}</h1>
                    </header>
                    <main className="page-content">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}