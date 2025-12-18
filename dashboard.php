<?php
// dashboard.php
require_once 'config/database.php';
require_once 'config/session.php';
require_once 'includes/header.php';

// Vérifier la connexion
Session::requireLogin();

$database = new Database();
$db = $database->getConnection();

// Récupérer les produits de l'utilisateur connecté
$user_id = Session::get('user_id');
$role = Session::get('role');

if ($role == 'admin') {
    // Les admins voient tous les produits
    $query = "SELECT p.*, u.username as user_name 
              FROM produits p 
              LEFT JOIN users u ON p.user_id = u.id 
              ORDER BY p.id DESC";
    $stmt = $db->prepare($query);
} else {
    // Les utilisateurs normaux ne voient que leurs produits
    $query = "SELECT * FROM produits WHERE user_id = :user_id ORDER BY id DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
}

$stmt->execute();
$produits = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="user-info">
    <img src="C:\wamp64\www\tva_users\assets\tva.avif" alt="">
    <div class="user-welcome">
        <h2><i class="fas fa-user-circle"></i> Bienvenue, <?php echo htmlspecialchars(Session::get('username')); ?>!</h2>
        <p class="user-role">Rôle: <span class="role-badge role-<?php echo Session::get('role'); ?>">
            <?php echo Session::get('role'); ?>
        </span></p>
    </div>
    
    <div class="user-actions">
        <a href="logout.php" class="btn-logout">
            <i class="fas fa-sign-out-alt"></i> Déconnexion
        </a>
    </div>
</div>

<div class="input-section">
    <div class="input-group">
        <button class="btn btn-ajouter" id="addProductBtn">
            <i class="fas fa-plus-circle"></i> Ajouter un produit
        </button>
    </div>
    
    <div class="buttons-section">
        <button class="btn btn-export" id="exportBtn">
            <i class="fas fa-file-export"></i> Exporter
        </button>
        <button class="btn btn-print" id="printBtn">
            <i class="fas fa-print"></i> Imprimer
        </button>
        
       <!-- <?php if (Session::isAdmin()): ?>
            <a href="admin.php" class="btn btn-admin">
                <i class="fas fa-cogs"></i> Administration
            </a> 
        <?php endif; ?> -->
    </div>
</div>

<div class="table-container">
    <table id="vatTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Libellé</th>
                <th>Prix HT</th>
                <th>TVA</th>
                <th>Prix TTC</th>
                <th>Date</th>
                <?php if (Session::isAdmin()): ?>
                    <th>Utilisateur</th>
                <?php endif; ?>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="tableBody">
            <?php if(count($produits) > 0): ?>
                <?php foreach($produits as $produit): ?>
                    <tr id="row-<?php echo $produit['id']; ?>">
                        <td><?php echo $produit['id']; ?></td>
                        <td class="product-name"><?php echo htmlspecialchars($produit['libelle']); ?></td>
                        <td class="price-cell"><?php echo number_format($produit['prix_ht'], 2, ',', ' '); ?> €</td>
                        <td><span class="tva-percent"><?php echo $produit['tva']; ?>%</span></td>
                        <td class="price-cell"><strong><?php echo number_format($produit['prix_ttc'], 2, ',', ' '); ?> €</strong></td>
                        <td><?php echo date('d/m/Y', strtotime($produit['created_at'])); ?></td>
                        <?php if (Session::isAdmin()): ?>
                            <td><?php echo htmlspecialchars($produit['user_name'] ?? 'N/A'); ?></td>
                        <?php endif; ?>
                        <td>
                            <div class="action-cell">
                                <?php if (Session::isAdmin() || $produit['user_id'] == $user_id): ?>
                                    <button class="action-btn btn-editer" onclick="editProduct(<?php echo $produit['id']; ?>)">
                                        <i class="fas fa-edit"></i> Modifier
                                    </button>
                                    <button class="action-btn btn-supprimer" onclick="deleteProduct(<?php echo $produit['id']; ?>)">
                                        <i class="fas fa-trash"></i> Supprimer
                                    </button>
                                <?php else: ?>
                                    <span class="no-permission">Lecture seule</span>
                                <?php endif; ?>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="<?php echo Session::isAdmin() ? 8 : 7; ?>" class="empty-table">
                        Aucun produit dans la base de données.
                    </td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php
require_once 'includes/footer.php';
?>