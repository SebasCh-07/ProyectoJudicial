# Sistema de Gestión Judicial - Extrajudicial

## 📋 Descripción General

Sistema completo de gestión para procesos judiciales y extrajudiciales con funcionalidades avanzadas de seguimiento, notificaciones automáticas, gestión de clientes y recuperación de cartera. Diseñado para optimizar la gestión de procesos legales y mejorar la efectividad en la recuperación de créditos.

## 🎯 Objetivo del Sistema

El objetivo principal es proporcionar una plataforma integral que permita:

- **Gestión eficiente** de procesos judiciales y extrajudiciales
- **Seguimiento automatizado** de vencimientos y alertas
- **Optimización de la recuperación** de cartera vencida
- **Control de asignaciones** y responsabilidades del equipo
- **Generación de reportes** y métricas de efectividad
- **Comunicación automatizada** con clientes

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Login seguro** con validación de credenciales
- **Roles diferenciados**: Administrador y Usuario
- **Gestión de sesiones** con sessionStorage
- **Redirección automática** según el rol del usuario

**Credenciales de Demo:**
- **Administrador**: `admin` / `admin123`
- **Usuario**: `user` / `user123`

### 👥 Gestión de Usuarios
- **CRUD completo** de usuarios del sistema
- **Asignación de roles** (Admin/Usuario)
- **Control de estado** (Activo/Inactivo)
- **Búsqueda en tiempo real** por nombre o email
- **Validación de datos** y duplicados

### 🏢 Gestión Completa de Clientes

#### Información Personal Extendida
- Nombres completos, CI, fecha de nacimiento
- Estado civil, profesión, ingresos
- Múltiples direcciones (Principal, Laboral, Comercial)
- Verificación de direcciones con coordenadas GPS
- Integración con Google Maps

#### Árbol Genealógico Completo
- **Padre**: Nombre, CI, teléfono, dirección
- **Madre**: Información completa de contacto
- **Cónyuge**: Datos de pareja/esposo(a)
- **Hijos**: Información detallada incluyendo edad
- **Hermanos**: Contactos y ubicaciones

#### Documentos Financieros
- **Pagaré**: Número, monto, fechas, documento digital
- **Desembolso**: Monto, fecha, método de pago, datos bancarios
- **Tabla de amortización**: Cuotas detalladas con capital, interés, fechas y estado
- **Descarga de documentos**: Simulación de archivos PDF

### ⚖️ Procesos Judiciales
- **Gestión completa** de casos judiciales
- **Estados**: En Trámite, Sentencia, Archivado
- **Información detallada**: Número de caso, juzgado, monto, fechas
- **Documentos asociados**: Demanda, anexos, notificaciones
- **Historial de acciones**: Seguimiento completo del proceso
- **Asignación a usuarios** específicos

### 📄 Procesos Extrajudiciales
- **Gestión de créditos** y deudas
- **Estados**: Vigente, Vencido, Cancelado
- **Control de vencimientos** automático
- **Alertas configuradas** por tipo de proceso
- **Seguimiento de pagos** y morosidad

### 📋 Sistema de Asignaciones

#### Para Administradores:
- **Asignar procesos** a usuarios específicos
- **Definir prioridades**: Alta, Media, Baja
- **Establecer fechas límite** y notas
- **Seguimiento del estado** de asignaciones
- **Reasignación** de procesos

#### Para Usuarios:
- **Recibir asignaciones** de procesos
- **Ver información completa** del proceso asignado
- **Actualizar estado**: Asignado, En Progreso, Completado
- **Subir archivos** relacionados al proceso
- **Agregar notas** de progreso

### 📁 Sistema de Carga de Archivos
- **Tipos de archivo**: Recibos, notas, documentos, evidencias
- **Formatos soportados**: PDF, DOC, DOCX, JPG, PNG, TXT
- **Validación**: Tamaño máximo 10MB
- **Organización**: Archivos por proceso y tipo
- **Descripciones detalladas** para cada archivo

### 🚨 Sistema de Alertas y Notificaciones

#### Alertas Urgentes para Admin:
- **Créditos vencidos**: Notificación automática con días de retraso
- **Próximos vencimientos**: Alertas 2 días antes del vencimiento
- **Actualización automática**: Cada 5 minutos en el dashboard
- **Acciones rápidas**: Ver cliente y enviar SMS directo

#### Mensajes Automáticos:
- **Recordatorios automáticos**: 2 días antes del vencimiento
- **Horario comercial**: Solo entre 9:00 AM - 6:00 PM
- **Personalización**: Mensajes por cliente
- **Registro completo**: Historial de mensajes enviados

