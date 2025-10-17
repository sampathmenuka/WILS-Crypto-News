import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const CoinChart = ({ prices = [] }) => {
    const chartConfig = useMemo(() => {
        const labels = prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString());
        const values = prices.map(([, value]) => Number(value.toFixed(2)));

        return {
            data: {
                labels,
                datasets: [
                    {
                        label: 'Price (USD)',
                        data: values,
                        fill: false,
                        tension: 0.25,
                        borderColor: 'rgba(229, 125, 7, 0.9)',
                        backgroundColor: 'rgba(229, 125, 7, 0.25)',
                        pointRadius: 0,
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        ticks: {
                            callback: (value) => `$${value}`,
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.08)',
                        },
                    },
                },
            },
        };
    }, [prices]);

    if (!prices.length) {
        return <p className="muted">No chart data available.</p>;
    }

    return (
        <div className="coin-chart">
            <Line data={chartConfig.data} options={chartConfig.options} height={320} />
        </div>
    );
};

export default CoinChart;