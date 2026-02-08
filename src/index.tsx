import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function detectAeoSource(): string | null {
  try {
    const url = new URL(window.location.href)
    const explicit = url.searchParams.get('aeo_source') || url.searchParams.get('llm_source')
    if (explicit) return explicit.toLowerCase()

    const utmSource = url.searchParams.get('utm_source')
    if (utmSource && /(chatgpt|perplexity|claude|gemini|copilot|you)/i.test(utmSource)) {
      return utmSource.toLowerCase()
    }

    const referrer = document.referrer || ''
    if (/chatgpt\.com|chat\.openai\.com/i.test(referrer)) return 'chatgpt'
    if (/perplexity\.ai/i.test(referrer)) return 'perplexity'
    if (/claude\.ai/i.test(referrer)) return 'claude'
    if (/gemini\.google\.com/i.test(referrer)) return 'gemini'
    if (/copilot\.microsoft\.com|bing\.com\/chat/i.test(referrer)) return 'copilot'
    if (/you\.com/i.test(referrer)) return 'you'
  } catch (_err) {
    return null
  }
  return null
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const aeoSource = detectAeoSource()
if (aeoSource) {
  sessionStorage.setItem('aeo_source', aeoSource)
  const windowWithGtag = window as Window & {
    gtag?: (...args: unknown[]) => void
  }
  if (typeof windowWithGtag.gtag === 'function') {
    windowWithGtag.gtag('event', 'aeo_visit', {
      event_category: 'acquisition',
      event_label: aeoSource,
    })
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
