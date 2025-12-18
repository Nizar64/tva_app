<?php
// api/read.php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Récupérer tous les produits
$query = "SELECT * FROM produits ORDER BY id DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$produits = $stmt->fetchAll(PDO::FETCH_ASSOC);

if(count($produits) > 0) {
    echo json_encode($produits);
} else {
    echo json_encode(array());
}
?>