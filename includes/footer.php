<?php
// includes/footer.php
?>
        
        <div class="total-section">
            <span>TOTAL TTC : </span>
            <span id="totalTTC">0.00</span> €
        </div>
    </div>

    <!-- Modal pour ajouter/modifier -->
    <div id="productModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Ajouter un produit</h3>
                <span class="close-modal">&times;</span>
            </div>
            <form id="productForm">
                <input type="hidden" id="productId" name="id" value="0">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="libelle">Libellé *</label>
                        <input type="text" id="modalLibelle" name="libelle" required>
                    </div>
                    <div class="form-group">
                        <label for="prix_ht">Prix HT *</label>
                        <input type="number" id="modalPrixHT" name="prix_ht" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="tva">TVA *</label>
                        <select id="modalTVA" name="tva" required>
                            <option value="5.5">5.5%</option>
                            <option value="10">10%</option>
                            <option value="20" selected>20%</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-annuler" id="cancelModal">Annuler</button>
                    <button type="submit" class="btn btn-confirmer" id="saveProduct">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>