// Datos simulados para el sistema
const mockData = {
    // Usuarios del sistema
    users: [
        {
            id: 1,
            name: "Administrador",
            email: "admin@sistema.com",
            role: "admin",
            status: "activo",
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            name: "Juan Pérez",
            email: "juan.perez@sistema.com",
            role: "user",
            status: "activo",
            createdAt: "2024-02-01"
        },
        {
            id: 3,
            name: "María García",
            email: "maria.garcia@sistema.com",
            role: "user",
            status: "activo",
            createdAt: "2024-02-15"
        },
        {
            id: 4,
            name: "Carlos López",
            email: "carlos.lopez@sistema.com",
            role: "user",
            status: "inactivo",
            createdAt: "2024-03-01"
        }
    ],

    // Clientes del sistema
    clients: [
        {
            id: 1,
            name: "Roberto Silva",
            document: "12345678-9",
            address: "Av. Providencia 1234, Santiago",
            phone: "+56 9 1234 5678",
            email: "roberto.silva@email.com",
            status: "activo",
            createdAt: "2024-01-10",
            familyReferences: [
                { name: "Ana Silva", relationship: "Esposa", phone: "+56 9 1234 5679" },
                { name: "Pedro Silva", relationship: "Hijo", phone: "+56 9 1234 5680" }
            ]
        },
        {
            id: 2,
            name: "Carmen Rodríguez",
            document: "87654321-0",
            address: "Calle Las Condes 567, Las Condes",
            phone: "+56 9 8765 4321",
            email: "carmen.rodriguez@email.com",
            status: "activo",
            createdAt: "2024-01-20",
            familyReferences: [
                { name: "Miguel Rodríguez", relationship: "Esposo", phone: "+56 9 8765 4322" }
            ]
        },
        {
            id: 3,
            name: "Fernando Morales",
            document: "11223344-5",
            address: "Av. Apoquindo 890, Las Condes",
            phone: "+56 9 1122 3344",
            email: "fernando.morales@email.com",
            status: "activo",
            createdAt: "2024-02-05",
            familyReferences: [
                { name: "Patricia Morales", relationship: "Esposa", phone: "+56 9 1122 3345" },
                { name: "Diego Morales", relationship: "Hijo", phone: "+56 9 1122 3346" }
            ]
        },
        {
            id: 4,
            name: "Isabel Herrera",
            document: "55667788-9",
            address: "Calle Vitacura 234, Vitacura",
            phone: "+56 9 5566 7788",
            email: "isabel.herrera@email.com",
            status: "inactivo",
            createdAt: "2024-02-20",
            familyReferences: []
        },
        {
            id: 5,
            name: "Luis Mendoza",
            document: "99887766-5",
            address: "Av. Manquehue 456, Las Condes",
            phone: "+56 9 9988 7766",
            email: "luis.mendoza@email.com",
            status: "activo",
            createdAt: "2024-03-01",
            familyReferences: [
                { name: "Sofía Mendoza", relationship: "Hija", phone: "+56 9 9988 7767" }
            ]
        }
    ],

    // Procesos judiciales
    judicialProcesses: [
        {
            id: 1,
            clientId: 1,
            clientName: "Roberto Silva",
            caseNumber: "C-2024-001",
            status: "en_tramite",
            startDate: "2024-01-15",
            lastUpdate: "2024-03-15",
            court: "Juzgado Civil de Santiago",
            amount: 15000000,
            documents: [
                { name: "Demanda.pdf", type: "pdf", size: "2.3 MB" },
                { name: "Anexos.pdf", type: "pdf", size: "5.1 MB" },
                { name: "Notificación.pdf", type: "pdf", size: "1.8 MB" }
            ],
            history: [
                { date: "2024-01-15", action: "Presentación de demanda", user: "Admin" },
                { date: "2024-02-01", action: "Notificación al demandado", user: "Juan Pérez" },
                { date: "2024-03-15", action: "Audiencia de conciliación", user: "María García" }
            ]
        },
        {
            id: 2,
            clientId: 2,
            clientName: "Carmen Rodríguez",
            caseNumber: "C-2024-002",
            status: "sentencia",
            startDate: "2024-01-20",
            lastUpdate: "2024-03-10",
            court: "Juzgado Civil de Las Condes",
            amount: "8.500.000",
            documents: [
                { name: "Demanda.pdf", type: "pdf", size: "1.9 MB" },
                { name: "Sentencia.pdf", type: "pdf", size: "3.2 MB" }
            ],
            history: [
                { date: "2024-01-20", action: "Presentación de demanda", user: "Admin" },
                { date: "2024-02-15", action: "Audiencia de juicio", user: "Juan Pérez" },
                { date: "2024-03-10", action: "Sentencia favorable", user: "María García" }
            ]
        },
        {
            id: 3,
            clientId: 3,
            clientName: "Fernando Morales",
            caseNumber: "C-2024-003",
            status: "archivado",
            startDate: "2024-02-05",
            lastUpdate: "2024-03-01",
            court: "Juzgado Civil de Providencia",
            amount: 12000000,
            documents: [
                { name: "Demanda.pdf", type: "pdf", size: "2.1 MB" },
                { name: "Acuerdo.pdf", type: "pdf", size: "1.5 MB" }
            ],
            history: [
                { date: "2024-02-05", action: "Presentación de demanda", user: "Admin" },
                { date: "2024-02-20", action: "Acuerdo extrajudicial", user: "Juan Pérez" },
                { date: "2024-03-01", action: "Archivo del proceso", user: "María García" }
            ]
        }
    ],

    // Procesos extrajudiciales
    extrajudicialProcesses: [
        {
            id: 1,
            clientId: 1,
            clientName: "Roberto Silva",
            creditNumber: "CE-2024-001",
            status: "vigente",
            amount: 5000000,
            dueDate: "2024-06-15",
            startDate: "2024-01-10",
            lastUpdate: "2024-03-15",
            alerts: [
                { type: "vencimiento", message: "Vencimiento en 30 días", active: true },
                { type: "pago", message: "Recordatorio de pago mensual", active: true }
            ]
        },
        {
            id: 2,
            clientId: 2,
            clientName: "Carmen Rodríguez",
            creditNumber: "CE-2024-002",
            status: "vencido",
            amount: 3200000,
            dueDate: "2024-02-15",
            startDate: "2024-01-15",
            lastUpdate: "2024-03-10",
            alerts: [
                { type: "vencido", message: "Crédito vencido hace 25 días", active: true },
                { type: "cobranza", message: "Inicio de proceso de cobranza", active: true }
            ]
        },
        {
            id: 3,
            clientId: 3,
            clientName: "Fernando Morales",
            creditNumber: "CE-2024-003",
            status: "vigente",
            amount: 7800000,
            dueDate: "2024-08-20",
            startDate: "2024-02-01",
            lastUpdate: "2024-03-15",
            alerts: [
                { type: "vencimiento", message: "Vencimiento en 90 días", active: true }
            ]
        },
        {
            id: 4,
            clientId: 4,
            clientName: "Isabel Herrera",
            creditNumber: "CE-2024-004",
            status: "cancelado",
            amount: 4500000,
            dueDate: "2024-01-30",
            startDate: "2024-01-20",
            lastUpdate: "2024-02-15",
            alerts: [
                { type: "cancelado", message: "Crédito cancelado", active: false }
            ]
        }
    ],

    // Alertas del sistema
    alerts: [
        {
            id: 1,
            type: "vencimiento",
            priority: "high",
            message: "Crédito de Carmen Rodríguez vencido hace 25 días",
            recipient: "Juan Pérez",
            clientId: 2,
            clientName: "Carmen Rodríguez",
            createdAt: "2024-03-10",
            status: "activa"
        },
        {
            id: 2,
            type: "documento",
            priority: "medium",
            message: "Documentos pendientes de revisión en proceso judicial C-2024-001",
            recipient: "María García",
            clientId: 1,
            clientName: "Roberto Silva",
            createdAt: "2024-03-15",
            status: "activa"
        },
        {
            id: 3,
            type: "pago",
            priority: "low",
            message: "Recordatorio de pago mensual para Roberto Silva",
            recipient: "Juan Pérez",
            clientId: 1,
            clientName: "Roberto Silva",
            createdAt: "2024-03-15",
            status: "activa"
        },
        {
            id: 4,
            type: "audiencia",
            priority: "high",
            message: "Audiencia de conciliación programada para mañana",
            recipient: "María García",
            clientId: 1,
            clientName: "Roberto Silva",
            createdAt: "2024-03-14",
            status: "activa"
        },
        {
            id: 5,
            type: "vencimiento",
            priority: "medium",
            message: "Vencimiento de crédito en 30 días para Roberto Silva",
            recipient: "Juan Pérez",
            clientId: 1,
            clientName: "Roberto Silva",
            createdAt: "2024-03-15",
            status: "activa"
        }
    ],

    // Configuración del sistema
    settings: {
        defaultDeadline: 30,
        maxAlerts: 10,
        alertTypes: {
            email: true,
            sms: true,
            push: false
        },
        reports: {
            email: "admin@sistema.com",
            frequency: "weekly"
        }
    }
};

