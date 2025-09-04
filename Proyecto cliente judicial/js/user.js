// Aplicación principal del sistema judicial para usuarios
class UserSystem {
    constructor() {
        // Verificar si hay sesión válida
        const currentUser = sessionStorage.getItem('currentUser');
        const userRole = sessionStorage.getItem('userRole');
        
        if (!currentUser || userRole !== 'user') {
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = JSON.parse(currentUser);
        this.currentSection = 'assignments';
        this.charts = {}; // Almacenar instancias de gráficos
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUserInfo();
        this.loadAssignments();
        this.showUrgentAlerts();
        // Actualizar alertas urgentes cada 5 minutos
        setInterval(() => this.showUrgentAlerts(), 5 * 60 * 1000);
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
        const clientSearchInput = document.getElementById('clientSearch');
        if (clientSearchInput) {
            clientSearchInput.addEventListener('input', (e) => {
                this.filterClients(e.target.value);
            });
        }

        const clientFilterSelect = document.getElementById('clientFilter');
        if (clientFilterSelect) {
            clientFilterSelect.addEventListener('change', (e) => {
                this.filterClients('', e.target.value);
            });
        }

        // Report period selector
        const reportPeriodSelect = document.getElementById('reportPeriod');
        if (reportPeriodSelect) {
            reportPeriodSelect.addEventListener('change', () => {
                this.updateReports();
            });
        }

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
        
        // Limpiar sessionStorage
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('loginTime');
        
        // Limpiar variables globales
        window.currentUser = null;
        window.userRole = null;
        
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
            'clients': 'Gestión de Clientes',
            'judicial': 'Procesos Judiciales',
            'extrajudicial': 'Procesos Extrajudiciales',
            'assignments': 'Mis Asignaciones',
            'alerts': 'Panel de Alertas',
            'reports': 'Reportes y Métricas'
        };
        return titles[section] || section;
    }

