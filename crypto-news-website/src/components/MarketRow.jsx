import React from 'react';

const MarketRow = ({ coin, index }) => {
    const priceChange = coin?.price_change_percentage_24h ?? 0;

    return (
        <tr>
            <td>{index + 1}</td>
            <td className="coin-cell">
                <img src={coin.image} alt={`${coin.name} icon`} />
                <div className="coin-meta">
                    <span className="coin-name">{coin.name}</span>
                    <span className="coin-symbol">{coin.symbol?.toUpperCase()}</span>
                </div>
            </td>
            <td>${coin.current_price?.toLocaleString()}</td>
            <td className={priceChange >= 0 ? 'positive' : 'negative'}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </td>
            <td>${coin.market_cap?.toLocaleString()}</td>
        </tr>
    );
};

export default MarketRow;