<style>
    .nav-link {
        font-size: 25px;
        margin-right: 30px;
        font-family: "Raleway", Helvetica, Arial, sans-serif;
    }

    .btn2 {
        color: white;
        background-color: #7158fe;
    }

    .btn2:hover {
        color: white;
        background-color: blue;
    }

    @media (min-width: 990px) {
        .btn2 {
            position: relative;
            float: right;
        }
    }

    .container-fluid {
        background: #fff;
    }
</style>

<header id="header" class="header fixed-top d-flex align-items-center navbar navbar-expand-lg">
    <div class="container-fluid">

        <div class="d-flex align-items-center justify-content-between">
            <a href="index.php" class="logo d-flex align-items-center">
                <img src="assets/img/logo.png" alt="">
                <span class="d-none d-lg-block">MoneyWorld</span>
            </a>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#about">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#version">Version</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#mission">Mission</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#policy">Policy</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#contact">Contact</a>
                </li>
            </ul>
            <li class="btn1 nav-link">
                <button type="button" onclick="location.href = 'login.php';" class="btn btn2">Login</button>
            </li>
        </div>
    </div>
</header>