// Funciones auxiliares para los datos
const dataUtils = {
    // Obtener cliente por ID
    getClientById: (id) => {
        return mockData.clients.find(client => client.id === id);
    },

    // Obtener procesos judiciales por cliente
    getJudicialProcessesByClient: (clientId) => {
        return mockData.judicialProcesses.filter(process => process.clientId === clientId);
    },

    // Obtener procesos extrajudiciales por cliente
    getExtrajudicialProcessesByClient: (clientId) => {
        return mockData.extrajudicialProcesses.filter(process => process.clientId === clientId);
    },

    // Obtener alertas por cliente
    getAlertsByClient: (clientId) => {
        return mockData.alerts.filter(alert => alert.clientId === clientId);
    },

    // Obtener alertas activas
    getActiveAlerts: () => {
        return mockData.alerts.filter(alert => alert.status === "activa");
    },

    // Obtener estadísticas del dashboard
    getDashboardStats: () => {
        const totalClients = mockData.clients.filter(client => client.status === "activo").length;
        const totalJudicial = mockData.judicialProcesses.length;
        const totalExtrajudicial = mockData.extrajudicialProcesses.filter(p => p.status === "vigente").length;
        
        // Calcular efectividad (procesos exitosos / total)
        const successfulProcesses = mockData.judicialProcesses.filter(p => p.status === "sentencia").length;
        const effectiveness = totalJudicial > 0 ? Math.round((successfulProcesses / totalJudicial) * 100) : 0;

        return {
            totalClients,
            totalJudicial,
            totalExtrajudicial,
            effectiveness
        };
    },

    // Obtener datos para gráficos
    getChartData: () => {
        // Datos para gráfico de estados de procesos
        const processStatus = {
            'En Trámite': mockData.judicialProcesses.filter(p => p.status === "en_tramite").length,
            'Sentencia': mockData.judicialProcesses.filter(p => p.status === "sentencia").length,
            'Archivado': mockData.judicialProcesses.filter(p => p.status === "archivado").length
        };

        // Datos para gráfico de actividad mensual (simulado)
        const monthlyActivity = {
            'Enero': 15,
            'Febrero': 23,
            'Marzo': 18,
            'Abril': 12
        };

        // Datos para gráfico de efectividad por tipo
        const effectivenessByType = {
            'Judicial': 67,
            'Extrajudicial': 85,
            'Conciliación': 92
        };

        // Datos para gráfico de distribución de estados
        const statusDistribution = {
            'Vigente': mockData.extrajudicialProcesses.filter(p => p.status === "vigente").length,
            'Vencido': mockData.extrajudicialProcesses.filter(p => p.status === "vencido").length,
            'Cancelado': mockData.extrajudicialProcesses.filter(p => p.status === "cancelado").length
        };

        // Datos para gráfico de tendencia
        const trendData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr'],
            data: [65, 72, 78, 82]
        };

        return {
            processStatus,
            monthlyActivity,
            effectivenessByType,
            statusDistribution,
            trendData
        };
    },

    // Formatear moneda
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Formatear fecha
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Obtener estado del proceso en español
    getProcessStatusText: (status) => {
        const statusMap = {
            'en_tramite': 'En Trámite',
            'sentencia': 'Sentencia',
            'archivado': 'Archivado',
            'vigente': 'Vigente',
            'vencido': 'Vencido',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    },

    // Obtener clase CSS para prioridad de alerta
    getAlertPriorityClass: (priority) => {
        const priorityMap = {
            'high': 'high',
            'medium': 'medium',
            'low': 'low'
        };
        return priorityMap[priority] || 'low';
    },

    // Generar ID único
    generateId: () => {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }
};

// Exportar para uso global
window.mockData = mockData;
window.dataUtils = dataUtils;