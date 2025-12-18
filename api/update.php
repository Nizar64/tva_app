<?php


require_once '../config/session.php';
Session::requireLogin();

//  dans les requêtes, vérifiez les permissions
if (!Session::isAdmin()) {
    // vérifiez que l'utilisateur est propriétaire du produit
}



// api/update.php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Récupérer les données PUT
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->id) &&
    !empty($data->libelle) &&
    !empty($data->prix_ht) &&
    !empty($data->tva)
) {
    // Calculer le nouveau prix TTC
    $prix_ttc = $data->prix_ht * (1 + $data->tva / 100);
    
    // Préparer la requête
    $query = "UPDATE produits 
              SET libelle = :libelle, 
                  prix_ht = :prix_ht, 
                  tva = :tva, 
                  prix_ttc = :prix_ttc 
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    // Nettoyer et lier les paramètres
    $id = htmlspecialchars(strip_tags($data->id));
    $libelle = htmlspecialchars(strip_tags($data->libelle));
    $prix_ht = htmlspecialchars(strip_tags($data->prix_ht));
    $tva = htmlspecialchars(strip_tags($data->tva));
    
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":libelle", $libelle);
    $stmt->bindParam(":prix_ht", $prix_ht);
    $stmt->bindParam(":tva", $tva);
    $stmt->bindParam(":prix_ttc", $prix_ttc);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array(
            "message" => "Produit mis à jour avec succès.",
            "prix_ttc" => number_format($prix_ttc, 2, ',', ' ')
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de mettre à jour le produit."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
}
?>