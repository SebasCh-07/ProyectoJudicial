# Funciones de Pantallas - Sistema de Gestión Judicial

## 1. Pantalla de Login (index.html)

### Funciones Principales:
- **Autenticación de usuarios**: Validación de credenciales (usuario/contraseña)
- **Control de acceso**: Redirección según rol del usuario (admin/user)
- **Credenciales demo**: 
  - Admin: admin / admin123
  - Usuario: user / user123
- **Gestión de sesión**: Almacenamiento de datos de usuario en sessionStorage
- **Notificaciones**: Banner de notificaciones para mensajes del sistema

---

## 2. Dashboard Principal (dashboard.html)

### Funciones Principales:
- **Resumen general del sistema**: Métricas clave en tiempo real
- **Métricas principales**:
  - Total de clientes
  - Procesos judiciales activos
  - Procesos extrajudiciales activos
  - Porcentaje de efectividad
- **Gráficos y visualizaciones**:
  - Efectividad de contacto
  - Procesos por estado
  - Actividad mensual
- **Alertas urgentes**: Notificaciones de alta prioridad
- **Navegación rápida**: Enlaces directos a otras secciones

---

## 3. Panel de Administración (admin.html)

### Funciones Principales:

#### 3.1 Dashboard Admin
- **Métricas administrativas**: Vista completa del sistema
- **Enlaces directos**: Navegación rápida a módulos específicos
- **Gráficos avanzados**: Análisis detallado de rendimiento

#### 3.2 Gestión de Usuarios
- **CRUD de usuarios**: Crear, leer, actualizar y eliminar usuarios
- **Búsqueda en tiempo real**: Filtrado instantáneo de usuarios
- **Gestión de roles**: Asignación de permisos (admin/user)
- **Exportación de datos**: Descarga de listado de usuarios
- **Estados de usuario**: Activo/Inactivo

#### 3.3 Gestión de Clientes
- **CRUD de clientes**: Administración completa de clientes
- **Búsqueda y filtros**: Por nombre, documento, estado
- **Información detallada**: Documento, dirección, contacto
- **Estados de cliente**: Activo/Inactivo
- **Exportación**: Descarga de datos de clientes

#### 3.4 Procesos Judiciales
- **Gestión de casos judiciales**: Creación y seguimiento
- **Información del caso**: Número de caso, cliente, estado
- **Fechas importantes**: Inicio y última actualización
- **Estados del proceso**: En progreso, completado, suspendido
- **Exportación**: Reportes de procesos judiciales

#### 3.5 Procesos Extrajudiciales
- **Gestión de créditos**: Administración de cartera extrajudicial
- **Información financiera**: Monto, fecha de vencimiento
- **Estados del crédito**: Activo, vencido, pagado
- **Seguimiento**: Control de pagos y gestiones
- **Exportación**: Reportes de cartera

#### 3.6 Gestión de Asignaciones
- **Asignación de tareas**: Distribución de procesos a usuarios
- **Tipos de proceso**: Judicial/Extrajudicial
- **Estados de asignación**: Asignado, En Progreso, Completado
- **Niveles de prioridad**: Alta, Media, Baja
- **Búsqueda y filtros**: Por estado, usuario, tipo

#### 3.7 Calendario de Alertas
- **Vista mensual**: Calendario interactivo
- **Alertas programadas**: Gestión de recordatorios
- **Navegación temporal**: Mes anterior/siguiente
- **Lista de alertas**: Vista detallada de eventos programados
- **Creación de alertas**: Programación de nuevas notificaciones

#### 3.8 Panel de Notificaciones
- **Gestión de alertas**: Creación y administración
- **Búsqueda de alertas**: Filtrado por contenido
- **Tipos de alerta**: Urgente, Normal, Informativa
- **Estados**: Activa, Leída, Archivada
- **Exportación**: Reportes de alertas

#### 3.9 Configuración del Sistema
- **Parámetros generales**: Configuración de plazos y límites
- **Tipos de alerta**: Configuración de notificaciones (Email, SMS, Push)
- **Configuración de reportes**: Email y frecuencia automática
- **Mantenimiento**: Limpieza de datos y restauración de respaldos
- **Configuración de usuarios**: Límites y permisos

---

## 4. Gestión de Usuarios (usuarios.html)