    loadSectionContent(section) {
        switch (section) {
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
            case 'alerts':
                this.loadAlerts();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
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

    loadAssignments() {
        const assignmentsGrid = document.getElementById('assignmentsGrid');
        assignmentsGrid.innerHTML = '';

        // Filtrar asignaciones para el usuario actual
        const userAssignments = mockData.assignments.filter(assignment => 
            assignment.assignedTo === this.currentUser.id
        );

        if (userAssignments.length === 0) {
            assignmentsGrid.innerHTML = `
                <div class="no-assignments">
                    <i class="fas fa-tasks" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <h3>No tienes asignaciones</h3>
                    <p>Cuando el administrador te asigne procesos, aparecerán aquí.</p>
                </div>
            `;
            return;
        }

        userAssignments.forEach(assignment => {
            // Obtener información del proceso
            let processInfo = { title: 'Proceso no encontrado', client: '', details: '' };
            
            if (assignment.processType === 'judicial') {
                const process = mockData.judicialProcesses.find(p => p.id === assignment.processId);
                if (process) {
                    processInfo = {
                        title: `Proceso Judicial: ${process.caseNumber}`,
                        client: process.clientName,
                        details: `Juzgado: ${process.court} | Monto: ${dataUtils.formatCurrency(process.amount)}`
                    };
                }
            } else if (assignment.processType === 'extrajudicial') {
                const process = mockData.extrajudicialProcesses.find(p => p.id === assignment.processId);
                if (process) {
                    processInfo = {
                        title: `Proceso Extrajudicial: ${process.creditNumber}`,
                        client: process.clientName,
                        details: `Monto: ${dataUtils.formatCurrency(process.amount)} | Vencimiento: ${dataUtils.formatDate(process.dueDate)}`
                    };
                }
            }

            const assignmentCard = document.createElement('div');
            assignmentCard.className = `assignment-card ${assignment.priority}`;
            assignmentCard.innerHTML = `
                <div class="assignment-header">
                    <div>
                        <div class="assignment-title">${processInfo.title}</div>
                        <div class="assignment-meta">Asignado: ${dataUtils.formatDate(assignment.assignedDate)}</div>
                    </div>
                    <span class="badge badge-${assignment.priority}">${assignment.priority.toUpperCase()}</span>
                </div>
                
                <div class="assignment-content">
                    <p><strong>Cliente:</strong> ${processInfo.client}</p>
                    <p><strong>Estado:</strong> <span class="badge badge-${assignment.status === 'completed' ? 'active' : assignment.status === 'in_progress' ? 'warning' : 'secondary'}">${this.getAssignmentStatusText(assignment.status)}</span></p>
                    <p><strong>Fecha Límite:</strong> ${dataUtils.formatDate(assignment.dueDate)}</p>
                    <p><small>${processInfo.details}</small></p>
                    ${assignment.notes ? `<p><strong>Notas:</strong> ${assignment.notes}</p>` : ''}
                </div>
                
                <div class="assignment-actions">
                    <button class="btn-edit" onclick="app.viewAssignmentDetails(${assignment.id})">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                    <button class="btn-primary" onclick="app.updateAssignmentStatus(${assignment.id})">
                        <i class="fas fa-edit"></i> Actualizar Estado
                    </button>
                    <button class="btn-secondary" onclick="app.uploadFileToProcess(${assignment.processId}, '${assignment.processType}')">
                        <i class="fas fa-upload"></i> Subir Archivo
                    </button>
                </div>
            `;
            assignmentsGrid.appendChild(assignmentCard);
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

    exportAssignments() {
        // Filtrar asignaciones para el usuario actual
        const userAssignments = mockData.assignments.filter(assignment => 
            assignment.assignedTo === this.currentUser.id
        );
        this.exportToCSV(userAssignments, 'mis_asignaciones');
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

    viewAssignmentDetails(assignmentId) {
        const assignment = mockData.assignments.find(a => a.id === assignmentId);
        if (!assignment) {
            this.showNotification('Asignación no encontrada', 'error');
            return;
        }

        const assignedBy = mockData.users.find(u => u.id === assignment.assignedBy);
        
        let processInfo = 'Proceso no encontrado';
        let processFiles = [];
        
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

        // Obtener archivos subidos para este proceso
        processFiles = mockData.userUploads.filter(upload => 
            upload.processId === assignment.processId && 
            upload.processType === assignment.processType
        );

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

                <div class="info-section">
                    <h4>Archivos Subidos</h4>
                    ${processFiles.length > 0 ? 
                        processFiles.map(file => `
                            <div class="uploaded-file">
                                <i class="fas ${file.fileType === 'receipt' ? 'fa-receipt' : file.fileType === 'note' ? 'fa-sticky-note' : 'fa-file'}"></i>
                                <span><strong>${file.fileName}</strong></span>
                                <small>(${file.fileSize}) - ${dataUtils.formatDate(file.uploadDate)}</small>
                                <p><em>${file.description}</em></p>
                            </div>
                        `).join('') : 
                        '<p>No hay archivos subidos para este proceso</p>'
                    }
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="app.updateAssignmentStatus(${assignment.id})" class="btn-primary">
                        <i class="fas fa-edit"></i> Actualizar Estado
                    </button>
                    <button type="button" onclick="app.uploadFileToProcess(${assignment.processId}, '${assignment.processType}')" class="btn-secondary">
                        <i class="fas fa-upload"></i> Subir Archivo
                    </button>
                </div>
            </div>
        `);
    }

    updateAssignmentStatus(assignmentId) {
        const assignment = mockData.assignments.find(a => a.id === assignmentId);
        if (!assignment) {
            this.showNotification('Asignación no encontrada', 'error');
            return;
        }

        this.showModal('Actualizar Estado de Asignación', `
            <form id="updateStatusForm">
                <div class="form-group">
                    <label for="assignmentStatus">Estado *</label>
                    <select id="assignmentStatus" required>
                        <option value="assigned" ${assignment.status === 'assigned' ? 'selected' : ''}>Asignado</option>
                        <option value="in_progress" ${assignment.status === 'in_progress' ? 'selected' : ''}>En Progreso</option>
                        <option value="completed" ${assignment.status === 'completed' ? 'selected' : ''}>Completado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="statusNotes">Notas del Usuario</label>
                    <textarea id="statusNotes" rows="3" placeholder="Agrega comentarios sobre el progreso..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveAssignmentStatus(${assignmentId})" class="btn-primary">
                        <i class="fas fa-save"></i> Actualizar Estado
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    saveAssignmentStatus(assignmentId) {
        const status = document.getElementById('assignmentStatus').value;
        const notes = document.getElementById('statusNotes').value.trim();

        if (!status) {
            this.showNotification('Por favor seleccione un estado', 'error');
            return;
        }

        // Actualizar la asignación en mockData
        const assignmentIndex = mockData.assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIndex > -1) {
            mockData.assignments[assignmentIndex].status = status;
            if (notes) {
                mockData.assignments[assignmentIndex].userNotes = notes;
            }
        }

        console.log('Estado de asignación actualizado:', assignmentId, status);
        this.showNotification('Estado actualizado correctamente', 'success');
        this.closeModal();
        this.loadAssignments();
    }

    uploadFileToProcess(processId, processType) {
        this.showModal('Subir Archivo al Proceso', `
            <form id="uploadFileForm">
                <div class="form-group">
                    <label for="fileType">Tipo de Archivo *</label>
                    <select id="fileType" required>
                        <option value="">Seleccione el tipo</option>
                        <option value="receipt">Recibo</option>
                        <option value="note">Nota</option>
                        <option value="document">Documento</option>
                        <option value="evidence">Evidencia</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fileUpload">Seleccionar Archivo *</label>
                    <input type="file" id="fileUpload" required accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt">
                    <small>Formatos permitidos: PDF, DOC, DOCX, JPG, PNG, TXT (máx. 10MB)</small>
                </div>
                <div class="form-group">
                    <label for="fileDescription">Descripción *</label>
                    <textarea id="fileDescription" rows="3" required placeholder="Describa el contenido del archivo..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="app.saveFileUpload(${processId}, '${processType}')" class="btn-primary">
                        <i class="fas fa-upload"></i> Subir Archivo
                    </button>
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `);
    }

    saveFileUpload(processId, processType) {
        const fileType = document.getElementById('fileType').value;
        const fileInput = document.getElementById('fileUpload');
        const description = document.getElementById('fileDescription').value.trim();

        if (!fileType || !fileInput.files[0] || !description) {
            this.showNotification('Por favor complete todos los campos', 'error');
            return;
        }

        const file = fileInput.files[0];
        
        // Validar tamaño del archivo (10MB máximo)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('El archivo es demasiado grande (máximo 10MB)', 'error');
            return;
        }

        // Simular subida del archivo
        const newUpload = {
            id: dataUtils.generateId(),
            processType: processType,
            processId: processId,
            uploadedBy: this.currentUser.id,
            fileName: file.name,
            fileType: fileType,
            uploadDate: new Date().toISOString().split('T')[0],
            description: description,
            fileSize: this.formatFileSize(file.size)
        };

        // Agregar a mockData
        mockData.userUploads.push(newUpload);

        console.log('Archivo subido:', newUpload);
        this.showNotification(`Archivo "${file.name}" subido correctamente`, 'success');
        this.closeModal();
        this.loadAssignments();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ===== FUNCIONES DE ALERTAS URGENTES =====

    showUrgentAlerts() {
        const urgentAlerts = dataUtils.getUrgentAlerts();
        const container = document.getElementById('urgentFlyout');

        if (urgentAlerts.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        container.innerHTML = urgentAlerts.map(alert => `
            <div class="urgent-alerts urgent-alert-item ${alert.type}" data-client-id="${alert.clientId}" data-process-id="${alert.processId}" data-type="${alert.type}">
                <h4><i class="fas fa-exclamation-triangle"></i> Alerta Urgente</h4>
                <div class="urgent-alerts-summary">
                    ${alert.type === 'overdue' ? `<span class="urgent-stat"><strong>${alert.daysOverdue}</strong> días de retraso</span>` : `<span class="urgent-stat"><strong>${alert.daysUntilDue}</strong> días para vencer</span>`}
                </div>
                <div class="alert-content">
                    <span class="alert-message">${alert.message}</span>
                </div>
                <div class="alert-actions">
                    <button class="btn-sm btn-primary" onclick="app.viewClientFromAlertAndDismiss(${alert.clientId}, this)">
                        <i class="fas fa-user"></i> Ver Cliente
                    </button>
                    <button class="btn-sm btn-secondary" onclick="app.sendAutomaticMessage(${alert.clientId}, ${alert.daysUntilDue || 0})">
                        <i class="fas fa-sms"></i> Enviar SMS
                    </button>
                    <button class="btn-sm btn-danger" onclick="app.dismissUrgentAlert(this)">
                        <i class="fas fa-times"></i> Descartar
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewClientFromAlertAndDismiss(clientId, buttonEl) {
        const alertEl = buttonEl && buttonEl.closest('.urgent-alerts');
        if (alertEl) {
            const clientId = alertEl.dataset.clientId;
            const processId = alertEl.dataset.processId;
            const type = alertEl.dataset.type;
            
            // Marcar como vista
            dataUtils.dismissUrgentAlert({ clientId: parseInt(clientId), processId: parseInt(processId), type });
            
            // Ver cliente
            this.viewClient(parseInt(clientId));
            
            // Actualizar alertas
            this.showUrgentAlerts();
        }
    }

    sendAutomaticMessage(clientId, daysUntilDue) {
        const message = dataUtils.generateAutomaticMessage(clientId, daysUntilDue);
        if (message) {
            // Simular envío de SMS
            console.log('Enviando SMS:', message);
            this.showNotification(`SMS enviado a ${message.phone}`, 'success');
            
            // Agregar al historial de mensajes automáticos
            mockData.automaticMessages.push({
                ...message,
                id: dataUtils.generateId(),
                sentDate: new Date().toISOString().split('T')[0],
                status: 'sent',
                type: 'reminder'
            });
        }
    }

    dismissUrgentAlert(buttonEl) {
        const alertEl = buttonEl && buttonEl.closest('.urgent-alerts');
        if (alertEl) {
            const clientId = alertEl.dataset.clientId;
            const processId = alertEl.dataset.processId;
            const type = alertEl.dataset.type;
            
            // Marcar como vista
            dataUtils.dismissUrgentAlert({ clientId: parseInt(clientId), processId: parseInt(processId), type });
            
            // Actualizar alertas
            this.showUrgentAlerts();
            
            this.showNotification('Alerta descartada', 'info');
        }
    }
}

// Inicializar la aplicación cuando se carga la página
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new UserSystem();
    // Hacer la aplicación disponible globalmente una vez creada
    window.app = app;
});