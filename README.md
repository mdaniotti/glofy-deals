# Glofy Deals API

Sistema backend para procesar datos de ventas y calcular comisiones para representantes de ventas.

## 📋 Descripción

API REST que permite:

- Importar datos de ventas desde archivos CSV
- Calcular comisiones para representantes de ventas
- Consultar información de deals y comisiones
- Gestionar el estado de las ventas

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/mdaniotti/glofy-deals.git
cd glofy-deals

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env
```

## 🛠️ Uso

### Desarrollo

```bash
# Ejecutar en modo desarrollo con hot reload
npm run dev

# Verificar tipos TypeScript
npm run typecheck
```

### Producción

```bash
# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm run start:dist
```

### Importar datos

```bash
# Importar deals desde CSV
npm run import-deals
```

## 📊 Endpoints

### Health Check

- `GET /` - Estado del servicio

### Deals

- `GET /api/v1/deals` - Listar todos los deals
- `GET /api/v1/deals/:id` - Obtener deal específico

### Comisiones

- `GET /api/v1/commissions` - Listar comisiones
- `GET /api/v1/commissions/:rep` - Comisiones por representante
- `POST /api/v1/commissions/calculate` - Calcular comisiones

## 🗂️ Estructura del Proyecto

```
glofy-deals/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── routes/         # Definición de endpoints
│   ├── scripts/        # Scripts de utilidad
│   ├── app.ts          # Configuración de Express
│   ├── db.ts           # Configuración de base de datos
│   └── index.ts        # Punto de entrada
├── data/
│   ├── deals.csv       # Datos de ventas
│   └── glofy-deals.db  # Base de datos SQLite
└── package.json
```

## 🛡️ Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de datos**: SQLite (better-sqlite3)
- **Seguridad**: Helmet, CORS
- **Logging**: Morgan

## 📈 Datos de Ejemplo

El proyecto incluye datos de ejemplo con:

- 50 deals de ventas
- 5 representantes de ventas
- 6 modelos de autos diferentes
- Estados: completed, cancelled, in process

## 🔧 Decisiones Técnicas

<!--
Aquí puedes documentar las decisiones técnicas tomadas durante el desarrollo:

### Base de Datos
- **SQLite**: Elegido por simplicidad y portabilidad para este proyecto de demostración
- **better-sqlite3**: Driver de alto rendimiento para Node.js

### Arquitectura
- **MVC Pattern**: Separación clara entre rutas, controladores y lógica de negocio
- **TypeScript**: Tipado estático para mayor robustez del código

### Seguridad
- **Helmet**: Headers de seguridad automáticos
- **CORS**: Configuración para permitir requests cross-origin

### Performance
- **Morgan**: Logging de requests para debugging
- **Nodemon**: Hot reload en desarrollo

### Escalabilidad
- **Modular**: Estructura preparada para crecimiento
- **Environment Variables**: Configuración flexible por entorno
-->
