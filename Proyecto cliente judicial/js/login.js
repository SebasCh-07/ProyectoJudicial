// Sistema de Login
class LoginSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Notification close
        document.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simular validación de login
        if (username === 'admin' && password === 'admin123') {
            this.loginSuccess('admin', { id: 1, name: 'Administrador', role: 'admin' });
        } else if (username === 'user' && password === 'user123') {
            this.loginSuccess('user', { id: 2, name: 'Juan Pérez', role: 'user' });
        } else {
            this.showNotification('Credenciales incorrectas', 'error');
        }
    }

    loginSuccess(role, userData) {
        // Guardar en sessionStorage para permitir navegación
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('loginTime', Date.now().toString());

        // También establecer variables globales
        window.currentUser = userData;
        window.userRole = role;

        // Mostrar mensaje de éxito
        this.showNotification(`Bienvenido, ${userData.name}!`, 'success');

        // Redirigir después de un breve delay para mostrar el mensaje
        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const banner = document.getElementById('notificationBanner');
        const messageEl = document.getElementById('notificationMessage');

        messageEl.textContent = message;

        // Cambiar color según tipo
        banner.className = `notification-banner ${type}`;

        banner.classList.remove('hidden');
        banner.classList.add('show');

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        const banner = document.getElementById('notificationBanner');
        banner.classList.remove('show');
        banner.classList.add('hidden');
    }
}

// Inicializar el sistema de login cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

