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
            contacted: true,
            converted: true,
            promissoryNote: {
                number: "PN-2024-001",
                amount: 5000000,
                dueDate: "2024-06-15",
                signedDate: "2024-01-10",
                document: "pagare_roberto_silva.pdf"
            },
            disbursement: {
                amount: 5000000,
                date: "2024-01-12",
                method: "Transferencia bancaria",
                accountNumber: "12345678",
                bank: "Banco de Chile"
            },
            amortizationTable: [
                { installment: 1, dueDate: "2024-02-15", capital: 833333, interest: 50000, total: 883333, status: "pagado" },
                { installment: 2, dueDate: "2024-03-15", capital: 833333, interest: 45833, total: 879166, status: "pagado" },
                { installment: 3, dueDate: "2024-04-15", capital: 833333, interest: 41666, total: 874999, status: "pendiente" },
                { installment: 4, dueDate: "2024-05-15", capital: 833333, interest: 37499, total: 870832, status: "pendiente" },
                { installment: 5, dueDate: "2024-06-15", capital: 833333, interest: 33332, total: 866665, status: "pendiente" },
                { installment: 6, dueDate: "2024-07-15", capital: 833335, interest: 29165, total: 862500, status: "pendiente" }
            ],
            personalDocuments: {
                fullName: "Roberto Antonio Silva Mendoza",
                ci: "12345678-9",
                birthDate: "1980-05-15",
                civilStatus: "Casado",
                profession: "Ingeniero Comercial",
                income: 1500000,
                addresses: [
                    { type: "Principal", address: "Av. Providencia 1234, Santiago", verified: true },
                    { type: "Laboral", address: "Av. Las Condes 567, Las Condes", verified: true }
                ],
                coordinates: { lat: -33.4372, lng: -70.6506 }
            },
            familyTree: {
                father: { name: "Carlos Silva Pérez", ci: "11111111-1", phone: "+56 9 1111 1111", address: "Calle Los Álamos 123, Santiago" },
                mother: { name: "María Mendoza López", ci: "22222222-2", phone: "+56 9 2222 2222", address: "Calle Los Álamos 123, Santiago" },
                spouse: { name: "Ana Silva Rodríguez", ci: "33333333-3", phone: "+56 9 1234 5679", address: "Av. Providencia 1234, Santiago" },
                children: [
                    { name: "Pedro Silva Silva", ci: "44444444-4", phone: "+56 9 1234 5680", age: 15, address: "Av. Providencia 1234, Santiago" }
                ],
                siblings: [
                    { name: "Carmen Silva Mendoza", ci: "55555555-5", phone: "+56 9 5555 5555", address: "Calle San Martín 456, Santiago" }
                ]
            },
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
            contacted: true,
            converted: false,
            promissoryNote: null,
            disbursement: null,
            amortizationTable: [],
            personalDocuments: {
                fullName: "Carmen Elena Rodríguez Morales",
                ci: "87654321-0",
                birthDate: "1975-08-22",
                civilStatus: "Casada",
                profession: "Profesora",
                income: 800000,
                addresses: [
                    { type: "Principal", address: "Calle Las Condes 567, Las Condes", verified: true }
                ],
                coordinates: { lat: -33.4126, lng: -70.5693 }
            },
            familyTree: {
                father: { name: "Pedro Rodríguez González", ci: "66666666-6", phone: "+56 9 6666 6666", address: "Av. Independencia 789, Santiago" },
                mother: { name: "Rosa Morales Silva", ci: "77777777-7", phone: "+56 9 7777 7777", address: "Av. Independencia 789, Santiago" },
                spouse: { name: "Miguel Rodríguez Castro", ci: "88888888-8", phone: "+56 9 8765 4322", address: "Calle Las Condes 567, Las Condes" },
                children: [],
                siblings: [
                    { name: "Luis Rodríguez Morales", ci: "99999999-9", phone: "+56 9 9999 9999", address: "Calle Maipú 321, Santiago" }
                ]
            },
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
            contacted: true,
            converted: true,
            promissoryNote: {
                number: "PN-2024-002",
                amount: 7800000,
                dueDate: "2024-08-20",
                signedDate: "2024-02-05",
                document: "pagare_fernando_morales.pdf"
            },
            disbursement: {
                amount: 7800000,
                date: "2024-02-07",
                method: "Cheque",
                accountNumber: "87654321",
                bank: "Banco Santander"
            },
            amortizationTable: [
                { installment: 1, dueDate: "2024-03-20", capital: 1300000, interest: 78000, total: 1378000, status: "pagado" },
                { installment: 2, dueDate: "2024-04-20", capital: 1300000, interest: 65000, total: 1365000, status: "pendiente" },
                { installment: 3, dueDate: "2024-05-20", capital: 1300000, interest: 52000, total: 1352000, status: "pendiente" },
                { installment: 4, dueDate: "2024-06-20", capital: 1300000, interest: 39000, total: 1339000, status: "pendiente" },
                { installment: 5, dueDate: "2024-07-20", capital: 1300000, interest: 26000, total: 1326000, status: "pendiente" },
                { installment: 6, dueDate: "2024-08-20", capital: 1300000, interest: 13000, total: 1313000, status: "pendiente" }
            ],
            personalDocuments: {
                fullName: "Fernando José Morales Herrera",
                ci: "11223344-5",
                birthDate: "1985-12-03",
                civilStatus: "Casado",
                profession: "Contador",
                income: 1200000,
                addresses: [
                    { type: "Principal", address: "Av. Apoquindo 890, Las Condes", verified: true },
                    { type: "Comercial", address: "Av. Providencia 1800, Providencia", verified: false }
                ],
                coordinates: { lat: -33.4078, lng: -70.5792 }
            },
            familyTree: {
                father: { name: "José Morales Vega", ci: "10101010-1", phone: "+56 9 1010 1010", address: "Calle Ñuñoa 456, Ñuñoa" },
                mother: { name: "Elena Herrera Soto", ci: "20202020-2", phone: "+56 9 2020 2020", address: "Calle Ñuñoa 456, Ñuñoa" },
                spouse: { name: "Patricia Morales González", ci: "30303030-3", phone: "+56 9 1122 3345", address: "Av. Apoquindo 890, Las Condes" },
                children: [
                    { name: "Diego Morales Morales", ci: "40404040-4", phone: "+56 9 1122 3346", age: 12, address: "Av. Apoquindo 890, Las Condes" }
                ],
                siblings: []
            },
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
            contacted: false,
            converted: false,
            promissoryNote: null,
            disbursement: null,
            amortizationTable: [],
            personalDocuments: {
                fullName: "Isabel María Herrera Campos",
                ci: "55667788-9",
                birthDate: "1990-04-18",
                civilStatus: "Soltera",
                profession: "Diseñadora",
                income: 600000,
                addresses: [
                    { type: "Principal", address: "Calle Vitacura 234, Vitacura", verified: false }
                ],
                coordinates: { lat: -33.3823, lng: -70.5447 }
            },
            familyTree: {
                father: { name: "Roberto Herrera Díaz", ci: "50505050-5", phone: "+56 9 5050 5050", address: "Av. Maipú 678, Maipú" },
                mother: { name: "María Campos Ruiz", ci: "60606060-6", phone: "+56 9 6060 6060", address: "Av. Maipú 678, Maipú" },
                spouse: null,
                children: [],
                siblings: [
                    { name: "Carlos Herrera Campos", ci: "70707070-7", phone: "+56 9 7070 7070", address: "Calle San Bernardo 890, San Bernardo" }
                ]
            },
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
            contacted: true,
            converted: false,
            promissoryNote: null,
            disbursement: null,
            amortizationTable: [],
            personalDocuments: {
                fullName: "Luis Alberto Mendoza Torres",
                ci: "99887766-5",
                birthDate: "1978-11-25",
                civilStatus: "Divorciado",
                profession: "Médico",
                income: 2000000,
                addresses: [
                    { type: "Principal", address: "Av. Manquehue 456, Las Condes", verified: true }
                ],
                coordinates: { lat: -33.3686, lng: -70.5515 }
            },
            familyTree: {
                father: { name: "Alberto Mendoza Vásquez", ci: "80808080-8", phone: "+56 9 8080 8080", address: "Calle Conchalí 123, Conchalí" },
                mother: { name: "Carmen Torres Jiménez", ci: "90909090-9", phone: "+56 9 9090 9090", address: "Calle Conchalí 123, Conchalí" },
                spouse: null,
                children: [
                    { name: "Sofía Mendoza García", ci: "11111111-1", phone: "+56 9 9988 7767", age: 18, address: "Av. Manquehue 456, Las Condes" }
                ],
                siblings: [
                    { name: "Ana Mendoza Torres", ci: "12121212-1", phone: "+56 9 1212 1212", address: "Av. La Florida 567, La Florida" }
                ]
            },
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

    // Asignaciones de procesos
    assignments: [
        {
            id: 1,
            processType: "extrajudicial",
            processId: 1,
            assignedBy: 1, // Admin ID
            assignedTo: 2, // User ID
            assignedDate: "2024-03-15",
            status: "assigned",
            priority: "high",
            notes: "Cliente con historial de pagos puntuales",
            dueDate: "2024-03-19"
        },
        {
            id: 2,
            processType: "judicial",
            processId: 1,
            assignedBy: 1,
            assignedTo: 3, // María García
            assignedDate: "2024-03-14",
            status: "in_progress",
            priority: "medium",
            notes: "Revisar documentación antes de la audiencia",
            dueDate: "2024-03-17"
        },
        {
            id: 3,
            processType: "judicial",
            processId: 2,
            assignedBy: 1,
            assignedTo: 2, // Juan Pérez
            assignedDate: "2024-03-10",
            status: "assigned",
            priority: "medium",
            notes: "Proceso judicial en etapa de conciliación",
            dueDate: "2024-09-07"
        }
    ],

    // Archivos y documentos cargados por usuarios
    userUploads: [
        {
            id: 1,
            processType: "extrajudicial",
            processId: 1,
            uploadedBy: 2,
            fileName: "recibo_pago_marzo.pdf",
            fileType: "receipt",
            uploadDate: "2024-03-16",
            description: "Recibo de pago correspondiente a marzo 2024",
            fileSize: "1.2 MB"
        },
        {
            id: 2,
            processType: "judicial",
            processId: 1,
            uploadedBy: 3,
            fileName: "nota_audiencia.txt",
            fileType: "note",
            uploadDate: "2024-03-15",
            description: "Notas de la audiencia de conciliación",
            fileSize: "0.5 KB"
        }
    ],

    // Calendario de alertas programadas
    scheduledAlerts: [
        {
            id: 1,
            title: "Audiencia Fernando Morales",
            description: "Audiencia de conciliación programada",
            date: "2024-03-25",
            time: "10:00",
            type: "audiencia",
            clientId: 3,
            assignedTo: 3,
            status: "active",
            reminderBefore: 24 // horas
        },
        {
            id: 2,
            title: "Seguimiento Carmen Rodríguez",
            description: "Llamada de seguimiento para negociación",
            date: "2024-03-22",
            time: "14:30",
            type: "seguimiento",
            clientId: 2,
            assignedTo: 2,
            status: "active",
            reminderBefore: 2 // horas
        }
    ],

    // Mensajes automáticos enviados
    automaticMessages: [
        {
            id: 1,
            clientId: 1,
            phone: "+56 9 1234 5678",
            message: "Estimado Roberto Silva, le recordamos que su crédito vence en 2 días. Por favor, realice el pago correspondiente para evitar recargos.",
            sentDate: "2024-06-13",
            status: "sent",
            type: "reminder"
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
        },
        automaticMessages: {
            enabled: true,
            reminderDays: [2, 1, 0], // días antes del vencimiento
            businessHours: {
                start: "09:00",
                end: "18:00"
            }
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
        
        // Calcular efectividad de contacto y conversión
        const contactedClients = mockData.clients.filter(client => client.contacted).length;
        const convertedClients = mockData.clients.filter(client => client.converted).length;
        const contactEffectiveness = totalClients > 0 ? Math.round((contactedClients / totalClients) * 100) : 0;
        const conversionEffectiveness = contactedClients > 0 ? Math.round((convertedClients / contactedClients) * 100) : 0;
        
        // Calcular efectividad (procesos exitosos / total)
        const successfulProcesses = mockData.judicialProcesses.filter(p => p.status === "sentencia").length;
        const judicialEffectiveness = totalJudicial > 0 ? Math.round((successfulProcesses / totalJudicial) * 100) : 0;

        return {
            totalClients,
            totalJudicial,
            totalExtrajudicial,
            effectiveness: judicialEffectiveness,
            contactEffectiveness,
            conversionEffectiveness,
            contactedClients,
            convertedClients
        };
    },

    // Obtener datos para gráficos
    getChartData: () => {
        const stats = dataUtils.getDashboardStats();
        
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
            'Contacto': stats.contactEffectiveness,
            'Conversión': stats.conversionEffectiveness,
            'Judicial': stats.effectiveness
        };

        // Datos específicos para el gráfico de efectividad de contacto
        const contactEffectivenessData = {
            'Clientes Contactados': stats.contactedClients,
            'Clientes No Contactados': stats.totalClients - stats.contactedClients,
            'Clientes Convertidos': stats.convertedClients,
            'Clientes No Convertidos': stats.contactedClients - stats.convertedClients
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
            contactEffectivenessData,
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
        // Generar ID secuencial basado en el tipo de dato
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5);
        return `${timestamp}${random}`;
    },

    // Búsqueda avanzada de clientes por nombre o CI
    searchClients: (query) => {
        if (!query || query.trim() === '') {
            return mockData.clients;
        }
        
        const searchTerm = query.toLowerCase().trim();
        return mockData.clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.document.includes(searchTerm) ||
            client.personalDocuments.fullName.toLowerCase().includes(searchTerm) ||
            client.personalDocuments.ci.includes(searchTerm)
        );
    },

    // Calcular días hasta vencimiento
    getDaysUntilDue: (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    // Obtener alertas urgentes para admin
    getUrgentAlerts: () => {
        const urgentAlerts = [];
        const today = new Date();

        // Revisar procesos extrajudiciales vencidos
        mockData.extrajudicialProcesses.forEach(process => {
            if (process.status === "vigente") {
                const daysUntilDue = dataUtils.getDaysUntilDue(process.dueDate);
                
                if (daysUntilDue < 0) {
                    urgentAlerts.push({
                        type: "overdue",
                        priority: "high",
                        message: `${process.clientName}: ${Math.abs(daysUntilDue)} días de retraso`,
                        clientId: process.clientId,
                        processId: process.id,
                        daysOverdue: Math.abs(daysUntilDue)
                    });
                } else if (daysUntilDue <= 2) {
                    urgentAlerts.push({
                        type: "due_soon",
                        priority: "medium",
                        message: `${process.clientName}: vence en ${daysUntilDue} días`,
                        clientId: process.clientId,
                        processId: process.id,
                        daysUntilDue: daysUntilDue
                    });
                }
            }
        });

        return urgentAlerts.sort((a, b) => {
            if (a.type === "overdue" && b.type !== "overdue") return -1;
            if (a.type !== "overdue" && b.type === "overdue") return 1;
            if (a.daysOverdue && b.daysOverdue) return b.daysOverdue - a.daysOverdue;
            return 0;
        });
    },

    // Generar mensaje automático para cliente
    generateAutomaticMessage: (clientId, daysUntilDue) => {
        const client = dataUtils.getClientById(clientId);
        if (!client) return null;

        let message = `Estimado/a ${client.name}, `;
        
        if (daysUntilDue === 2) {
            message += `le recordamos que su crédito vence en 2 días. Por favor, realice el pago correspondiente para evitar recargos.`;
        } else if (daysUntilDue === 1) {
            message += `su crédito vence mañana. Es importante que realice el pago hoy para evitar mora.`;
        } else if (daysUntilDue === 0) {
            message += `su crédito vence hoy. Por favor, contacte a nuestras oficinas inmediatamente.`;
        }

        return {
            clientId: clientId,
            phone: client.phone,
            message: message,
            scheduledDate: new Date().toISOString().split('T')[0]
        };
    },

    // Obtener información completa del cliente con documentos
    getClientFullProfile: (clientId) => {
        const client = dataUtils.getClientById(clientId);
        if (!client) return null;

        const judicialProcesses = dataUtils.getJudicialProcessesByClient(clientId);
        const extrajudicialProcesses = dataUtils.getExtrajudicialProcessesByClient(clientId);
        const alerts = dataUtils.getAlertsByClient(clientId);

        return {
            ...client,
            processes: {
                judicial: judicialProcesses,
                extrajudicial: extrajudicialProcesses
            },
            alerts: alerts,
            totalDebt: extrajudicialProcesses.reduce((total, process) => total + process.amount, 0),
            hasOverduePayments: extrajudicialProcesses.some(process => 
                process.status === "vencido" || dataUtils.getDaysUntilDue(process.dueDate) < 0
            )
        };
    }
};

// Exportar para uso global
window.mockData = mockData;
window.dataUtils = dataUtils;