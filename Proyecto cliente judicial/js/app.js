// Aplicación principal del sistema judicial
class JudicialSystem {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.charts = {}; // Almacenar instancias de gráficos
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoginSection();
        this.loadSettings();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Navigation menu
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('a').dataset.section;
                this.navigateToSection(section);
            });
        });

        // Search and filter inputs
        document.getElementById('clientSearch').addEventListener('input', (e) => {
            this.filterClients(e.target.value);
        });

        document.getElementById('clientFilter').addEventListener('change', (e) => {
            this.filterClients('', e.target.value);
        });

        // Búsqueda en tiempo real para usuarios
        document.getElementById('userSearch').addEventListener('input', (e) => {
            this.searchUsers(e.target.value);
        });

        // Report period selector
        document.getElementById('reportPeriod').addEventListener('change', () => {
            this.updateReports();
        });

        // Settings form
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });

        // Notification close
        document.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification();
        });

        // Botones de agregar nuevos elementos
        this.setupAddButtons();
    }

    setupAddButtons() {
        // Botón Nuevo Usuario
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.showAddUserModal();
            });
        }

        // Botón Nuevo Cliente
        const addClientBtn = document.getElementById('addClientBtn');
        if (addClientBtn) {
            addClientBtn.addEventListener('click', () => {
                this.showAddClientModal();
            });
        }

        // Botón Nueva Alerta
        const addAlertBtn = document.getElementById('addAlertBtn');
        if (addAlertBtn) {
            addAlertBtn.addEventListener('click', () => {
                this.showAddAlertModal();
            });
        }

        // Botón Nuevo Proceso Judicial
        const addJudicialBtn = document.getElementById('addJudicialBtn');
        if (addJudicialBtn) {
            addJudicialBtn.addEventListener('click', () => {
                this.showAddJudicialModal();
            });
        }

        // Botón Nuevo Proceso Extrajudicial
        const addExtrajudicialBtn = document.getElementById('addExtrajudicialBtn');
        if (addExtrajudicialBtn) {
            addExtrajudicialBtn.addEventListener('click', () => {
                this.showAddExtrajudicialModal();
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simular validación de login
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { id: 1, name: 'Administrador', role: 'admin' };
            this.loginSuccess();
        } else if (username === 'user' && password === 'user123') {
            this.currentUser = { id: 2, name: 'Juan Pérez', role: 'user' };
            this.loginSuccess();
        } else {
            this.showNotification('Credenciales incorrectas', 'error');
        }
    }

    loginSuccess() {
        this.hideLoginSection();
        this.showAppSection();
        this.updateUserInfo();
        this.loadDashboard();
        this.showNotification(`Bienvenido, ${this.currentUser.name}!`, 'success');

        // Ocultar elementos de admin si no es admin
        if (this.currentUser.role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'none';
            });
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.destroyAllCharts(); // Destruir todos los gráficos al cerrar sesión
        this.showLoginSection();
        this.hideAppSection();
        this.showNotification('Sesión cerrada correctamente', 'info');
    }

    showLoginSection() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('appSection').classList.add('hidden');
    }

    hideLoginSection() {
        document.getElementById('loginSection').classList.add('hidden');
    }

    showAppSection() {
        document.getElementById('appSection').classList.remove('hidden');
    }

    hideAppSection() {
        document.getElementById('appSection').classList.add('hidden');
    }

    updateUserInfo() {
        document.getElementById('currentUser').textContent = this.currentUser.name;
    }

    navigateToSection(section) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(el => {
            el.classList.add('hidden');
        });

        // Mostrar la sección seleccionada
        document.getElementById(section).classList.remove('hidden');

        // Actualizar menú activo
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Actualizar breadcrumb
        document.getElementById('currentSection').textContent = this.getSectionTitle(section);

        // Cargar contenido de la sección
        this.loadSectionContent(section);

        this.currentSection = section;
    }

    getSectionTitle(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'users': 'Gestión de Usuarios',
            'clients': 'Gestión de Clientes',
            'judicial': 'Procesos Judiciales',
            'extrajudicial': 'Procesos Extrajudiciales',
            'alerts': 'Panel de Alertas',
            'reports': 'Reportes y Métricas',
            'settings': 'Configuración'
        };
        return titles[section] || section;
    }

    loadSectionContent(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'clients':
                this.loadClients();
                break;
            case 'judicial':
                this.loadJudicialProcesses();
                break;
            case 'extrajudicial':
                this.loadExtrajudicialProcesses();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    loadDashboard() {
        const stats = dataUtils.getDashboardStats();

        // Actualizar métricas
        document.getElementById('totalClients').textContent = stats.totalClients;
        document.getElementById('totalJudicial').textContent = stats.totalJudicial;
        document.getElementById('totalExtrajudicial').textContent = stats.totalExtrajudicial;
        document.getElementById('effectiveness').textContent = `${stats.effectiveness}%`;

        // Crear gráficos solo si no existen
        this.createDashboardCharts();
    }

    createDashboardCharts() {
        const chartData = dataUtils.getChartData();

        // Destruir gráficos existentes si los hay
        if (this.charts.processStatusChart) {
            this.charts.processStatusChart.destroy();
        }
        if (this.charts.monthlyActivityChart) {
            this.charts.monthlyActivityChart.destroy();
        }

        // Gráfico de estados de procesos
        const processStatusCtx = document.getElementById('processStatusChart').getContext('2d');
        this.charts.processStatusChart = new Chart(processStatusCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(chartData.processStatus),
                datasets: [{
                    data: Object.values(chartData.processStatus),
                    backgroundColor: ['#3498db', '#27ae60', '#e74c3c'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });

        // Gráfico de actividad mensual
        const monthlyActivityCtx = document.getElementById('monthlyActivityChart').getContext('2d');
        this.charts.monthlyActivityChart = new Chart(monthlyActivityCtx, {
            type: 'line',
            data: {
                labels: Object.keys(chartData.monthlyActivity),
                datasets: [{
                    label: 'Procesos',
                    data: Object.values(chartData.monthlyActivity),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    }

    loadUsers() {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        mockData.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role}</span></td>
                <td>
                    <button class="btn-edit" onclick="app.editUser(${user.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-danger" onclick="app.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadClients() {
        const tbody = document.getElementById('clientsTableBody');
        tbody.innerHTML = '';

        mockData.clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.document}</td>
                <td>${client.address}</td>
                <td><span class="badge ${client.status === 'activo' ? 'badge-active' : 'badge-inactive'}">${client.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="app.viewClient(${client.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="app.editClient(${client.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadJudicialProcesses() {
        const tbody = document.getElementById('judicialTableBody');
        tbody.innerHTML = '';

        mockData.judicialProcesses.forEach(process => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${process.caseNumber}</td>
                <td>${process.clientName}</td>
                <td><span class="badge badge-${process.status}">${dataUtils.getProcessStatusText(process.status)}</span></td>
                <td>${dataUtils.formatDate(process.startDate)}</td>
                <td>${dataUtils.formatDate(process.lastUpdate)}</td>
                <td>
                    <button class="btn-edit" onclick="app.viewJudicialProcess(${process.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="app.editJudicialProcess(${process.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadExtrajudicialProcesses() {
        const tbody = document.getElementById('extrajudicialTableBody');
        tbody.innerHTML = '';

        mockData.extrajudicialProcesses.forEach(process => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${process.creditNumber}</td>
                <td>${process.clientName}</td>
                <td>${dataUtils.formatCurrency(process.amount)}</td>
                <td><span class="badge badge-${process.status}">${dataUtils.getProcessStatusText(process.status)}</span></td>
                <td>${dataUtils.formatDate(process.dueDate)}</td>
                <td>
                    <button class="btn-edit" onclick="app.viewExtrajudicialProcess(${process.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="app.editExtrajudicialProcess(${process.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadAlerts() {
        const alertsGrid = document.getElementById('alertsGrid');
        alertsGrid.innerHTML = '';

        const activeAlerts = dataUtils.getActiveAlerts();

        activeAlerts.forEach(alert => {
            const alertCard = document.createElement('div');
            alertCard.className = `alert-card ${dataUtils.getAlertPriorityClass(alert.priority)}`;
            alertCard.innerHTML = `
                <div class="alert-header">
                    <span class="alert-priority ${alert.priority}">${alert.priority.toUpperCase()}</span>
                    <span class="alert-date">${dataUtils.formatDate(alert.createdAt)}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-footer">
                    <span><i class="fas fa-user"></i> ${alert.recipient}</span>
                    <span><i class="fas fa-user-tie"></i> ${alert.clientName}</span>
                </div>
            `;
            alertsGrid.appendChild(alertCard);
        });
    }

    loadReports() {
        this.createReportCharts();
    }

    createReportCharts() {
        const chartData = dataUtils.getChartData();

        // Destruir gráficos existentes si los hay
        if (this.charts.effectivenessChart) {
            this.charts.effectivenessChart.destroy();
        }
        if (this.charts.distributionChart) {
            this.charts.distributionChart.destroy();
        }
        if (this.charts.trendChart) {
            this.charts.trendChart.destroy();
        }

        // Gráfico de efectividad por tipo
        const effectivenessCtx = document.getElementById('effectivenessChart').getContext('2d');
        this.charts.effectivenessChart = new Chart(effectivenessCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData.effectivenessByType),
                datasets: [{
                    label: 'Efectividad (%)',
                    data: Object.values(chartData.effectivenessByType),
                    backgroundColor: ['#3498db', '#27ae60', '#f39c12'],
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });

        // Gráfico de distribución de estados
        const distributionCtx = document.getElementById('distributionChart').getContext('2d');
        this.charts.distributionChart = new Chart(distributionCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(chartData.statusDistribution),
                datasets: [{
                    data: Object.values(chartData.statusDistribution),
                    backgroundColor: ['#27ae60', '#e74c3c', '#95a5a6'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });

        // Gráfico de tendencia
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        this.charts.trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: chartData.trendData.labels,
                datasets: [{
                    label: 'Tendencia de Recuperación (%)',
                    data: chartData.trendData.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });
    }

    loadSettings() {
        const settings = mockData.settings;

        document.getElementById('defaultDeadline').value = settings.defaultDeadline;
        document.getElementById('maxAlerts').value = settings.maxAlerts;
        document.getElementById('emailAlerts').checked = settings.alertTypes.email;
        document.getElementById('smsAlerts').checked = settings.alertTypes.sms;
        document.getElementById('pushAlerts').checked = settings.alertTypes.push;
        document.getElementById('reportEmail').value = settings.reports.email;
        document.getElementById('autoReports').value = settings.reports.frequency;
    }

    saveSettings() {
        // Simular guardado de configuración
        const settings = {
            defaultDeadline: parseInt(document.getElementById('defaultDeadline').value),
            maxAlerts: parseInt(document.getElementById('maxAlerts').value),
            alertTypes: {
                email: document.getElementById('emailAlerts').checked,
                sms: document.getElementById('smsAlerts').checked,
                push: document.getElementById('pushAlerts').checked
            },
            reports: {
                email: document.getElementById('reportEmail').value,
                frequency: document.getElementById('autoReports').value
            }
        };

        console.log('Configuración guardada:', settings);
        this.showNotification('Configuración guardada correctamente', 'success');
    }

    resetSettings() {
        this.loadSettings();
        this.showNotification('Configuración restablecida', 'info');
    }

    filterClients(searchTerm = '', statusFilter = '') {
        const tbody = document.getElementById('clientsTableBody');
        tbody.innerHTML = '';

        // Si no hay término de búsqueda y no hay filtro de estado, mostrar todos los clientes
        if (!searchTerm && !statusFilter) {
            this.loadClients();
            return;
        }

        let filteredClients = mockData.clients;

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filteredClients = filteredClients.filter(client =>
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.document.includes(searchTerm)
            );
        }

        // Filtrar por estado
        if (statusFilter) {
            filteredClients = filteredClients.filter(client => client.status === statusFilter);
        }

        // Si no hay resultados, mostrar mensaje
        if (filteredClients.length === 0) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = `
                <td colspan="6" class="no-results">
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <p>No se encontraron clientes que coincidan con "${searchTerm || 'los filtros seleccionados'}"</p>
                    </div>
                </td>
            `;
            tbody.appendChild(noResultsRow);
            return;
        }

        // Renderizar clientes filtrados
        filteredClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.document}</td>
                <td>${client.address}</td>
                <td><span class="badge ${client.status === 'activo' ? 'badge-active' : 'badge-inactive'}">${client.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="app.viewClient(${client.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="app.editClient(${client.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateReports() {
        // Simular actualización de reportes según el período seleccionado
        const period = document.getElementById('reportPeriod').value;
        console.log('Actualizando reportes para período:', period);
        this.showNotification('Reportes actualizados', 'info');
    }

    // Función para destruir todos los gráficos
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    // ===== MODALES DE CREACIÓN =====

    showAddUserModal() {
        this.showModal('Nuevo Usuario', `
            <form id="addUserForm">
                <div class="form-group">
                    <label for="newUserName">Nombre Completo *</label>
                    <input type="text" id="newUserName" required placeholder="Ingrese el nombre completo">
                </div>
                <div class="form-group">
                    <label for="newUserEmail">Email *</label>
                    <input type="email" id="newUserEmail" required placeholder="usuario@empresa.com">
                </div>
                <div class="form-group">
                    <label for="newUserRole">Rol *</label>
                    <select id="newUserRole" required>
                        <option value="">Seleccione un rol</option>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="newUserStatus">Estado *</label>
                    <select id="newUserStatus" required>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveNewUser()" class="btn-primary">
                        <i class="fas fa-save"></i> Crear Usuario
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    showAddClientModal() {
        this.showModal('Nuevo Cliente', `
            <form id="addClientForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="newClientName">Nombre Completo *</label>
                        <input type="text" id="newClientName" required placeholder="Ingrese el nombre completo">
                    </div>
                    <div class="form-group">
                        <label for="newClientDocument">RUT *</label>
                        <input type="text" id="newClientDocument" required placeholder="12345678-9">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newClientPhone">Teléfono *</label>
                        <input type="text" id="newClientPhone" required placeholder="+56 9 1234 5678">
                    </div>
                    <div class="form-group">
                        <label for="newClientEmail">Email *</label>
                        <input type="email" id="newClientEmail" required placeholder="cliente@email.com">
                    </div>
                </div>
                <div class="form-group">
                    <label for="newClientAddress">Dirección *</label>
                    <input type="text" id="newClientAddress" required placeholder="Av. Providencia 1234, Santiago">
                </div>
                <div class="form-group">
                    <label for="newClientStatus">Estado *</label>
                    <select id="newClientStatus" required>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveNewClient()" class="btn-primary">
                        <i class="fas fa-save"></i> Crear Cliente
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    showAddAlertModal() {
        const clients = mockData.clients.filter(client => client.status === 'activo');
        const users = mockData.users.filter(user => user.status === 'activo');

        this.showModal('Nueva Alerta', `
            <form id="addAlertForm">
                <div class="form-group">
                    <label for="newAlertType">Tipo de Alerta *</label>
                    <select id="newAlertType" required>
                        <option value="">Seleccione el tipo</option>
                        <option value="vencimiento">Vencimiento</option>
                        <option value="documento">Documento</option>
                        <option value="pago">Pago</option>
                        <option value="audiencia">Audiencia</option>
                        <option value="cobranza">Cobranza</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newAlertPriority">Prioridad *</label>
                        <select id="newAlertPriority" required>
                            <option value="">Seleccione prioridad</option>
                            <option value="high">Alta</option>
                            <option value="medium">Media</option>
                            <option value="low">Baja</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newAlertStatus">Estado *</label>
                        <select id="newAlertStatus" required>
                            <option value="activa">Activa</option>
                            <option value="inactiva">Inactiva</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="newAlertClient">Cliente *</label>
                    <select id="newAlertClient" required>
                        <option value="">Seleccione un cliente</option>
                        ${clients.map(client => `<option value="${client.id}">${client.name} - ${client.document}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="newAlertRecipient">Destinatario *</label>
                    <select id="newAlertRecipient" required>
                        <option value="">Seleccione destinatario</option>
                        ${users.map(user => `<option value="${user.name}">${user.name} (${user.role})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="newAlertMessage">Mensaje *</label>
                    <textarea id="newAlertMessage" required rows="3" placeholder="Describa la alerta..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveNewAlert()" class="btn-primary">
                        <i class="fas fa-bell"></i> Crear Alerta
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    showAddJudicialModal() {
        const clients = mockData.clients.filter(client => client.status === 'activo');

        this.showModal('Nuevo Proceso Judicial', `
            <form id="addJudicialForm">
                <div class="form-group">
                    <label for="newJudicialClient">Cliente *</label>
                    <select id="newJudicialClient" required>
                        <option value="">Seleccione un cliente</option>
                        ${clients.map(client => `<option value="${client.id}">${client.name} - ${client.document}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newJudicialCaseNumber">Número de Caso *</label>
                        <input type="text" id="newJudicialCaseNumber" required placeholder="C-2024-XXX">
                    </div>
                    <div class="form-group">
                        <label for="newJudicialCourt">Juzgado *</label>
                        <input type="text" id="newJudicialCourt" required placeholder="Juzgado Civil de...">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newJudicialAmount">Monto *</label>
                        <input type="number" id="newJudicialAmount" required placeholder="15000000">
                    </div>
                    <div class="form-group">
                        <label for="newJudicialStatus">Estado *</label>
                        <select id="newJudicialStatus" required>
                            <option value="en_tramite">En Trámite</option>
                            <option value="sentencia">Sentencia</option>
                            <option value="archivado">Archivado</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="newJudicialStartDate">Fecha de Inicio *</label>
                    <input type="date" id="newJudicialStartDate" required>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveNewJudicial()" class="btn-primary">
                        <i class="fas fa-gavel"></i> Crear Proceso
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    showAddExtrajudicialModal() {
        const clients = mockData.clients.filter(client => client.status === 'activo');

        this.showModal('Nuevo Proceso Extrajudicial', `
            <form id="addExtrajudicialForm">
                <div class="form-group">
                    <label for="newExtrajudicialClient">Cliente *</label>
                    <select id="newExtrajudicialClient" required>
                        <option value="">Seleccione un cliente</option>
                        ${clients.map(client => `<option value="${client.name}">${client.name} - ${client.document}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newExtrajudicialCreditNumber">Número de Crédito *</label>
                        <input type="text" id="newExtrajudicialCreditNumber" required placeholder="CE-2024-XXX">
                    </div>
                    <div class="form-group">
                        <label for="newExtrajudicialAmount">Monto *</label>
                        <input type="number" id="newExtrajudicialAmount" required placeholder="5000000">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newExtrajudicialStatus">Estado *</label>
                        <select id="newExtrajudicialStatus" required>
                            <option value="vigente">Vigente</option>
                            <option value="vencido">Vencido</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newExtrajudicialDueDate">Fecha de Vencimiento *</label>
                        <input type="date" id="newExtrajudicialDueDate" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="newExtrajudicialStartDate">Fecha de Inicio *</label>
                    <input type="date" id="newExtrajudicialStartDate" required>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveNewExtrajudicial()" class="btn-primary">
                        <i class="fas fa-file-contract"></i> Crear Proceso
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    // ===== FUNCIONES DE GUARDADO =====

    saveNewUser() {
        const name = document.getElementById('newUserName').value.trim();
        const email = document.getElementById('newUserEmail').value.trim();
        const role = document.getElementById('newUserRole').value;
        const status = document.getElementById('newUserStatus').value;

        if (!name || !email || !role || !status) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        // Validar email
        if (!this.validateEmail(email)) {
            this.showNotification('Por favor ingrese un email válido', 'error');
            return;
        }

        // Verificar si el email ya existe
        if (mockData.users.some(user => user.email === email)) {
            this.showNotification('El email ya está registrado en el sistema', 'error');
            return;
        }

        const newUser = {
            id: dataUtils.generateId(),
            name,
            email,
            role,
            status,
            createdAt: new Date().toISOString().split('T')[0]
        };

        // Agregar a mockData
        mockData.users.push(newUser);

        console.log('Nuevo usuario creado:', newUser);
        this.showNotification('Usuario creado correctamente', 'success');
        this.closeModal();
        this.loadUsers();
    }

    saveNewClient() {
        const name = document.getElementById('newClientName').value.trim();
        const document = document.getElementById('newClientDocument').value.trim();
        const phone = document.getElementById('newClientPhone').value.trim();
        const email = document.getElementById('newClientEmail').value.trim();
        const address = document.getElementById('newClientAddress').value.trim();
        const status = document.getElementById('newClientStatus').value;

        if (!name || !document || !phone || !email || !address || !status) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        // Validar email
        if (!this.validateEmail(email)) {
            this.showNotification('Por favor ingrese un email válido', 'error');
            return;
        }

        // Verificar si el RUT ya existe
        if (mockData.clients.some(client => client.document === document)) {
            this.showNotification('El RUT ya está registrado en el sistema', 'error');
            return;
        }

        const newClient = {
            id: dataUtils.generateId(),
            name,
            document,
            phone,
            email,
            address,
            status,
            createdAt: new Date().toISOString().split('T')[0],
            familyReferences: []
        };

        // Agregar a mockData
        mockData.clients.push(newClient);

        console.log('Nuevo cliente creado:', newClient);
        this.showNotification('Cliente creado correctamente', 'success');
        this.closeModal();
        this.loadClients();
    }

    saveNewAlert() {
        const type = document.getElementById('newAlertType').value;
        const priority = document.getElementById('newAlertPriority').value;
        const status = document.getElementById('newAlertStatus').value;
        const clientId = parseInt(document.getElementById('newAlertClient').value);
        const recipient = document.getElementById('newAlertRecipient').value;
        const message = document.getElementById('newAlertMessage').value.trim();

        if (!type || !priority || !status || !clientId || !recipient || !message) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        const client = dataUtils.getClientById(clientId);
        if (!client) {
            this.showNotification('Cliente no encontrado', 'error');
            return;
        }

        const newAlert = {
            id: dataUtils.generateId(),
            type,
            priority,
            message,
            recipient,
            clientId,
            clientName: client.name,
            status,
            createdAt: new Date().toISOString().split('T')[0]
        };

        // Agregar a mockData
        mockData.alerts.push(newAlert);

        console.log('Nueva alerta creada:', newAlert);
        this.showNotification('Alerta creada correctamente', 'success');
        this.closeModal();
        this.loadAlerts();
    }

    saveNewJudicial() {
        const clientId = parseInt(document.getElementById('newJudicialClient').value);
        const caseNumber = document.getElementById('newJudicialCaseNumber').value.trim();
        const court = document.getElementById('newJudicialCourt').value.trim();
        const amount = parseInt(document.getElementById('newJudicialAmount').value);
        const status = document.getElementById('newJudicialStatus').value;
        const startDate = document.getElementById('newJudicialStartDate').value;

        if (!clientId || !caseNumber || !court || !amount || !status || !startDate) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        const client = dataUtils.getClientById(clientId);
        if (!client) {
            this.showNotification('Cliente no encontrado', 'error');
            return;
        }

        const newJudicial = {
            id: dataUtils.generateId(),
            clientId,
            clientName: client.name,
            caseNumber,
            status,
            startDate,
            lastUpdate: startDate,
            court,
            amount,
            documents: [],
            history: [
                {
                    date: startDate,
                    action: 'Proceso creado',
                    user: this.currentUser.name
                }
            ]
        };

        // Agregar a mockData
        mockData.judicialProcesses.push(newJudicial);

        console.log('Nuevo proceso judicial creado:', newJudicial);
        this.showNotification('Proceso judicial creado correctamente', 'success');
        this.closeModal();
        this.loadJudicialProcesses();
    }

    saveNewExtrajudicial() {
        const clientName = document.getElementById('newExtrajudicialClient').value;
        const creditNumber = document.getElementById('newExtrajudicialCreditNumber').value.trim();
        const amount = parseInt(document.getElementById('newExtrajudicialAmount').value);
        const status = document.getElementById('newExtrajudicialStatus').value;
        const dueDate = document.getElementById('newExtrajudicialDueDate').value;
        const startDate = document.getElementById('newExtrajudicialStartDate').value;

        if (!clientName || !creditNumber || !amount || !status || !dueDate || !startDate) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        // Encontrar el cliente por nombre
        const client = mockData.clients.find(c => c.name === clientName);
        if (!client) {
            this.showNotification('Cliente no encontrado', 'error');
            return;
        }

        const newExtrajudicial = {
            id: dataUtils.generateId(),
            clientId: client.id,
            clientName: client.name,
            creditNumber,
            status,
            amount,
            dueDate,
            startDate,
            lastUpdate: startDate,
            alerts: []
        };

        // Agregar a mockData
        mockData.extrajudicialProcesses.push(newExtrajudicial);

        console.log('Nuevo proceso extrajudicial creado:', newExtrajudicial);
        this.showNotification('Proceso extrajudicial creado correctamente', 'success');
        this.closeModal();
        this.loadExtrajudicialProcesses();
    }

    // ===== FUNCIONES DE VALIDACIÓN =====

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateRUT(rut) {
        const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
        return rutRegex.test(rut);
    }

    validatePhone(phone) {
        const phoneRegex = /^\+56\s[0-9]{1,2}\s[0-9]{4}\s[0-9]{4}$/;
        return phoneRegex.test(phone);
    }

    // ===== FUNCIONES CRUD EXISTENTES =====

    editUser(userId) {
        const user = mockData.users.find(u => u.id === userId);
        this.showModal('Editar Usuario', `
            <form id="editUserForm">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" value="${user.name}" id="editUserName">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="${user.email}" id="editUserEmail">
                </div>
                <div class="form-group">
                    <label>Rol</label>
                    <select id="editUserRole">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveUser(${userId})" class="btn-primary">Guardar</button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        `);
    }
    saveUser(userId) {
        const name = document.getElementById('editUserName').value;
        const email = document.getElementById('editUserEmail').value;
        const role = document.getElementById('editUserRole').value;

        console.log('Usuario guardado:', { id: userId, name, email, role });
        this.showNotification('Usuario actualizado correctamente', 'success');
        this.closeModal();
        this.loadUsers();
    }

    deleteUser(userId) {
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            console.log('Usuario eliminado:', userId);
            this.showNotification('Usuario eliminado correctamente', 'success');
            this.loadUsers();
        }
    }

    viewClient(clientId) {
        const client = dataUtils.getClientById(clientId);
        const judicialProcesses = dataUtils.getJudicialProcessesByClient(clientId);
        const extrajudicialProcesses = dataUtils.getExtrajudicialProcessesByClient(clientId);

        this.showModal('Ficha del Cliente', `
            <div class="client-profile">
                <div class="client-header">
                    <h3>${client.name}</h3>
                    <span class="badge ${client.status === 'activo' ? 'badge-active' : 'badge-inactive'}">${client.status}</span>
                </div>
                
                <div class="client-info">
                    <div class="info-section">
                        <h4>Información Personal</h4>
                        <p><strong>Documento:</strong> ${client.document}</p>
                        <p><strong>Dirección:</strong> ${client.address}</p>
                        <p><strong>Teléfono:</strong> ${client.phone}</p>
                        <p><strong>Email:</strong> ${client.email}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Referencias Familiares</h4>
                        ${client.familyReferences.length > 0 ?
                client.familyReferences.map(ref =>
                    `<p><strong>${ref.name}</strong> (${ref.relationship}) - ${ref.phone}</p>`
                ).join('') :
                '<p>No hay referencias familiares</p>'
            }
                    </div>
                    
                    <div class="info-section">
                        <h4>Procesos Judiciales</h4>
                        ${judicialProcesses.length > 0 ?
                judicialProcesses.map(process =>
                    `<p><strong>${process.caseNumber}</strong> - ${dataUtils.getProcessStatusText(process.status)}</p>`
                ).join('') :
                '<p>No hay procesos judiciales</p>'
            }
                    </div>
                    
                    <div class="info-section">
                        <h4>Procesos Extrajudiciales</h4>
                        ${extrajudicialProcesses.length > 0 ?
                extrajudicialProcesses.map(process =>
                    `<p><strong>${process.creditNumber}</strong> - ${dataUtils.formatCurrency(process.amount)}</p>`
                ).join('') :
                '<p>No hay procesos extrajudiciales</p>'
            }
                    </div>
                </div>
            </div>
        `);
    }

    editClient(clientId) {
        const client = dataUtils.getClientById(clientId);
        this.showModal('Editar Cliente', `
            <form id="editClientForm">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" value="${client.name}" id="editClientName">
                </div>
                <div class="form-group">
                    <label>Documento</label>
                    <input type="text" value="${client.document}" id="editClientDocument">
                </div>
                <div class="form-group">
                    <label>Dirección</label>
                    <input type="text" value="${client.address}" id="editClientAddress">
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" value="${client.phone}" id="editClientPhone">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="${client.email}" id="editClientEmail">
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveClient(${clientId})" class="btn-primary">Guardar</button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        `);
    }

    saveClient(clientId) {
        const name = document.getElementById('editClientName').value;
        const document = document.getElementById('editClientDocument').value;
        const address = document.getElementById('editClientAddress').value;
        const phone = document.getElementById('editClientPhone').value;
        const email = document.getElementById('editClientEmail').value;

        console.log('Cliente guardado:', { id: clientId, name, document, address, phone, email });
        this.showNotification('Cliente actualizado correctamente', 'success');
        this.closeModal();
        this.loadClients();
    }

    viewJudicialProcess(processId) {
        const process = mockData.judicialProcesses.find(p => p.id === processId);

        this.showModal('Detalle del Proceso Judicial', `
            <div class="process-detail">
                <div class="process-header">
                    <h3>${process.caseNumber}</h3>
                    <span class="badge badge-${process.status}">${dataUtils.getProcessStatusText(process.status)}</span>
                </div>
                
                <div class="process-info">
                    <div class="info-section">
                        <h4>Información General</h4>
                        <p><strong>Cliente:</strong> ${process.clientName}</p>
                        <p><strong>Juzgado:</strong> ${process.court}</p>
                        <p><strong>Monto:</strong> ${dataUtils.formatCurrency(process.amount)}</p>
                        <p><strong>Fecha de inicio:</strong> ${dataUtils.formatDate(process.startDate)}</p>
                        <p><strong>Última actualización:</strong> ${dataUtils.formatDate(process.lastUpdate)}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Documentos</h4>
                        ${process.documents.map(doc =>
            `<p><i class="fas fa-file-pdf"></i> ${doc.name} (${doc.size})</p>`
        ).join('')}
                    </div>
                    
                    <div class="info-section">
                        <h4>Historial</h4>
                        ${process.history.map(entry =>
            `<p><strong>${dataUtils.formatDate(entry.date)}:</strong> ${entry.action} - ${entry.user}</p>`
        ).join('')}
                    </div>
                </div>
            </div>
        `);
    }

    editJudicialProcess(processId) {
        const process = mockData.judicialProcesses.find(p => p.id === processId);
        this.showModal('Editar Proceso Judicial', `
            <form id="editJudicialForm">
                <div class="form-group">
                    <label>Estado</label>
                    <select id="editJudicialStatus">
                        <option value="en_tramite" ${process.status === 'en_tramite' ? 'selected' : ''}>En Trámite</option>
                        <option value="sentencia" ${process.status === 'sentencia' ? 'selected' : ''}>Sentencia</option>
                        <option value="archivado" ${process.status === 'archivado' ? 'selected' : ''}>Archivado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Juzgado</label>
                    <input type="text" value="${process.court}" id="editJudicialCourt">
                </div>
                <div class="form-group">
                    <label>Monto</label>
                    <input type="number" value="${process.amount}" id="editJudicialAmount">
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveJudicialProcess(${processId})" class="btn-primary">Guardar</button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        `);
    }

    saveJudicialProcess(processId) {
        const status = document.getElementById('editJudicialStatus').value;
        const court = document.getElementById('editJudicialCourt').value;
        const amount = parseInt(document.getElementById('editJudicialAmount').value);

        console.log('Proceso judicial guardado:', { id: processId, status, court, amount });
        this.showNotification('Proceso judicial actualizado correctamente', 'success');
        this.closeModal();
        this.loadJudicialProcesses();
    }

    viewExtrajudicialProcess(processId) {
        const process = mockData.extrajudicialProcesses.find(p => p.id === processId);

        this.showModal('Detalle del Proceso Extrajudicial', `
            <div class="process-detail">
                <div class="process-header">
                    <h3>${process.creditNumber}</h3>
                    <span class="badge badge-${process.status}">${dataUtils.getProcessStatusText(process.status)}</span>
                </div>
                
                <div class="process-info">
                    <div class="info-section">
                        <h4>Información General</h4>
                        <p><strong>Cliente:</strong> ${process.clientName}</p>
                        <p><strong>Monto:</strong> ${dataUtils.formatCurrency(process.amount)}</p>
                        <p><strong>Fecha de vencimiento:</strong> ${dataUtils.formatDate(process.dueDate)}</p>
                        <p><strong>Fecha de inicio:</strong> ${dataUtils.formatDate(process.startDate)}</p>
                        <p><strong>Última actualización:</strong> ${dataUtils.formatDate(process.lastUpdate)}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Alertas Configuradas</h4>
                        ${process.alerts.filter(alert => alert.active).map(alert =>
            `<p><i class="fas fa-bell"></i> ${alert.message}</p>`
        ).join('')}
                    </div>
                </div>
            </div>
        `);
    }

    editExtrajudicialProcess(processId) {
        const process = mockData.extrajudicialProcesses.find(p => p.id === processId);
        this.showModal('Editar Proceso Extrajudicial', `
            <form id="editExtrajudicialForm">
                <div class="form-group">
                    <label>Estado</label>
                    <select id="editExtrajudicialStatus">
                        <option value="vigente" ${process.status === 'vigente' ? 'selected' : ''}>Vigente</option>
                        <option value="vencido" ${process.status === 'vencido' ? 'selected' : ''}>Vencido</option>
                        <option value="cancelado" ${process.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Monto</label>
                    <input type="number" value="${process.amount}" id="editExtrajudicialAmount">
                </div>
                <div class="form-group">
                    <label>Fecha de Vencimiento</label>
                    <input type="date" value="${process.dueDate}" id="editExtrajudicialDueDate">
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveExtrajudicialProcess(${processId})" class="btn-primary">Guardar</button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        `);
    }

    saveExtrajudicialProcess(processId) {
        const status = document.getElementById('editExtrajudicialStatus').value;
        const amount = parseInt(document.getElementById('editExtrajudicialAmount').value);
        const dueDate = document.getElementById('editExtrajudicialDueDate').value;

        console.log('Proceso extrajudicial guardado:', { id: processId, status, amount, dueDate });
        this.showNotification('Proceso extrajudicial actualizado correctamente', 'success');
        this.closeModal();
        this.loadExtrajudicialProcesses();
    }

    // ===== FUNCIONES DE MODAL =====

    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modalOverlay').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.add('hidden');
    }

    // ===== FUNCIONES DE NOTIFICACIÓN =====

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

    // ===== FUNCIONES DE ELIMINACIÓN =====

    deleteClient(clientId) {
        if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
            // Verificar si tiene procesos asociados
            const judicialProcesses = dataUtils.getJudicialProcessesByClient(clientId);
            const extrajudicialProcesses = dataUtils.getExtrajudicialProcessesByClient(clientId);

            if (judicialProcesses.length > 0 || extrajudicialProcesses.length > 0) {
                this.showNotification('No se puede eliminar el cliente porque tiene procesos asociados', 'error');
                return;
            }

            // Eliminar de mockData
            const index = mockData.clients.findIndex(c => c.id === clientId);
            if (index > -1) {
                mockData.clients.splice(index, 1);
            }

            console.log('Cliente eliminado:', clientId);
            this.showNotification('Cliente eliminado correctamente', 'success');
            this.loadClients();
        }
    }

    deleteJudicialProcess(processId) {
        if (confirm('¿Está seguro de que desea eliminar este proceso judicial?')) {
            const index = mockData.judicialProcesses.findIndex(p => p.id === processId);
            if (index > -1) {
                mockData.judicialProcesses.splice(index, 1);
            }

            console.log('Proceso judicial eliminado:', processId);
            this.showNotification('Proceso judicial eliminado correctamente', 'success');
            this.loadJudicialProcesses();
        }
    }

    deleteExtrajudicialProcess(processId) {
        if (confirm('¿Está seguro de que desea eliminar este proceso extrajudicial?')) {
            const index = mockData.extrajudicialProcesses.findIndex(p => p.id === processId);
            if (index > -1) {
                mockData.extrajudicialProcesses.splice(index, 1);
            }

            console.log('Proceso extrajudicial eliminado:', processId);
            this.showNotification('Proceso extrajudicial eliminado correctamente', 'success');
            this.loadExtrajudicialProcesses();
        }
    }

    deleteAlert(alertId) {
        if (confirm('¿Está seguro de que desea eliminar esta alerta?')) {
            const index = mockData.alerts.findIndex(a => a.id === alertId);
            if (index > -1) {
                mockData.alerts.splice(index, 1);
            }

            console.log('Alerta eliminada:', alertId);
            this.showNotification('Alerta eliminada correctamente', 'success');
            this.loadAlerts();
        }
    }

    // ===== FUNCIONES DE BÚSQUEDA AVANZADA =====

    searchUsers(query) {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        // Si no hay query, mostrar todos los usuarios
        if (!query || query.trim() === '') {
            this.loadUsers();
            return;
        }

        const filteredUsers = mockData.users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredUsers.length === 0) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = `
                <td colspan="6" class="no-results">
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <p>No se encontraron usuarios que coincidan con "${query}"</p>
                    </div>
                </td>
            `;
            tbody.appendChild(noResultsRow);
        } else {
            filteredUsers.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role}</span></td>
                    <td><span class="badge ${user.status === 'activo' ? 'badge-active' : 'badge-inactive'}">${user.status}</span></td>
                    <td>
                        <button class="btn-edit" onclick="app.editUser(${user.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-danger" onclick="app.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    searchAlerts(query) {
        const alertsGrid = document.getElementById('alertsGrid');
        alertsGrid.innerHTML = '';

        const filteredAlerts = mockData.alerts.filter(alert =>
            alert.message.toLowerCase().includes(query.toLowerCase()) ||
            alert.recipient.toLowerCase().includes(query.toLowerCase()) ||
            alert.type.toLowerCase().includes(query.toLowerCase())
        );

        filteredAlerts.forEach(alert => {
            const alertCard = document.createElement('div');
            alertCard.className = `alert-card ${dataUtils.getAlertPriorityClass(alert.priority)}`;
            alertCard.innerHTML = `
                <div class="alert-header">
                    <span class="alert-priority ${alert.priority}">${alert.priority.toUpperCase()}</span>
                    <span class="alert-date">${dataUtils.formatDate(alert.createdAt)}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-footer">
                    <span><i class="fas fa-user"></i> ${alert.recipient}</span>
                    <span><i class="fas fa-user-tie"></i> ${alert.clientName}</span>
                </div>
                <div class="alert-actions">
                    <button class="btn-danger" onclick="app.deleteAlert(${alert.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            alertsGrid.appendChild(alertCard);
        });
    }

    // ===== FUNCIONES DE EXPORTACIÓN =====

    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            this.showNotification('No hay datos para exportar', 'error');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Archivo exportado correctamente', 'success');
    }

    exportUsers() {
        this.exportToCSV(mockData.users, 'usuarios');
    }

    exportClients() {
        this.exportToCSV(mockData.clients, 'clientes');
    }

    exportJudicialProcesses() {
        this.exportToCSV(mockData.judicialProcesses, 'procesos_judiciales');
    }

    exportExtrajudicialProcesses() {
        this.exportToCSV(mockData.extrajudicialProcesses, 'procesos_extrajudiciales');
    }

    exportAlerts() {
        this.exportToCSV(mockData.alerts, 'alertas');
    }

    // ===== FUNCIONES DE ESTADÍSTICAS =====

    getClientStatistics() {
        const totalClients = mockData.clients.length;
        const activeClients = mockData.clients.filter(c => c.status === 'activo').length;
        const inactiveClients = totalClients - activeClients;

        return {
            total: totalClients,
            active: activeClients,
            inactive: inactiveClients,
            percentage: totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0
        };
    }

    getProcessStatistics() {
        const judicial = mockData.judicialProcesses.length;
        const extrajudicial = mockData.extrajudicialProcesses.length;
        const total = judicial + extrajudicial;

        return {
            judicial,
            extrajudicial,
            total,
            judicialPercentage: total > 0 ? Math.round((judicial / total) * 100) : 0,
            extrajudicialPercentage: total > 0 ? Math.round((extrajudicial / total) * 100) : 0
        };
    }

    getAlertStatistics() {
        const totalAlerts = mockData.alerts.length;
        const activeAlerts = mockData.alerts.filter(a => a.status === 'activa').length;
        const highPriority = mockData.alerts.filter(a => a.priority === 'high').length;
        const mediumPriority = mockData.alerts.filter(a => a.priority === 'medium').length;
        const lowPriority = mockData.alerts.filter(a => a.priority === 'low').length;

        return {
            total: totalAlerts,
            active: activeAlerts,
            highPriority,
            mediumPriority,
            lowPriority
        };
    }

    // ===== FUNCIONES DE LIMPIEZA =====

    clearInactiveData() {
        if (confirm('¿Está seguro de que desea limpiar todos los datos inactivos? Esta acción no se puede deshacer.')) {
            const initialUsers = mockData.users.length;
            const initialClients = mockData.clients.length;
            const initialAlerts = mockData.alerts.length;

            // Limpiar usuarios inactivos
            mockData.users = mockData.users.filter(user => user.status === 'activo');

            // Limpiar clientes inactivos
            mockData.clients = mockData.clients.filter(client => client.status === 'activo');

            // Limpiar alertas inactivas
            mockData.alerts = mockData.alerts.filter(alert => alert.status === 'activa');

            const deletedUsers = initialUsers - mockData.users.length;
            const deletedClients = initialClients - mockData.clients.length;
            const deletedAlerts = initialAlerts - mockData.alerts.length;

            this.showNotification(`Limpieza completada: ${deletedUsers} usuarios, ${deletedClients} clientes, ${deletedAlerts} alertas eliminados`, 'success');

            // Recargar las secciones activas
            if (this.currentSection === 'users') this.loadUsers();
            if (this.currentSection === 'clients') this.loadClients();
            if (this.currentSection === 'alerts') this.loadAlerts();
        }
    }

    // ===== FUNCIONES DE RESPALDO =====

    backupData() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: mockData
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `backup_sistema_judicial_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Respaldo creado correctamente', 'success');
    }

    restoreData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                if (backup.data && backup.timestamp) {
                    if (confirm(`¿Está seguro de que desea restaurar el respaldo del ${new Date(backup.timestamp).toLocaleDateString()}? Esta acción sobrescribirá todos los datos actuales.`)) {
                        // Restaurar datos
                        Object.assign(mockData, backup.data);

                        // Recargar todas las secciones
                        this.loadSectionContent(this.currentSection);

                        this.showNotification('Datos restaurados correctamente', 'success');
                    }
                } else {
                    this.showNotification('Archivo de respaldo inválido', 'error');
                }
            } catch (error) {
                this.showNotification('Error al leer el archivo de respaldo', 'error');
                console.error('Error restoring data:', error);
            }
        };
        reader.readAsText(file);
    }
}

// Inicializar la aplicación cuando se carga la página
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new JudicialSystem();
});

// Hacer la aplicación disponible globalmente
window.app = app;