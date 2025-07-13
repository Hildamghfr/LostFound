// Global JavaScript functions for LostFound ITPLN

// Authentication functions
function login(username, password, userType) {
    // Simulate authentication
    const users = {
        'admin': { name: 'Administrator', type: 'admin', password: 'admin123' },
        'mahasiswa1': { name: 'Ahmad Rizki', type: 'mahasiswa', password: 'mhs123' },
        'mahasiswa2': { name: 'Sari Dewi', type: 'mahasiswa', password: 'mhs123' }
    };
    
    if (users[username] && users[username].password === password && users[username].type === userType) {
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            name: users[username].name,
            type: userType
        }));
        return true;
    }
    return false;
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return JSON.parse(currentUser);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Form validation
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// File upload handling
function handleFileUpload(input, maxSize = 5 * 1024 * 1024) {
    const file = input.files[0];
    if (!file) return null;
    
    if (file.size > maxSize) {
        showNotification('Ukuran file terlalu besar! Maksimal 5MB.', 'error');
        input.value = '';
        return null;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Format file tidak didukung! Gunakan JPG, PNG, atau GIF.', 'error');
        input.value = '';
        return null;
    }
    
    return file;
}

// Date formatting
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

// Local storage helpers
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Handle login form if present
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const username = formData.get('username');
            const password = formData.get('password');
            const userType = formData.get('userType');
            
            if (!username || !password || !userType) {
                showNotification('Mohon lengkapi semua field!', 'error');
                return;
            }
            
            if (login(username, password, userType)) {
                showNotification('Login berhasil! Mengalihkan...', 'success');
                setTimeout(() => {
                    if (userType === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'student-dashboard.html';
                    }
                }, 1500);
            } else {
                showNotification('Username, password, atau tipe user tidak valid!', 'error');
            }
        });
    }
    
    // Check authentication for protected pages
    if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('index.html')) {
        checkAuth();
    }
    
    // Add active class to current nav item
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    }
    
    .notification-content {
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-warning {
        border-left: 4px solid #f59e0b;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-success .fas {
        color: #10b981;
    }
    
    .notification-error .fas {
        color: #ef4444;
    }
    
    .notification-warning .fas {
        color: #f59e0b;
    }
    
    .notification-info .fas {
        color: #3b82f6;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background-color: #f3f4f6;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .nav-menu a.active {
        color: #667eea;
        font-weight: 600;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);