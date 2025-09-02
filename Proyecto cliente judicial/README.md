# Sistema de Gestión de Recuperación de Cartera Judicial y Extrajudicial

## Descripción
Prototipo funcional de un sistema de gestión para la recuperación de cartera judicial y extrajudicial. Este sistema permite gestionar clientes, procesos judiciales, procesos extrajudiciales, alertas y reportes de manera integral.

## Características Principales

### 🔐 Autenticación
- Sistema de login con roles (admin/user)
- Credenciales de demo:
  - **Admin**: `admin` / `admin123`
  - **Usuario**: `user` / `user123`

### 📊 Dashboard
- Métricas generales del sistema
- Gráficos de procesos por estado
- Actividad mensual del sistema

### 👥 Gestión de Usuarios (Solo Admin)
- Lista de usuarios del sistema
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Gestión de roles y estados

### 👤 Gestión de Clientes
- Lista completa de clientes
- Búsqueda y filtros por estado
- Ficha detallada del cliente con:
  - Información personal
  - Referencias familiares
  - Procesos asociados
  - Documentos

### ⚖️ Procesos Judiciales
- Lista de procesos judiciales
- Estados: En Trámite, Sentencia, Archivado
- Detalle completo con historial y documentos
- Gestión de estados y actualizaciones

### 📋 Procesos Extrajudiciales
- Lista de créditos y procesos extrajudiciales
- Estados: Vigente, Vencido, Cancelado
- Sistema de alertas configuradas
- Gestión de fechas de vencimiento

### �� Panel de Alertas
- Alertas activas del sistema
- Prioridades: Alta, Media, Baja
- Filtrado por tipo y destinatario
- Notificaciones en tiempo real

### 📈 Reportes y Métricas
- Gráficos de efectividad por tipo
- Distribución de estados
- Tendencia de recuperación
- Filtros por período

### ⚙️ Configuración
- Parámetros generales del sistema
- Tipos de alertas habilitadas
- Configuración de reportes automáticos
- Personalización de plazos

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficos**: Chart.js
- **Iconos**: Font Awesome
- **Datos**: Mock data en JavaScript
- **Arquitectura**: SPA (Single Page Application)

## Estructura del Proyecto



## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere servidor web ni base de datos

### Pasos para ejecutar
1. Descargar o clonar el proyecto
2. Abrir el archivo `index.html` en el navegador
3. Usar las credenciales de demo para acceder

### Navegación
- **Sidebar**: Navegación principal entre secciones
- **Breadcrumb**: Ubicación actual en el sistema
- **Modales**: Para edición y visualización de detalles
- **Notificaciones**: Banner superior para mensajes del sistema

## Funcionalidades Simuladas

### CRUD Operations
- Todos los formularios simulan guardado con `console.log`
- Los datos se mantienen en memoria durante la sesión
- Las operaciones de eliminación muestran confirmación

### Búsqueda y Filtros
- Búsqueda en tiempo real de clientes
- Filtros por estado y tipo
- Actualización dinámica de tablas

### Gráficos y Reportes
- Gráficos responsivos con Chart.js
- Datos simulados para demostración
- Filtros por período de tiempo

## Personalización

### Colores y Estilos
- Paleta de colores neutra (blanco, gris, azul)
- CSS modular y fácil de personalizar
- Diseño responsivo para diferentes dispositivos

### Datos Simulados
- Modificar `js/data.js` para cambiar datos de ejemplo
- Agregar nuevos tipos de procesos o estados
- Personalizar métricas y reportes

## Extensibilidad

### Nuevas Funcionalidades
- Agregar nuevas secciones al sidebar
- Implementar nuevos tipos de reportes
- Integrar con APIs externas

### Base de Datos
- Reemplazar mock data con llamadas a API
- Implementar persistencia de datos
- Agregar autenticación real

## Notas de Desarrollo

- El sistema está diseñado como prototipo funcional
- Toda la funcionalidad está implementada en el frontend
- Los datos se reinician al recargar la página
- Ideal para demostraciones y pruebas de concepto

## Soporte

Para preguntas o sugerencias sobre el prototipo, revisar el código fuente o contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Fecha**: Diciembre 2024  
**Tipo**: Prototipo Funcional