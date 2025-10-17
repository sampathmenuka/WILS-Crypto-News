// Coin details with chart using CoinGecko
(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'bitcoin';

  const titleEl = document.getElementById('coin-title');
  const rankEl = document.getElementById('coin-rank');
  const descEl = document.getElementById('coin-desc');
  const priceEl = document.getElementById('coin-price');
  const mcapEl = document.getElementById('coin-mcap');
  const supplyEl = document.getElementById('coin-supply');
  const perf24El = document.getElementById('perf-24h');
  const perf7El = document.getElementById('perf-7d');
  const perf30El = document.getElementById('perf-30d');
  const ctx = document.getElementById('priceChart');

  let chart;

  function pctSpan(v){
    if (v == null) return '-';
    const cls = v >= 0 ? 'chip up' : 'chip down';
    return `<span class="${cls}">${Number(v).toFixed(2)}%</span>`;
  }

  async function loadDetails(){
    const detailsUrl = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const chartUrl = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=30&interval=daily`;
    try{
      const [dRes, cRes] = await Promise.all([
        fetch(detailsUrl),
        fetch(chartUrl)
      ]);
      if (!dRes.ok || !cRes.ok) throw new Error('Failed to fetch coin');
      const [d, c] = [await dRes.json(), await cRes.json()];

      titleEl.textContent = d.name || id;
      rankEl.textContent = d.market_cap_rank ? `Rank #${d.market_cap_rank}` : '';
      descEl.innerHTML = d.description?.en ? d.description.en.split('. ').slice(0,2).join('. ') + '.' : 'No description available.';

      const price = d.market_data?.current_price?.usd;
      const mcap = d.market_data?.market_cap?.usd;
      const supply = d.market_data?.circulating_supply;

      priceEl.textContent = price != null ? `$${WILS.fmt.num(price, 8)}` : '-';
      mcapEl.textContent = mcap != null ? `$${WILS.fmt.num(mcap, 0)}` : '-';
      supplyEl.textContent = supply != null ? `${WILS.fmt.num(supply, 0)}` : '-';

      perf24El.innerHTML = pctSpan(d.market_data?.price_change_percentage_24h);
      perf7El.innerHTML = pctSpan(d.market_data?.price_change_percentage_7d);
      perf30El.innerHTML = pctSpan(d.market_data?.price_change_percentage_30d);

      const points = (c.prices || []).map(p => ({ t: new Date(p[0]), y: p[1] }));
      const labels = points.map(p => p.t.toLocaleDateString());
      const values = points.map(p => p.y);

      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `${d.name} Price (USD)`,
            data: values,
            borderColor: 'rgba(229,125,7,1)',
            backgroundColor: 'rgba(229,125,7,.15)',
            tension: .25,
            pointRadius: 0,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: 'rgba(255,255,255,.08)' }, ticks: { color:'#cfcfcf' } },
            y: { grid: { color: 'rgba(255,255,255,.08)' }, ticks: { color:'#cfcfcf' } },
          },
          plugins: {
            legend: { labels: { color:'#eaeaea' } },
            tooltip: {
              callbacks: {
                label: (ctx) => `$${WILS.fmt.num(ctx.parsed.y, 8)}`,
              }
            }
          }
        }
      });
    }catch(err){
      titleEl.textContent = 'Error loading coin';
      descEl.textContent = err.message || 'Unknown error';
    }
  }

  loadDetails();
})();
