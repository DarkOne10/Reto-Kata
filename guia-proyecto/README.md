# 🛍️ Tienda-Online

Una aplicación web moderna de comercio electrónico construida con Next.js y NestJS, utilizando Prisma como ORM.

## 🚀 Características Principales

- **Gestión de Productos**
  - ✅ Listado de productos con interfaz moderna y responsiva
  - ✅ Creación de nuevos productos
  - ✅ Edición de productos existentes
  - ✅ Eliminación de productos
  - ✅ Vista detallada de productos
  - ✅ Control de inventario automático

- **Interfaz de Usuario**
  - ✅ Diseño moderno y responsivo con Tailwind CSS
  - ✅ Componentes reutilizables con shadcn/ui
  - ✅ Navegación fluida con Next.js App Router
  - ✅ Notificaciones toast para mejor UX
  - ✅ Gestión de estado optimizada

## ✨ Características Implementadas

- **Autenticación y Usuarios** 🔒
  - ✅ Registro de usuarios
  - ✅ Inicio de sesión
  - ✅ Protección de rutas
  - ✅ JWT para autenticación

- **Carrito de Compras** 🛒
  - ✅ Agregar productos al carrito
  - ✅ Gestionar cantidades
  - ✅ Persistencia del carrito
  - ✅ Proceso de checkout
  - ✅ Validación de stock

- **Órdenes** 📦
  - ✅ Crear órdenes desde el carrito
  - ✅ Historial de órdenes
  - ✅ Vista detallada de órdenes
  - ✅ Estado de las órdenes


## 🛠️ Tecnologías

### Frontend
- **Next.js** (v15.3.3)
  - React Server Components
  - App Router
  - Serverless Functions
- **Tailwind CSS**
  - UI Components modernos
  - Diseño responsivo
- **TypeScript**
  - Tipado estático
  - Mejor mantenibilidad

### Backend
- **NestJS** (v11.0.7)
  - Arquitectura modular
  - Inyección de dependencias
  - Decoradores TypeScript
- **Prisma**
  - ORM moderno
  - Migraciones tipo-seguras
  - Schema-driven development
- **SQLite** (Desarrollo)
  - Base de datos relacional
  - Fácil configuración

## 📁 Estructura del Proyecto

```
tienda-online/
├── LICENSE                   # Licencia MIT
├── README.md                # Documentación principal
│
├── tienda-frontend/         # Aplicación Next.js
│   ├── src/
│   │   ├── app/            # App Router y páginas
│   │   │   ├── products/   # Funcionalidad de productos
│   │   │   │   ├── [id]/  # Detalles y edición
│   │   │   │   └── new/   # Crear producto
│   │   │   ├── globals.css
│   │   │   └── page.tsx   # Página principal
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── ui/        # Componentes base
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── label.tsx
│   │   │   └── product-card.tsx
│   │   └── lib/           # Utilidades
│   │       └── utils.ts
│   └── public/            # Archivos estáticos
│
└── tienda-backend/         # API NestJS
    ├── src/
    │   ├── products/      # Módulo de productos
    │   │   ├── dto/      # Data Transfer Objects
    │   │   ├── entities/ # Entidades
    │   │   ├── products.controller.ts
    │   │   └── products.service.ts
    │   ├── prisma/       # Configuración Prisma
    │   │   └── prisma.service.ts
    │   └── main.ts       # Punto de entrada
    └── prisma/
        ├── migrations/   # Historial de migraciones
        └── schema.prisma # Schema de la base de datos
```

## 🚀 Comenzando

### Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn
- Git

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/DarkoneSeinen/tienda-online.git
cd tienda-online
```

2. Instala las dependencias del frontend:
```bash
cd tienda-frontend
npm install
```

3. Instala las dependencias del backend:
```bash
cd ../tienda-backend
npm install
```

4. Configura la base de datos:
```bash
npx prisma migrate dev
```

5. Inicia el desarrollo:
```bash
# Terminal 1: Backend
cd tienda-backend
npm run start:dev

# Terminal 2: Frontend
cd tienda-frontend
npm run dev
```

## 📝 Estado del Proyecto

Este proyecto está en desarrollo activo. Estamos trabajando constantemente en nuevas características y mejoras.

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - vea el archivo [LICENSE](LICENSE) para más detalles.