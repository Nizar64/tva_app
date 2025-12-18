<?php
// logout.php
require_once 'config/session.php';

Session::destroy();

// Rediriger vers la page de connexion
header('Location: login.php?logout=1');
exit();
?>