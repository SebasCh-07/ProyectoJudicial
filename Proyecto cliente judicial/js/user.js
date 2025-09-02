// Aplicación principal del sistema judicial para usuarios
class UserSystem {
    constructor() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || { name: 'Usuario', role: 'user' };
        this.currentSection = 'dashboard';
        this.charts = {}; // Almacenar instancias de gráficos
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUserInfo();
        this.loadDashboard();
    }

    setupEventListeners() {
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

        // Report period selector
        document.getElementById('reportPeriod').addEventListener('change', () => {
            this.updateReports();
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
    }

    handleLogout() {
        this.currentUser = null;
        this.destroyAllCharts();
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('userRole');
        window.location.href = 'index.html';
        this.showNotification('Sesión cerrada correctamente', 'info');
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
            'clients': 'Gestión de Clientes',
            'judicial': 'Procesos Judiciales',
            'extrajudicial': 'Procesos Extrajudiciales',
            'alerts': 'Panel de Alertas',
            'reports': 'Reportes y Métricas'
        };
        return titles[section] || section;
    }

    loadSectionContent(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
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

    // ===== FUNCIONES DE BÚSQUEDA AVANZADA =====

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

    // ===== FUNCIONES DE VISUALIZACIÓN =====

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
}

// Inicializar la aplicación cuando se carga la página
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new UserSystem();
});

// Hacer la aplicación disponible globalmente
window.app = app;