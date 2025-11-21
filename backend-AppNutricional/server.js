// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('No hay GEMINI_API_KEY en el .env. El endpoint /chat fallará hasta que la agregues.');
}

const app = express();
app.use(cors());
app.use(express.json());

// --- Endpoint simple para probar ---
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Dra Laura funcionando' });
});
// Metricas del proceso
app.get('/metrics/:userId', (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT id, date, weight, body_fat, notes FROM metrics WHERE user_id = ? ORDER BY date ASC',
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});
// --- Calendario de eventos ---
app.get('/calendar/:userId', (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT id, date, title, type FROM calendar_events WHERE user_id = ? ORDER BY date ASC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.json(rows);
    }
  );
});

// --- Plan nutricional (usuario 1) ---
app.get('/plan/:userId', (req, res) => {
  const { userId } = req.params;
  db.get(
    'SELECT id, title, description, created_at FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
    [userId],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      if (!row) {
        return res.status(404).json({ error: 'No hay plan registrado' });
      }
      res.json(row);
    }
  );
});
// --- Crear orden (carrito → orden) ---
app.post('/orders', (req, res) => {
  const { userId, items } = req.body;

  // Validaciones básicas
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: 'userId e items (productId, quantity) son requeridos' });
  }

  // Obtenemos precios de los productos
  const productIds = items.map((it) => it.productId);
  const placeholders = productIds.map(() => '?').join(',');
  const sql = `SELECT id, price FROM products WHERE id IN (${placeholders})`;

  db.all(sql, productIds, (err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (!products.length) {
      return res.status(400).json({ error: 'Productos no encontrados' });
    }

    const priceMap = new Map(products.map((p) => [p.id, p.price]));

    let total = 0;
    for (const item of items) {
      const price = priceMap.get(item.productId);
      if (!price) {
        return res
          .status(400)
          .json({ error: `Producto inexistente: ${item.productId}` });
      }
      total += price * item.quantity;
    }

    // Creamos la orden
    db.run(
      'INSERT INTO orders (user_id, status, total) VALUES (?, ?, ?)',
      [userId, 'created', total],
      function (err2) {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ error: 'Error creando la orden' });
        }

        const orderId = this.lastID;

        // Insertar items
        const stmt = db.prepare(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
        );
        for (const item of items) {
          const price = priceMap.get(item.productId);
          stmt.run(orderId, item.productId, item.quantity, price);
        }
        stmt.finalize();

        res.status(201).json({
          orderId,
          status: 'created',
          total,
        });
      }
    );
  });
});

// --- Chat con Gemini (lo dejaremos listo pero luego lo probamos) ---
let ai = null;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

app.post('/chat', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini no está configurado (falta GEMINI_API_KEY)' });
  }

  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message es requerido' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                'Eres un asistente de soporte de la clínica de nutrición de la Dra. Laura Rozo. ' +
                'Responde con un tono profesional, cálido y claro. No des diagnósticos médicos; ' +
                'solo recomendaciones generales y siempre sugiere consultar directamente con la doctora. ' +
                'Pregunta del paciente: ' + message,
            },
          ],
        },
      ],
    });

    const text = response.text || 'Lo siento, no pude generar una respuesta en este momento.';
    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error llamando a Gemini' });
  }
});

app.listen(PORT, () => {
  console.log(`API Dra Laura escuchando en http://localhost:${PORT}`);
});
// --- Productos (tienda) ---
app.get('/products', (req, res) => {
  db.all(
    'SELECT id, name, description, price, image_url FROM products',
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.json(rows);
    }
  );
});