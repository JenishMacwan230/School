// Default admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    checkLoginStatus();
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdminControls();
    }
}

// Show admin controls
function showAdminControls() {
    document.getElementById('admin-link').style.display = 'none';
    document.getElementById('logout-link').style.display = 'block';
    document.getElementById('edit-mode-controls').style.display = 'block';
}

// Hide admin controls
function hideAdminControls() {
    document.getElementById('admin-link').style.display = 'block';
    document.getElementById('logout-link').style.display = 'none';
    document.getElementById('edit-mode-controls').style.display = 'none';
    if (document.body.classList.contains('editing')) {
        toggleEditMode();
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Login function
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        showAdminControls();
        closeLoginModal();
        alert('Login successful! You can now edit the website content.');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        alert('Invalid credentials! Please try again.\nDefault: admin / admin123');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('isAdminLoggedIn');
        hideAdminControls();
        alert('You have been logged out.');
    }
}

// Toggle edit mode
function toggleEditMode() {
    const body = document.body;
    const button = document.querySelector('.btn-edit-mode');
    const buttonText = document.getElementById('edit-mode-text');
    
    if (body.classList.contains('editing')) {
        body.classList.remove('editing');
        button.classList.remove('active');
        buttonText.textContent = 'Enable Edit Mode';
        removeEditListeners();
    } else {
        body.classList.add('editing');
        button.classList.add('active');
        buttonText.textContent = 'Disable Edit Mode';
        addEditListeners();
    }
}

// Add click listeners to editable elements
function addEditListeners() {
    // Text elements
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener('click', editText);
    });

    // Image elements
    const editableImages = document.querySelectorAll('.editable-image');
    editableImages.forEach(element => {
        element.addEventListener('click', editImage);
    });
}

// Remove edit listeners
function removeEditListeners() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.removeEventListener('click', editText);
    });

    const editableImages = document.querySelectorAll('.editable-image');
    editableImages.forEach(element => {
        element.removeEventListener('click', editImage);
    });
}

// Edit text content
function editText(event) {
    const element = event.currentTarget;
    const field = element.getAttribute('data-field');
    const currentText = element.textContent;
    
    const newText = prompt('Enter new text:', currentText);
    if (newText !== null && newText !== currentText) {
        element.textContent = newText;
        saveContent(field, newText);
    }
}

// Edit image
function editImage(event) {
    const element = event.currentTarget;
    const field = element.getAttribute('data-field');
    const currentSrc = element.getAttribute('src');
    
    const newSrc = prompt('Enter new image URL:', currentSrc);
    if (newSrc !== null && newSrc !== currentSrc) {
        element.setAttribute('src', newSrc);
        saveContent(field, newSrc);
    }
}

// Save content to localStorage
function saveContent(field, value) {
    const content = JSON.parse(localStorage.getItem('schoolContent') || '{}');
    content[field] = value;
    localStorage.setItem('schoolContent', JSON.stringify(content));
}

// Load content from localStorage
function loadContent() {
    const content = JSON.parse(localStorage.getItem('schoolContent') || '{}');
    
    // Load text content
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        const field = element.getAttribute('data-field');
        if (content[field]) {
            element.textContent = content[field];
        }
    });

    // Load images
    const editableImages = document.querySelectorAll('.editable-image');
    editableImages.forEach(element => {
        const field = element.getAttribute('data-field');
        if (content[field]) {
            element.setAttribute('src', content[field]);
        }
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
