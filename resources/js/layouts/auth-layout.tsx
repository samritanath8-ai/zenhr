import { Link } from '@inertiajs/react';
import type {ReactNode} from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif",
            background: '#0b0d17',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Glow orbs */}
            <div style={{
                position: 'fixed', top: '-140px', right: '-140px',
                width: '520px', height: '520px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245,200,66,0.09) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'fixed', bottom: '-120px', left: '-120px',
                width: '440px', height: '440px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '46px', height: '46px', borderRadius: '13px',
                            background: '#f5c842',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                                <path d="M3 10L10 3L17 10" stroke="#0b0d17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 8V17H9V13H11V17H15V8" stroke="#0b0d17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em' }}>ZenHR</span>
                    </Link>
                </div>

                {children}
            </div>
        </div>
    );
}
