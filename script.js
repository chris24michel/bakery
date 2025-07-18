// Menu Data
const menuItems = [
    {
        id: 1,
        name: "Classic Sourdough",
        description: "Traditional sourdough with a crisp crust and airy interior",
        price: 7.50,
        category: "sourdough",
        image: "images/sourdough.jpg"
    },
    {
        id: 2,
        name: "Whole Wheat Sourdough",
        description: "Nutty flavor with the perfect balance of whole wheat and white flour",
        price: 8.00,
        category: "sourdough",
        image: "images/sourdough.jpg"
    },
    {
        id: 3,
        name: "Rosemary Garlic Sourdough",
        description: "Aromatic rosemary and roasted garlic infused in our classic loaf",
        price: 9.00,
        category: "sourdough",
        image: "images/sourdough.jpg"
    },
    {
        id: 4,
        name: "Chocolate Chip Cookie",
        description: "Classic cookie with melty chocolate chips and a touch of sea salt",
        price: 3.50,
        category: "cookies",
        image: "images/cookies.jpg"
    },
    {
        id: 5,
        name: "Oatmeal Raisin Cookie",
        description: "Chewy oatmeal cookie packed with plump raisins and cinnamon",
        price: 3.00,
        category: "cookies",
        image: "images/cookies.jpg"
    },
    {
        id: 6,
        name: "Double Chocolate Cookie",
        description: "Rich chocolate cookie with dark chocolate chunks",
        price: 4.00,
        category: "cookies",
        image: "images/cookies.jpg"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const menuItemsContainer = document.querySelector('.menu-items');
const categoryButtons = document.querySelectorAll('.menu-categories button');
const cartCount = document.querySelector('.cart-count');
const orderItemsContainer = document.querySelector('.order-items');
const emptyCartMsg = document.querySelector('.empty-cart');
const totalAmount = document.querySelector('.total-amount');
const orderForm = document.querySelector('.order-form');
const modal = document.getElementById('order-modal');
const closeModal = document.querySelector('.close-modal');
const closeBtn = document.querySelector('.close-btn');

// Display menu items
function displayMenuItems(category = 'all') {
    menuItemsContainer.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    if (filteredItems.length === 0) {
        menuItemsContainer.innerHTML = '<p class="no-items">No items found in this category</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item');
        itemElement.dataset.id = item.id;
        itemElement.dataset.category = item.category;
        
        itemElement.innerHTML = `
            <div class="menu-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-item-content">
                <div class="menu-item-title">
                    <span>${item.name}</span>
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <p class="menu-item-desc">${item.description}</p>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        
        menuItemsContainer.appendChild(itemElement);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add item to cart
function addToCart(e) {
    const itemId = parseInt(e.target.dataset.id);
    const item = menuItems.find(item => item.id === itemId);
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification(item.name);
}

// Show notification when item is added to cart
function showCartNotification(itemName) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = `${itemName} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Update cart display
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cart.length === 0) {
        emptyCartMsg.style.display = 'block';
        orderItemsContainer.innerHTML = '';
    } else {
        emptyCartMsg.style.display = 'none';
        orderItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            
            itemElement.innerHTML = `
                <div>
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="order-item-quantity">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                    <div class="remove-item" data-id="${item.id}">Remove</div>
                </div>
            `;
            
            orderItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }
    
    updateTotal();
}

// Update total amount
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Increase item quantity
function increaseQuantity(e) {
    const itemId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === itemId);
    item.quantity += 1;
    updateCart();
}

// Decrease item quantity
function decreaseQuantity(e) {
    const itemId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === itemId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== itemId);
    }
    
    updateCart();
}

// Remove item from cart
function removeItem(e) {
    const itemId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Handle category filter
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayMenuItems(button.dataset.category);
    });
});

// In your script.js file
const API_URL = 'https://fyptm02g0j.execute-api.us-east-1.amazonaws.com/prod/order';

async function submitOrder(orderData) {
    try {
        // Validate required fields before sending
        if (!orderData.name || !orderData.email || !orderData.items || orderData.items.length === 0) {
            throw new Error('Please fill all required fields');
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors', // Enable CORS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: orderData.name,
                email: orderData.email,
                items: orderData.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: orderData.total,
                phone: orderData.phone || '',
                date: orderData.date || '',
                address: orderData.address || '',
                notes: orderData.notes || ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit order');
        }

        return await response.json();
    } catch (error) {
        console.error('Order submission error:', error);
        throw error; // Re-throw to handle in your UI
    }
}

// Example usage when form is submitted
document.querySelector('.order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const orderData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            items: Array.from(document.querySelectorAll('.cart-item')).map(item => ({
                id: item.dataset.id,
                name: item.dataset.name,
                price: parseFloat(item.dataset.price),
                quantity: parseInt(item.querySelector('.quantity').textContent)
            })),
            total: parseFloat(document.querySelector('.order-total').textContent.replace('$', '')),
            date: document.getElementById('date').value,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value
        };

        const result = await submitOrder(orderData);
        alert('Order submitted successfully! Order ID: ' + result.orderId);
        // Reset form or redirect as needed
    } catch (error) {
        alert('Error: ' + error.message);
    }
});


// Add this to load menu items from backend
async function loadMenuItems() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        const items = await response.json();
        
        // Replace your static menuItems array with the fetched data
        menuItems = items;
        displayMenuItems();
    } catch (error) {
        console.error('Failed to load menu:', error);
        // Fall back to static menu items
        displayMenuItems();
    }
}

// Call this at initialization
loadMenuItems();

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    window.location.href = '#menu';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize
displayMenuItems();
updateCart();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Set minimum date for delivery (today + 1 day)
const dateInput = document.getElementById('date');
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];
dateInput.setAttribute('min', minDate);