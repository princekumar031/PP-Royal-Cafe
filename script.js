/* ============================================
   Royal Cafe - JavaScript Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    initAddMenuItem();
    initViewToggle();
    initOrderButtons();
    initContactForm();
    initAuth();
});

/* ---------- Header Scroll Effect ---------- */
function initHeaderScroll() {
    var header = document.getElementById('header');
    var onScroll = function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
}

/* ---------- Mobile Menu Toggle ---------- */
function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('nav');

    toggle.addEventListener('click', function () {
        nav.classList.toggle('mobile-open');
    });

    // Close mobile menu when a nav link, order button, or auth button is clicked
    document.querySelectorAll('.nav-link, .btn-order-nav, .auth-link').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('mobile-open');
        });
    });
}

/* ---------- Scroll Animations (Intersection Observer) ---------- */
function initScrollAnimations() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    var elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    elements.forEach(function (el) {
        observer.observe(el);
    });
}

/* ---------- Order Now Buttons (Menu Items) ---------- */
function initOrderButtons() {
    var buttons = document.querySelectorAll('.btn-order');
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var item = this.getAttribute('data-item') || 'your order';
            e.preventDefault();
            e.stopPropagation();
            showNotification('Placing order for: ' + item + ' ...');
        });
    });
}

/* ---------- Contact Form Validation ---------- */
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;

        // Reset previous errors
        clearErrors();

        // Validate name
        var name = form.name.value.trim();
        if (name.length < 2) {
            showError('name', 'Please enter a valid name');
            isValid = false;
        }

        // Validate email
        var email = form.email.value.trim();
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }

        // Validate phone
        var phone = form.phone.value.trim();
        var phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,20}$/;
        if (!phoneRegex.test(phone)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate subject
        if (form.subject.value.trim() === '') {
            showError('subject', 'Please enter a subject');
            isValid = false;
        }

        // Validate message
        if (form.message.value.trim().length < 10) {
            showError('message', 'Message should be at least 10 characters');
            isValid = false;
        }

        if (isValid) {
            showSuccess('Thank you! Your message has been sent successfully.');
            form.reset();
        }
    });

    function showSuccess(message) {
        var successEl = document.getElementById('formSuccess');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
            setTimeout(function () { successEl.style.display = 'none'; }, 4000);
        }
    }

    function showError(field, message) {
        var input = form.querySelector('[name="' + field + '"]');
        input.classList.add('invalid');
        var error = document.getElementById(field + 'Error');
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
        }
    }

    function clearErrors() {
        var inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(function (input) {
            input.classList.remove('invalid');
        });
        var errors = form.querySelectorAll('.form-error');
        errors.forEach(function (err) {
            err.style.display = 'none';
        });
    }
}

/* ---------- Notification System ---------- */
function showNotification(message) {
    // Remove existing notification
    var existing = document.querySelector('.notification');
    if (existing) existing.remove();

    var notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText =
        'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);' +
        'background:var(--dark-brown);color:var(--white);padding:0.75rem 1.75rem;' +
        'border-radius:var(--radius-lg);box-shadow:var(--shadow-strong);z-index:9999;' +
        'opacity:0;transition:all 0.3s ease;font-size:0.95rem;';

    document.body.appendChild(notif);

    setTimeout(function () {
        notif.style.transform = 'translateX(-50%) translateY(0)';
        notif.style.opacity = '1';
    }, 10);

    setTimeout(function () {
        notif.style.transform = 'translateX(-50%) translateY(100px)';
        notif.style.opacity = '0';
        setTimeout(function () { notif.remove(); }, 300);
    }, 3000);
}

/* ---------- Password Hashing (client-side, never plain text) ---------- */
function hashPassword(password) {
    var hash = 0;
    var str = password + 'royalcafe_salt_2024';
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hc_' + (hash >>> 0).toString(36);
}

