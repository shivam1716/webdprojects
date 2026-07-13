import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import "./MarketDashboard.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

function MarketDashboard() {
  const [coins, setCoins] = useState([]);
  const [btcDominance, setBtcDominance] = useState("0.00");

  const fetchMarket = async () => {
    try {
      // Fetch Market Data
      const market = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h"
      );

      const data = await market.json();

      setCoins(Array.isArray(data) ? data : []);

      // Fetch Global Data
      const global = await fetch(
        "https://api.coingecko.com/api/v3/global"
      );

      const globalData = await global.json();

      setBtcDominance(
        Number(
          globalData?.data?.market_cap_percentage?.btc ?? 0
        ).toFixed(2)
      );
    } catch (error) {
      console.log("Market Error:", error);
    }
  };

  useEffect(() => {
    fetchMarket();

    const timer = setInterval(fetchMarket, 30000);

    return () => clearInterval(timer);
  }, []);

  // Top Gainers
  const gainers = [...coins]
    .sort(
      (a, b) =>
        Number(b.price_change_percentage_24h ?? -9999) -
        Number(a.price_change_percentage_24h ?? -9999)
    )
    .slice(0, 5);

  // Top Losers
  const losers = [...coins]
    .sort(
      (a, b) =>
        Number(a.price_change_percentage_24h ?? 9999) -
        Number(b.price_change_percentage_24h ?? 9999)
    )
    .slice(0, 5);

  const Sparkline = ({ data = [], color }) => {
    return (
      <Line
        data={{
          labels: data.map((_, i) => i),
          datasets: [
            {
              data,
              borderColor: color,
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
        }}
      />
    );
  };

  return (
    <section className="market-dashboard">
      <h2>Market Dashboard</h2>

      <div className="market-stats">
        <div>
          <h3>BTC Dominance</h3>
          <p>{btcDominance}%</p>
        </div>

        <div>
          <h3>Total Coins</h3>
          <p>{coins.length}</p>
        </div>

        <div>
          <h3>Live Status</h3>
          <p className="green">ONLINE</p>
        </div>
      </div>

      <div className="tables">
        {/* Top Gainers */}
        <div className="market-box">
          <h2>🚀 Top Gainers</h2>

          {gainers.map((coin) => (
            <div className="market-row" key={coin.id}>
              <img src={coin.image} alt={coin.name} />

              <span>{coin.name}</span>

              <strong className="green">
                +{Number(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
              </strong>
            </div>
          ))}
        </div>

        {/* Top Losers */}
        <div className="market-box">
          <h2>📉 Top Losers</h2>

          {losers.map((coin) => (
            <div className="market-row" key={coin.id}>
              <img src={coin.image} alt={coin.name} />

              <span>{coin.name}</span>

              <strong className="red">
                {Number(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
              </strong>
            </div>
          ))}
        </div>
      </div>

      <h2>Live Market Coins</h2>

      <div className="coin-grid">
        {coins.map((coin) => (
          <div className="coin-card" key={coin.id}>
            <div className="coin-title">
              <img src={coin.image} alt={coin.name} />

              <h3>{coin.name}</h3>
            </div>

            <h2>
              $
              {Number(coin.current_price ?? 0).toLocaleString()}
            </h2>

            <p>
              Market Cap: $
              {Number(coin.market_cap ?? 0).toLocaleString()}
            </p>

            <p>
              Volume: $
              {Number(coin.total_volume ?? 0).toLocaleString()}
            </p>

            <p>
              24h High: $
              {Number(coin.high_24h ?? 0).toLocaleString()}
            </p>

            <p>
              24h Low: $
              {Number(coin.low_24h ?? 0).toLocaleString()}
            </p>

            <div
              className="spark"
              style={{ height: "80px" }}
            >
              <Sparkline
                data={coin.sparkline_in_7d?.price || []}
                color={
                  Number(coin.price_change_percentage_24h ?? 0) >= 0
                    ? "#00ff99"
                    : "#ff4444"
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MarketDashboard;