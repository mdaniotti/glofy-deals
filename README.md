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

PORT=
NODE_ENV=
```
### Importar datos

```bash
# Importar deals desde CSV
npm run import-deals data/deals.csv
```

## 📊 Endpoints

### Deals

- `POST /api/v1/deals` - Crear un nuevo deal

### Comisiones

- `GET /api/v1/commissions` - Listar todas las comisiones
- `GET /api/v1/commissions/deals/:deal_id` - Listar todas las comisiones por deal
- `GET /api/v1/commissions/reps/:rep?commissionDate=` - Comisiones por representante, con posibilidad de obtener por fecha
- `POST /api/v1/commissions/total/:month?year=` - Calcular el total de comisiones de un mes especifico de un determindo año

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

## 🔧 Decisiones Técnicas

Aquí puedes documentar las decisiones técnicas tomadas durante el desarrollo:

### Base de Datos
- **SQLite**: Elegido por simplicidad y portabilidad para este proyecto de demostración, no tenía mucha experiencia pero era mas flexible porque no necesitamos de un servidor. Me hibiese gustado implementra transacciones y evitar los db locked.
- **Estructira DB**: Decidí separar las informacion en una tabla "commissions" para poder tener multiples comisiones para un mismo deal, poder agregar mas campos sin afectar a un deal y poder hacer consultas mas eficientes de las comisiones

### Arquitectura
- **MVC Pattern**: Separación clara entre rutas, controladores y lógica de negocio
- **TypeScript**: Tipado estático para mayor robustez del código
- Decidí crear un script para la carga de los csv porque me pareció lo mas simple y rápido. Lo ideal cargar los CSVs desde el front y analizarlos en el back.
- También hubiera implementado un endpont para modificar el estado de un deal, cuando se marcara como "completed" calcular la comision correspondiente.

### Seguridad
- **Helmet**: Headers de seguridad automáticos
- **CORS**: Configuración para permitir requests cross-origin

### Performance
- **Morgan**: Logging de requests para debugging
- **Nodemon**: Hot reload en desarrollo

### Escalabilidad
- **Modular**: Estructura preparada para crecimiento
- **Environment Variables**: Configuración flexible por entorno
