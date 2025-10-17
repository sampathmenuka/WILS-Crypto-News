import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { fetchCoinDetail, fetchCoinChart } from '../utils/api';
import { formatNumber, formatCurrency } from '../utils/format';
import './CoinDetail.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function CoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coinData, chartResult] = await Promise.all([
          fetchCoinDetail(id),
          fetchCoinChart(id, 30),
        ]);
        setCoin(coinData);

        const points = chartResult.prices.map((p) => ({
          t: new Date(p[0]),
          y: p[1],
        }));
        setChartData({
          labels: points.map((p) => p.t.toLocaleDateString()),
          datasets: [
            {
              label: `${coinData.name} Price (USD)`,
              data: points.map((p) => p.y),
              borderColor: 'rgba(229,125,7,1)',
              backgroundColor: 'rgba(229,125,7,.15)',
              tension: 0.25,
              pointRadius: 0,
              fill: true,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <div className="container"><div className="loading">Loading coin details...</div></div>;
  if (error) return <div className="container"><div className="error">Error: {error}</div></div>;
  if (!coin) return null;

  const pctSpan = (val) => {
    if (val == null) return '-';
    const cls = val >= 0 ? 'chip up' : 'chip down';
    return <span className={cls}>{val.toFixed(2)}%</span>;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,.08)' },
        ticks: { color: '#cfcfcf' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,.08)' },
        ticks: { color: '#cfcfcf' },
      },
    },
    plugins: {
      legend: { labels: { color: '#eaeaea' } },
      tooltip: {
        callbacks: {
          label: (ctx) => formatCurrency(ctx.parsed.y, 8),
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>{coin.name}</h1>
        <span className="muted">
          {coin.market_cap_rank ? `Rank #${coin.market_cap_rank}` : ''}
        </span>
      </div>

      <section className="coin-layout">
        <div className="card chart-card">
          <div className="card-body">
            {chartData && (
              <div style={{ height: '300px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Overview</h3>
            <p className="muted coin-desc">
              {coin.description?.en
                ? coin.description.en.split('. ').slice(0, 2).join('. ') + '.'
                : 'No description available.'}
            </p>
            <div className="coin-stats">
              <div>
                <strong>Current Price:</strong>{' '}
                {formatCurrency(coin.market_data?.current_price?.usd, 8)}
              </div>
              <div>
                <strong>Market Cap:</strong>{' '}
                {formatCurrency(coin.market_data?.market_cap?.usd, 0)}
              </div>
              <div>
                <strong>Circulating Supply:</strong>{' '}
                {formatNumber(coin.market_data?.circulating_supply, 0)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="card-body">
          <h3>Performance</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div>
              <div className="muted">24h</div>
              <div>{pctSpan(coin.market_data?.price_change_percentage_24h)}</div>
            </div>
            <div>
              <div className="muted">7d</div>
              <div>{pctSpan(coin.market_data?.price_change_percentage_7d)}</div>
            </div>
            <div>
              <div className="muted">30d</div>
              <div>{pctSpan(coin.market_data?.price_change_percentage_30d)}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CoinDetail;
