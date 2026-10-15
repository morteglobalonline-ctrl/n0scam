import { classifyActiveUrl } from './classifier.mjs';

const extensionApi = globalThis.browser ?? globalThis.chrome;
const state = document.querySelector('#state');
const result = document.querySelector('#result');
const badge = document.querySelector('#badge');
const host = document.querySelector('#host');
const signals = document.querySelector('#signals');

function render(assessment) {
  state.hidden = true;
  result.hidden = false;
  host.textContent = assessment.host || 'Desteklenmeyen içerik';
  badge.textContent = assessment.verdict === 'BLOCK' ? 'YÜKSEK RİSK' : assessment.verdict === 'WARN' ? 'DİKKAT' : 'DOĞRULANAMADI';
  badge.className = `badge ${assessment.verdict === 'BLOCK' ? 'block' : assessment.verdict === 'WARN' ? 'warn' : ''}`;
  signals.replaceChildren(...assessment.signals.map((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}

try {
  const [tab] = await extensionApi.tabs.query({ active: true, currentWindow: true });
  render(classifyActiveUrl(tab?.url ?? ''));
} catch {
  render({ verdict: 'UNKNOWN', host: '', signals: ['Sekme adresi okunamadı. Safari iznini kontrol edin.'] });
}
