const handleResponse = async (res) => {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Ocurrió un error en la solicitud.');
  }
  return res.json();
};

const textButton = document.getElementById('text-submit');
const mathButton = document.getElementById('math-submit');
const base64Button = document.getElementById('base64-submit');
const passwordButton = document.getElementById('password-submit');

testToolsAvailability();

function testToolsAvailability() {
  fetch('/api/tools')
    .then((res) => res.json())
    .then((tools) => console.log('YourTools backend listo:', tools))
    .catch(() => console.warn('No se pudo obtener la lista de herramientas.'));
}

textButton?.addEventListener('click', async () => {
  const text = document.getElementById('text-input').value;
  const output = document.getElementById('text-result');
  output.textContent = 'Procesando...';
  try {
    const data = await fetch('/api/text/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).then(handleResponse);
    output.innerHTML = `Caracteres: <strong>${data.characters}</strong><br/>` +
      `Palabras: <strong>${data.words}</strong><br/>` +
      `Oraciones: <strong>${data.sentences}</strong><br/>` +
      `<small>Vista previa:</small><br/>${data.preview || 'Sin vista previa'}`;
  } catch (error) {
    output.textContent = error.message;
  }
});

mathButton?.addEventListener('click', async () => {
  const expression = document.getElementById('math-input').value;
  const output = document.getElementById('math-result');
  output.textContent = 'Calculando...';
  try {
    const data = await fetch('/api/math/calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression }),
    }).then(handleResponse);
    output.innerHTML = `Resultado: <strong>${data.result}</strong>`;
  } catch (error) {
    output.textContent = error.message;
  }
});

base64Button?.addEventListener('click', async () => {
  const text = document.getElementById('base64-input').value;
  const mode = document.getElementById('base64-mode').value;
  const output = document.getElementById('base64-result');
  output.textContent = 'Procesando...';
  try {
    const data = await fetch('/api/base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode }),
    }).then(handleResponse);
    output.textContent = data.result;
  } catch (error) {
    output.textContent = error.message;
  }
});

passwordButton?.addEventListener('click', async () => {
  const length = document.getElementById('password-length').value;
  const lower = document.getElementById('pw-lower').checked;
  const upper = document.getElementById('pw-upper').checked;
  const numbers = document.getElementById('pw-numbers').checked;
  const symbols = document.getElementById('pw-symbols').checked;
  const output = document.getElementById('password-result');
  output.textContent = 'Generando...';

  const params = new URLSearchParams({ length, lower, upper, numbers, symbols });
  try {
    const data = await fetch(`/api/password?${params.toString()}`).then(handleResponse);
    output.textContent = data.password;
  } catch (error) {
    output.textContent = error.message;
  }
});