/* ---------- Utility: Smooth anchor scroll with offset ---------- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        var target = href && href !== '#' ? document.querySelector(href) : null;
        if (target) {
            e.preventDefault();
            var headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 0;
             var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    });
});

/* ---------- Authentication ---------- */
function initAuth() {
    var modal = document.getElementById('authModal');
    if (!modal) return;

    var loginBtn = document.getElementById('loginBtn');
    var signupBtn = document.getElementById('signupBtn');
    var closeBtn = document.getElementById('authClose');

    if (loginBtn) loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!JSON.parse(localStorage.getItem('royalCafeUser') || 'null')) {
            openAuth('login');
        }
    });
    if (signupBtn) signupBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var storedUser = JSON.parse(localStorage.getItem('royalCafeUser') || 'null');
        if (storedUser) {
            localStorage.removeItem('royalCafeUser');
            loginBtn.textContent = 'Login';
            signupBtn.textContent = 'Sign Up';
            signupBtn.classList.remove('auth-link-btn');
            showNotification('Logged out successfully');
        } else {
            openAuth('signup');
        }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeAuth);

    var overlay = modal.querySelector('.auth-overlay');
    if (overlay) overlay.addEventListener('click', closeAuth);

    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');

    document.getElementById('switchToSignup').addEventListener('click', function (e) {
        e.preventDefault();
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });
    document.getElementById('switchToLogin').addEventListener('click', function (e) {
        e.preventDefault();
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    document.getElementById('signupFormEl').addEventListener('submit', function (e) {
        e.preventDefault(); handleSignup();
    });
    document.getElementById('loginFormEl').addEventListener('submit', function (e) {
        e.preventDefault(); handleLogin();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeAuth();
    });

    var toggleBtns = modal.querySelectorAll('.toggle-password');
    toggleBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var wrapper = this.closest('.password-wrapper');
            var input = wrapper.querySelector('input');
            var icon = this.querySelector('.eye-icon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '🔒';
            } else {
                input.type = 'password';
                icon.textContent = '👁';
            }
        });
    });

    var forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', function (e) {
            e.preventDefault();
            clearAuthErrors();
            var emailInput = document.querySelector('#loginFormEl input[name="email"]');
            var email = emailInput ? emailInput.value.trim() : '';

            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                showAuthError('loginEmailError', 'Please enter your email to reset password');
                return;
            }

            var users = JSON.parse(localStorage.getItem('royalCafeUsers') || '[]');
            var user = users.find(function (u) { return u.email === email; });

            if (!user) {
                showAuthError('loginEmailError', 'Email not found. Please sign up first.');
                return;
            }

            var tempPassword = 'RC' + Math.floor(100000 + Math.random() * 900000);
            var userIndex = users.findIndex(function (u) { return u.email === email; });
            users[userIndex].password = hashPassword(tempPassword);
            localStorage.setItem('royalCafeUsers', JSON.stringify(users));

            showNotification('Your temporary password is: ' + tempPassword + '. Use it to login. Change it later.');
        });
    }

    checkAuthState();
}

