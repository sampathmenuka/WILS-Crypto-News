// Lightweight inline SVG sparkline (no chart library needed for table rows).
function Sparkline({ data, width = 120, height = 36, positive, label }) {
  if (!Array.isArray(data) || data.length < 2) return <span className="muted">-</span>;

  // Downsample long series to keep the DOM small.
  const step = Math.max(1, Math.floor(data.length / 60));
  const points = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const up = positive ?? points[points.length - 1] >= points[0];
  const color = up ? '#4ade80' : '#fb7185';

  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      className="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label || `7 day trend ${up ? 'up' : 'down'}`}
    >
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default Sparkline;
