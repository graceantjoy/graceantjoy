document.addEventListener('DOMContentLoaded', () => {
    // Swiper初始化
    if (document.querySelector('.swiper-container')) {
        new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            spaceBetween: 10,
        });
    }

    updateCartCount();
});

function changeQuantity(amount) {
    let quantityInput = document.getElementById('quantity');
    let newValue = parseInt(quantityInput.value) + amount;
    if (newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

function addToCart(productName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += parseInt(document.getElementById('quantity').value);
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: parseInt(document.getElementById('quantity').value)
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartNotification();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function showCartNotification() {
    let cartNotification = document.getElementById('cartNotification');
    if (cartNotification) {
        cartNotification.style.display = 'block';
        setTimeout(() => {
            cartNotification.style.display = 'none';
        }, 2000);
    }
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    
    if (container) {
        container.innerHTML = '';

        if (cart.length === 0) {
            container.innerHTML = '<p class="product-description text-center">购物车为空</p>';
            updateCartSummary(0, 0);
            return;
        }

        let total = 0;
        let totalItems = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalItems += item.quantity;

            container.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>单价：¥${item.price} | 数量：${item.quantity}</p>
                        <div class="cart-item-actions">
                            <button onclick="updateQuantity(${index}, -1)"><i class="ri-subtract-line"></i></button>
                            <button onclick="updateQuantity(${index}, 1)"><i class="ri-add-line"></i></button>
                            <button onclick="removeItem(${index})"><i class="ri-delete-bin-line"></i></button>
                        </div>
                    </div>
                    <div class="cart-item-total">¥${itemTotal}</div>
                </div>
            `;
        });

        updateCartSummary(totalItems, total);
    }
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
    updateCartCount();
}

function updateCartSummary(totalItems, totalPrice) {
    const totalItemsEl = document.getElementById('totalItems');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (totalPriceEl) totalPriceEl.textContent = totalPrice.toFixed(2);
}

// 页面加载时初始化购物车
document.addEventListener('DOMContentLoaded', loadCart);
