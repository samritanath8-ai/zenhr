<!DOCTYPE html>
<html>
<head>
    <title>ZenHR</title>
</head>
<body style="margin:0; font-family:Arial; overflow:hidden;">

<div style="display:flex; height:100vh;">

    <!-- SIDEBAR -->
    <div style="
        width:220px;
        background:#0f172a;
        color:white;
        padding:20px;
        flex-shrink:0;
    ">
        <h2>ZenHR</h2>

        <p><a href="/dashboard" style="color:white; text-decoration:none;">Dashboard</a></p>
        <p><a href="/users" style="color:white; text-decoration:none;">Users</a></p>
    </div>

    <!-- MAIN -->
    <div style="
        flex:1;
        background:#f8fafc;
        display:flex;
        flex-direction:column;
    ">

        <!-- TOP BAR -->
        <div style="
            display:flex;
            justify-content:flex-end;
            align-items:center;
            padding:15px 30px;
            background:white;
            border-bottom:1px solid #e5e7eb;
        ">

            <div onclick="toggleDropdown()" style="cursor:pointer; display:flex; align-items:center; gap:10px; position:relative;">

                <!-- Avatar -->
                <div style="
                    width:35px;
                    height:35px;
                    border-radius:50%;
                    background:#6366f1;
                    color:white;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-weight:bold;
                ">
                    {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                </div>

                <!-- Name -->
                <span>{{ Auth::user()->name }}</span>

                <!-- DROPDOWN -->
                <div id="dropdownMenu" style="
                    display:none;
                    position:absolute;
                    top:45px;
                    right:0;
                    background:white;
                    border-radius:8px;
                    box-shadow:0 5px 15px rgba(0,0,0,0.1);
                    width:160px;
                ">
                    <a href="/profile" style="display:block; padding:10px; text-decoration:none; color:black;">
                        My Profile
                    </a>

                    <form method="POST" action="/logout">
                        @csrf
                        <button style="
                            width:100%;
                            padding:10px;
                            border:none;
                            background:none;
                            text-align:left;
                            cursor:pointer;
                        ">
                            Logout
                        </button>
                    </form>
                </div>

            </div>

        </div>

        <!-- CONTENT -->
        <div style="
            padding:30px;
            overflow-y:auto;
        ">
            @yield('content')
        </div>

    </div>

</div>

<script>
function toggleDropdown() {
    let menu = document.getElementById("dropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
    if (!event.target.closest('[onclick="toggleDropdown()"]')) {
        let menu = document.getElementById("dropdownMenu");
        if (menu) menu.style.display = "none";
    }
}
</script>

</body>
</html>