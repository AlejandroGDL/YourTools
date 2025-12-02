const path = require('path');
const express = require('express');
const { evaluate } = require('mathjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const safeLength = (value, defaultValue, min, max) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return defaultValue;
  return Math.min(Math.max(parsed, min), max);
};

app.post('/api/text/analyze', (req, res) => {
  const { text = '' } = req.body || {};
  const normalized = String(text);
  const words = normalized.trim().split(/\s+/).filter(Boolean);
  const sentences = normalized.split(/[.!?]+/).filter(Boolean);
  res.json({
    characters: normalized.length,
    words: words.length,
    sentences: sentences.length,
    preview: normalized.slice(0, 240),
  });
});

app.post('/api/math/calc', (req, res) => {
  const { expression } = req.body || {};
  if (!expression || typeof expression !== 'string') {
    return res.status(400).json({ error: 'Expression is required.' });
  }

  try {
    const result = evaluate(expression);
    if (typeof result === 'function') {
      return res.status(400).json({ error: 'Expressions that return functions are not allowed.' });
    }
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Could not evaluate expression.' });
  }
});

app.post('/api/base64', (req, res) => {
  const { text = '', mode = 'encode' } = req.body || {};
  const normalized = String(text);
  try {
    if (mode === 'decode') {
      const decoded = Buffer.from(normalized, 'base64').toString('utf8');
      return res.json({ result: decoded });
    }
    const encoded = Buffer.from(normalized, 'utf8').toString('base64');
    return res.json({ result: encoded });
  } catch (error) {
    res.status(400).json({ error: 'Invalid Base64 input.' });
  }
});

app.get('/api/password', (req, res) => {
  const length = safeLength(req.query.length, 16, 4, 64);
  const includeSymbols = req.query.symbols !== 'false';
  const includeNumbers = req.query.numbers !== 'false';
  const includeUpper = req.query.upper !== 'false';
  const includeLower = req.query.lower !== 'false';

  const pools = [];
  if (includeLower) pools.push('abcdefghijklmnopqrstuvwxyz');
  if (includeUpper) pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (includeNumbers) pools.push('0123456789');
  if (includeSymbols) pools.push('!@#$%^&*()_+{}[]<>?');

  if (!pools.length) {
    return res.status(400).json({ error: 'At least one character type must be enabled.' });
  }

  const combined = pools.join('');
  const password = Array.from({ length }, () => combined[Math.floor(Math.random() * combined.length)]).join('');
  res.json({ password });
});

app.get('/api/tools', (_req, res) => {
  res.json([
    {
      id: 'text-analyzer',
      name: 'Analizador de texto',
      description: 'Cuenta caracteres, palabras y oraciones con vista previa.',
      endpoint: '/api/text/analyze',
      method: 'POST',
    },
    {
      id: 'math-lab',
      name: 'Laboratorio matemático',
      description: 'Evalúa expresiones matemáticas complejas de forma segura.',
      endpoint: '/api/math/calc',
      method: 'POST',
    },
    {
      id: 'base64',
      name: 'Conversor Base64',
      description: 'Codifica o decodifica texto usando Base64.',
      endpoint: '/api/base64',
      method: 'POST',
    },
    {
      id: 'password-maker',
      name: 'Generador de contraseñas',
      description: 'Crea contraseñas seguras con diferentes parámetros.',
      endpoint: '/api/password',
      method: 'GET',
    },
  ]);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`YourTools server ready on http://localhost:${port}`);
});
