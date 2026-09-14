export const formatNumber = (num, decimals = 2) => {
  const n = Number(num);
  if (num == null || !isFinite(n)) return '-';
  return n.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
};

export const formatPercent = (num, decimals = 2) => {
  const n = Number(num);
  if (num == null || !isFinite(n)) return '-';
  return `${n.toFixed(decimals)}%`;
};

export const formatSignedPercent = (num, decimals = 2) => {
  const n = Number(num);
  if (num == null || !isFinite(n)) return '-';
  return `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`;
};

export const formatCurrency = (num, decimals = 2) => {
  const n = Number(num);
  if (num == null || !isFinite(n)) return '-';
  return `$${formatNumber(n, decimals)}`;
};

// Price with precision that adapts to magnitude: $63,421.50 / $0.4213 / $0.00001234
export const formatPrice = (num) => {
  const n = Number(num);
  if (num == null || !isFinite(n)) return '-';
  // Round to 4 significant digits first so e.g. 0.99996 is treated as 1 and shown as $1.00.
  const abs = Math.abs(Number(n.toPrecision(4)));
  if (abs >= 1) {
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (abs === 0) return '$0.00';
  return `$${n.toLocaleString(undefined, { maximumSignificantDigits: 4 })}`;
};

// Compact currency for large values: $1.23T, $456.7B, $12.3M
export const formatCompactCurrency = (num) => {
  const n = Number(num);
  if (num == null || !isFinite(n)) return '-';
  return `$${n.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 2 })}`;
};

// Relative time: "just now", "42s ago", "5m ago", "3h ago"
export const formatTimeAgo = (date) => {
  if (!date) return '';
  const diff = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
