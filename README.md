# YourTools

Suite de herramientas web full-stack para análisis de texto, cálculos matemáticos, conversión Base64 y generación de contraseñas.

## Scripts

- `npm start`: inicia el servidor Express y sirve el frontend.
- `npm run dev`: inicia el servidor con recarga en caliente usando nodemon.

> Nota: si la instalación de dependencias falla en tu entorno, verifica la configuración de red o usa un mirror de npm.

## Endpoints principales

- `POST /api/text/analyze`: recibe `{ text }` y retorna conteo de caracteres, palabras, oraciones y vista previa.
- `POST /api/math/calc`: recibe `{ expression }` y evalúa la expresión usando `mathjs` con control de errores.
- `POST /api/base64`: recibe `{ text, mode }` para codificar o decodificar en Base64.
- `GET /api/password`: genera una contraseña segura con parámetros opcionales `length`, `lower`, `upper`, `numbers`, `symbols`.
- `GET /api/tools`: lista las herramientas disponibles y sus endpoints.

El frontend está disponible en la ruta raíz y consume la API para cada herramienta.
