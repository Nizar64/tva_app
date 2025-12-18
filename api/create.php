<?php
// api/create.php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/session.php';

Session::requireLogin();

$database = new Database();
$db = $database->getConnection();

// Récupérer les données POST
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->libelle) &&
    !empty($data->prix_ht) &&
    !empty($data->tva)
) {
    // Calculer le prix TTC
    $prix_ttc = $data->prix_ht * (1 + $data->tva / 100);
    
    // Récupérer l'ID utilisateur de la session
    $user_id = Session::get('user_id');
    
    // Préparer la requête
    $query = "INSERT INTO produits (libelle, prix_ht, tva, prix_ttc, user_id) 
              VALUES (:libelle, :prix_ht, :tva, :prix_ttc, :user_id)";
    
    $stmt = $db->prepare($query);
    
    // Nettoyer et lier les paramètres
    $libelle = htmlspecialchars(strip_tags($data->libelle));
    $prix_ht = htmlspecialchars(strip_tags($data->prix_ht));
    $tva = htmlspecialchars(strip_tags($data->tva));
    
    $stmt->bindParam(":libelle", $libelle);
    $stmt->bindParam(":prix_ht", $prix_ht);
    $stmt->bindParam(":tva", $tva);
    $stmt->bindParam(":prix_ttc", $prix_ttc);
    $stmt->bindParam(":user_id", $user_id);
    
    if($stmt->execute()) {
        $last_id = $db->lastInsertId();
        
        // Récupérer les informations de l'utilisateur
        $user_query = "SELECT username FROM users WHERE id = :user_id";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(':user_id', $user_id);
        $user_stmt->execute();
        $user = $user_stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode(array(
            "message" => "Produit créé avec succès.",
            "id" => $last_id,
            "prix_ttc" => number_format($prix_ttc, 2, ',', ' '),
            "created_at" => date('d/m/Y'),
            "user_name" => $user['username'] ?? 'Utilisateur'
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de créer le produit."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
}
?>