<!DOCTYPE html>
<html>
<head>
    <title>ZenHR</title>
    <style>
        body { margin: 0; font-family: Arial; display: flex; }
        .sidebar {
            width: 200px;
            background: #0f172a;
            color: white;
            height: 100vh;
            padding: 20px;
        }
        .sidebar a {
            color: white;
            display: block;
            margin: 10px 0;
            text-decoration: none;
        }
        .content {
            flex: 1;
            padding: 20px;
            background: #f1f5f9;
        }
    </style>
</head>
<body>

<div class="sidebar">
    <h2>ZenHR</h2>
    <a href="/dashboard">Dashboard</a>
    <a href="/users">Users</a>
</div>

<div class="content">
    @yield('content')
</div>

</body>
</html>