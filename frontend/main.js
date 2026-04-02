const form = document.getElementById('form');
const promptEl = document.getElementById('prompt');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.textContent = 'Generating...';
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptEl.value })
    });
    if (!res.ok) {
      const err = await res.json();
      result.textContent = 'Error: ' + (err.error || res.statusText);
      return;
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await res.json();
      result.textContent = JSON.stringify(data, null, 2);
    } else {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      result.innerHTML = `<img src="${url}" alt="generated" style="max-width:100%"/>`;
    }
  } catch (err) {
    result.textContent = 'Request failed: ' + err.message;
  }
});
