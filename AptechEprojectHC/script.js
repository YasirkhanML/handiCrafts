// ==================== Global Variables ====================
let cart = []; // Global cart array
let cartItemsContainer; // Container for cart items

// ==================== Cart Functions ====================

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    renderCartItems(); // Render cart items after loading
    updateCartBadge(); // Update cart badge after loading
  }
}

// Clear cart from localStorage
function clearCartFromLocalStorage() {
  localStorage.removeItem('cart');
}

// Render cart items in the cart drawer
function renderCartItems() {
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = ''; // Clear the container
    let total = 0; // Initialize total price

    // Loop through cart items and render them
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity; // Calculate item total
      total += itemTotal; // Add to overall total

      const cartItem = `
        <div class="hussain-cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h5>${item.name}</h5>
            <p>Rs.${itemTotal.toFixed(2)}</p>
          </div>
          <div class="hussain-quantity-selector">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItem);
    });

    // Add total section and actions
    const totalSection = `
      <div class="hussain-cart-total">
        <h5>Total: Rs.${total.toFixed(2)}</h5>
      </div>
      <div class="hussain-cart-actions">
        <button class="hussain-checkout-btn">Checkout</button>
        <button class="hussain-empty-cart-btn">Empty Cart</button>
      </div>
    `;
    cartItemsContainer.insertAdjacentHTML('beforeend', totalSection);

    // Add event listeners for buttons
    const checkoutButton = document.querySelector('.hussain-checkout-btn');
    const emptyCartButton = document.querySelector('.hussain-empty-cart-btn');

    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html'; // Redirect to checkout page
      });
    }

    if (emptyCartButton) {
      emptyCartButton.addEventListener('click', () => {
        cart.length = 0; // Clear the cart
        renderCartItems(); // Re-render the cart
        clearCartFromLocalStorage(); // Clear cart from localStorage
        updateCartBadge(); // Update cart badge after emptying cart
      });
    }
  }
}

// Open the cart drawer
function openCartDrawer() {
  const cartDrawer = document.querySelector('.hussain-cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.add('open');
  }
}

// Close the cart drawer
function closeCartDrawer() {
  const cartDrawer = document.querySelector('.hussain-cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.remove('open');
  }
}

// Update item quantity in the cart
window.updateQuantity = function (productId, change) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
      cart.splice(cart.indexOf(cartItem), 1); // Remove item if quantity is 0
    }
    renderCartItems(); // Re-render the cart
    saveCartToLocalStorage(); // Save cart to localStorage
    updateCartBadge(); // Update cart badge after changing quantity
  }
};

// Add a product to the cart
function addToCart(productId) {
  // Find the product card using the productId
  const productCard = document.querySelector(`.hussain-product-card button[data-id="${productId}"]`)?.closest('.hussain-product-card');
  if (!productCard) {
    console.error(`Product card with ID ${productId} not found.`);
    return;
  }

  // Extract product details from the static HTML
  const product = {
    id: productId,
    name: productCard.querySelector('.hussain-card-title').textContent,
    price: parseFloat(productCard.querySelector('.hussain-card-price').textContent.replace('Rs.', '')),
    image: productCard.querySelector('img').src,
    quantity: 1, // Default quantity
  };

  // Check if the product already exists in the cart
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1; // Increase quantity if item already exists
  } else {
    cart.push(product); // Add new item to cart
  }

  renderCartItems(); // Re-render the cart
  openCartDrawer(); // Open the cart drawer
  saveCartToLocalStorage(); // Save cart to localStorage
  updateCartBadge(); // Update cart badge after adding to cart
}

// Function to update the cart badge count
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart .badge');
  if (cartBadge) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
  }
}

// ==================== Checkout Page Logic ====================

// Render cart items on the checkout page
function renderCheckoutItems() {
  const productsContainer = document.getElementById('aayan-products');
  const totalAmountElement = document.getElementById('aayan-total-amount');

  if (productsContainer) {
    productsContainer.innerHTML = ''; // Clear the container
    let total = 0; // Initialize total price

    // Loop through cart items and render them
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity; // Calculate item total
      total += itemTotal; // Add to overall total

      const cartItem = `
        <div class="aayan-product-item">
          <span class="aayan-product-name">${item.name} (x${item.quantity})</span>
          <span class="aayan-product-price">Rs.${itemTotal.toFixed(2)}</span>
        </div>
      `;
      productsContainer.insertAdjacentHTML('beforeend', cartItem);
    });

    // Update total amount
    totalAmountElement.textContent = `Rs.${total.toFixed(2)}`;
  }
}

// ==================== Input Restrictions and Validation ====================

// Function to validate card number (only digits, max 12 characters)
function validateCardNumber(input) {
  const cardNumber = input.value.replace(/\D/g, ''); // Remove non-digits
  input.value = cardNumber.slice(0, 12); // Limit to 12 digits
  const errorElement = document.getElementById('aayan-card-number-error');
  if (cardNumber.length !== 12) {
    errorElement.textContent = 'Card number must be 12 digits.';
    errorElement.style.display = 'block';
    return false;
  } else {
    errorElement.style.display = 'none';
    return true;
  }
}

// Function to validate expiry date (MM/YY format)
function validateExpiryDate(input) {
  const expiryDate = input.value.replace(/\D/g, ''); // Remove non-digits
  if (expiryDate.length >= 2) {
    input.value = `${expiryDate.slice(0, 2)}/${expiryDate.slice(2, 4)}`; // Format as MM/YY
  }
  const errorElement = document.getElementById('aayan-expiry-error');
  const isValid = /^\d{2}\/\d{2}$/.test(input.value); // Check MM/YY format
  if (!isValid) {
    errorElement.textContent = 'Expiry date must be in MM/YY format.';
    errorElement.style.display = 'block';
    return false;
  } else {
    errorElement.style.display = 'none';
    return true;
  }
}

// Function to validate CVV (only digits, max 3 characters)
function validateCVV(input) {
  const cvv = input.value.replace(/\D/g, ''); // Remove non-digits
  input.value = cvv.slice(0, 3); // Limit to 3 digits
  const errorElement = document.getElementById('aayan-cvv-error');
  if (cvv.length !== 3) {
    errorElement.textContent = 'CVV must be 3 digits.';
    errorElement.style.display = 'block';
    return false;
  } else {
    errorElement.style.display = 'none';
    return true;
  }
}

// Function to validate address (must not be empty)
function validateAddress(input) {
  const address = input.value.trim();
  const errorElement = document.getElementById('aayan-address-error');
  if (!address) {
    errorElement.textContent = 'Address is required.';
    errorElement.style.display = 'block';
    return false;
  } else {
    errorElement.style.display = 'none';
    return true;
  }
}

// Function to check if all fields are valid
function validateForm() {
  const cardName = document.getElementById('aayan-card-name').value.trim();
  const cardNumberValid = validateCardNumber(document.getElementById('aayan-card-number'));
  const expiryDateValid = validateExpiryDate(document.getElementById('aayan-expiry'));
  const cvvValid = validateCVV(document.getElementById('aayan-cvv'));
  const addressValid = validateAddress(document.getElementById('aayan-address'));
  const submitButton = document.querySelector('.aayan-submit-button');

  if (cardName && cardNumberValid && expiryDateValid && cvvValid && addressValid) {
    submitButton.disabled = false; // Enable submit button
  } else {
    submitButton.disabled = true; // Disable submit button
  }
}

// ==================== Event Listeners ====================

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart items container
  cartItemsContainer = document.querySelector('.hussain-cart-items');

  // Load cart from localStorage
  loadCartFromLocalStorage();

  // Render checkout items if on the checkout page
  if (window.location.pathname.includes('checkout.html')) {
    renderCheckoutItems();

    // Add event listeners for input validation
    document.getElementById('aayan-card-number').addEventListener('input', (e) => {
      validateCardNumber(e.target);
      validateForm();
    });

    document.getElementById('aayan-expiry').addEventListener('input', (e) => {
      validateExpiryDate(e.target);
      validateForm();
    });

    document.getElementById('aayan-cvv').addEventListener('input', (e) => {
      validateCVV(e.target);
      validateForm();
    });

    document.getElementById('aayan-address').addEventListener('input', (e) => {
      validateAddress(e.target);
      validateForm();
    });

    document.getElementById('aayan-card-name').addEventListener('input', validateForm);

    // Handle form submission on the checkout page
    const checkoutForm = document.getElementById('aayan-checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // alert('Order placed successfully!');
        clearCartFromLocalStorage(); // Clear cart from localStorage
        window.location.href = 'thank-you.html'; // Redirect to a thank you page
      });
    }
  }

  // ==================== Navbar Scroll Effect ====================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ==================== Counter Animation ====================
  const counters = document.querySelectorAll('.counter');
  const counterSection = document.querySelector('.icons-section');

  if (counterSection && counters.length > 0) {
    const startCounter = () => {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let increment = target / (target === 20000 ? 300 : 500);
        let delay = target === 20000 ? 20 : 10;
        let count = 0;

        const updateCounter = () => {
          if (count < target) {
            count += increment;
            counter.innerText = Math.ceil(count).toLocaleString();
            setTimeout(updateCounter, delay);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };

        updateCounter();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(counterSection);
  }

  // ==================== Dropdown Hover Effect ====================
  const dropdownToggle = document.querySelector('.nav-item.dropdown .dropdown-toggle');
  const dropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('mouseenter', () => dropdownMenu.classList.add('show'));
    dropdownMenu.addEventListener('mouseenter', () => dropdownMenu.classList.add('show'));

    const closeDropdown = () => {
      setTimeout(() => {
        if (!dropdownMenu.matches(':hover') && !dropdownToggle.matches(':hover')) {
          dropdownMenu.classList.remove('show');
        }
      }, 200);
    };

    dropdownToggle.addEventListener('mouseleave', closeDropdown);
    dropdownMenu.addEventListener('mouseleave', closeDropdown);
  }

  // ==================== Icon Container Hover Effect ====================
  const iconContainers = document.querySelectorAll('.icon-container');
  if (iconContainers.length > 0) {
    iconContainers.forEach((container) => {
      container.addEventListener('mouseenter', () => {
        container.style.backgroundColor = '#e9ecef';
      });

      container.addEventListener('mouseleave', () => {
        container.style.backgroundColor = '#f8f9fa';
      });
    });
  }

  // ==================== Add to Cart Functionality ====================
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('hussain-add-to-cart')) {
      const productId = +e.target.getAttribute('data-id');
      addToCart(productId); // Add product to cart
    }
  });

  // ==================== Cart Icon Functionality ====================
  const cartIcon = document.querySelector('.navbar .cart');
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior
      openCartDrawer(); // Open the cart drawer
    });
  }

  // Close cart drawer when close button is clicked
  const closeDrawerButton = document.querySelector('.hussain-close-drawer');
  if (closeDrawerButton) {
    closeDrawerButton.addEventListener('click', closeCartDrawer);
  }
});