// Fetch live crypto prices from CoinGecko public API
// No API key needed. Rate limit applies; be gentle.
(function(){
  const API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h';
  const tbody = document.querySelector('#markets-table tbody');
  const headCells = Array.from(document.querySelectorAll('#markets-table thead th'));
  const updatedEl = document.getElementById('last-updated');

  let data = [];
  let sortKey = 'market_cap_rank';
  let sortDir = 'asc';

  function setUpdated(){
    if (updatedEl) updatedEl.textContent = `Updated ${new Date().toLocaleTimeString()}`;
  }

  function sortBy(key){
    if (sortKey === key){
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key; sortDir = 'asc';
    }
    render();
  }

  headCells.forEach(th => th.addEventListener('click', () => sortBy(th.dataset.sort)));

  function row(c){
    const change = Number(c.price_change_percentage_24h || 0);
    const chipClass = change >= 0 ? 'chip up' : 'chip down';
    const changeTxt = isFinite(change) ? `${change.toFixed(2)}%` : '-';
    const price = WILS?.fmt?.num(c.current_price, 6) || c.current_price;
    const mcap = WILS?.fmt?.num(c.market_cap, 0) || c.market_cap;
    const href = `coin.html?id=${encodeURIComponent(c.id)}`;
    return `<tr>
      <td>${c.market_cap_rank ?? '-'}</td>
      <td><a href="${href}">${c.name}</a></td>
      <td>${(c.symbol || '').toUpperCase()}</td>
      <td>$${price}</td>
      <td><span class="${chipClass}">${changeTxt}</span></td>
      <td>$${mcap}</td>
    </tr>`;
  }

  function render(){
    const sorted = [...data].sort((a,b)=>{
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'string'){
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === 'asc' ? (va - vb) : (vb - va);
    });
    tbody.innerHTML = sorted.map(row).join('');
  }

  async function load(){
    try{
      updatedEl && (updatedEl.textContent = 'Loading...');
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to fetch markets');
      data = await res.json();
      setUpdated();
      render();
    } catch(err){
      tbody.innerHTML = `<tr><td colspan="6">${err.message || 'Error'}</td></tr>`;
      updatedEl && (updatedEl.textContent = 'Failed to load');
    }
  }

  load();
  // Optional refresh every 2 minutes
  setInterval(load, 120000);
})();
