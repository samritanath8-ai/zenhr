<!DOCTYPE html>
<html>
<head>
    <title>Login - ZenHR</title>

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            display: flex;
            height: 100vh;
        }

        .left {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ffffff;
        }

        .login-box {
            width: 350px;
        }

        h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }

        p {
            color: #666;
            margin-bottom: 30px;
        }

        input {
            width: 100%;
            padding: 14px;
            margin: 10px 0;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 16px;
        }

        button {
            width: 100%;
            padding: 14px;
            background: #6b46c1;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
        }

        button:hover {
            background: #553c9a;
        }

        .right {
            width: 50%;
            background: linear-gradient(135deg, #6b46c1, #9f7aea);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }

        .right h2 {
            font-size: 28px;
            text-align: center;
            width: 70%;
        }
    </style>
</head>

<body>

<div class="left">
    <div class="login-box">
        <h1>Welcome back</h1>
        <p>Please enter your details</p>

        @if(session('error'))
            <p style="color:red">{{ session('error') }}</p>
        @endif

        <form method="POST" action="/login">
            @csrf

            <input type="email" name="email" placeholder="Email address" required>
            <input type="password" name="password" placeholder="Password" required>

            <button type="submit">Sign in</button>
        </form>
    </div>
</div>

<div class="right">
    <h2>Manage your HR operations smartly with ZenHR 🚀</h2>
</div>

</body>
</html>