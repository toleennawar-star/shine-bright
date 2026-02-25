// JavaScript for E-commerce Functionality

// Cart functionality
let cart = [];
let wishlist = [];

// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const overlay = document.querySelector('.overlay');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');
const searchIcon = document.querySelector('.search-icon');
const searchModal = document.querySelector('.search-modal');
const closeSearch = document.querySelector('.close-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const addToCartBtns = document.querySelectorAll('.action-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    loadWishlistFromStorage();
    updateCartCount();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Cart toggle
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    // Mobile menu toggle
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }
    
    // Search modal
    if (searchIcon) {
        searchIcon.addEventListener('click', openSearchModal);
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', closeSearchModal);
    }
    
    // Product filters
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProducts(btn.dataset.filter);
            });
        });
    }
    
    // Add to cart buttons
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('fa-shopping-cart') || 
                    e.target.closest('.fa-shopping-cart')) {
                    const productCard = e.target.closest('.product-card');
                    addToCart(productCard);
                }
            });
        });
    }
    
    // Close overlay on click
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeCartSidebar();
            closeSearchModal();
            closeMobileMenu();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            }
        });
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Cart Functions
function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function addToCart(productCard) {
    const product = {
        id: Date.now(),
        name: productCard.querySelector('.product-name').textContent,
        price: parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '')),
        image: productCard.querySelector('.product-image img').src,
        quantity: 1
    };
    
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }
    
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    
    // Show feedback
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== product