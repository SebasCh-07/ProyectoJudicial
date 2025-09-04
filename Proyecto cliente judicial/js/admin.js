// Aplicación principal del sistema judicial
class JudicialSystem {
    constructor() {
        // Verificar si hay sesión válida
        const currentUser = sessionStorage.getItem('currentUser');
        const userRole = sessionStorage.getItem('userRole');
        
        if (!currentUser || userRole !== 'admin') {
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = JSON.parse(currentUser);
        this.currentSection = 'dashboard';
        this.charts = {}; // Almacenar instancias de gráficos
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUserInfo();
        this.loadDashboard();
        this.loadSettings();
        
        // Inicializar sistema de mensajes automáticos
        if (this.currentUser.role === 'admin') {
            this.initializeAutomaticMessages();
        }
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Navigation menu
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('a').dataset.section;
                this.navigateToSection(section);
            });
        });

        // Search and filter inputs
        const clientSearch = document.getElementById('clientSearch');
        if (clientSearch) {
            clientSearch.addEventListener('input', (e) => {
                this.filterClients(e.target.value);
            });
        }

        const clientFilter = document.getElementById('clientFilter');
        if (clientFilter) {
            clientFilter.addEventListener('change', (e) => {
                this.filterClients('', e.target.value);
            });
        }

        // Búsqueda en tiempo real para usuarios
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.searchUsers(e.target.value);
            });
        }

        // Report period selector
        const reportPeriod = document.getElementById('reportPeriod');
        if (reportPeriod) {
            reportPeriod.addEventListener('change', () => {
                this.updateReports();
            });
        }

        // Settings form
        const saveSettings = document.getElementById('saveSettings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        const resetSettings = document.getElementById('resetSettings');
        if (resetSettings) {
            resetSettings.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        // Modal close
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target.id === 'modalOverlay') {
                    this.closeModal();
                }
            });
        }

        // Notification close
        const notificationClose = document.querySelector('.notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }

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

        // Botón Nueva Asignación
        const addAssignmentBtn = document.getElementById('addAssignmentBtn');
        if (addAssignmentBtn) {
            addAssignmentBtn.addEventListener('click', () => {
                this.showAddAssignmentModal();
            });
        }

        // Botón Nueva Alerta Programada
        const addScheduledAlertBtn = document.getElementById('addScheduledAlertBtn');
        if (addScheduledAlertBtn) {
            addScheduledAlertBtn.addEventListener('click', () => {
                this.showAddScheduledAlertModal();
            });
        }
    }



    handleLogout() {
        this.currentUser = null;
        this.destroyAllCharts(); // Destruir todos los gráficos al cerrar sesión
        
        // Limpiar sessionStorage
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('loginTime');
        
        // Limpiar variables globales
        window.currentUser = null;
        window.userRole = null;
        
        // Limpiar intervalos
        if (this.urgentAlertsInterval) {
            clearInterval(this.urgentAlertsInterval);
        }
        if (this.messageCheckInterval) {
            clearInterval(this.messageCheckInterval);
        }
        
        // Mostrar notificación y redirigir
        this.showNotification('Sesión cerrada correctamente', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
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
            'assignments': 'Gestión de Asignaciones',
            'calendar': 'Calendario de Alertas',
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
            case 'assignments':
                this.loadAssignments();
                break;
            case 'calendar':
                this.loadCalendar();
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

        // Mostrar alertas urgentes si es admin
        if (this.currentUser.role === 'admin') {
            this.showUrgentAlerts();
        }

        // Crear gráficos solo si no existen
        this.createDashboardCharts();
    }

    createDashboardCharts() {
        const chartData = dataUtils.getChartData();

        // Destruir gráficos existentes si los hay
        if (this.charts.contactEffectivenessChart) {
            this.charts.contactEffectivenessChart.destroy();
        }
        if (this.charts.processStatusChart) {
            this.charts.processStatusChart.destroy();
        }
        if (this.charts.monthlyActivityChart) {
            this.charts.monthlyActivityChart.destroy();
        }

        // Gráfico de efectividad de contacto
        const contactEffectivenessCtx = document.getElementById('contactEffectivenessChart').getContext('2d');
        this.charts.contactEffectivenessChart = new Chart(contactEffectivenessCtx, {
            type: 'doughnut',
            data: {
                labels: ['Contactados', 'No Contactados', 'Convertidos', 'No Convertidos'],
                datasets: [{
                    data: [
                        chartData.contactEffectivenessData['Clientes Contactados'],
                        chartData.contactEffectivenessData['Clientes No Contactados'],
                        chartData.contactEffectivenessData['Clientes Convertidos'],
                        chartData.contactEffectivenessData['Clientes No Convertidos']
                    ],
                    backgroundColor: ['#27ae60', '#e74c3c', '#3498db', '#95a5a6'],
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
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        });

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

    cleanupAssignmentIds() {
        // Limpiar IDs largos y regenerar IDs secuenciales
        mockData.assignments.forEach((assignment, index) => {
            const idString = String(assignment.id);
            // Si el ID es muy largo (más de 10 caracteres), reemplazarlo con un ID secuencial
            if (idString.length > 10) {
                assignment.id = index + 1;
                console.log(`ID limpiado: ${idString} -> ${assignment.id}`);
            }
        });
    }

    loadAssignments() {
        const tbody = document.getElementById('assignmentsTableBody');
        tbody.innerHTML = '';

        // Limpiar IDs largos y regenerar IDs secuenciales
        this.cleanupAssignmentIds();

        mockData.assignments.forEach(assignment => {
            // Obtener información del cliente y usuario asignado
            const assignedUser = mockData.users.find(u => u.id === assignment.assignedTo);
            let clientName = 'Cliente no encontrado';
            
            if (assignment.processType === 'judicial') {
                const process = mockData.judicialProcesses.find(p => p.id === assignment.processId);
                clientName = process ? process.clientName : 'Proceso no encontrado';
            } else if (assignment.processType === 'extrajudicial') {
                const process = mockData.extrajudicialProcesses.find(p => p.id === assignment.processId);
                clientName = process ? process.clientName : 'Proceso no encontrado';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${assignment.id}</td>
                <td><span class="badge ${assignment.processType === 'judicial' ? 'badge-info' : 'badge-secondary'}">${assignment.processType === 'judicial' ? 'Judicial' : 'Extrajudicial'}</span></td>
                <td>${clientName}</td>
                <td>${assignedUser ? assignedUser.name : 'Usuario no encontrado'}</td>
                <td><span class="badge badge-${assignment.status === 'completed' ? 'active' : assignment.status === 'in_progress' ? 'warning' : 'secondary'}">${this.getAssignmentStatusText(assignment.status)}</span></td>
                <td><span class="badge badge-${assignment.priority}">${assignment.priority.toUpperCase()}</span></td>
                <td>${dataUtils.formatDate(assignment.dueDate)}</td>
                <td>
                    <button class="btn-edit" onclick="app.viewAssignment('${assignment.id}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-edit" onclick="app.editAssignment('${assignment.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-danger" onclick="app.deleteAssignment('${assignment.id}')">
                        <i class="fas fa-trash"></i> Eliminar
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

    showAddAssignmentModal() {
        const users = mockData.users.filter(u => u.status === 'activo' && u.role === 'user');
        const judicialProcesses = mockData.judicialProcesses;
        const extrajudicialProcesses = mockData.extrajudicialProcesses;

        this.showModal('Nueva Asignación', `
            <form id="addAssignmentForm">
                <div class="form-group">
                    <label for="newAssignmentType">Tipo de Proceso *</label>
                    <select id="newAssignmentType" required onchange="app.updateProcessOptions()">
                        <option value="">Seleccione el tipo</option>
                        <option value="judicial">Judicial</option>
                        <option value="extrajudicial">Extrajudicial</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="newAssignmentProcess">Proceso *</label>
                    <select id="newAssignmentProcess" required disabled>
                        <option value="">Primero seleccione el tipo de proceso</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="newAssignmentUser">Asignar a *</label>
                    <select id="newAssignmentUser" required>
                        <option value="">Seleccione un usuario</option>
                        ${users.map(user => `<option value="${user.id}">${user.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="newAssignmentPriority">Prioridad *</label>
                        <select id="newAssignmentPriority" required>
                            <option value="">Seleccione prioridad</option>
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newAssignmentDueDate">Fecha Límite *</label>
                        <input type="date" id="newAssignmentDueDate" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="newAssignmentNotes">Notas</label>
                    <textarea id="newAssignmentNotes" rows="3" placeholder="Notas adicionales..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveNewAssignment()" class="btn-primary">
                        <i class="fas fa-tasks"></i> Crear Asignación
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);

        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('newAssignmentDueDate').min = today;
    }

    updateProcessOptions() {
        const processType = document.getElementById('newAssignmentType').value;
        const processSelect = document.getElementById('newAssignmentProcess');
        
        processSelect.innerHTML = '<option value="">Seleccione un proceso</option>';
        processSelect.disabled = !processType;

        if (processType === 'judicial') {
            mockData.judicialProcesses.forEach(process => {
                const option = document.createElement('option');
                option.value = process.id;
                option.textContent = `${process.caseNumber} - ${process.clientName}`;
                processSelect.appendChild(option);
            });
        } else if (processType === 'extrajudicial') {
            mockData.extrajudicialProcesses.forEach(process => {
                const option = document.createElement('option');
                option.value = process.id;
                option.textContent = `${process.creditNumber} - ${process.clientName}`;
                processSelect.appendChild(option);
            });
        }
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

    saveNewAssignment() {
        const processType = document.getElementById('newAssignmentType').value;
        const processId = parseInt(document.getElementById('newAssignmentProcess').value);
        const assignedTo = parseInt(document.getElementById('newAssignmentUser').value);
        const priority = document.getElementById('newAssignmentPriority').value;
        const dueDate = document.getElementById('newAssignmentDueDate').value;
        const notes = document.getElementById('newAssignmentNotes').value.trim();

        if (!processType || !processId || !assignedTo || !priority || !dueDate) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        // Verificar que el proceso existe
        let processExists = false;
        if (processType === 'judicial') {
            processExists = mockData.judicialProcesses.some(p => p.id === processId);
        } else if (processType === 'extrajudicial') {
            processExists = mockData.extrajudicialProcesses.some(p => p.id === processId);
        }

        if (!processExists) {
            this.showNotification('El proceso seleccionado no existe', 'error');
            return;
        }

        // Verificar que el usuario existe
        const userExists = mockData.users.some(u => u.id === assignedTo && u.status === 'activo');
        if (!userExists) {
            this.showNotification('El usuario seleccionado no existe o está inactivo', 'error');
            return;
        }

        // Generar ID secuencial para asignaciones
        const maxId = Math.max(...mockData.assignments.map(a => {
            const id = String(a.id);
            const numericPart = id.match(/^\d+/);
            return numericPart ? parseInt(numericPart[0]) : 0;
        }), 0);
        
        const newAssignment = {
            id: maxId + 1,
            processType,
            processId,
            assignedBy: this.currentUser.id,
            assignedTo,
            assignedDate: new Date().toISOString().split('T')[0],
            status: 'assigned',
            priority,
            notes,
            dueDate
        };

        // Agregar a mockData
        mockData.assignments.push(newAssignment);

        console.log('Nueva asignación creada:', newAssignment);
        this.showNotification('Asignación creada correctamente', 'success');
        this.closeModal();
        this.loadAssignments();
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
        const client = dataUtils.getClientFullProfile(clientId);
        if (!client) {
            this.showNotification('Cliente no encontrado', 'error');
            return;
        }

        const judicialProcesses = client.processes.judicial;
        const extrajudicialProcesses = client.processes.extrajudicial;

        this.showModal('Ficha Completa del Cliente', `
            <div class="client-profile-extended">
                <div class="client-header">
                    <h3>${client.personalDocuments.fullName}</h3>
                    <span class="badge ${client.status === 'activo' ? 'badge-active' : 'badge-inactive'}">${client.status}</span>
                    ${client.hasOverduePayments ? '<span class="badge badge-warning">Pagos Vencidos</span>' : ''}
                </div>
                
                <div class="client-tabs">
                    <div class="tab-nav">
                        <button class="tab-btn active" onclick="app.switchClientTab('personal')">Personal</button>
                        <button class="tab-btn" onclick="app.switchClientTab('family')">Familia</button>
                        <button class="tab-btn" onclick="app.switchClientTab('financial')">Financiero</button>
                        <button class="tab-btn" onclick="app.switchClientTab('location')">Ubicación</button>
                        <button class="tab-btn" onclick="app.switchClientTab('processes')">Procesos</button>
                    </div>
                    
                    <div class="tab-content">
                        <!-- Personal Tab -->
                        <div id="personal-tab" class="tab-pane active">
                    <div class="info-section">
                        <h4>Información Personal</h4>
                                <div class="info-grid">
                                    <div><strong>Nombre Completo:</strong> ${client.personalDocuments.fullName}</div>
                                    <div><strong>CI:</strong> ${client.personalDocuments.ci}</div>
                                    <div><strong>Fecha Nacimiento:</strong> ${dataUtils.formatDate(client.personalDocuments.birthDate)}</div>
                                    <div><strong>Estado Civil:</strong> ${client.personalDocuments.civilStatus}</div>
                                    <div><strong>Profesión:</strong> ${client.personalDocuments.profession}</div>
                                    <div><strong>Ingresos:</strong> ${dataUtils.formatCurrency(client.personalDocuments.income)}</div>
                                    <div><strong>Teléfono:</strong> ${client.phone}</div>
                                    <div><strong>Email:</strong> ${client.email}</div>
                    </div>
                    
                                <h5>Direcciones</h5>
                                ${client.personalDocuments.addresses.map(addr => `
                                    <p><strong>${addr.type}:</strong> ${addr.address} 
                                    <span class="badge ${addr.verified ? 'badge-active' : 'badge-inactive'}">
                                        ${addr.verified ? 'Verificada' : 'No Verificada'}
                                    </span></p>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Family Tab -->
                        <div id="family-tab" class="tab-pane hidden">
                    <div class="info-section">
                                <h4>Árbol Genealógico</h4>
                                <div class="family-tree">
                                    <div class="family-level">
                                        <h5>Padres</h5>
                                        <div class="family-members">
                                            ${client.familyTree.father ? `
                                                <div class="family-member">
                                                    <strong>Padre:</strong> ${client.familyTree.father.name}<br>
                                                    <small>CI: ${client.familyTree.father.ci} | Tel: ${client.familyTree.father.phone}</small><br>
                                                    <small>Dir: ${client.familyTree.father.address}</small>
                                                </div>
                                            ` : '<p>No hay información del padre</p>'}
                                            
                                            ${client.familyTree.mother ? `
                                                <div class="family-member">
                                                    <strong>Madre:</strong> ${client.familyTree.mother.name}<br>
                                                    <small>CI: ${client.familyTree.mother.ci} | Tel: ${client.familyTree.mother.phone}</small><br>
                                                    <small>Dir: ${client.familyTree.mother.address}</small>
                                                </div>
                                            ` : '<p>No hay información de la madre</p>'}
                                        </div>
                                    </div>
                                    
                                    <div class="family-level">
                                        <h5>Cónyuge</h5>
                                        ${client.familyTree.spouse ? `
                                            <div class="family-member">
                                                <strong>${client.personalDocuments.civilStatus === 'Casado' ? 'Esposo/a' : 'Pareja'}:</strong> ${client.familyTree.spouse.name}<br>
                                                <small>CI: ${client.familyTree.spouse.ci} | Tel: ${client.familyTree.spouse.phone}</small><br>
                                                <small>Dir: ${client.familyTree.spouse.address}</small>
                                            </div>
                                        ` : '<p>No hay información del cónyuge</p>'}
                                    </div>
                                    
                                    <div class="family-level">
                                        <h5>Hijos</h5>
                                        ${client.familyTree.children.length > 0 ? 
                                            client.familyTree.children.map(child => `
                                                <div class="family-member">
                                                    <strong>${child.name}</strong> (${child.age} años)<br>
                                                    <small>CI: ${child.ci} | Tel: ${child.phone}</small><br>
                                                    <small>Dir: ${child.address}</small>
                                                </div>
                                            `).join('') : 
                                            '<p>No hay información de hijos</p>'
            }
                    </div>
                    
                                    <div class="family-level">
                                        <h5>Hermanos</h5>
                                        ${client.familyTree.siblings.length > 0 ? 
                                            client.familyTree.siblings.map(sibling => `
                                                <div class="family-member">
                                                    <strong>${sibling.name}</strong><br>
                                                    <small>CI: ${sibling.ci} | Tel: ${sibling.phone}</small><br>
                                                    <small>Dir: ${sibling.address}</small>
                                                </div>
                                            `).join('') : 
                                            '<p>No hay información de hermanos</p>'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Financial Tab -->
                        <div id="financial-tab" class="tab-pane hidden">
                            <div class="info-section">
                                <h4>Información Financiera</h4>
                                <p><strong>Deuda Total:</strong> ${dataUtils.formatCurrency(client.totalDebt)}</p>
                                
                                ${client.promissoryNote ? `
                                    <h5>Pagaré</h5>
                                    <div class="financial-doc">
                                        <p><strong>Número:</strong> ${client.promissoryNote.number}</p>
                                        <p><strong>Monto:</strong> ${dataUtils.formatCurrency(client.promissoryNote.amount)}</p>
                                        <p><strong>Fecha Vencimiento:</strong> ${dataUtils.formatDate(client.promissoryNote.dueDate)}</p>
                                        <p><strong>Fecha Firma:</strong> ${dataUtils.formatDate(client.promissoryNote.signedDate)}</p>
                                        <p><strong>Documento:</strong> <a href="#" onclick="app.downloadDocument('${client.promissoryNote.document}')">${client.promissoryNote.document}</a></p>
                                    </div>
                                ` : '<p>No hay pagaré registrado</p>'}
                                
                                ${client.disbursement ? `
                                    <h5>Desembolso</h5>
                                    <div class="financial-doc">
                                        <p><strong>Monto:</strong> ${dataUtils.formatCurrency(client.disbursement.amount)}</p>
                                        <p><strong>Fecha:</strong> ${dataUtils.formatDate(client.disbursement.date)}</p>
                                        <p><strong>Método:</strong> ${client.disbursement.method}</p>
                                        <p><strong>Cuenta:</strong> ${client.disbursement.accountNumber}</p>
                                        <p><strong>Banco:</strong> ${client.disbursement.bank}</p>
                                    </div>
                                ` : '<p>No hay desembolso registrado</p>'}
                                
                                ${client.amortizationTable && client.amortizationTable.length > 0 ? `
                                    <h5>Tabla de Amortización</h5>
                                    <div class="table-container">
                                        <table class="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Cuota</th>
                                                    <th>Fecha Venc.</th>
                                                    <th>Capital</th>
                                                    <th>Interés</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${client.amortizationTable.map(installment => `
                                                    <tr>
                                                        <td>${installment.installment}</td>
                                                        <td>${dataUtils.formatDate(installment.dueDate)}</td>
                                                        <td>${dataUtils.formatCurrency(installment.capital)}</td>
                                                        <td>${dataUtils.formatCurrency(installment.interest)}</td>
                                                        <td>${dataUtils.formatCurrency(installment.total)}</td>
                                                        <td><span class="badge ${installment.status === 'pagado' ? 'badge-active' : 'badge-warning'}">${installment.status}</span></td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : '<p>No hay tabla de amortización</p>'}
                            </div>
                        </div>
                        
                        <!-- Location Tab -->
                        <div id="location-tab" class="tab-pane hidden">
                            <div class="info-section">
                                <h4>Ubicación en Google Maps</h4>
                                <div id="clientMap" style="height: 400px; width: 100%; border-radius: 8px; margin-top: 10px;"></div>
                                <p style="margin-top: 10px;"><strong>Coordenadas:</strong> ${client.personalDocuments.coordinates.lat}, ${client.personalDocuments.coordinates.lng}</p>
                            </div>
                        </div>
                        
                        <!-- Processes Tab -->
                        <div id="processes-tab" class="tab-pane hidden">
                    <div class="info-section">
                        <h4>Procesos Judiciales</h4>
                        ${judicialProcesses.length > 0 ?
                judicialProcesses.map(process =>
                                        `<div class="process-item">
                                            <p><strong>${process.caseNumber}</strong> - ${dataUtils.getProcessStatusText(process.status)}</p>
                                            <small>Monto: ${dataUtils.formatCurrency(process.amount)} | Juzgado: ${process.court}</small>
                                        </div>`
                ).join('') :
                '<p>No hay procesos judiciales</p>'
            }
                    
                        <h4>Procesos Extrajudiciales</h4>
                        ${extrajudicialProcesses.length > 0 ?
                extrajudicialProcesses.map(process =>
                                        `<div class="process-item">
                                            <p><strong>${process.creditNumber}</strong> - ${dataUtils.getProcessStatusText(process.status)}</p>
                                            <small>Monto: ${dataUtils.formatCurrency(process.amount)} | Vencimiento: ${dataUtils.formatDate(process.dueDate)}</small>
                                        </div>`
                ).join('') :
                '<p>No hay procesos extrajudiciales</p>'
            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        // Inicializar Google Maps después de que se muestre el modal
        setTimeout(() => {
            this.initializeClientMap(client.personalDocuments.coordinates, client.personalDocuments.addresses[0].address);
        }, 100);
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

    // ===== FUNCIONES PARA PESTAÑAS DE CLIENTE =====

    switchClientTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.add('hidden');
            pane.classList.remove('active');
        });

        // Desactivar todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar la pestaña seleccionada
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.remove('hidden');
            targetTab.classList.add('active');
        }

        // Activar el botón correspondiente
        event.target.classList.add('active');

        // Si es la pestaña de ubicación, inicializar el mapa
        if (tabName === 'location') {
            setTimeout(() => {
                const mapElement = document.getElementById('clientMap');
                if (mapElement && !mapElement.hasChildNodes()) {
                    // El mapa se inicializa en viewClient
                }
            }, 100);
        }
    }

    initializeClientMap(coordinates, address) {
        const mapContainer = document.getElementById('clientMap');
        
        // Crear una vista de mapa alternativa usando OpenStreetMap
        mapContainer.innerHTML = `
            <div style="height: 100%; background: #f5f5f5; border-radius: 8px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 10px; left: 10px; right: 10px; background: white; padding: 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 10;">
                    <h4 style="margin: 0 0 5px 0; color: #333;"><i class="fas fa-map-marker-alt" style="color: #dc3545;"></i> Ubicación del Cliente</h4>
                    <p style="margin: 0; font-size: 14px; color: #666;">${address}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">Coordenadas: ${coordinates.lat}, ${coordinates.lng}</p>
                </div>
                
                <iframe 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" 
                    style="border-radius: 8px;"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng-0.01}%2C${coordinates.lat-0.01}%2C${coordinates.lng+0.01}%2C${coordinates.lat+0.01}&amp;layer=mapnik&amp;marker=${coordinates.lat}%2C${coordinates.lng}">
                </iframe>
                
                <div style="position: absolute; bottom: 10px; right: 10px; z-index: 10;">
                    <a href="https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}" 
                       target="_blank" 
                       class="btn-primary" 
                       style="text-decoration: none; padding: 8px 12px; font-size: 12px;">
                        <i class="fas fa-external-link-alt"></i> Ver en Google Maps
                    </a>
                </div>
            </div>
        `;
    }

    downloadDocument(documentName) {
        // Simular descarga de documento
        this.showNotification(`Descargando documento: ${documentName}`, 'info');
        console.log('Simulando descarga de:', documentName);
    }

    // ===== FUNCIONES PARA ASIGNACIONES =====

    getAssignmentStatusText(status) {
        const statusMap = {
            'assigned': 'Asignado',
            'in_progress': 'En Progreso',
            'completed': 'Completado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    viewAssignment(assignmentId) {
        console.log('Intentando ver asignación con ID:', assignmentId);
        // Convertir a string para comparación consistente
        const assignment = mockData.assignments.find(a => String(a.id) === String(assignmentId));
        console.log('Asignación encontrada:', assignment);
        
        if (!assignment) {
            this.showNotification('Asignación no encontrada', 'error');
            return;
        }

        const assignedUser = mockData.users.find(u => u.id === assignment.assignedTo);
        const assignedBy = mockData.users.find(u => u.id === assignment.assignedBy);
        
        let processInfo = 'Proceso no encontrado';
        if (assignment.processType === 'judicial') {
            const process = mockData.judicialProcesses.find(p => p.id === assignment.processId);
            if (process) {
                processInfo = `<strong>Caso:</strong> ${process.caseNumber}<br>
                              <strong>Cliente:</strong> ${process.clientName}<br>
                              <strong>Juzgado:</strong> ${process.court}<br>
                              <strong>Monto:</strong> ${dataUtils.formatCurrency(process.amount)}`;
            }
        } else if (assignment.processType === 'extrajudicial') {
            const process = mockData.extrajudicialProcesses.find(p => p.id === assignment.processId);
            if (process) {
                processInfo = `<strong>Crédito:</strong> ${process.creditNumber}<br>
                              <strong>Cliente:</strong> ${process.clientName}<br>
                              <strong>Monto:</strong> ${dataUtils.formatCurrency(process.amount)}<br>
                              <strong>Vencimiento:</strong> ${dataUtils.formatDate(process.dueDate)}`;
            }
        }

        console.log('Mostrando modal de detalles de asignación');
        this.showModal('Detalle de Asignación', `
            <div class="assignment-detail">
                <div class="assignment-header">
                    <h3>Asignación #${assignment.id}</h3>
                    <span class="badge badge-${assignment.status === 'completed' ? 'active' : assignment.status === 'in_progress' ? 'warning' : 'secondary'}">
                        ${this.getAssignmentStatusText(assignment.status)}
                    </span>
                </div>
                
                <div class="info-section">
                    <h4>Información General</h4>
                    <p><strong>Tipo de Proceso:</strong> ${assignment.processType === 'judicial' ? 'Judicial' : 'Extrajudicial'}</p>
                    <p><strong>Asignado por:</strong> ${assignedBy ? assignedBy.name : 'Usuario no encontrado'}</p>
                    <p><strong>Asignado a:</strong> ${assignedUser ? assignedUser.name : 'Usuario no encontrado'}</p>
                    <p><strong>Fecha de Asignación:</strong> ${dataUtils.formatDate(assignment.assignedDate)}</p>
                    <p><strong>Fecha Límite:</strong> ${dataUtils.formatDate(assignment.dueDate)}</p>
                    <p><strong>Prioridad:</strong> <span class="badge badge-${assignment.priority}">${assignment.priority.toUpperCase()}</span></p>
                </div>
                
                <div class="info-section">
                    <h4>Información del Proceso</h4>
                    <p>${processInfo}</p>
                </div>
                
                <div class="info-section">
                    <h4>Notas</h4>
                    <p>${assignment.notes || 'No hay notas adicionales'}</p>
                </div>
            </div>
        `);
    }

    editAssignment(assignmentId) {
        const assignment = mockData.assignments.find(a => String(a.id) === String(assignmentId));
        if (!assignment) {
            this.showNotification('Asignación no encontrada', 'error');
            return;
        }

        const users = mockData.users.filter(u => u.status === 'activo' && u.role === 'user');

        this.showModal('Editar Asignación', `
            <form id="editAssignmentForm">
                <div class="form-group">
                    <label for="editAssignmentUser">Asignar a *</label>
                    <select id="editAssignmentUser" required>
                        ${users.map(user => 
                            `<option value="${user.id}" ${user.id === assignment.assignedTo ? 'selected' : ''}>${user.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editAssignmentStatus">Estado *</label>
                        <select id="editAssignmentStatus" required>
                            <option value="assigned" ${assignment.status === 'assigned' ? 'selected' : ''}>Asignado</option>
                            <option value="in_progress" ${assignment.status === 'in_progress' ? 'selected' : ''}>En Progreso</option>
                            <option value="completed" ${assignment.status === 'completed' ? 'selected' : ''}>Completado</option>
                            <option value="cancelled" ${assignment.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editAssignmentPriority">Prioridad *</label>
                        <select id="editAssignmentPriority" required>
                            <option value="low" ${assignment.priority === 'low' ? 'selected' : ''}>Baja</option>
                            <option value="medium" ${assignment.priority === 'medium' ? 'selected' : ''}>Media</option>
                            <option value="high" ${assignment.priority === 'high' ? 'selected' : ''}>Alta</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editAssignmentDueDate">Fecha Límite *</label>
                    <input type="date" id="editAssignmentDueDate" value="${assignment.dueDate}" required>
                </div>
                <div class="form-group">
                    <label for="editAssignmentNotes">Notas</label>
                    <textarea id="editAssignmentNotes" rows="3" placeholder="Notas adicionales...">${assignment.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveAssignment(${assignmentId})" class="btn-primary">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    saveAssignment(assignmentId) {
        const assignedTo = parseInt(document.getElementById('editAssignmentUser').value);
        const status = document.getElementById('editAssignmentStatus').value;
        const priority = document.getElementById('editAssignmentPriority').value;
        const dueDate = document.getElementById('editAssignmentDueDate').value;
        const notes = document.getElementById('editAssignmentNotes').value.trim();

        if (!assignedTo || !status || !priority || !dueDate) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        // Actualizar la asignación en mockData
        const assignmentIndex = mockData.assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIndex > -1) {
            mockData.assignments[assignmentIndex] = {
                ...mockData.assignments[assignmentIndex],
                assignedTo,
                status,
                priority,
                dueDate,
                notes
            };
        }

        console.log('Asignación actualizada:', assignmentId);
        this.showNotification('Asignación actualizada correctamente', 'success');
        this.closeModal();
        this.loadAssignments();
    }

    deleteAssignment(assignmentId) {
        if (confirm('¿Está seguro de que desea eliminar esta asignación?')) {
            const index = mockData.assignments.findIndex(a => String(a.id) === String(assignmentId));
            if (index > -1) {
                mockData.assignments.splice(index, 1);
            }

            console.log('Asignación eliminada:', assignmentId);
            this.showNotification('Asignación eliminada correctamente', 'success');
            this.loadAssignments();
        }
    }

    // ===== FUNCIONES DE ALERTAS URGENTES =====

    showUrgentAlerts() {
        const urgentAlerts = dataUtils.getUrgentAlerts();
        const container = document.getElementById('urgentAlertsContainer');

        if (urgentAlerts.length === 0) {
            container.innerHTML = '';
            return;
        }

        const urgentCount = urgentAlerts.filter(alert => alert.type === 'overdue').length;
        const soonCount = urgentAlerts.filter(alert => alert.type === 'due_soon').length;

        container.innerHTML = `
            <div class="urgent-alerts">
                <h4><i class="fas fa-exclamation-triangle"></i> Alertas Urgentes (${urgentAlerts.length})</h4>
                <div class="urgent-alerts-summary">
                    ${urgentCount > 0 ? `<span class="urgent-stat"><strong>${urgentCount}</strong> créditos vencidos</span>` : ''}
                    ${soonCount > 0 ? `<span class="urgent-stat"><strong>${soonCount}</strong> próximos a vencer</span>` : ''}
                </div>
                <div class="urgent-alerts-list">
                    ${urgentAlerts.slice(0, 5).map(alert => `
                        <div class="urgent-alert-item ${alert.type}">
                            <div class="alert-content">
                                <span class="alert-message">${alert.message}</span>
                                <small class="alert-meta">
                                    ${alert.type === 'overdue' ? `${alert.daysOverdue} días de retraso` : `Vence en ${alert.daysUntilDue} días`}
                                </small>
                            </div>
                            <div class="alert-actions">
                                <button class="btn-sm btn-primary" onclick="app.viewClientFromAlert(${alert.clientId})">
                                    <i class="fas fa-user"></i> Ver Cliente
                                </button>
                                <button class="btn-sm btn-secondary" onclick="app.sendAutomaticMessage(${alert.clientId}, ${alert.daysUntilDue || 0})">
                                    <i class="fas fa-sms"></i> Enviar SMS
                                </button>
                            </div>
                        </div>
                    `).join('')}
                    ${urgentAlerts.length > 5 ? `
                        <div class="show-more-alerts">
                            <button class="btn-link" onclick="app.showAllUrgentAlerts()">
                                Ver todas las alertas (${urgentAlerts.length - 5} más)
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Configurar actualización automática cada 5 minutos
        if (!this.urgentAlertsInterval) {
            this.urgentAlertsInterval = setInterval(() => {
                if (this.currentSection === 'dashboard') {
                    this.showUrgentAlerts();
                }
            }, 5 * 60 * 1000); // 5 minutos
        }
    }

    viewClientFromAlert(clientId) {
        this.viewClient(clientId);
    }

    sendAutomaticMessage(clientId, daysUntilDue) {
        const message = dataUtils.generateAutomaticMessage(clientId, daysUntilDue);
        
        if (!message) {
            this.showNotification('No se pudo generar el mensaje', 'error');
            return;
        }

        this.showModal('Enviar Mensaje Automático', `
            <div class="message-preview">
                <h4>Mensaje a enviar:</h4>
                <div class="message-content">
                    <p><strong>Destinatario:</strong> ${message.phone}</p>
                    <div class="message-text">
                        ${message.message}
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.confirmSendMessage(${clientId}, '${message.phone}', '${message.message.replace(/'/g, "\\'")}')" class="btn-primary">
                        <i class="fas fa-paper-plane"></i> Enviar Mensaje
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
        `);
    }

    confirmSendMessage(clientId, phone, message) {
        // Simular envío de mensaje
        const newMessage = {
            id: dataUtils.generateId(),
            clientId: clientId,
            phone: phone,
            message: message,
            sentDate: new Date().toISOString().split('T')[0],
            status: 'sent',
            type: 'reminder'
        };

        mockData.automaticMessages.push(newMessage);

        console.log('Mensaje enviado:', newMessage);
        this.showNotification('Mensaje enviado correctamente', 'success');
        this.closeModal();
    }

    showAllUrgentAlerts() {
        const urgentAlerts = dataUtils.getUrgentAlerts();
        
        this.showModal('Todas las Alertas Urgentes', `
            <div class="all-urgent-alerts">
                <div class="alerts-summary">
                    <p><strong>Total de alertas:</strong> ${urgentAlerts.length}</p>
                </div>
                <div class="alerts-list">
                    ${urgentAlerts.map(alert => `
                        <div class="urgent-alert-item ${alert.type}">
                            <div class="alert-content">
                                <span class="alert-message">${alert.message}</span>
                                <small class="alert-meta">
                                    ${alert.type === 'overdue' ? `${alert.daysOverdue} días de retraso` : `Vence en ${alert.daysUntilDue} días`}
                                </small>
                            </div>
                            <div class="alert-actions">
                                <button class="btn-sm btn-primary" onclick="app.viewClientFromAlert(${alert.clientId}); app.closeModal();">
                                    <i class="fas fa-user"></i> Ver Cliente
                                </button>
                                <button class="btn-sm btn-secondary" onclick="app.sendAutomaticMessage(${alert.clientId}, ${alert.daysUntilDue || 0})">
                                    <i class="fas fa-sms"></i> SMS
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }

    // ===== SISTEMA DE MENSAJES AUTOMÁTICOS =====

    initializeAutomaticMessages() {
        // Configurar verificación automática de mensajes cada hora
        if (!this.messageCheckInterval) {
            this.messageCheckInterval = setInterval(() => {
                this.checkAndSendAutomaticMessages();
            }, 60 * 60 * 1000); // 1 hora
        }

        // Ejecutar verificación inicial
        this.checkAndSendAutomaticMessages();
    }

    checkAndSendAutomaticMessages() {
        const settings = mockData.settings.automaticMessages;
        
        if (!settings.enabled) {
            return;
        }

        const today = new Date();
        const currentHour = today.getHours();
        const startHour = parseInt(settings.businessHours.start.split(':')[0]);
        const endHour = parseInt(settings.businessHours.end.split(':')[0]);

        // Solo enviar mensajes en horario comercial
        if (currentHour < startHour || currentHour >= endHour) {
            return;
        }

        mockData.extrajudicialProcesses.forEach(process => {
            if (process.status === 'vigente') {
                const daysUntilDue = dataUtils.getDaysUntilDue(process.dueDate);
                
                // Verificar si debe enviarse mensaje según configuración
                if (settings.reminderDays.includes(daysUntilDue)) {
                    // Verificar si ya se envió mensaje hoy
                    const todayString = today.toISOString().split('T')[0];
                    const alreadySent = mockData.automaticMessages.some(msg => 
                        msg.clientId === process.clientId && 
                        msg.sentDate === todayString
                    );

                    if (!alreadySent) {
                        this.sendScheduledMessage(process.clientId, daysUntilDue);
                    }
                }
            }
        });
    }

    sendScheduledMessage(clientId, daysUntilDue) {
        const message = dataUtils.generateAutomaticMessage(clientId, daysUntilDue);
        
        if (message) {
            mockData.automaticMessages.push(message);
            console.log('Mensaje automático programado enviado:', message);
            
            // Mostrar notificación solo al admin
            if (this.currentUser.role === 'admin') {
                this.showNotification(`Mensaje automático enviado a ${message.phone}`, 'info');
            }
        }
    }

    // ===== FUNCIONES DEL CALENDARIO =====

    loadCalendar() {
        this.currentCalendarDate = new Date();
        this.renderCalendar();
        this.loadScheduledAlerts();
    }

    renderCalendar() {
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        // Actualizar título del mes
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

        // Obtener primer día del mes y número de días
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // Obtener alertas para este mes
        const monthAlerts = mockData.scheduledAlerts.filter(alert => {
            const alertDate = new Date(alert.date);
            return alertDate.getMonth() === month && alertDate.getFullYear() === year;
        });

        // Días del mes anterior (para completar la primera semana)
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNum = prevMonthDays - i;
            const dayElement = this.createCalendarDay(dayNum, true, []);
            calendarGrid.appendChild(dayElement);
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const dayAlerts = monthAlerts.filter(alert => {
                const alertDate = new Date(alert.date);
                return alertDate.getDate() === day;
            });
            
            const isToday = this.isToday(year, month, day);
            const dayElement = this.createCalendarDay(day, false, dayAlerts, isToday);
            calendarGrid.appendChild(dayElement);
        }

        // Días del mes siguiente (para completar la última semana)
        const totalCells = calendarGrid.children.length;
        const remainingCells = 42 - totalCells; // 6 semanas × 7 días
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createCalendarDay(day, true, []);
            calendarGrid.appendChild(dayElement);
        }
    }

    createCalendarDay(dayNum, isOtherMonth, alerts, isToday = false) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${alerts.length > 0 ? 'has-events' : ''}`;
        
        let eventsHtml = '';
        if (alerts.length > 0) {
            eventsHtml = alerts.slice(0, 3).map(alert => 
                `<div class="calendar-event ${alert.type || 'default'}" onclick="app.viewScheduledAlert(${alert.id})" title="${alert.title}">
                    ${alert.title.substring(0, 15)}${alert.title.length > 15 ? '...' : ''}
                </div>`
            ).join('');
            
            if (alerts.length > 3) {
                eventsHtml += `<div class="calendar-event-more">+${alerts.length - 3} más</div>`;
            }
        }

        dayElement.innerHTML = `
            <div class="calendar-day-number">${dayNum}</div>
            ${eventsHtml}
        `;

        if (!isOtherMonth) {
            dayElement.addEventListener('click', () => {
                this.showAddAlertOnDate(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth(), dayNum);
            });
        }

        return dayElement;
    }

    isToday(year, month, day) {
        const today = new Date();
        return today.getFullYear() === year && 
               today.getMonth() === month && 
               today.getDate() === day;
    }

    previousMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
        this.renderCalendar();
    }

    loadScheduledAlerts() {
        const alertsList = document.getElementById('scheduledAlertsList');
        alertsList.innerHTML = '';

        const sortedAlerts = [...mockData.scheduledAlerts]
            .filter(alert => alert.status === 'active')
            .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

        if (sortedAlerts.length === 0) {
            alertsList.innerHTML = '<p>No hay alertas programadas</p>';
            return;
        }

        sortedAlerts.forEach(alert => {
            const client = dataUtils.getClientById(alert.clientId);
            const assignedUser = mockData.users.find(u => u.id === alert.assignedTo);

            const alertElement = document.createElement('div');
            alertElement.className = 'scheduled-alert-item';
            alertElement.innerHTML = `
                <div class="scheduled-alert-content">
                    <div class="scheduled-alert-title">${alert.title}</div>
                    <div class="scheduled-alert-details">${alert.description}</div>
                    <div class="scheduled-alert-time">
                        <i class="fas fa-calendar"></i> ${dataUtils.formatDate(alert.date)} a las ${alert.time}
                        | <i class="fas fa-user"></i> ${client ? client.name : 'Cliente no encontrado'}
                        | <i class="fas fa-user-tie"></i> ${assignedUser ? assignedUser.name : 'Usuario no encontrado'}
                    </div>
                </div>
                <div class="scheduled-alert-actions">
                    <button class="btn-sm btn-edit" onclick="app.editScheduledAlert(${alert.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-sm btn-danger" onclick="app.deleteScheduledAlert(${alert.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            alertsList.appendChild(alertElement);
        });
    }

    showAddAlertOnDate(year, month, day) {
        const selectedDate = new Date(year, month, day);
        const dateString = selectedDate.toISOString().split('T')[0];
        
        this.showAddScheduledAlertModal(dateString);
    }

    showAddScheduledAlertModal(preselectedDate = null) {
        const clients = mockData.clients.filter(c => c.status === 'activo');
        const users = mockData.users.filter(u => u.status === 'activo');
        
        this.showModal('Nueva Alerta Programada', `
            <form id="addScheduledAlertForm">
                <div class="form-group">
                    <label for="scheduledAlertTitle">Título *</label>
                    <input type="text" id="scheduledAlertTitle" required placeholder="Ej: Audiencia Juan Pérez">
                </div>
                <div class="form-group">
                    <label for="scheduledAlertDescription">Descripción *</label>
                    <textarea id="scheduledAlertDescription" rows="3" required placeholder="Describa la alerta..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="scheduledAlertDate">Fecha *</label>
                        <input type="date" id="scheduledAlertDate" required value="${preselectedDate || ''}">
                    </div>
                    <div class="form-group">
                        <label for="scheduledAlertTime">Hora *</label>
                        <input type="time" id="scheduledAlertTime" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="scheduledAlertType">Tipo *</label>
                        <select id="scheduledAlertType" required>
                            <option value="">Seleccione el tipo</option>
                            <option value="audiencia">Audiencia</option>
                            <option value="seguimiento">Seguimiento</option>
                            <option value="pago">Recordatorio de Pago</option>
                            <option value="documento">Entrega de Documentos</option>
                            <option value="reunion">Reunión</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="scheduledAlertClient">Cliente *</label>
                        <select id="scheduledAlertClient" required>
                            <option value="">Seleccione un cliente</option>
                            ${clients.map(client => `<option value="${client.id}">${client.name} - ${client.document}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="scheduledAlertAssignedTo">Asignar a *</label>
                        <select id="scheduledAlertAssignedTo" required>
                            <option value="">Seleccione un usuario</option>
                            ${users.map(user => `<option value="${user.id}">${user.name} (${user.role})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="scheduledAlertReminder">Recordatorio (horas antes) *</label>
                        <select id="scheduledAlertReminder" required>
                            <option value="1">1 hora antes</option>
                            <option value="2">2 horas antes</option>
                            <option value="24">1 día antes</option>
                            <option value="48">2 días antes</option>
                            <option value="168">1 semana antes</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveScheduledAlert()" class="btn-primary">
                        <i class="fas fa-calendar-plus"></i> Programar Alerta
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);

        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('scheduledAlertDate').min = today;
    }

    saveScheduledAlert() {
        const title = document.getElementById('scheduledAlertTitle').value.trim();
        const description = document.getElementById('scheduledAlertDescription').value.trim();
        const date = document.getElementById('scheduledAlertDate').value;
        const time = document.getElementById('scheduledAlertTime').value;
        const type = document.getElementById('scheduledAlertType').value;
        const clientId = parseInt(document.getElementById('scheduledAlertClient').value);
        const assignedTo = parseInt(document.getElementById('scheduledAlertAssignedTo').value);
        const reminderBefore = parseInt(document.getElementById('scheduledAlertReminder').value);

        if (!title || !description || !date || !time || !type || !clientId || !assignedTo || !reminderBefore) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        const newScheduledAlert = {
            id: dataUtils.generateId(),
            title,
            description,
            date,
            time,
            type,
            clientId,
            assignedTo,
            status: 'active',
            reminderBefore,
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString().split('T')[0]
        };

        // Agregar a mockData
        mockData.scheduledAlerts.push(newScheduledAlert);

        console.log('Nueva alerta programada creada:', newScheduledAlert);
        this.showNotification('Alerta programada correctamente', 'success');
        this.closeModal();
        this.loadCalendar();
    }

    viewScheduledAlert(alertId) {
        const alert = mockData.scheduledAlerts.find(a => a.id === alertId);
        if (!alert) {
            this.showNotification('Alerta no encontrada', 'error');
            return;
        }

        const client = dataUtils.getClientById(alert.clientId);
        const assignedUser = mockData.users.find(u => u.id === alert.assignedTo);
        const createdByUser = mockData.users.find(u => u.id === alert.createdBy);

        this.showModal('Detalle de Alerta Programada', `
            <div class="scheduled-alert-detail">
                <div class="alert-header">
                    <h3>${alert.title}</h3>
                    <span class="badge badge-${alert.type}">${alert.type.toUpperCase()}</span>
                </div>
                
                <div class="info-section">
                    <h4>Información General</h4>
                    <p><strong>Descripción:</strong> ${alert.description}</p>
                    <p><strong>Fecha y Hora:</strong> ${dataUtils.formatDate(alert.date)} a las ${alert.time}</p>
                    <p><strong>Cliente:</strong> ${client ? client.name : 'Cliente no encontrado'}</p>
                    <p><strong>Asignado a:</strong> ${assignedUser ? assignedUser.name : 'Usuario no encontrado'}</p>
                    <p><strong>Recordatorio:</strong> ${alert.reminderBefore} horas antes</p>
                    <p><strong>Creado por:</strong> ${createdByUser ? createdByUser.name : 'Usuario no encontrado'}</p>
                    <p><strong>Fecha de creación:</strong> ${dataUtils.formatDate(alert.createdAt)}</p>
                </div>
            </div>
        `);
    }

    editScheduledAlert(alertId) {
        const alert = mockData.scheduledAlerts.find(a => a.id === alertId);
        if (!alert) {
            this.showNotification('Alerta no encontrada', 'error');
            return;
        }

        const clients = mockData.clients.filter(c => c.status === 'activo');
        const users = mockData.users.filter(u => u.status === 'activo');

        this.showModal('Editar Alerta Programada', `
            <form id="editScheduledAlertForm">
                <div class="form-group">
                    <label for="editScheduledAlertTitle">Título *</label>
                    <input type="text" id="editScheduledAlertTitle" required value="${alert.title}">
                </div>
                <div class="form-group">
                    <label for="editScheduledAlertDescription">Descripción *</label>
                    <textarea id="editScheduledAlertDescription" rows="3" required>${alert.description}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editScheduledAlertDate">Fecha *</label>
                        <input type="date" id="editScheduledAlertDate" required value="${alert.date}">
                    </div>
                    <div class="form-group">
                        <label for="editScheduledAlertTime">Hora *</label>
                        <input type="time" id="editScheduledAlertTime" required value="${alert.time}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editScheduledAlertType">Tipo *</label>
                        <select id="editScheduledAlertType" required>
                            <option value="audiencia" ${alert.type === 'audiencia' ? 'selected' : ''}>Audiencia</option>
                            <option value="seguimiento" ${alert.type === 'seguimiento' ? 'selected' : ''}>Seguimiento</option>
                            <option value="pago" ${alert.type === 'pago' ? 'selected' : ''}>Recordatorio de Pago</option>
                            <option value="documento" ${alert.type === 'documento' ? 'selected' : ''}>Entrega de Documentos</option>
                            <option value="reunion" ${alert.type === 'reunion' ? 'selected' : ''}>Reunión</option>
                            <option value="otro" ${alert.type === 'otro' ? 'selected' : ''}>Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editScheduledAlertStatus">Estado *</label>
                        <select id="editScheduledAlertStatus" required>
                            <option value="active" ${alert.status === 'active' ? 'selected' : ''}>Activa</option>
                            <option value="completed" ${alert.status === 'completed' ? 'selected' : ''}>Completada</option>
                            <option value="cancelled" ${alert.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.updateScheduledAlert(${alertId})" class="btn-primary">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    updateScheduledAlert(alertId) {
        const title = document.getElementById('editScheduledAlertTitle').value.trim();
        const description = document.getElementById('editScheduledAlertDescription').value.trim();
        const date = document.getElementById('editScheduledAlertDate').value;
        const time = document.getElementById('editScheduledAlertTime').value;
        const type = document.getElementById('editScheduledAlertType').value;
        const status = document.getElementById('editScheduledAlertStatus').value;

        if (!title || !description || !date || !time || !type || !status) {
            this.showNotification('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        // Actualizar la alerta en mockData
        const alertIndex = mockData.scheduledAlerts.findIndex(a => a.id === alertId);
        if (alertIndex > -1) {
            mockData.scheduledAlerts[alertIndex] = {
                ...mockData.scheduledAlerts[alertIndex],
                title,
                description,
                date,
                time,
                type,
                status
            };
        }

        console.log('Alerta programada actualizada:', alertId);
        this.showNotification('Alerta actualizada correctamente', 'success');
        this.closeModal();
        this.loadCalendar();
    }

    deleteScheduledAlert(alertId) {
        if (confirm('¿Está seguro de que desea eliminar esta alerta programada?')) {
            const index = mockData.scheduledAlerts.findIndex(a => a.id === alertId);
            if (index > -1) {
                mockData.scheduledAlerts.splice(index, 1);
            }

            console.log('Alerta programada eliminada:', alertId);
            this.showNotification('Alerta eliminada correctamente', 'success');
            this.loadCalendar();
        }
    }

    // ===== FUNCIONES DE BÚSQUEDA MEJORADA =====

    filterClients(searchTerm = '', statusFilter = '') {
        const tbody = document.getElementById('clientsTableBody');
        tbody.innerHTML = '';

        // Usar la función de búsqueda mejorada
        let filteredClients = dataUtils.searchClients(searchTerm);

        // Aplicar filtro de estado si existe
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
}

// Inicializar la aplicación cuando se carga la página
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new JudicialSystem();
});

// Hacer la aplicación disponible globalmente
window.app = app;