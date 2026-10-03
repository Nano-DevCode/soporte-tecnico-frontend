<div align="center">

# 🖥️ Soporte Técnico — Plataforma Integral de Service Desk & Gestión de Activos TI (ITSM)

**Plataforma web empresarial para la administración del ciclo de vida de incidencias técnicas, monitoreo proactivo de acuerdos de nivel de servicio (SLA), trazabilidad inmutable (Audit Trail) y control de inventario tecnológico.**

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443e38?logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

[Explorar Módulos](#-módulos-y-funcionalidades) • [Arquitectura](#-arquitectura-del-sistema) • [Roles y Permisos](#-matriz-de-control-de-acceso-rbac) • [Instalación](#-instalación-y-despliegue) • [Capturas](#-catálogo-visual-del-sistema) • [Equipo y Licencia](#-equipo-de-desarrollo-y-colaboradores)

</div>

---

## 📌 Visión General del Proyecto

Esta aplicación frontend fue diseñada bajo estándares **ITIL / ITSM** para centralizar, automatizar y digitalizar todas las operaciones de soporte tecnológico en centros de cómputo, universidades y dependencias corporativas. 

Permite coordinar desde la solicitud de auxilio técnico de un usuario final hasta el diagnóstico de laboratorio, la afectación de almacén con refacciones, la generación de oficios oficiales con folios institucionales y la medición en tiempo real de indicadores críticos de rendimiento (**MTTR, SLA, FCR y CSAT**).

```mermaid
graph TD
    User([👤 Usuario / Solicitante]) -->|Levanta Incidencia| CreateTicket[Módulo de Tickets]
    Sec([👩‍💼 Secretaria / Asistente]) -->|Levanta por Tercero| OnBehalf[Ticket On-Behalf]
    
    CreateTicket --> Router[Enrutamiento y Asignación]
    OnBehalf --> Router
    
    Router --> Tech([🔧 Cuadrilla de Técnicos])
    Tech --> Intervention[Diagnóstico e Intervención]
    
    Intervention -.->|Solicitud de Refacciones| Warehouse[Control de Consumibles]
    Intervention -.->|Préstamo de Herramientas| Tools[Módulo de Taller]
    Intervention -.->|Baja o Reparación Mayor| TechReports[Dictamen Técnico PDF]
    
    Intervention --> Resolution[Finalización y Cierre]
    Resolution --> Survey[Encuesta de Satisfacción CSAT]
    
    subgraph Monitorización Continua
        SLA[⏱️ Motor Proactivo de SLA]
        CDC[📜 Registro de Auditoría CDC]
        WS[⚡ Socket.io Realtime Events]
    end
    
    Resolution -.-> SLA
    Intervention -.-> CDC
    WS -.->|Alertas Push| Tech
```

---

## ✨ Características Principales

* ⚡ **Tiempo Real Bidireccional:** Comunicación instantánea con **Socket.io Client** acoplada a invalidación reactiva de caché en **React Query**, alertas flotantes con **Sonner**, Web Audio API y notificaciones nativas de escritorio (*zero-polling*).
* ⏱️ **Monitoreo Proactivo de SLA:** Alertas preventivas cuando un ticket consume más del 75% de su tiempo máximo de resolución y detección de violaciones críticas de acuerdos de servicio.
* 📜 **Auditoría y Trazabilidad Inmutable (CDC):** Explorador de cambios que compara valores anteriores vs. valores nuevos (*Diff Viewer*) para cada registro del sistema con IP, usuario y Request ID.
* 🔐 **Seguridad & Sesiones en Redis:** Control de acceso granular (**RBAC** con 9 perfiles), rotación silenciosa de *refresh tokens* ante errores 401 en Axios y revocación de sesiones remotas con un solo clic.
* 📦 **Gestión de Inventario & Almacén:** Fichas técnicas completas de hardware, control de stock de consumibles, lotes y kardex de movimientos.
* 📊 **Analítica de Alto Impacto:** Tableros visuales con **Recharts** que computan MTTR, disponibilidad de infraestructura, costo por incidente y gráficos de barras por departamento y tipología de falla.
* 🌐 **Internacionalización & Accesibilidad:** Soporte multilenguaje fluido con **i18next** (Español / Inglés), navegación asistida por teclado mediante paleta de comandos interactiva (`cmdk`) y temas Claro/Oscuro.

---

## 🏗️ Módulos y Funcionalidades

### 1. Gestión Integral de Tickets de Soporte
* **Creación Directa y Asistida:** Levantamiento de fallas con selección de ubicación de equipo, horario disponible, evidencias fotográficas/documentales y protección con claves de idempotencia (`UUIDv4`).
* **Creación a Nombre de Tercero (`on-behalf`):** Levantamiento delegado de incidentes para personal docente o directivo sin acceso inmediato a terminales.
* **Flujo de Trabajo Operativo:** Bandeja de tickets actuales, asignación individual o cuadrilla de técnicos, derivación interdepartamental, dictamen de intervención y cierre con folios de orden de trabajo (OT).
* **Gestión de Rechazos:** Registro de causales justificadas de rechazo de solicitudes con generación automática de acta institucional.
* **Trazabilidad en Detalle:** Stepper interactivo con línea temporal, actores involucrados, historial de intervenciones y descargas documentales.

### 2. Tablero de Monitoreo Proactivo de SLA (`/tickets/sla`)
* **KPIs Ejecutivos en Vivo:** Porcentaje global de cumplimiento, conteo de tickets dentro de plazo, en riesgo (`<25%` de tiempo restante) y vencidos.
* **Desglose por Prioridad:** Monitoreo diferenciado para incidentes Críticos (P1), Altos (P2), Medios (P3) y Bajos (P4).
* **Barras de Progreso Dinámicas:** Visualización porcentual del tiempo consumido, cálculo de horas restantes y formateo de plazos límite.
* **Evaluación Bajo Demanda:** Gatillo manual para disparar ciclos de evaluación y auditoría de alertas desde la interfaz.

### 3. Trazabilidad y Registro de Auditoría Global (`/audit-logs`)
* **Change Data Capture (CDC):** Historial inmutable de operaciones `CREATE`, `UPDATE` y `DELETE` sobre tickets, equipos, usuarios y catálogos.
* **Visor Diferencial (Diff Viewer):** Modal interactivo que resalta en verde los nuevos valores y en rojo los atributos previos modificados.
* **Metadatos de Seguridad:** Registro de dirección IP, navegador (User Agent), timestamp de servidor y `x-request-id` de trazabilidad distribuida.

### 4. Inventario de Activos Tecnológicos & Equipos
* **Ficha Técnica Detallada:** Registro de CPUs, RAM, almacenamiento, procesador, dirección MAC, marca, modelo y serie.
* **Asignación y Responsabilidad:** Vinculación de equipos con empleados y departamentos responsables.
* **Historial de Movimientos:** Control de traslados, mantenimientos de laboratorio y préstamos temporales.

### 5. Almacén de Consumibles y Refacciones
* **Control de Stock y Lotes:** Registro de compras por lote con alertas de stock mínimo para tóner, conectores, cables y discos.
* **Salida de Refacciones:** Despacho de consumibles con vinculación directa a folios de tickets o justificación de área.
* **Kardex:** Trazabilidad de entradas, salidas y existencias en tiempo real.

### 6. Herramientas de Taller & Préstamos
* Catálogo de herramientas especializadas (multímetros, ponchadoras, comprobadores de red).
* Préstamos temporales a personal técnico con registro de fechas y estado de devolución.

### 7. Documentación Oficial y Reportes Técnicos
* Emisión y edición de Dictámenes Técnicos de Desincorporación y Reparación.
* Generación de órdenes de trabajo (OT) y actas de entrega/respuesta en formato PDF.
* Reportes ejecutivos consolidados por periodo escolar y departamento.

### 8. Gestión de Folios Institucionales
* Control centralizado de secuencias numéricas y prefijos institucionales para Órdenes de Trabajo y Oficios de Respuesta por departamento.

### 9. Encuestas de Calidad y Satisfacción (CSAT)
* Constructor de reactivos y preguntas de evaluación de calidad de servicio.
* Formulario de satisfacción presentado al solicitante tras el cierre del incidente.

### 10. Dashboard Ejecutivo y Métricas ITSM
* Gráficos interactivos de MTTR (Mean Time to Resolution).
* Cumplimiento mensual de SLA frente a meta establecida.
* Tasa de resolución en primer nivel (First Level Resolution).
* Estimación de costos de servicio por incidente e historial de disponibilidad crítica.

---

## 👥 Matriz de Control de Acceso (RBAC)

La plataforma gobierna la visibilidad de rutas, botones y acciones mediante un sistema de permisos estricto que contempla 9 roles institucionales:

| Rol | Dashboard | Tickets | SLA | Auditoría | Inventario | Consumibles | Reportes | Catálogos |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **SuperAdmin** |  |  |  |  |  |  |  |  |
| **Jefe de Centro de Cómputo** |  |  |  | ❌ |  |  |  |  |
| **Coordinador de Soporte** |  |  |  | ❌ |  |  |  | ❌ |
| **Técnico de Soporte** |  |  |  | ❌ |  |  | ❌ | ❌ |
| **Jefe de Departamento** |  | 🟡 *(Propios)* | ❌ | ❌ | 🟡 *(Propios)* | ❌ | 🟡 | ❌ |
| **Secretaria de C.C.** | ❌ |  *(On-Behalf)* | ❌ | ❌ | ❌ |  | ❌ | ❌ |
| **Encargado de Inventario** | ❌ | ❌ | ❌ | ❌ |  |  | ❌ | ❌ |
| **Planeación** | ❌ | 🟡 *(Historial)* | ❌ | ❌ | 🟡 *(Consulta)* | ❌ |  | ❌ |
| **Visitante / Auditor** | ❌ | 🟡 *(Solo lectura)* | ❌ | ❌ | 🟡 *(Solo lectura)* | 🟡 | ❌ | ❌ |

---

## 💻 Pila Tecnológica

| Capa | Tecnologías |
| :--- | :--- |
| **Framework & Core** | **React 19**, **TypeScript**, **Vite 8** (con SWC) |
| **Estilos & UI Primitives** | **Tailwind CSS v4**, **Radix UI**, `@base-ui/react`, `lucide-react`, `tw-animate-css` |
| **Gestión de Estado** | **Zustand 5** (Auth & RBAC), **TanStack React Query 5** (Server State & Caching) |
| **Formularios & Validación** | **React Hook Form 7**, **Zod 4**, `@hookform/resolvers` |
| **Tablas & Visualización** | **TanStack Table 8**, **Recharts 3**, `react-day-picker` |
| **Tiempo Real & Conectividad** | **Socket.io Client 4**, **Axios 1.20** (con auto-rotación de refresh tokens) |
| **Internacionalización** | **i18next**, `react-i18next`, `i18next-browser-languagedetector` |
| **Feedback & Utilidades** | **Sonner** (Toasts), `date-fns`, `cmdk` (Command Palette), `uuid` |
| **Infraestructura & Servidor** | **Docker**, **Nginx** (Reverse Proxy SPA + WebSocket Upgrade) |

---

## 🚀 Instalación y Despliegue

### Requisitos Previos
* **Node.js:** `>= 20.x`
* **Gestor de Paquetes:** `pnpm` (`>= 9.x` recomendado) o `npm`
* **Backend:** Repositorio [soporte-tecnico-backend](https://github.com/Nano-DevCode/soporte-tecnico-backend) en ejecución.

### 1. Clonar el repositorio
```bash
git clone git@github-personal:Nano-DevCode/soporte-tecnico-frontend.git
cd soporte-tecnico-frontend
```

### 2. Configurar Variables de Entorno
Copia la plantilla `.env.template` a `.env`:
```bash
cp .env.template .env
```
Ajusta los endpoints según tu entorno:
```env
# Servidor local de desarrollo
VITE_API_URL_LOCAL=http://localhost:3000/api

# Servidor en red interna / intranet institucional
VITE_API_URL_INTERNAL=http://192.168.1.50:3000/api

# Servidor en producción
VITE_API_URL_EXTERNAL=https://tu-dominio-soporte.com/api

# Diagnóstico en consola (false en producción)
VITE_ENABLE_LOGS=false
```

### 3. Instalar Dependencias
```bash
pnpm install
```

### 4. Ejecutar en Modo Desarrollo
```bash
pnpm dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 5. Compilación de Producción
```bash
pnpm build
```
Genera los archivos optimizados listos para producción con *code-splitting* modular en el directorio `dist/`.

---

## 🐳 Despliegue con Docker y Nginx

La solución incluye un `Dockerfile` de múltiples etapas (*multi-stage build*) y un archivo `nginx.conf` optimizado con compresión, cabeceras seguras y soporte directo para el proxy de WebSockets y fallback de SPA:

```bash
# Construir y levantar contenedor con docker-compose
docker compose up -d --build
```

---

## 📸 Catálogo Visual del Sistema

> *El sistema cuenta con un catálogo exhaustivo de capturas de pantalla organizadas por módulos temáticos en la carpeta [`docs/screenshots/`](docs/screenshots/).*

### 1. Autenticación, Seguridad y Control de Sesiones
| Inicio de Sesión Institucional | Recuperación de Contraseña |
| :---: | :---: |
| ![Login](docs/screenshots/01-auth/01-login-screen.png) | ![Recuperar Contraseña](docs/screenshots/01-auth/03-forgot-password.png) |

| Seguridad y Sesiones Activas en Redis | Preferencias de Idioma y Cuenta |
| :---: | :---: |
| ![Sesiones Activas](docs/screenshots/01-auth/05-sessions-revocation.png) | ![Preferencias](docs/screenshots/01-auth/04-account-settings.png) |

| Perfil Personal del Usuario |
| :---: |
| ![Perfil de Usuario](docs/screenshots/01-auth/06-user-profile.png) |

---

### 2. Analítica Ejecutiva y Rendimiento de Técnicos
| Panel de Control Ejecutivo (Métricas ITSM) | Tablero de Rendimiento y Efectividad por Técnico |
| :---: | :---: |
| ![Dashboard Overview](docs/screenshots/02-dashboard/01-dashboard-overview.png) | ![KPI de Técnicos](docs/screenshots/02-dashboard/07-technicians-kpi-board.png) |

---

### 3. Mesa de Ayuda y Ciclo de Vida del Ticket
| Bandeja de Tickets Actuales en Seguimiento | Historial Maestro de Incidencias |
| :---: | :---: |
| ![Tickets Actuales](docs/screenshots/03-tickets/01-current-tickets-list.png) | ![Historial Tickets](docs/screenshots/03-tickets/02-all-tickets-history.png) |

| Formulario de Levantamiento Directo | Levantamiento a Nombre de Tercero (On-Behalf) |
| :---: | :---: |
| ![Crear Ticket](docs/screenshots/03-tickets/04-create-ticket-form.png) | ![Ticket On-Behalf](docs/screenshots/03-tickets/05-create-ticket-on-behalf.png) |

| Detalle Técnico de la Incidencia | Línea de Tiempo Dinámica (Stepper de Fases) |
| :---: | :---: |
| ![Detalle Ticket](docs/screenshots/03-tickets/06-ticket-detail-view.png) | ![Stepper](docs/screenshots/03-tickets/07-ticket-stepper-timeline.png) |

| Asignación de Cuadrilla de Técnicos | Canalización / Derivación entre Áreas |
| :---: | :---: |
| ![Asignar Técnico](docs/screenshots/03-tickets/08-assign-ticket-modal.png) | ![Canalizar Ticket](docs/screenshots/03-tickets/09-route-ticket-modal.png) |

| Diagnóstico y Bitácora de Intervención Técnica | Conclusión del Servicio y Orden de Trabajo |
| :---: | :---: |
| ![Intervención Técnica](docs/screenshots/03-tickets/10-intervene-ticket-form.png) | ![Cierre Ticket](docs/screenshots/03-tickets/11-finish-ticket-form.png) |

| Encuesta de Satisfacción del Usuario (CSAT) | Diálogo de Rechazo Justificado |
| :---: | :---: |
| ![Encuesta CSAT](docs/screenshots/03-tickets/14-service-survey-modal.png) | ![Rechazar Ticket](docs/screenshots/03-tickets/12-reject-ticket-dialog.png) |

| Formato Oficial de Solicitud de Soporte (PDF) | Orden de Trabajo de Mantenimiento (PDF) |
| :---: | :---: |
| ![Formato Solicitud PDF](docs/screenshots/03-tickets/13-ticket-documents-tab.png) | ![Orden de Trabajo PDF](docs/screenshots/03-tickets/16-work-order-document-pdf.png) |

---

### 4. Monitoreo Proactivo de Acuerdos de Nivel de Servicio (SLA)
| Tablero General de Monitoreo de SLA en Tiempo Real | Tabla de Conteo Regresivo y Barras de Consumo |
| :---: | :---: |
| ![Monitoreo SLA](docs/screenshots/04-sla/01-sla-dashboard-view.png) | ![Cuenta Regresiva SLA](docs/screenshots/04-sla/03-sla-countdown-table.png) |

---

### 5. Auditoría Inmutable y Trazabilidad CDC (Change Data Capture)
| Historial Global de Modificaciones (Audit Logs) | Comparador Diferencial de Cambios (Diff Viewer) |
| :---: | :---: |
| ![Tabla Auditoría](docs/screenshots/05-audit/01-audit-logs-table.png) | ![Diff Viewer](docs/screenshots/05-audit/02-audit-diff-dialog.png) |

| Visor de Payload Completo Estructurado (JSON) |
| :---: |
| ![Visor JSON](docs/screenshots/05-audit/03-audit-json-viewer.png) |

---

### 6. Activos TI e Inventario de Cómputo
| Catálogo de Activos Tecnológicos del C.C. | Ficha Técnica de Hardware |
| :---: | :---: |
| ![Activos TI](docs/screenshots/06-equipments/03-it-assets-catalog.png) | ![Ficha Hardware](docs/screenshots/06-equipments/02-equipment-detail-card.png) |

| Bitácora Histórica de Movimientos | Formato Digital de Resguardo / Traslado |
| :---: | :---: |
| ![Movimientos Activos](docs/screenshots/06-equipments/05-it-assets-movements.png) | ![Detalle Movimiento](docs/screenshots/06-equipments/06-it-assets-movement-view.png) |

---

### 7. Almacén de Consumibles y Refacciones
| Inventario de Consumibles y Alertas de Stock | Registro de Lote / Recepción de Remesa |
| :---: | :---: |
| ![Stock Consumibles](docs/screenshots/07-consumables/01-consumables-stock-list.png) | ![Entrada Lote](docs/screenshots/07-consumables/02-consumable-batch-create.png) |

| Despacho / Salida de Refacciones por Incidencia | Kardex Completo de Movimientos de Almacén |
| :---: | :---: |
| ![Salida Consumibles](docs/screenshots/07-consumables/03-consumable-output-form.png) | ![Kardex Consumibles](docs/screenshots/07-consumables/04-consumable-kardex-history.png) |

---

### 8. Herramientas de Taller & Préstamos
| Catálogo de Herramientas de Trabajo | Control de Préstamos y Devoluciones |
| :---: | :---: |
| ![Catálogo Herramientas](docs/screenshots/08-tools/01-tools-catalog.png) | ![Bitácora Herramientas](docs/screenshots/08-tools/02-tools-movement-history.png) |

---

### 9. Reportes Técnicos, Folios y Gobernanza Institucional
| Base de Conocimiento de Bitácoras de Intervención | Exportación de Reportes Ejecutivos a Excel |
| :---: | :---: |
| ![Base de Conocimiento](docs/screenshots/09-reports-folios/01-technical-reports-list.png) | ![Reportes Excel](docs/screenshots/09-reports-folios/03-executive-reports-page.png) |

| Configuración de Folios y Prefijos por Departamento | Catálogo de Departamentos y Prioridades |
| :---: | :---: |
| ![Folios Departamento](docs/screenshots/09-reports-folios/04-folios-departments-list.png) | ![Departamentos](docs/screenshots/10-admin-governance/03-departments-catalog.png) |

| Gestión de Periodos Escolares y Folios Activos | Administración de Jefaturas del Centro de Cómputo |
| :---: | :---: |
| ![Periodos Escolares](docs/screenshots/10-admin-governance/04-school-periods-manager.png) | ![Jefes CC](docs/screenshots/10-admin-governance/05-center-managers-history.png) |

---

### 10. Experiencia de Usuario y Accesibilidad
| Interfaz en Tema Oscuro (Dark Theme) | Selector Dinámico de Idioma (Español / Inglés) |
| :---: | :---: |
| ![Tema Oscuro](docs/screenshots/11-ui-features/01-dark-mode-theme.png) | ![Selector Idioma](docs/screenshots/11-ui-features/02-language-switcher.png) |

---

## 👥 Equipo de Desarrollo

El diseño, arquitectura, desarrollo técnico e implementación de este sistema fue realizado por el siguiente equipo:

| Desarrollador / Colaborador | Rol | Perfil & Contacto |
| :--- | :--- | :--- |
| **Nano-DevCode** | Lead Developer & Arquitectura Frontend | [![GitHub](https://img.shields.io/badge/GitHub-Nano--DevCode-181717?style=flat&logo=github)](https://github.com/Nano-DevCode)<br>📧 `mayka708.ms@gmail.com` |
| **AlexDro360** | Frontend Developer | [![GitHub](https://img.shields.io/badge/GitHub-AlexDro360-181717?style=flat&logo=github)](https://github.com/AlexDro360)<br>🎓 `21160666@itoaxaca.edu.mx` |
| **JazminMartinezC** | Frontend Developer | [![GitHub](https://img.shields.io/badge/GitHub-JazminMartinezC-181717?style=flat&logo=github)](https://github.com/JazminMartinezC)<br>🎓 `21160705@itoaxaca.edu.mx` |

---

## 📄 Derechos de Autor y Licencia

**Copyright © 2024–2026 Equipo de Desarrollo. Todos los derechos reservados.**

> [!IMPORTANT]
> **Aviso de Titularidad de Derechos y Uso Institucional:**  
> **Nuestro equipo de desarrollo es el titular y propietario exclusivo de la totalidad de los derechos de autor, derechos patrimoniales y propiedad intelectual** derivados de esta plataforma, su código fuente, arquitectura, módulos, diseño de interfaz y esquemas de datos.
> 
> Este sistema fue diseñado, desarrollado e implementado como una solución integral de Service Desk e ITSM para una **institución educativa y pública**.
> 
> **Condiciones de Uso y Restricciones:**  
> Queda estrictamente prohibida la copia, reproducción, distribución, comercialización, modificación no autorizada o sublicenciamiento total o parcial de este software sin la previa autorización explícita y por escrito de los titulares de los derechos de autor. Todos los derechos reservados.