### Funciones Principales:
- **Vista dedicada de usuarios**: Interfaz específica para gestión de usuarios
- **CRUD completo**: Todas las operaciones de usuario
- **Búsqueda avanzada**: Filtrado en tiempo real
- **Exportación de datos**: Descarga de información de usuarios
- **Gestión de roles**: Asignación y modificación de permisos

---

## 5. Gestión de Clientes (clientes.html)

### Funciones Principales:
- **Vista dedicada de clientes**: Interfaz específica para gestión de clientes
- **CRUD completo**: Todas las operaciones de cliente
- **Búsqueda y filtros**: Por múltiples criterios
- **Información completa**: Datos personales y de contacto
- **Estados de cliente**: Control de activación/desactivación
- **Exportación**: Descarga de datos de clientes

---

## 6. Procesos Judiciales (procesos-judiciales.html)

### Funciones Principales:
- **Vista dedicada de procesos judiciales**: Interfaz específica para casos judiciales
- **Gestión de casos**: Creación, edición y seguimiento
- **Información del proceso**: Número de caso, cliente, fechas
- **Estados del proceso**: Control del avance del caso
- **Exportación**: Reportes de procesos judiciales

---

## 7. Procesos Extrajudiciales (procesos-extrajudiciales.html)

### Funciones Principales:
- **Vista dedicada de procesos extrajudiciales**: Interfaz específica para cartera
- **Gestión de créditos**: Administración de deudas extrajudiciales
- **Información financiera**: Montos, fechas de vencimiento
- **Estados del crédito**: Control de pagos y gestiones
- **Exportación**: Reportes de cartera extrajudicial

---

## 8. Gestión de Asignaciones (asignaciones.html)

### Funciones Principales:
- **Vista dedicada de asignaciones**: Interfaz específica para tareas
- **Gestión de asignaciones**: Creación y distribución de tareas
- **Tipos de proceso**: Judicial y extrajudicial
- **Estados de asignación**: Seguimiento del progreso
- **Niveles de prioridad**: Clasificación de urgencia
- **Búsqueda y filtros**: Por múltiples criterios

---

## 9. Calendario (calendario.html)

### Funciones Principales:
- **Vista dedicada del calendario**: Interfaz específica para programación
- **Calendario mensual**: Vista interactiva del mes
- **Alertas programadas**: Gestión de recordatorios
- **Navegación temporal**: Cambio de mes
- **Lista de alertas**: Vista detallada de eventos
- **Creación de alertas**: Programación de nuevas notificaciones

---

## 10. Panel de Alertas (alertas.html)

### Funciones Principales:
- **Vista dedicada de alertas**: Interfaz específica para notificaciones
- **Gestión de alertas**: Creación y administración
- **Búsqueda de alertas**: Filtrado por contenido
- **Tipos de alerta**: Clasificación por urgencia
- **Estados de alerta**: Control de lectura y archivado
- **Exportación**: Reportes de alertas

---

## Funcionalidades Comunes en Todas las Pantallas

### Navegación:
- **Sidebar**: Menú lateral con acceso a todas las secciones
- **Breadcrumb**: Indicador de ubicación actual
- **Información de usuario**: Datos del usuario logueado

### Operaciones CRUD:
- **Crear**: Formularios para nuevos registros
- **Leer**: Tablas y listas de datos
- **Actualizar**: Edición de registros existentes
- **Eliminar**: Borrado de registros

### Búsqueda y Filtros:
- **Búsqueda en tiempo real**: Filtrado instantáneo
- **Filtros por estado**: Activo/Inactivo, etc.
- **Búsqueda por texto**: En múltiples campos

### Exportación:
- **Descarga de datos**: Exportación en formato compatible
- **Reportes**: Generación de informes

### Notificaciones:
- **Banner de notificaciones**: Mensajes del sistema
- **Alertas urgentes**: Notificaciones de alta prioridad

### Modales:
- **Formularios**: Creación y edición de registros
- **Confirmaciones**: Para operaciones críticas
- **Vista detallada**: Información completa de registros

---

## Roles y Permisos

### Administrador:
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y configuración del sistema
- Todas las operaciones CRUD
- Exportación de datos
- Configuración del sistema

### Usuario:
- Acceso limitado a funcionalidades básicas
- Gestión de sus propias asignaciones
- Consulta de datos asignados
- Operaciones limitadas según permisos

