const menuItems = [
    {
        id: 1,
        name: "Боул с лососем и авокадо",
        price: 650,
        calories: 450,
        protein: 25,
        fat: 22,
        carbs: 35,
        category: ["keto", "high-protein"],
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Киноа с овощами гриль",
        price: 420,
        calories: 320,
        protein: 12,
        fat: 8,
        carbs: 45,
        category: ["vegan", "low-carb"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Куриная грудка су-вид",
        price: 550,
        calories: 280,
        protein: 45,
        fat: 5,
        carbs: 2,
        category: ["keto", "high-protein", "low-carb"],
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Смузи боул Зеленая энергия",
        price: 380,
        calories: 210,
        protein: 5,
        fat: 4,
        carbs: 38,
        category: ["vegan"],
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Тофу скрэмбл",
        price: 400,
        calories: 310,
        protein: 18,
        fat: 15,
        carbs: 12,
        category: ["vegan", "keto"],
        image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Стейк из тунца",
        price: 890,
        calories: 350,
        protein: 42,
        fat: 12,
        carbs: 0,
        category: ["high-protein", "keto", "low-carb"],
        image: "https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=500&q=80"
    }
];

let cart = [];
let currentFilter = 'all';

const menuGrid = document.getElementById('menu-grid');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalDisplay = document.getElementById('cart-total');
const qrSection = document.getElementById('qr-section');
const checkoutBtn = document.getElementById('checkout-btn');
const qrContainer = document.getElementById('qrcode');
const totalK = document.getElementById('total-k');
const totalB = document.getElementById('total-b');
const totalZh = document.getElementById('total-zh');
const totalU = document.getElementById('total-u');

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    setupFilters();
});

function renderMenu() {
    menuGrid.innerHTML = '';
    
    const filteredItems = currentFilter === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category.includes(currentFilter));

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-img">
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${item.name}</h3>
                    <span class="card-price">${item.price} ₽</span>
                </div>
                <div class="card-tags">
                    ${item.category.map(cat => `<span class="tag">${cat}</span>`).join('')}
                </div>
                <div class="kbju-info">
                    <div class="kbju-item">
                        <span class="kbju-label">Ккал</span>
                        <span class="kbju-val">${item.calories}</span>
                    </div>
                    <div class="kbju-item">
                        <span class="kbju-label">Белки</span>
                        <span class="kbju-val">${item.protein}</span>
                    </div>
                    <div class="kbju-item">
                        <span class="kbju-label">Жиры</span>
                        <span class="kbju-val">${item.fat}</span>
                    </div>
                    <div class="kbju-item">
                        <span class="kbju-label">Угл</span>
                        <span class="kbju-val">${item.carbs}</span>
                    </div>
                </div>
                <button class="add-btn" onclick="addToCart(${item.id})">В корзину</button>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderMenu();
        });
    });
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    cart.push(item);
    updateCartUI();
    
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'Добавлено!';
    btn.style.background = '#fff';
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
    }, 1000);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    cartModal.classList.toggle('hidden');
    if (cartModal.classList.contains('hidden')) {
        qrSection.classList.add('hidden');
        checkoutBtn.style.display = 'block';
    }
}

function updateCartUI() {
    cartCount.innerText = cart.length;
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Корзина пуста</p>';
    } else {
        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₽</p>
                </div>
                <i class="fa-solid fa-trash remove-item" onclick="removeFromCart(${index})"></i>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    const totals = cart.reduce((acc, item) => {
        acc.price += item.price;
        acc.k += item.calories;
        acc.b += item.protein;
        acc.zh += item.fat;
        acc.u += item.carbs;
        return acc;
    }, { price: 0, k: 0, b: 0, zh: 0, u: 0 });

    cartTotalDisplay.innerText = totals.price;
    totalK.innerText = totals.k;
    totalB.innerText = totals.b;
    totalZh.innerText = totals.zh;
    totalU.innerText = totals.u;
}

function processCheckout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    checkoutBtn.style.display = 'none';
    qrSection.classList.remove('hidden');
    const orderId = 'ORD-' + Math.floor(Math.random() * 10000);
    document.getElementById('order-id-display').innerText = orderId;

    const orderData = {
        id: orderId,
        items: cart.map(i => i.id),
        total: cartTotalDisplay.innerText
    };

    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: JSON.stringify(orderData),
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    
    cart = [];
    cartCount.innerText = 0;
}
