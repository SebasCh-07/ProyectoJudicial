# Sistema de Gestión Judicial - Extrajudicial

## Descripción

Sistema completo de gestión para procesos judiciales y extrajudiciales con funcionalidades avanzadas de seguimiento, notificaciones automáticas y gestión de clientes.

## Características Implementadas

### 🎯 Gráfico de Efectividad
- **Gráfico de contacto vs conversión**: Muestra cuántos clientes fueron contactados vs cuántos se convirtieron en clientes efectivos
- **Métricas en tiempo real**: Dashboard actualizado con estadísticas de efectividad
- **Visualización clara**: Gráfico tipo doughnut con porcentajes y tooltips informativos

### 👥 Gestión Completa de Clientes
- **Información personal extendida**: Nombres completos, CI, fecha de nacimiento, estado civil, profesión, ingresos
- **Múltiples direcciones**: Principal, laboral, comercial con verificación de estado
- **Búsqueda avanzada**: Por nombre completo o número de CI
- **Integración con Google Maps**: Ubicación automática basada en dirección con coordenadas

### 🌳 Árbol Genealógico
- **Información familiar completa**:
  - Padre: Nombre completo, CI, teléfono, dirección
  - Madre: Nombre completo, CI, teléfono, dirección
  - Cónyuge: Información completa de pareja/esposo(a)
  - Hijos: Datos completos incluyendo edad
  - Hermanos: Información de contacto y ubicación
- **Vista organizada**: Pestañas separadas para fácil navegación

### 💰 Documentos Financieros
- **Pagaré**: Número, monto, fechas de firma y vencimiento, documento digital
- **Desembolso**: Monto, fecha, método de pago, datos bancarios
- **Tabla de amortización**: Cuotas detalladas con capital, interés, fechas y estado de pago
- **Descarga de documentos**: Simulación de descarga de archivos PDF

### 👨‍💼 Sistema de Roles y Asignaciones
#### Administrador:
- Asignar procesos a usuarios específicos
- Definir prioridades (Alta, Media, Baja)
- Establecer fechas límite
- Agregar notas e instrucciones
- Seguimiento del estado de asignaciones

#### Usuario:
- Recibir asignaciones de procesos
- Ver información completa del proceso asignado
- Actualizar estado de la asignación
- Subir archivos relacionados al proceso
- Agregar notas de progreso

### 📁 Sistema de Carga de Archivos
- **Tipos de archivo**: Recibos, notas, documentos, evidencias
- **Formatos soportados**: PDF, DOC, DOCX, JPG, PNG, TXT
- **Validación**: Tamaño máximo 10MB
- **Organización**: Archivos organizados por proceso
- **Descripciones**: Cada archivo incluye descripción detallada

### 🚨 Sistema de Notificaciones y Alertas

#### Alertas Urgentes para Admin:
- **Créditos vencidos**: Notificación automática con días de retraso
- **Próximos vencimientos**: Alertas 2 días antes del vencimiento
- **Actualización automática**: Cada 5 minutos en el dashboard
- **Acciones rápidas**: Ver cliente y enviar SMS directo

#### Mensajes Automáticos:
- **Recordatorios automáticos**: 2 días antes del vencimiento para créditos nuevos
- **Horario comercial**: Solo envía mensajes entre 9:00 AM - 6:00 PM
- **Personalización**: Mensajes personalizados por cliente
- **Registro**: Historial de mensajes enviados

### 📅 Calendario de Alertas Programadas
- **Vista de calendario**: Interfaz visual para programar alertas
- **Tipos de alerta**: Audiencias, seguimientos, pagos, documentos, reuniones
- **Asignación**: Asignar alertas a usuarios específicos
- **Recordatorios**: Configurables (1 hora a 1 semana antes)
- **Navegación**: Por meses con vista completa de eventos

## Estructura del Sistema

### Autenticación
- **Admin**: admin / admin123
- **Usuario**: user / user123

### Navegación por Roles

#### Panel Administrador:
1. Dashboard con alertas urgentes
2. Gestión de usuarios
3. Gestión completa de clientes
4. Procesos judiciales
5. Procesos extrajudiciales
6. Sistema de asignaciones
7. Calendario de alertas
8. Panel de alertas
9. Reportes y métricas
10. Configuración

#### Panel Usuario:
1. Dashboard personal
2. Ver clientes (solo lectura)
3. Ver procesos
4. Mis asignaciones
5. Cargar archivos
6. Alertas personales
7. Reportes

## Funcionalidades Técnicas

### Búsqueda Avanzada
- Búsqueda en tiempo real por nombre o CI
- Filtros por estado (activo/inactivo)
- Resultados instantáneos sin recarga de página

### Notificaciones Dinámicas
- Sistema de notificaciones en tiempo real
- Diferentes tipos: éxito, error, información, advertencia
- Auto-ocultado después de 5 segundos
- Posicionamiento fijo en la parte superior

### Gestión de Estados
- Estados de procesos: Vigente, Vencido, Cancelado
- Estados de asignaciones: Asignado, En Progreso, Completado
- Actualización automática de métricas

### Exportación de Datos
- Exportación a CSV de todas las entidades
- Respaldo completo del sistema en JSON
- Restauración de datos desde archivo

## Instalación y Uso

1. Abrir `index.html` en un navegador web
2. Usar credenciales de demo para acceder
3. Navegar por las diferentes secciones según el rol

## Notas Técnicas

- **Google Maps**: Requiere API key válida (reemplazar YOUR_API_KEY)
- **Datos**: Simulados con localStorage para persistencia
- **Responsive**: Adaptado para dispositivos móviles
- **Accesibilidad**: Soporte para lectores de pantalla y navegación por teclado

## Próximas Mejoras Sugeridas

- Integración con API real de mensajería SMS
- Conexión con base de datos real
- Autenticación con JWT
- Notificaciones push en tiempo real
- Integración con sistemas bancarios
- Reportes PDF automáticos

---

**Desarrollado para gestión eficiente de procesos judiciales y extrajudiciales con enfoque en la recuperación de cartera.**