### 📅 Calendario de Alertas Programadas
- **Vista de calendario**: Interfaz visual para programar alertas
- **Tipos de alerta**: Audiencias, seguimientos, pagos, documentos, reuniones
- **Asignación**: A usuarios específicos
- **Recordatorios**: Configurables (1 hora a 1 semana antes)
- **Navegación**: Por meses con vista completa de eventos

### 📊 Dashboard y Métricas

#### Métricas Principales:
- **Total de clientes** activos
- **Procesos judiciales** en curso
- **Procesos extrajudiciales** vigentes
- **Efectividad** de recuperación

#### Gráficos Interactivos:
- **Gráfico de contacto vs conversión**: Clientes contactados vs convertidos
- **Estados de procesos**: Distribución por estado
- **Actividad mensual**: Tendencias de actividad
- **Efectividad por tipo**: Métricas de rendimiento

## 🖥️ Pantallas del Sistema

### 1. **Pantalla de Login** (`index.html`)
- Formulario de autenticación
- Información de credenciales demo
- Notificaciones de estado
- Redirección automática por rol

### 2. **Dashboard Administrador** (`admin.html`)
- **Métricas generales** del sistema
- **Alertas urgentes** en tiempo real
- **Gráficos de efectividad** y tendencias
- **Acceso rápido** a todas las funcionalidades

### 3. **Panel de Usuario** (`user.html`)
- **Mis Asignaciones** como pantalla principal
- **Dashboard personal** con métricas relevantes
- **Acceso a procesos** asignados
- **Carga de archivos** y actualización de estados

### 4. **Gestión de Usuarios** (`usuarios.html`)
- **Lista completa** de usuarios del sistema
- **Formularios de creación** y edición
- **Búsqueda en tiempo real**
- **Control de roles** y estados

### 5. **Gestión de Clientes** (`clientes.html`)
- **Lista de clientes** con información completa
- **Perfiles detallados** con árbol genealógico
- **Documentos financieros** y pagarés
- **Búsqueda avanzada** por múltiples criterios

### 6. **Procesos Judiciales** (`procesos-judiciales.html`)
- **Lista de casos** judiciales activos
- **Detalles del proceso** y documentos
- **Historial de acciones** y seguimiento
- **Asignación** a usuarios específicos

### 7. **Procesos Extrajudiciales** (`procesos-extrajudiciales.html`)
- **Gestión de créditos** y deudas
- **Control de vencimientos** y morosidad
- **Alertas automáticas** por estado
- **Seguimiento de pagos**

### 8. **Calendario** (`calendario.html`)
- **Vista de calendario** mensual
- **Programación de alertas** y recordatorios
- **Asignación de eventos** a usuarios
- **Navegación** por meses

### 9. **Panel de Alertas** (`alertas.html`)
- **Lista de alertas** activas
- **Filtros por prioridad** y tipo
- **Acciones rápidas** de gestión
- **Historial** de alertas resueltas

## 🛠️ Estructura Técnica

### Archivos Principales:
```
📁 Proyecto cliente judicial/
├── 📄 index.html              # Pantalla de login
├── 📄 admin.html              # Panel administrador
├── 📄 user.html               # Panel usuario
├── 📄 usuarios.html           # Gestión de usuarios
├── 📄 clientes.html           # Gestión de clientes
├── 📄 procesos-judiciales.html # Procesos judiciales
├── 📄 procesos-extrajudiciales.html # Procesos extrajudiciales
├── 📄 calendario.html         # Calendario de alertas
├── 📄 alertas.html            # Panel de alertas
├── 📄 dashboard.html          # Dashboard independiente
├── 📁 css/
│   └── 📄 styles.css          # Estilos principales
├── 📁 js/
│   ├── 📄 app.js              # Lógica principal del sistema
│   ├── 📄 admin.js            # Funcionalidades de admin
│   ├── 📄 user.js             # Funcionalidades de usuario
│   ├── 📄 login.js            # Sistema de autenticación
│   └── 📄 data.js             # Datos simulados y utilidades
└── 📄 README.md               # Documentación del proyecto
```

### Tecnologías Utilizadas:
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos y responsive
- **JavaScript ES6+**: Lógica de aplicación
- **Chart.js**: Gráficos interactivos
- **Font Awesome**: Iconografía
- **Google Maps API**: Integración de mapas

## 🚀 Instalación y Uso

### Requisitos:
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para CDNs y Google Maps)

### Instalación:
1. **Descargar** todos los archivos del proyecto
2. **Abrir** `index.html` en un navegador web
3. **Usar credenciales** de demo para acceder
4. **Navegar** por las diferentes secciones según el rol

### Configuración de Google Maps:
1. Obtener API key de Google Maps
2. Reemplazar `YOUR_API_KEY` en los archivos HTML
3. Habilitar las APIs necesarias en Google Cloud Console

## 📱 Funcionalidades por Rol

