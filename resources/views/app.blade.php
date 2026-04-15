<!DOCTYPE html>
<html>
<head>
    <title>ZenHR</title>

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            display: flex;
            background: #f5f7fa;
        }

        /* SIDEBAR */
        .sidebar {
            width: 240px;
            height: 100vh;
            background: #111827;
            color: white;
            padding: 25px;
        }

        .logo {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 30px;
        }

        .sidebar a {
            display: block;
            padding: 10px;
            margin: 8px 0;
            color: #cbd5e1;
            text-decoration: none;
            border-radius: 6px;
        }

        .sidebar a:hover {
            background: #1f2937;
            color: white;
        }

        /* MAIN */
        .main {
            flex: 1;
            padding: 30px;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        button {
            background: #10b981;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
        }

        input {
            padding: 8px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
        }

        table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
        }

        th, td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }

        a.link {
            color: #2563eb;
            text-decoration: none;
        }

    </style>
</head>

<body>

<div class="sidebar">
    <div class="logo">ZenHR</div>

    <a href="/dashboard">Dashboard</a>
    <a href="/users">Users</a>
</div>

<div class="main">

    <div class="topbar">
        <div><b>Welcome</b></div>

        <div>
            {{ auth()->user()->name }} |
            <a href="/logout">Logout</a>
        </div>
    </div>

    @yield('content')

</div>

</body>
</html>