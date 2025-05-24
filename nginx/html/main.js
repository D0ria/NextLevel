// main.js

// Gestion des données
const {Pool} = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'db-1',
    database: 'postgres',
    password: 'example',
    port: 5432,
});

let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        // Mise à jour des classes active
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        
        document.getElementById(page).classList.add('active');
        link.classList.add('active');
    });
});

// Gestion des produits
async function addProduct(product) {
    const query = 'INSERT INTO products (name, price, image, description, stock) VALUES (?, ?, ?, ?, ?)';
    const values = [product.name, product.price, product.image, product.description, product.stock];
    await pool.query(query, values);
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    renderAdminProducts();
}

async function removeProduct(index) {
    const query = 'INSERT INTO products (name, price, image, description, stock) VALUES (?, ?, ?, ?, ?)';
    const values = [product.name, product.price, products.image, products.description, products.stock];
    await pool.query(query, values);
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    renderAdminProducts();
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map((product, index) => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">${product.price}€</p>
                <button onclick="addToCart(${index})">Ajouter au panier</button>
            </div>
        </div>
    `).join('');
}

function renderAdminProducts() {
    const list = document.getElementById('admin-products-list');
    list.innerHTML = products.map((product, index) => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price}€</p>
                <button onclick="removeProduct(${index})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Gestion du panier
function addToCart(productIndex) {
    const product = products[productIndex];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((product, index) => `
        <div class="cart-item">
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p>${product.price}€</p>
                <button onclick="removeFromCart(${index})">Retirer</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, product) => sum + parseFloat(product.price), 0);
    document.getElementById('total-amount').textContent = total.toFixed(2);
}

// Formulaire d'ajout de produit
document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        name: document.getElementById('product-name').value,
        price: document.getElementById('product-price').value,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value
    };
    addProduct(product);
    e.target.reset();
});

// Initialisation
renderProducts();
renderAdminProducts();
updateCartCount();
renderCart();

// Gestion du checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    alert('Commande validée ! Merci de votre achat.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
});