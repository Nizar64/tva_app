// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const addProductBtn = document.getElementById('addProductBtn');
    const exportBtn = document.getElementById('exportBtn');
    const printBtn = document.getElementById('printBtn');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelModal = document.getElementById('cancelModal');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    const productIdInput = document.getElementById('productId');
    const modalLibelle = document.getElementById('modalLibelle');
    const modalPrixHT = document.getElementById('modalPrixHT');
    const modalTVA = document.getElementById('modalTVA');
    const totalTTCElement = document.getElementById('totalTTC');
    
    let isEditMode = false;
    let currentProductId = null;
    
    // Calculer et afficher le total initial
    updateTotal();
    
    // Ouvrir le modal pour ajouter
    addProductBtn.addEventListener('click', function() {
        isEditMode = false;
        modalTitle.textContent = 'Ajouter un produit';
        productForm.reset();
        productIdInput.value = '0';
        productModal.style.display = 'block';
        modalLibelle.focus();
    });
    
    // Fermer le modal
    closeModal.addEventListener('click', closeModalFunc);
    cancelModal.addEventListener('click', closeModalFunc);
    
    function closeModalFunc() {
        productModal.style.display = 'none';
    }
    
    // Fermer le modal en cliquant en dehors
    window.addEventListener('click', function(event) {
        if (event.target === productModal) {
            closeModalFunc();
        }
    });
    
    // Soumettre le formulaire
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            id: productIdInput.value,
            libelle: modalLibelle.value.trim(),
            prix_ht: parseFloat(modalPrixHT.value),
            tva: parseFloat(modalTVA.value)
        };
        
        // Validation
        if (!formData.libelle) {
            alert('Veuillez saisir un libellé');
            return;
        }
        
        if (isNaN(formData.prix_ht) || formData.prix_ht < 0) {
            alert('Veuillez saisir un prix HT valide');
            return;
        }
        
        if (isEditMode) {
            updateProduct(formData);
        } else {
            createProduct(formData);
        }
    });
    
    // Créer un produit
    function createProduct(productData) {
        fetch('api/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message && !data.message.includes('Impossible')) {
                // Ajouter la nouvelle ligne au tableau
                addRowToTable({
                    id: data.id,
                    libelle: productData.libelle,
                    prix_ht: productData.prix_ht,
                    tva: productData.tva,
                    prix_ttc: data.prix_ttc,
                    created_at: data.created_at
                });
                
                // Mettre à jour le total
                updateTotal();
                
                // Fermer le modal
                closeModalFunc();
                
                // Afficher un message de succès
                showMessage('Produit ajouté avec succès!', 'success');
            } else {
                alert('Erreur: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de l\'ajout du produit');
        });
    }
    
    // Modifier un produit
    function updateProduct(productData) {
        fetch('api/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message && !data.message.includes('Impossible')) {
                // Mettre à jour la ligne dans le tableau
                updateRowInTable({
                    id: productData.id,
                    libelle: productData.libelle,
                    prix_ht: productData.prix_ht,
                    tva: productData.tva,
                    prix_ttc: data.prix_ttc
                });
                
                // Mettre à jour le total
                updateTotal();
                
                // Fermer le modal
                closeModalFunc();
                
                // Afficher un message de succès
                showMessage('Produit modifié avec succès!', 'success');
            } else {
                alert('Erreur: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la modification du produit');
        });
    }
    
    // Supprimer un produit
    function deleteProduct(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            return;
        }
        
        fetch('api/delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message && !data.message.includes('Impossible')) {
                // Supprimer la ligne du tableau
                const row = document.getElementById('row-' + id);
                if (row) {
                    row.remove();
                }
                
                // Mettre à jour le total
                updateTotal();
                
                // Afficher un message de succès
                showMessage('Produit supprimé avec succès!', 'success');
                
                // Vérifier si le tableau est vide
                checkEmptyTable();
            } else {
                alert('Erreur: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la suppression du produit');
        });
    }
    
    // Éditer un produit
    window.editProduct = function(id) {
        isEditMode = true;
        currentProductId = id;
        
        // Récupérer les données du produit
        const row = document.getElementById('row-' + id);
        if (row) {
            const cells = row.querySelectorAll('td');
            
            modalTitle.textContent = 'Modifier le produit';
            productIdInput.value = id;
            modalLibelle.value = cells[1].textContent.trim();
            modalPrixHT.value = parseFloat(cells[2].textContent.replace('€', '').replace(',', '.').trim());
            
            // Extraire le taux de TVA
            const tvaText = cells[3].querySelector('.tva-percent').textContent;
            const tvaValue = parseFloat(tvaText.replace('%', ''));
            modalTVA.value = tvaValue.toString();
            
            productModal.style.display = 'block';
            modalLibelle.focus();
        }
    };
    
    // Supprimer un produit (fonction globale)
    window.deleteProduct = deleteProduct;
    
    // Ajouter une ligne au tableau
    function addRowToTable(product) {
        const tableBody = document.getElementById('tableBody');
        
        // Vérifier si le tableau est vide
        const emptyRow = tableBody.querySelector('.empty-table');
        if (emptyRow) {
            tableBody.innerHTML = '';
        }
        
        const newRow = document.createElement('tr');
        newRow.id = 'row-' + product.id;
        newRow.classList.add('new-row');
        
        newRow.innerHTML = `
            <td>${product.id}</td>
            <td class="product-name">${product.libelle}</td>
            <td class="price-cell">${parseFloat(product.prix_ht).toFixed(2).replace('.', ',')} €</td>
            <td><span class="tva-percent">${product.tva}%</span></td>
            <td class="price-cell"><strong>${product.prix_ttc} €</strong></td>
            <td>${product.created_at}</td>
            <td>
                <div class="action-cell">
                    <button class="action-btn btn-editer" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="action-btn btn-supprimer" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </td>
        `;
        
        tableBody.prepend(newRow);
    }
    
    // Mettre à jour une ligne dans le tableau
    function updateRowInTable(product) {
        const row = document.getElementById('row-' + product.id);
        if (row) {
            const cells = row.querySelectorAll('td');
            
            cells[1].textContent = product.libelle;
            cells[1].className = 'product-name';
            
            cells[2].textContent = parseFloat(product.prix_ht).toFixed(2).replace('.', ',') + ' €';
            cells[2].className = 'price-cell';
            
            cells[3].innerHTML = `<span class="tva-percent">${product.tva}%</span>`;
            
            cells[4].innerHTML = `<strong>${product.prix_ttc} €</strong>`;
            cells[4].className = 'price-cell';
        }
    }
    
    // Mettre à jour le total
    function updateTotal() {
        const priceCells = document.querySelectorAll('td.price-cell strong');
        let total = 0;
        
        priceCells.forEach(cell => {
            const priceText = cell.textContent.replace('€', '').replace(',', '.').trim();
            const price = parseFloat(priceText);
            if (!isNaN(price)) {
                total += price;
            }
        });
        
        totalTTCElement.textContent = total.toFixed(2).replace('.', ',');
    }
    
    // Vérifier si le tableau est vide
    function checkEmptyTable() {
        const tableBody = document.getElementById('tableBody');
        const rows = tableBody.querySelectorAll('tr');
        
        if (rows.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-table">Aucun produit dans la base de données.</td>
                </tr>
            `;
        }
    }
    
    // Afficher un message
    function showMessage(message, type) {
        // Créer un élément de message temporaire
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.textContent = message;
        
        // Ajouter après le titre
        const container = document.querySelector('.container');
        const title = document.querySelector('h1');
        container.insertBefore(messageDiv, title.nextSibling);
        
        // Supprimer après 5 secondes
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
    
    // Exporter les données
    exportBtn.addEventListener('click', function() {
        fetch('api/read.php')
            .then(response => response.json())
            .then(data => {
                // Convertir en CSV
                let csv = 'ID,Libellé,Prix HT,TVA (%),Prix TTC,Date création\n';
                
                data.forEach(product => {
                    csv += `${product.id},"${product.libelle}",${product.prix_ht},${product.tva},${product.prix_ttc},${product.created_at}\n`;
                });
                
                // Télécharger le fichier
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'produits_tva.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            });
    });
    
    // Imprimer le tableau
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Calcul automatique du TTC lors de la saisie
    modalPrixHT.addEventListener('input', function() {
        const prixHT = parseFloat(this.value) || 0;
        const tva = parseFloat(modalTVA.value) || 20;
        const prixTTC = prixHT * (1 + tva / 100);
        
        // Afficher un aperçu (optionnel)
        const preview = document.getElementById('ttcPreview');
        if (!preview) {
            const previewDiv = document.createElement('div');
            previewDiv.id = 'ttcPreview';
            previewDiv.style.marginTop = '10px';
            previewDiv.style.padding = '10px';
            previewDiv.style.backgroundColor = '#f8f9fa';
            previewDiv.style.borderRadius = '5px';
            previewDiv.style.fontSize = '14px';
            modalPrixHT.parentNode.appendChild(previewDiv);
        }
        
        if (prixHT > 0) {
            document.getElementById('ttcPreview').textContent = 
                `Prix TTC estimé: ${prixTTC.toFixed(2)} €`;
        } else {
            document.getElementById('ttcPreview').textContent = '';
        }
    });
    
    modalTVA.addEventListener('change', function() {
        if (modalPrixHT.value) {
            modalPrixHT.dispatchEvent(new Event('input'));
        }
    });
});