/**
 * Tax Tools - Shared JavaScript Utilities
 */

// Format currency
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format currency with cents
function formatCurrencyExact(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format percentage
function formatPercent(value, decimals = 1) {
  return value.toFixed(decimals) + '%';
}

// Parse input value safely
function parseInput(value, defaultValue = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// 2024 Federal Tax Brackets
const FEDERAL_BRACKETS = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 }
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 }
  ],
  head: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 }
  ]
};

// Standard Deductions 2024
const STANDARD_DEDUCTIONS = {
  single: 14600,
  married: 29200,
  head: 21900
};

// Calculate federal tax
function calculateFederalTax(taxableIncome, filingStatus = 'single') {
  const brackets = FEDERAL_BRACKETS[filingStatus];
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }
    if (remainingIncome <= 0) break;
  }

  return tax;
}

// Get marginal tax rate
function getMarginalRate(taxableIncome, filingStatus = 'single') {
  const brackets = FEDERAL_BRACKETS[filingStatus];
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return brackets[brackets.length - 1].rate;
}

// Calculate self-employment tax
function calculateSelfEmploymentTax(netEarnings) {
  const socialSecurityLimit = 168600; // 2024 limit
  const socialSecurityRate = 0.124;
  const medicareRate = 0.029;
  const additionalMedicareThreshold = 200000;
  const additionalMedicareRate = 0.009;

  // Self-employment tax base (92.35% of net earnings)
  const taxBase = netEarnings * 0.9235;

  // Social Security portion
  const socialSecurity = Math.min(taxBase, socialSecurityLimit) * socialSecurityRate;

  // Medicare portion
  let medicare = taxBase * medicareRate;
  if (taxBase > additionalMedicareThreshold) {
    medicare += (taxBase - additionalMedicareThreshold) * additionalMedicareRate;
  }

  return {
    socialSecurity,
    medicare,
    total: socialSecurity + medicare,
    deductible: (socialSecurity + medicare) / 2
  };
}

// Auto-calculate on input change
function setupAutoCalculate(formId, calculateFn) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', calculateFn);
    input.addEventListener('change', calculateFn);
  });
  
  // Initial calculation
  calculateFn();
}

// Update result element
function updateResult(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

// Local storage helpers
function saveToStorage(key, data) {
  try {
    localStorage.setItem('tax_' + key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage not available');
  }
}

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem('tax_' + key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Cookie consent
function initCookieConsent() {
  const consent = localStorage.getItem('cookie_consent');
  const banner = document.getElementById('cookie-consent');
  
  if (!consent && banner) {
    banner.classList.add('show');
  }
}

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted');
  document.getElementById('cookie-consent')?.classList.remove('show');
  
  if (typeof initAnalytics === 'function') {
    initAnalytics();
  }
}

function declineCookies() {
  localStorage.setItem('cookie_consent', 'declined');
  document.getElementById('cookie-consent')?.classList.remove('show');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initCookieConsent();
});

