/**
 * Tax Tools - Analytics Configuration
 */

const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: 'G-NH0Y6G6LTJ',
  ADSENSE_PUB_ID: '',
  ANALYTICS_ENABLED: true,
  ADS_ENABLED: false
};

function initAnalytics() {
  if (!ANALYTICS_CONFIG.ANALYTICS_ENABLED || !ANALYTICS_CONFIG.GA_MEASUREMENT_ID) return;

  const consent = localStorage.getItem('cookie_consent');
  if (consent !== 'accepted') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
  window.gtag = gtag;
}

function trackEvent(eventName, params = {}) {
  if (window.gtag && ANALYTICS_CONFIG.ANALYTICS_ENABLED) {
    gtag('event', eventName, params);
  }
}

function initAds() {
  if (!ANALYTICS_CONFIG.ADS_ENABLED || !ANALYTICS_CONFIG.ADSENSE_PUB_ID) return;

  const consent = localStorage.getItem('cookie_consent');
  if (consent !== 'accepted') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ANALYTICS_CONFIG.ADSENSE_PUB_ID}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
  const consent = localStorage.getItem('cookie_consent');
  if (consent === 'accepted') {
    initAnalytics();
    initAds();
  }
});

