import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Create account" />
            <style>{`
                @import url('https://fonts.bunny.net/css?family=dm-sans:300,400,500,600');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .register-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #080b14;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }
                .zen-input {
                    width: 100%; padding: 12px 16px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px; color: #fff; font-size: 14px;
                    font-family: 'DM Sans', sans-serif;
                    outline: none; transition: all 0.2s; box-sizing: border-box;
                }
                .zen-input::placeholder { color: rgba(255,255,255,0.25); }
                .zen-input:focus {
                    border-color: rgba(245,200,66,0.5);
                    background: rgba(255,255,255,0.06);
                    box-shadow: 0 0 0 3px rgba(245,200,66,0.08);
                }
                .zen-btn {
                    width: 100%; padding: 13px;
                    background: #f5c842; color: #0b0d17;
                    border: none; border-radius: 10px;
                    font-size: 15px; font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer; transition: all 0.2s;
                }
                .zen-btn:hover:not(:disabled) {
                    background: #f7d460;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(245,200,66,0.28);
                }
                .zen-btn:disabled { opacity: 0.55; cursor: not-allowed; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
                .zen-card { animation: fadeUp 0.5s ease both; }
                .zen-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                @media(max-width:500px){ .zen-row { grid-template-columns: 1fr; } }
            `}</style>

            <div className="register-root">
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div className="zen-card" style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px', padding: '36px',
                    }}>
                        <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#fff', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                            Create account
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', marginBottom: '28px' }}>
                            Join ZenHR — takes less than a minute
                        </p>

                        {Object.keys(errors).length > 0 && (
                            <div style={{
                                background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)',
                                borderRadius: '10px', padding: '11px 15px',
                                fontSize: '13px', color: '#ff6b6b', marginBottom: '20px',
                            }}>{Object.values(errors)[0]}</div>
                        )}

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '7px' }}>
                                    Full name
                                </label>
                                <input type="text" className="zen-input" placeholder="Jane Smith"
                                    value={data.name} onChange={e => setData('name', e.target.value)} autoFocus required />
                            </div>

                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '7px' }}>
                                    Email address
                                </label>
                                <input type="email" className="zen-input" placeholder="you@company.com"
                                    value={data.email} onChange={e => setData('email', e.target.value)} required />
                            </div>

                            <div className="zen-row" style={{ marginBottom: '26px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '7px' }}>
                                        Password
                                    </label>
                                    <input type="password" className="zen-input" placeholder="••••••••"
                                        value={data.password} onChange={e => setData('password', e.target.value)} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '7px' }}>
                                        Confirm
                                    </label>
                                    <input type="password" className="zen-input" placeholder="••••••••"
                                        value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                                </div>
                            </div>

                            <button type="submit" className="zen-btn" disabled={processing}>
                                {processing ? 'Creating account…' : 'Create account →'}
                            </button>
                        </form>

                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '18px', lineHeight: '1.6' }}>
                            By signing up you agree to our terms & privacy policy.
                        </p>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '14px', color: 'rgba(255,255,255,0.38)' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#f5c842', textDecoration: 'none', fontWeight: 500 }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}