<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Create account — ZenHR</title>
    <link rel="preconnect" href="https://fonts.bunny.net" />
    <link href="https://fonts.bunny.net/css?family=dm-serif-display:400|dm-sans:300,400,500,600" rel="stylesheet" />
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'DM Sans', sans-serif;
            background: #0d0d14;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            color: #fff;
            overflow: hidden;
            position: relative;
        }
        .glow-1 {
            position: fixed; top: -120px; right: -120px;
            width: 500px; height: 500px; border-radius: 50%;
            background: radial-gradient(circle, rgba(245,200,66,0.09) 0%, transparent 70%);
            pointer-events: none;
        }
        .glow-2 {
            position: fixed; bottom: -100px; left: -100px;
            width: 400px; height: 400px; border-radius: 50%;
            background: radial-gradient(circle, rgba(100,120,255,0.07) 0%, transparent 70%);
            pointer-events: none;
        }
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .wrapper {
            width: 100%; max-width: 460px;
            position: relative; z-index: 10;
            animation: fadeUp 0.6s ease both;
        }
        .logo-wrap {
            display: flex; flex-direction: column;
            align-items: center; gap: 12px;
            margin-bottom: 40px;
            text-decoration: none;
        }
        .logo-icon {
            width: 44px; height: 44px; border-radius: 12px;
            background: #f5c842;
            display: flex; align-items: center; justify-content: center;
        }
        .logo-text { color: #fff; font-weight: 600; font-size: 18px; }
        .card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 36px;
        }
        .card h1 {
            font-family: 'DM Serif Display', serif;
            font-size: 28px; font-weight: 400;
            color: #fff; margin-bottom: 6px;
        }
        .card .subtitle {
            font-size: 14px; color: rgba(255,255,255,0.4);
            margin-bottom: 32px;
        }
        .form-group { margin-bottom: 20px; }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }
        @media (max-width: 480px) {
            .form-row { grid-template-columns: 1fr; }
        }
        .form-row-last { margin-bottom: 28px; }
        label {
            display: block;
            font-size: 13px; font-weight: 500;
            color: rgba(255,255,255,0.55);
            margin-bottom: 7px;
        }
        input[type="email"],
        input[type="password"],
        input[type="text"] {
            width: 100%; padding: 12px 16px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            color: #fff; font-size: 14px;
            font-family: 'DM Sans', sans-serif;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        input::placeholder { color: rgba(255,255,255,0.28); }
        input:focus {
            border-color: rgba(245,200,66,0.5);
            background: rgba(255,255,255,0.06);
            box-shadow: 0 0 0 3px rgba(245,200,66,0.08);
        }
        .field-error {
            font-size: 12px; color: #ff6b6b;
            margin-top: 6px;
        }
        .alert-error {
            background: rgba(255,107,107,0.08);
            border: 1px solid rgba(255,107,107,0.2);
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13px; color: #ff6b6b;
            margin-bottom: 24px;
        }
        .btn-submit {
            width: 100%; padding: 13px;
            background: #f5c842;
            color: #0d0d14;
            border: none; border-radius: 10px;
            font-size: 15px; font-weight: 600;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-submit:hover {
            background: #f5d870;
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(245,200,66,0.28);
        }
        .btn-submit:active { transform: translateY(0); }
        .terms {
            font-size: 12px; color: rgba(255,255,255,0.3);
            text-align: center; margin-top: 20px; line-height: 1.6;
        }
        .footer-link {
            text-align: center; margin-top: 24px;
            font-size: 14px; color: rgba(255,255,255,0.4);
        }
        .footer-link a {
            color: #f5c842; text-decoration: none; font-weight: 500;
        }
        .footer-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="glow-1"></div>
    <div class="glow-2"></div>

    <div class="wrapper">
        <a href="/" class="logo-wrap">
            <div class="logo-icon">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" rx="1" fill="#0d0d14"/>
                    <rect x="9" y="2" width="5" height="5" rx="1" fill="#0d0d14"/>
                    <rect x="2" y="9" width="5" height="5" rx="1" fill="#0d0d14"/>
                    <rect x="9" y="9" width="5" height="5" rx="1" fill="#0d0d14" opacity="0.4"/>
                </svg>
            </div>
            <span class="logo-text">ZenHR</span>
        </a>

        <div class="card">
            <h1>Create an account</h1>
            <p class="subtitle">Start your journey — it only takes a minute</p>

            @if ($errors->any())
                <div class="alert-error">{{ $errors->first() }}</div>
            @endif

            <form method="POST" action="/register">
                @csrf

                <div class="form-group">
                    <label for="name">Full name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Jane Smith"
                        value="{{ old('name') }}"
                        autofocus
                        required
                    />
                    @error('name') <div class="field-error">{{ $message }}</div> @enderror
                </div>

                <div class="form-group">
                    <label for="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value="{{ old('email') }}"
                        required
                    />
                    @error('email') <div class="field-error">{{ $message }}</div> @enderror
                </div>

                <div class="form-row form-row-last">
                    <div>
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                        @error('password') <div class="field-error">{{ $message }}</div> @enderror
                    </div>
                    <div>
                        <label for="password_confirmation">Confirm password</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button type="submit" class="btn-submit">Create account →</button>
            </form>

            <p class="terms">By creating an account you agree to our terms of service and privacy policy.</p>
        </div>

        <div class="footer-link">
            Already have an account? <a href="/login">Sign in</a>
        </div>
    </div>
</body>
</html>