function openAuth(type) {
    var modal = document.getElementById('authModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    if (type === 'signup') {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    } else {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    }
}

function closeAuth() {
    var modal = document.getElementById('authModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function clearAuthErrors() {
    var errors = document.querySelectorAll('.auth-error');
    for (var i = 0; i < errors.length; i++) {
        errors[i].textContent = '';
    }
}

function showAuthError(id, message) {
    var el = document.getElementById(id);
    if (el) el.textContent = message;
}

function handleSignup() {
    var form = document.getElementById('signupFormEl');
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var password = form.password.value;
    var isValid = true;

    clearAuthErrors();

    if (name.length < 2) {
        showAuthError('signupNameError', 'Please enter a valid name');
        isValid = false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        showAuthError('signupEmailError', 'Please enter a valid email');
        isValid = false;
    }
    if (password.length < 6) {
        showAuthError('signupPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    if (!isValid) return;

    var users = JSON.parse(localStorage.getItem('royalCafeUsers') || '[]');
    if (users.find(function (u) { return u.email === email; })) {
        showAuthError('signupEmailError', 'Email already registered. Please login.');
        return;
    }

    users.push({ name: name, email: email, password: hashPassword(password) });
    localStorage.setItem('royalCafeUsers', JSON.stringify(users));
    showNotification('Account created! You can now login.');
    form.reset();
    closeAuth();
}

function handleLogin() {
    var form = document.getElementById('loginFormEl');
    var email = form.email.value.trim();
    var password = form.password.value;
    var isValid = true;

    clearAuthErrors();

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        showAuthError('loginEmailError', 'Please enter a valid email');
        isValid = false;
    }
    if (password.length < 1) {
        showAuthError('loginPasswordError', 'Please enter your password');
        isValid = false;
    }
    if (!isValid) return;

    var users = JSON.parse(localStorage.getItem('royalCafeUsers') || '[]');
    var hashedPassword = hashPassword(password);
    var user = users.find(function (u) {
        return u.email === email && u.password === hashedPassword;
    });
    if (!user) {
        showAuthError('loginPasswordError', 'Invalid email or password');
        return;
    }

    localStorage.setItem('royalCafeUser', JSON.stringify({
        name: user.name,
        email: user.email
    }));
    showNotification('Login successful! Welcome, ' + user.name.split(' ')[0] + '!');
    closeAuth();
    form.reset();

    setTimeout(function () {
        window.location.hash = '#home';
        window.scrollTo(0, 0);
        checkAuthState();
    }, 1000);
}

function checkAuthState() {
    var loginBtn = document.getElementById('loginBtn');
    var signupBtn = document.getElementById('signupBtn');
    if (!loginBtn || !signupBtn) return;

    var storedUser = JSON.parse(localStorage.getItem('royalCafeUser') || 'null');
    if (storedUser) {
        loginBtn.textContent = storedUser.name.split(' ')[0] || 'Account';
        loginBtn.onclick = function (e) { e.preventDefault(); };
        signupBtn.textContent = 'Logout';
        signupBtn.classList.add('auth-link-btn');
        signupBtn.onclick = function (e) {
            e.preventDefault();
            localStorage.removeItem('royalCafeUser');
            loginBtn.textContent = 'Login';
            signupBtn.textContent = 'Sign Up';
            signupBtn.classList.remove('auth-link-btn');
            loginBtn.onclick = null;
            signupBtn.onclick = null;
            showNotification('Logged out successfully');
        };
    }
}

/* ---------- Add Menu Item (Admin) ---------- */
function initAddMenuItem() {
    var toggle = document.getElementById('addMenuToggle');
    var container = document.getElementById('addMenuFormContainer');
    var form = document.getElementById('addMenuItemForm');
    if (!toggle || !container || !form) return;

    var isOpen = localStorage.getItem('royalCafeAddMenuOpen') === 'true';
    container.style.display = isOpen ? 'block' : 'none';

    toggle.addEventListener('click', function () {
        isOpen = container.style.display === 'block';
        container.style.display = isOpen ? 'none' : 'block';
        localStorage.setItem('royalCafeAddMenuOpen', container.style.display === 'block');
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        addMenuItem(form);
    });

    renderCustomItems();
}

/* ---------- View More / View Less Toggle ---------- */
var isViewMoreActive = false;

function initViewToggle() {
    var btn = document.getElementById('viewToggleBtn');
    if (!btn) return;

    btn.addEventListener('click', function () {
        var customItems = document.querySelectorAll('.custom-menu-item');
        if (!isViewMoreActive) {
            customItems.forEach(function (item) {
                item.classList.remove('menu-item-hidden');
            });
            btn.textContent = 'View Less';
        } else {
            customItems.forEach(function (item) {
                item.classList.add('menu-item-hidden');
            });
            btn.textContent = 'View More';
        }
        isViewMoreActive = !isViewMoreActive;
    });

    updateViewToggle();
}

function updateViewToggle() {
    var btn = document.getElementById('viewToggleBtn');
    if (!btn) return;

    var customItems = document.querySelectorAll('.custom-menu-item');
    if (customItems.length > 0) {
        btn.style.display = 'block';
        btn.textContent = isViewMoreActive ? 'View Less' : 'View More';
    } else {
        btn.style.display = 'none';
    }
}

function updateItemVisibility() {
    var customItems = document.querySelectorAll('.custom-menu-item');
    if (isViewMoreActive) {
        customItems.forEach(function (item) {
            item.classList.remove('menu-item-hidden');
        });
    } else {
        customItems.forEach(function (item) {
            item.classList.add('menu-item-hidden');
        });
    }
}

function addMenuItem(form) {
    var name = form.itemName.value.trim();
    var price = form.itemPrice.value.trim();
    var description = form.itemDescription.value.trim();
    var image = form.itemImage.value.trim();
    var isValid = true;

    clearAddItemErrors();

    if (name.length < 2) {
        showAddItemError('itemNameError', 'Please enter a valid name');
        isValid = false;
    }
    if (!price || parseFloat(price) < 0) {
        showAddItemError('itemPriceError', 'Please enter a valid price');
        isValid = false;
    }
    if (description.length < 5) {
        showAddItemError('itemDescError', 'Please enter a valid description');
        isValid = false;
    }
    if (!image) {
        showAddItemError('itemImageError', 'Please enter an image URL');
        isValid = false;
    }
    if (!isValid) return;

    var items = JSON.parse(localStorage.getItem('royalCafeCustomItems') || '[]');
    var newItem = {
        id: Date.now().toString(),
        name: name,
        price: price,
        description: description,
        image: image
    };
    items.push(newItem);
    localStorage.setItem('royalCafeCustomItems', JSON.stringify(items));
    form.reset();
    showNotification('Menu item added successfully!');
    renderCustomItems();
    refreshOrderButtons();
}

function renderCustomItems() {
    var grid = document.querySelector('.menu-grid');
    if (!grid) return;

    var existing = grid.querySelectorAll('.custom-menu-item');
    existing.forEach(function (el) { el.remove(); });

    var items = JSON.parse(localStorage.getItem('royalCafeCustomItems') || '[]');
    items.forEach(function (item) {
        var card = createMenuItemCard(item);
        grid.appendChild(card);
    });

    updateItemVisibility();
    updateViewToggle();
}

function createMenuItemCard(item) {
    var card = document.createElement('div');
    card.className = 'menu-card fade-in custom-menu-item menu-item-hidden';

    var imageDiv = document.createElement('div');
    imageDiv.className = 'menu-image';
    var img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    imageDiv.appendChild(img);
    card.appendChild(imageDiv);

    var content = document.createElement('div');
    content.className = 'menu-content';

    var header = document.createElement('div');
    header.className = 'menu-header';
    var nameEl = document.createElement('span');
    nameEl.className = 'menu-name';
    nameEl.textContent = item.name;
    var priceEl = document.createElement('span');
    priceEl.className = 'menu-price';
    priceEl.textContent = '₹' + item.price;
    header.appendChild(nameEl);
    header.appendChild(priceEl);
    content.appendChild(header);

    var descEl = document.createElement('p');
    descEl.className = 'menu-desc';
    descEl.textContent = item.description;
    content.appendChild(descEl);

    var btnContainer = document.createElement('div');
    btnContainer.className = 'menu-btns';
    var btnOrder = document.createElement('button');
    btnOrder.className = 'btn btn-primary btn-order';
    btnOrder.setAttribute('data-item', item.name);
    btnOrder.textContent = 'Order Now';
    var btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-delete';
    btnDelete.setAttribute('data-id', item.id);
    btnDelete.textContent = 'Delete';
    btnContainer.appendChild(btnOrder);
    btnContainer.appendChild(btnDelete);
    content.appendChild(btnContainer);
    card.appendChild(content);

    btnDelete.addEventListener('click', function () {
        deleteMenuItem(item.id);
    });

    return card;
}

function deleteMenuItem(id) {
    var items = JSON.parse(localStorage.getItem('royalCafeCustomItems') || '[]');
    items = items.filter(function (it) { return it.id !== id; });
    localStorage.setItem('royalCafeCustomItems', JSON.stringify(items));
    showNotification('Menu item deleted');
    renderCustomItems();
    refreshOrderButtons();
}

function refreshOrderButtons() {
    var buttons = document.querySelectorAll('.btn-order');
    buttons.forEach(function (btn) {
        btn.replaceWith(btn.cloneNode(true));
    });
    initOrderButtons();
}

function showAddItemError(id, message) {
    var el = document.getElementById(id);
    if (el) el.textContent = message;
}

function clearAddItemErrors() {
    var errors = document.querySelectorAll('#addMenuItemForm .form-error');
    errors.forEach(function (err) { err.textContent = ''; });
}
