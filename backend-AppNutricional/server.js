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