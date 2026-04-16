<!DOCTYPE html>
<html>
<head>
    <title>Login - ZenHR</title>
</head>

<body style="margin:0; font-family:Arial;">

<div style="display:flex; height:100vh;">

    <!-- LEFT SIDE IMAGE -->
    <div style="
    flex:1;
    background:url('/images/login.jpg');
    background-size:cover;
    background-position:center;
">
</div>

    <!-- RIGHT SIDE LOGIN -->
   <div style="
    flex:1;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f8fafc;
">

        <div style="
            width:300px;
            background:white;
            padding:30px;
            border-radius:10px;
            box-shadow:0 4px 10px rgba(0,0,0,0.1);
        ">

            <h2 style="margin-bottom:20px;">ZenHR Login</h2>

            @if(session('error'))
                <p style="color:red;">{{ session('error') }}</p>
            @endif

            <form method="POST" action="/login">
                @csrf

                <input type="email" name="email" placeholder="Email" required
                    style="width:100%; padding:10px; margin-bottom:10px;">

                <input type="password" name="password" placeholder="Password" required
                    style="width:100%; padding:10px; margin-bottom:20px;">

                <button style="
                    width:100%;
                    padding:10px;
                    background:#6366f1;
                    color:white;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                ">
                    Login
                </button>

            </form>

        </div>

    </div>

</div>

</body>
</html>