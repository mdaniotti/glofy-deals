import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";

// Crear conexión a la base de datos
const dbPath = path.join(__dirname, "../data/glofy-deals.db");
const db: DatabaseType = new Database(dbPath, { timeout: 15000 });

// Crear tabla deals
db.exec(`
    CREATE TABLE IF NOT EXISTS deals (
      deal_id TEXT PRIMARY KEY,
      rep TEXT NOT NULL,
      car_model TEXT NOT NULL,
      deal_amount REAL NOT NULL,
      deal_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_process'
    )
  `);

// Crear tabla commissions
db.exec(`
    CREATE TABLE IF NOT EXISTS commissions (
      commission_id TEXT PRIMARY KEY,
      deal_id TEXT NOT NULL,
      rep TEXT NOT NULL,
      commission_amount REAL NOT NULL,
      commission_percentage REAL NOT NULL,
      commission_date TEXT NOT NULL,
      FOREIGN KEY (deal_id) REFERENCES deals(deal_id)
    )
  `);

export default db;
