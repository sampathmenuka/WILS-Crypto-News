export const formatNumber = (num, decimals = 2) => {
  const n = Number(num);
  if (!isFinite(n)) return '-';
  return n.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
};

export const formatPercent = (num, decimals = 2) => {
  const n = Number(num);
  if (!isFinite(n)) return '-';
  return `${n.toFixed(decimals)}%`;
};

export const formatCurrency = (num, decimals = 2) => {
  const n = Number(num);
  if (!isFinite(n)) return '-';
  return `$${formatNumber(n, decimals)}`;
};
