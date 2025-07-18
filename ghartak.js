document.addEventListener('DOMContentLoaded', () => {
    // ---- SETTINGS ----
    const ADMIN_ID = 'AKASH777';
    const ADMIN_PASS = 'admin123';
    const WHATSAPP_NUMBER = '917388731640';
    const ADMIN_EMAIL = 'your@email.com'; // Update with real email

    // ---- DOM ----
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminPanelModal = document.getElementById('adminPanelModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminIdInput = document.getElementById('adminId');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginMessage = document.getElementById('loginMessage');

    const productManagementForm = document.getElementById('productManagementForm');
    const productAddName = document.getElementById('productAddName');
    const productAddBrand = document.getElementById('productAddBrand');
    const productAddPrice = document.getElementById('productAddPrice');
    const productAddCategory = document.getElementById('productAddCategory');
    const productAddStock = document.getElementById('productAddStock');
    const currentProductsList = document.getElementById('currentProductsList');

    const villageManagementForm = document.getElementById('villageManagementForm');
    const villageAddName = document.getElementById('villageAddName');
    const currentVillagesList = document.getElementById('currentVillagesList');
    const deliveryVillageSelect = document.getElementById('deliveryVillage');

    const productListings = document.getElementById('productList');
    const productNameSelect = document.getElementById('productName');
    const quantityInput = document.getElementById('quantity');
    const productPriceDisplay = document.getElementById('productPriceDisplay');
    const customerOrderForm = document.getElementById('customerOrderForm');
    const categoryFilterButtons = document.querySelectorAll('.filter-btn');

    // ---- DATA ----
    let products = JSON.parse(localStorage.getItem('bazzarwalaProducts_v2')) || [
        { id: 'prod1', name: 'आटा (5kg)', brand: 'आशीर्वाद', price: 150, category: 'Grocery', inStock: true },
        { id: 'prod2', name: 'चावल (1kg)', brand: 'भारत गोल्ड', price: 40, category: 'Grocery', inStock: true },
        { id: 'prod3', name: 'अरहर दाल', brand: 'पतंजलि', price: 95, category: 'Grocery', inStock: true },
        { id: 'prod4', name: 'सरसो तेल', brand: 'फॉर्च्यून', price: 170, category: 'Grocery', inStock: true },
        { id: 'prod5', name: 'हल्दी पाउडर', brand: 'एवरस्ट', price: 28, category: 'Masale', inStock: true },
        { id: 'prod6', name: 'धनिया पाउडर', brand: 'MDH', price: 38, category: 'Masale', inStock: true },
        { id: 'prod7', name: 'मिर्चा पाउडर', brand: 'गोल्डी', price: 32, category: 'Masale', inStock: true },
        { id: 'prod8', name: 'साबुन', brand: 'लाइफबॉय', price: 30, category: 'Personal Care', inStock: true },
        { id: 'prod9', name: 'सर्फ', brand: 'रिन', price: 65, category: 'Detergent', inStock: true },
        { id: 'prod10', name: 'बिस्कुट', brand: 'पारले-जी', price: 10, category: 'Snacks', inStock: true }
    ];
    let villages = JSON.parse(localStorage.getItem('bazzarwalaVillages')) || [
        'TISUHI', 'MADIHAN', 'BASAHI', 'KALWARI', 'SHOBHI', 'HARIHARA', 'PATEHARA', 'JAMUI', 'MARCHA'
    ];

    // ---- UTIL ----
    function saveProducts() { localStorage.setItem('bazzarwalaProducts_v2', JSON.stringify(products)); }
    function saveVillages() { localStorage.setItem('bazzarwalaVillages', JSON.stringify(villages)); }

    // ========== PRODUCTS ==========
    function renderProducts(filterCategory = 'सभी') {
        productListings.innerHTML = '';
        const filtered = products.filter(p =>
            p.inStock && (filterCategory === 'सभी' || p.category === filterCategory)
        );
        if (filtered.length === 0) {
            productListings.innerHTML = `<p style="text-align:center; grid-column: 1 / -1; color:#6a0dad;">कोई उत्पाद उपलब्ध नहीं है.</p>`;
            return;
        }
        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = `product-card${!product.inStock ? ' out-of-stock' : ''}`;
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>ब्रांड: ${product.brand || '-'}</p>
                <p>श्रेणी: ${product.category}</p>
                <p class="price">₹${product.price}</p>
            `;
            productListings.appendChild(card);
        });
    }

    function populateOrderFormProducts() {
        productNameSelect.innerHTML = '<option value="">उत्पाद चुनें</option>';
        products.filter(p => p.inStock).forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.dataset.price = p.price;
            option.dataset.brand = p.brand || '';
            option.textContent = `${p.name} (${p.brand}) - ₹${p.price}`;
            productNameSelect.appendChild(option);
        });
    }

    function updateProductPriceDisplay() {
        const option = productNameSelect.options[productNameSelect.selectedIndex];
        if (!option) return;
        const price = parseFloat(option.dataset.price);
        const quantity = parseInt(quantityInput.value) || 0;
        if (price && quantity) {
            productPriceDisplay.textContent = `कुल: ₹${price * quantity}`;
        } else {
            productPriceDisplay.textContent = '';
        }
    }

    categoryFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderProducts(button.dataset.category);
        });
    });

    // ========== ऑर्डर / व्हाट्सऐप ==========
    customerOrderForm.addEventListener('submit', e => {
        e.preventDefault();
        const selectedOption = productNameSelect.options[productNameSelect.selectedIndex];
        if (!selectedOption || !selectedOption.value) return alert('कोई उत्पाद चुनें');
        const product = products.find(p => p.id === selectedOption.value);
        const customerName = document.getElementById('customerName').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const deliveryVillage = deliveryVillageSelect.value;
        const deliveryAddress = document.getElementById('deliveryAddress').value;
        const quantity = parseInt(quantityInput.value);
        const total = product.price * quantity;

        let message = `नमस्ते Bazzarwala!\n\nमेरा ऑर्डर है:\n*उत्पाद:* ${product.name}\n*ब्रांड:* ${product.brand}\n*मात्रा:* ${quantity}\n*कुल कीमत:* ₹${total}\n\n*नाम:* ${customerName}\n*फोन:* ${customerPhone}\n*गाँव:* ${deliveryVillage}\n*पता:* ${deliveryAddress}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

        // Optional: Email via FormSubmit.co
        const formData = new FormData(customerOrderForm);
        formData.append('Product Name', product.name);
        formData.append('Brand', product.brand);
        formData.append('Quantity', quantity);
        formData.append('Total Price', `₹${total}`);
        formData.append('_subject', `नया ऑर्डर: ${customerName}`);
        fetch(`https://formsubmit.co/${ADMIN_EMAIL}`, { method:'POST', body:formData });

        alert("ऑर्डर भेज दिया गया है!");
        customerOrderForm.reset();
        productPriceDisplay.textContent = '';
    });
    productNameSelect.addEventListener('change', updateProductPriceDisplay);
    quantityInput.addEventListener('input', updateProductPriceDisplay);

    // ========== ADMIN LOGIN ==========
    adminLoginForm.addEventListener('submit', e => {
        e.preventDefault();
        if (
            adminIdInput.value.trim() === ADMIN_ID &&
            adminPasswordInput.value.trim() === ADMIN_PASS
        ) {
            adminLoginModal.style.display = 'none';
            adminPanelModal.style.display = 'flex';
            renderAdminProducts();
            renderAdminVillages();
            loginMessage.textContent = '';
        } else {
            loginMessage.textContent = 'गलत पासवर्ड या ID';
        }
    });

    // ========== ADMIN PANEL ==========
    // टैब स्विचिंग
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');
            const name = btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1);
            document.getElementById(`admin${name}Tab`).classList.add('active');
        });
    });

    function renderAdminProducts() {
        currentProductsList.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${product.name} (${product.brand}) - ₹${product.price} - ${product.category} - ${product.inStock ? 'उपलब्ध' : 'नहीं'}</span>
                <div>
                    <button class="edit-stock-btn" data-id="${product.id}" data-stock="${product.inStock}">स्टॉक</button>
                    <button class="delete-btn" data-id="${product.id}">हटाएं</button>
                </div>
            `;
            currentProductsList.appendChild(li);
        });
        renderProducts();
        populateOrderFormProducts();
    }

    productManagementForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = productAddName.value.trim();
        const brand = productAddBrand.value.trim();
        const price = parseFloat(productAddPrice.value);
        const category = productAddCategory.value;
        const inStock = productAddStock.value === 'true';

        const existing = products.find(p =>
            p.name.toLowerCase() === name.toLowerCase() &&
            p.brand.toLowerCase() === brand.toLowerCase()
        );
        if (existing) {
            existing.price = price;
            existing.category = category;
            existing.inStock = inStock;
            alert("उत्पाद अपडेट हो गया");
        } else {
            products.push({
                id: 'prod' + Date.now(),
                name,
                brand,
                price,
                category,
                inStock
            });
            alert("उत्पाद जोड़ा गया");
        }
        saveProducts();
        productManagementForm.reset();
        renderAdminProducts();
    });

    currentProductsList.addEventListener('click', e => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('हटाना है?')) {
                products = products.filter(p => p.id !== id);
                saveProducts();
                renderAdminProducts();
            }
        }
        if (e.target.classList.contains('edit-stock-btn')) {
            const id = e.target.dataset.id;
            const product = products.find(p => p.id === id);
            product.inStock = !product.inStock;
            saveProducts();
            renderAdminProducts();
        }
    });

    // ========== VILLAGES ==========
    function renderAdminVillages() {
        currentVillagesList.innerHTML = '';
        villages.forEach(v => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${v}</span><button class="delete-btn" data-village="${v}">हटाएं</button>`;
            currentVillagesList.appendChild(li);
        });
        populateDeliveryVillages();
    }
    function populateDeliveryVillages() {
        deliveryVillageSelect.innerHTML = '<option value="">गाँव चुनें</option>';
        villages.forEach(v => {
            const option = document.createElement('option');
            option.value = v;
            option.textContent = v;
            deliveryVillageSelect.appendChild(option);
        });
    }
    villageManagementForm.addEventListener('submit', e => {
        e.preventDefault();
        const newVillage = villageAddName.value.trim();
        if (!newVillage) return;
        if (!villages.includes(newVillage)) {
            villages.push(newVillage);
            saveVillages();
            renderAdminVillages();
            villageAddName.value = '';
        } else {
            alert("गाँव पहले से है");
        }
    });
    currentVillagesList.addEventListener('click', e => {
        const village = e.target.dataset.village;
        if (village && confirm(`"${village}" को हटाएं?`)) {
            villages = villages.filter(v => v !== village);
            saveVillages();
            renderAdminVillages();
        }
    });

    // ========== CLOSE MODALS ==========
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
            adminPanelModal.style.display = 'none';
        });
    });
    window.addEventListener('click', e => {
        if (e.target === adminLoginModal) adminLoginModal.style.display = 'none';
        if (e.target === adminPanelModal) adminPanelModal.style.display = 'none';
    });

    // ========== ADMIN ICON DOUBLE-TAP ==========
    const adminIcon = document.getElementById('adminIconArea');
    if (adminIcon) {
        let lastClick = 0;
        adminIcon.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClick < 400) {
                adminLoginModal.style.display = 'flex';
            }
            lastClick = now;
        });
    }

    // ====== INITIAL LOAD ======
    renderProducts();
    populateOrderFormProducts();
    populateDeliveryVillages();
});
