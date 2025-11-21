// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'dra_laura.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Pacientes / usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )`);

  // Planes nutricionales
  db.run(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Métricas de progreso
  db.run(`
    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      weight REAL,
      body_fat REAL,
      notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Eventos de calendario
  db.run(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Productos
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT
    )
  `);

  // Órdenes
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      total REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Items de cada orden
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // Datos demo
  db.run(`
    INSERT OR IGNORE INTO users (id, name, email)
    VALUES (1, 'Paciente Demo', 'paciente@demo.com')
  `);

  db.run(`
    INSERT OR IGNORE INTO plans (id, user_id, title, description)
    VALUES (
      1,
      1,
      'Plan Nutricional Inicial',
      'Desayuno: avena con frutas y proteína.\nAlmuerzo: proteína magra + vegetales.\nCena: ligera, alta en fibra.'
    )
  `);

  // Datos demo métricas
  db.run(`
    INSERT OR IGNORE INTO metrics (id, user_id, date, weight, body_fat, notes)
    VALUES
      (1, 1, '2025-11-15', 72.5, 24.0, 'Inicio del tratamiento'),
      (2, 1, '2025-11-18', 71.8, 23.5, 'Buena adherencia al plan')
  `);

  // Datos demo calendario
  db.run(`
    INSERT OR IGNORE INTO calendar_events (id, user_id, date, title, type)
    VALUES
      (1, 1, '2025-11-21', 'Control nutricional', 'control'),
      (2, 1, '2025-11-28', 'Seguimiento semanal', 'seguimiento')
  `);

  // Datos demo productos
  db.run(`
    INSERT OR IGNORE INTO products (id, name, description, price, image_url)
    VALUES
      (1, 'Omega 3 Premium', 'Suplemento de omega-3 de alta pureza.', 80.0, 'https://picsum.photos/200'),
      (2, 'Multivitamínico Mujer', 'Formulación específica para mujeres activas.', 65.0, 'https://picsum.photos/201'),
      (3, 'Proteína Vegetal', 'Proteína a base de plantas, sabor vainilla.', 95.0, 'https://picsum.photos/202')
  `);
});

module.exports = db;