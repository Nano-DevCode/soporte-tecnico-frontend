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

> *Las capturas de pantalla de la interfaz se encuentran organizadas en la carpeta `docs/screenshots/`.*

### Autenticación y Control de Sesiones
| Pantalla de Login | Recuperación de Contraseña |
| :---: | :---: |
| ![Login](docs/screenshots/01-auth/01-login.png) | ![Recuperar Contraseña](docs/screenshots/01-auth/02-forgot-password.png) |

| Gestión de Sesiones Activas (Redis) | Cambio de Contraseña y Preferencias |
| :---: | :---: |
| ![Sesiones](docs/screenshots/01-auth/03-active-sessions.png) | ![Configuración](docs/screenshots/01-auth/04-account-settings.png) |

---

### Mesa de Ayuda y Gestión de Tickets
| Listado de Tickets Actuales | Detalle de Incidencia con Stepper |
| :---: | :---: |
| ![Tickets Actuales](docs/screenshots/02-tickets/01-current-tickets.png) | ![Detalle Ticket](docs/screenshots/02-tickets/02-ticket-detail-stepper.png) |

| Levantamiento de Ticket | Levantamiento a Nombre de Tercero (On-Behalf) |
| :---: | :---: |
| ![Nuevo Ticket](docs/screenshots/02-tickets/03-create-ticket.png) | ![Ticket On-Behalf](docs/screenshots/02-tickets/04-ticket-on-behalf.png) |

| Modal de Asignación a Técnicos | Diagnóstico e Intervención en Sitio |
| :---: | :---: |
| ![Asignar Ticket](docs/screenshots/02-tickets/05-assign-ticket.png) | ![Intervención Técnica](docs/screenshots/02-tickets/06-intervene-ticket.png) |

---

### SLA y Trazabilidad (Auditoría)
| Tablero de Monitoreo Proactivo de SLA | Comparador de Cambios (Audit Diff Viewer) |
| :---: | :---: |
| ![Monitoreo SLA](docs/screenshots/03-sla-audit/01-sla-monitoring.png) | ![Auditoría Diff](docs/screenshots/03-sla-audit/02-audit-diff-dialog.png) |

---

### Activos TI, Inventario y Almacén
| Catálogo de Equipos de Cómputo | Ficha Técnica de Hardware |
| :---: | :---: |
| ![Inventario Equipos](docs/screenshots/04-inventory/01-equipment-catalog.png) | ![Ficha Técnica](docs/screenshots/04-inventory/02-equipment-specifications.png) |

| Control de Consumibles y Stock | Salida de Refacciones Vinculada a Ticket |
| :---: | :---: |
| ![Consumibles](docs/screenshots/04-inventory/03-consumables-stock.png) | ![Salida Almacén](docs/screenshots/04-inventory/04-consumable-output.png) |

---

### Analítica y Métricas ITSM
| KPIs Globales (MTTR, SLA, FCR) | Gráficos por Departamento e Incidencia |
| :---: | :---: |
| ![KPIs Dashboard](docs/screenshots/05-dashboard/01-kpi-summary.png) | ![Gráficos Recharts](docs/screenshots/05-dashboard/02-department-charts.png) |

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

