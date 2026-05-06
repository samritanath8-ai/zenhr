import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=dm-serif-display:400,400i|dm-sans:300,400,500,600"
                    rel="stylesheet"
                />
                <style>{`
                    * { font-family: 'DM Sans', sans-serif; }
                    .display-font { font-family: 'DM Serif Display', serif; }
                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(24px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-12px) rotate(2deg); }
                    }
                    @keyframes shimmer {
                        0% { background-position: -200% center; }
                        100% { background-position: 200% center; }
                    }
                    .fade-up { animation: fadeUp 0.7s ease forwards; }
                    .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
                    .fade-up-2 { animation: fadeUp 0.7s 0.25s ease both; }
                    .fade-up-3 { animation: fadeUp 0.7s 0.4s ease both; }
                    .float-orb { animation: float 6s ease-in-out infinite; }
                    .float-orb-2 { animation: float 8s 2s ease-in-out infinite; }
                    .gradient-text {
                        background: linear-gradient(135deg, #f5c842 0%, #f5a623 50%, #f5c842 100%);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        animation: shimmer 3s linear infinite;
                    }
                    .btn-primary {
                        background: #f5c842;
                        color: #0d0d14;
                        transition: all 0.2s ease;
                    }
                    .btn-primary:hover {
                        background: #f5d870;
                        transform: translateY(-1px);
                        box-shadow: 0 8px 24px rgba(245, 200, 66, 0.35);
                    }
                    .btn-secondary {
                        background: transparent;
                        border: 1px solid rgba(255,255,255,0.15);
                        color: rgba(255,255,255,0.8);
                        transition: all 0.2s ease;
                    }
                    .btn-secondary:hover {
                        border-color: rgba(255,255,255,0.35);
                        color: #fff;
                        background: rgba(255,255,255,0.05);
                    }
                    .feature-card {
                        background: rgba(255,255,255,0.03);
                        border: 1px solid rgba(255,255,255,0.07);
                        transition: all 0.3s ease;
                    }
                    .feature-card:hover {
                        background: rgba(255,255,255,0.06);
                        border-color: rgba(245, 200, 66, 0.2);
                        transform: translateY(-2px);
                    }
                    .nav-link {
                        color: rgba(255,255,255,0.6);
                        transition: color 0.2s ease;
                    }
                    .nav-link:hover { color: #fff; }
                `}</style>
            </Head>
            <div style={{ background: '#0d0d14', minHeight: '100vh', color: '#fff', overflow: 'hidden', position: 'relative' }}>

                {/* Background orbs */}
                <div className="float-orb" style={{
                    position: 'absolute', top: '-120px', right: '-80px',
                    width: '520px', height: '520px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                <div className="float-orb-2" style={{
                    position: 'absolute', bottom: '10%', left: '-100px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(100,120,255,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: '800px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(245,200,66,0.04) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                {/* Nav */}
                <header style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#f5c842', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect x="2" y="2" width="5" height="5" rx="1" fill="#0d0d14"/>
                                <rect x="9" y="2" width="5" height="5" rx="1" fill="#0d0d14"/>
                                <rect x="2" y="9" width="5" height="5" rx="1" fill="#0d0d14"/>
                                <rect x="9" y="9" width="5" height="5" rx="1" fill="#0d0d14" opacity="0.4"/>
                            </svg>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-0.01em' }}>ZenHR</span>
                    </div>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {auth.user ? (
                            <Link href={dashboard()} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
                                Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="nav-link" style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none', borderRadius: '8px' }}>
                                    Sign in
                                </Link>
                                {canRegister && (
                                    <Link href={register()} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
                                        Get started
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero */}
                <main style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 40px 60px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <div className="fade-up-1" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.2)',
                        padding: '6px 14px', borderRadius: '100px', marginBottom: '32px'
                    }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f5c842', display: 'inline-block' }} />
                        <span style={{ fontSize: '13px', color: '#f5c842', fontWeight: 500 }}>Now in beta</span>
                    </div>

                    <h1 className="display-font fade-up-2" style={{
                        fontSize: 'clamp(48px, 8vw, 88px)', lineHeight: '1.05',
                        marginBottom: '24px', letterSpacing: '-0.02em', fontWeight: 400
                    }}>
                        Build something<br />
                        <span className="gradient-text">extraordinary</span>
                    </h1>

                    <p className="fade-up-3" style={{
                        fontSize: '18px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7',
                        maxWidth: '520px', margin: '0 auto 48px', fontWeight: 300
                    }}>
                        A modern platform built for speed, clarity, and scale. Manage users, monitor activity, and ship with confidence.
                    </p>

                    <div className="fade-up-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {auth.user ? (
                            <Link href={dashboard()} className="btn-primary" style={{ padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                {canRegister && (
                                    <Link href={register()} className="btn-primary" style={{ padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                                        Create free account
                                    </Link>
                                )}
                                <Link href={login()} className="btn-secondary" style={{ padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Feature grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '80px' }}>
                        {[
                            { icon: '⚡', title: 'Fast by default', desc: 'Inertia.js + React for instant page transitions without full reloads.' },
                            { icon: '🔐', title: 'Secure auth', desc: 'Session-based authentication with Laravel\'s battle-tested auth system.' },
                            { icon: '👥', title: 'User management', desc: 'Create, edit, and delete users with a clean admin interface.' },
                            { icon: '📊', title: 'Dashboard ready', desc: 'A beautiful dashboard scaffold ready for your data and widgets.' },
                        ].map((f, i) => (
                            <div key={i} className="feature-card" style={{ padding: '24px', borderRadius: '12px', textAlign: 'left' }}>
                                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{f.icon}</div>
                                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>{f.title}</div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Footer */}
                <footer style={{ padding: '32px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>© 2025 ZenHR. All rights reserved.</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Built with Laravel + Inertia</span>
                </footer>
            </div>
        </>
    );
}
