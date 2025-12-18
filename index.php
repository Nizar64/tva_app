<?php
// index.php
require_once 'config/session.php';


if (Session::isLoggedIn()) {
    header('Location: dashboard.php');
} else {
    header('Location: login.php');
}
exit();
?>