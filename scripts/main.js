// Shared site JS: mobile nav toggle, footer year, helpers
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.toggele_btn');
  const links = document.querySelector('.links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Utility: format numbers
  window.WILS = window.WILS || {};
  window.WILS.fmt = {
    num(n, d=2) {
      const x = Number(n);
      if (!isFinite(x)) return '-';
      return x.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: 0 });
    },
    pct(n, d=2) {
      const x = Number(n);
      if (!isFinite(x)) return '-';
      return `${x.toFixed(d)}%`;
    }
  };
})();
