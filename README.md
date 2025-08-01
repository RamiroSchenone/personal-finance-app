# Personal Finance App

Aplicación de finanzas personales construida con Next.js, TypeScript, Tailwind CSS, shadcn/ui y Supabase.

## 🚀 Características

- **Autenticación completa** con Supabase Auth
- **Dashboard financiero** con gráficos interactivos
- **Gestión de transacciones** y presupuestos
- **Reportes detallados** de gastos e ingresos
- **Interfaz moderna** y responsiva
- **Tema claro/oscuro**

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **Estado**: React Context + Hooks

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd personal-finance-app
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Supabase**
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Ve a Settings > API
   - Copia la URL y las claves

4. **Configura las variables de entorno**
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
   ```

5. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador**
   Ve a [http://localhost:3000](http://localhost:3000)

## 🔧 Configuración de Supabase

### 1. Crear el proyecto
- Ve a [supabase.com](https://supabase.com)
- Crea un nuevo proyecto
- Anota la URL y las claves de API

### 2. Configurar autenticación
- En tu proyecto de Supabase, ve a Authentication > Settings
- Configura los proveedores de autenticación que necesites
- Para desarrollo local, agrega `http://localhost:3000` a las URLs permitidas

### 3. Crear tablas (opcional)
Si necesitas tablas específicas para tu aplicación, puedes crearlas desde el SQL Editor de Supabase.

## 📁 Estructura del Proyecto

```
personal-finance-app/
├── app/                    # App Router de Next.js
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes de shadcn/ui
│   └── auth/              # Componentes de autenticación
├── contexts/              # Contextos de React
├── hooks/                 # Hooks personalizados
├── lib/                   # Utilidades y configuración
│   └── supabase/          # Configuración de Supabase
└── public/                # Archivos estáticos
```

## 🔐 Autenticación

La aplicación incluye un sistema completo de autenticación:

- **Login/Logout** con email y contraseña
- **Protección de rutas** automática
- **Estado de sesión** persistente
- **Middleware** para redirecciones

### Rutas de autenticación:
- `/auth/login` - Página de inicio de sesión
- `/` - Dashboard principal (requiere autenticación)

## 🎨 Personalización

### Temas
La aplicación soporta tema claro y oscuro. El estado se guarda en localStorage.

### Componentes
Todos los componentes de UI están basados en shadcn/ui y pueden ser personalizados fácilmente.

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de entorno para producción
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_produccion
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_produccion
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_produccion
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