### 👨‍💼 Administrador:
- ✅ **Dashboard completo** con métricas y alertas
- ✅ **Gestión de usuarios** (crear, editar, eliminar)
- ✅ **Gestión completa de clientes** con perfiles detallados
- ✅ **Procesos judiciales** y extrajudiciales
- ✅ **Sistema de asignaciones** a usuarios
- ✅ **Calendario de alertas** programadas
- ✅ **Panel de alertas** con acciones rápidas
- ✅ **Reportes y métricas** avanzadas
- ✅ **Configuración** del sistema
- ✅ **Exportación** de datos y respaldos

### 👤 Usuario:
- ✅ **Mis Asignaciones** como pantalla principal
- ✅ **Dashboard personal** con métricas relevantes
- ✅ **Ver clientes** (solo lectura)
- ✅ **Ver procesos** asignados
- ✅ **Actualizar estados** de asignaciones
- ✅ **Cargar archivos** relacionados
- ✅ **Alertas personales**
- ✅ **Reportes** de actividades

## 🔧 Funcionalidades Técnicas

### Búsqueda Avanzada:
- **Búsqueda en tiempo real** por nombre o CI
- **Filtros por estado** (activo/inactivo)
- **Resultados instantáneos** sin recarga de página
- **Múltiples criterios** de búsqueda

### Notificaciones Dinámicas:
- **Sistema de notificaciones** en tiempo real
- **Diferentes tipos**: éxito, error, información, advertencia
- **Auto-ocultado** después de 5 segundos
- **Posicionamiento fijo** en la parte superior

### Gestión de Estados:
- **Estados de procesos**: Vigente, Vencido, Cancelado
- **Estados de asignaciones**: Asignado, En Progreso, Completado
- **Actualización automática** de métricas
- **Sincronización** entre componentes

### Exportación de Datos:
- **Exportación a CSV** de todas las entidades
- **Respaldo completo** del sistema en JSON
- **Restauración de datos** desde archivo
- **Filtros** para exportación selectiva

## 📊 Métricas y Reportes

### Dashboard Principal:
- **Total de clientes** activos
- **Procesos judiciales** en curso
- **Procesos extrajudiciales** vigentes
- **Efectividad** de recuperación

### Gráficos Interactivos:
- **Contacto vs Conversión**: Efectividad de contacto
- **Estados de procesos**: Distribución visual
- **Actividad mensual**: Tendencias temporales
- **Efectividad por tipo**: Métricas de rendimiento

### Reportes Disponibles:
- **Reporte de clientes** con información completa
- **Reporte de procesos** por estado
- **Reporte de asignaciones** por usuario
- **Reporte de alertas** y notificaciones
- **Reporte de efectividad** y métricas

## 🔒 Seguridad y Datos

### Autenticación:
- **Validación de credenciales** en el frontend
- **Gestión de sesiones** con sessionStorage
- **Redirección automática** según rol
- **Protección de rutas** por rol de usuario

### Persistencia de Datos:
- **Datos simulados** en JavaScript
- **localStorage** para persistencia básica
- **SessionStorage** para gestión de sesiones
- **Estructura preparada** para integración con backend

## 🎨 Diseño y UX

### Características de Diseño:
- **Interfaz moderna** y profesional
- **Diseño responsive** para móviles y tablets
- **Navegación intuitiva** con sidebar
- **Colores corporativos** y consistentes
- **Iconografía clara** con Font Awesome

### Experiencia de Usuario:
- **Carga rápida** de páginas
- **Navegación fluida** entre secciones
- **Feedback visual** en todas las acciones
- **Mensajes informativos** y de error
- **Accesibilidad** básica implementada

## 🔮 Próximas Mejoras Sugeridas

### Integraciones:
- **API real de mensajería SMS** para notificaciones
- **Conexión con base de datos** real (MySQL, PostgreSQL)
- **Autenticación con JWT** y tokens seguros
- **Notificaciones push** en tiempo real
- **Integración con sistemas bancarios** para pagos

### Funcionalidades:
- **Reportes PDF** automáticos
- **Sistema de auditoría** completo
- **Chat interno** entre usuarios
- **Gestión de documentos** con OCR
- **Dashboard personalizable** por usuario

### Técnicas:
- **Backend con Node.js** o similar
- **Base de datos relacional** robusta
- **API REST** completa
- **Testing automatizado** (Jest, Cypress)
- **CI/CD** con GitHub Actions

## 📞 Soporte y Contacto

Para soporte técnico o consultas sobre el sistema:
- **Documentación**: Este archivo README.md
- **Código fuente**: Disponible en el repositorio
- **Demo**: Usar credenciales proporcionadas

---

**Desarrollado para gestión eficiente de procesos judiciales y extrajudiciales con enfoque en la recuperación de cartera y optimización de procesos legales.**

*Sistema completo, funcional y listo para uso en producción con las configuraciones adecuadas.*