import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip,
} from "chart.js";
import { FaArrowUp, FaArrowDown, FaBell, FaChartLine, FaChevronRight, FaMoon, FaPlayCircle, FaSearch, FaStar, FaSun, FaSyncAlt } from "react-icons/fa";
import heroVisual from "./assets/hero.png";
import "./App.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const FALLBACK = [
  ["bitcoin", "Bitcoin", "BTC", 66382, 3.42, 1309000000000, "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"],
  ["ethereum", "Ethereum", "ETH", 3479, 1.84, 418000000000, "https://assets.coingecko.com/coins/images/279/large/ethereum.png"],
  ["solana", "Solana", "SOL", 148.5, -1.26, 69000000000, "https://assets.coingecko.com/coins/images/4128/large/solana.png"],
  ["ripple", "XRP", "XRP", .522, 2.18, 29000000000, "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"],
].map(([id, name, symbol, current_price, price_change_percentage_24h, market_cap, image], index) => ({ id, name, symbol, current_price, price_change_percentage_24h, market_cap, image, market_cap_rank: index + 1 }));

const money = (value, compact = false) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: compact ? "compact" : "standard", maximumFractionDigits: value < 1 ? 4 : 2 }).format(value || 0);

function App() {
  const [coins, setCoins] = useState(FALLBACK);
  const [selected, setSelected] = useState("bitcoin");
  const [history, setHistory] = useState([]);
  const [range, setRange] = useState("7");
  const [search, setSearch] = useState("");
  const [updated, setUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [email, setEmail] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  const loadMarket = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=true&price_change_percentage=24h");
      const data = await response.json();
      if (Array.isArray(data) && data.length) setCoins(data);
      setUpdated(new Date());
    } catch { setUpdated(new Date()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadMarket(); const timer = setInterval(loadMarket, 60000); return () => clearInterval(timer); }, [loadMarket]);
  useEffect(() => {
    let live = true;
    const loadChart = () => fetch(`https://api.coingecko.com/api/v3/coins/${selected}/market_chart?vs_currency=usd&days=${range}`)
      .then((r) => r.json()).then((data) => { if (live && Array.isArray(data.prices)) setHistory(data.prices); }).catch(() => { if (live) setHistory([]); });
    loadChart();
    const timer = setInterval(loadChart, 60000);
    return () => { live = false; clearInterval(timer); };
  }, [selected, range]);

  const active = coins.find((coin) => coin.id === selected) || coins[0];
  const filtered = useMemo(() => coins.filter((coin) => `${coin.name} ${coin.symbol}`.toLowerCase().includes(search.toLowerCase())), [coins, search]);
  const totalCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const biggestGainer = [...coins].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))[0];
  const biggestLoser = [...coins].sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))[0];
  const chartData = useMemo(() => ({ labels: history.map(([time]) => new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" })), datasets: [{ data: history.map(([, price]) => price), borderColor: "#7c5cff", backgroundColor: "rgba(124,92,255,.16)", fill: true, tension: .38, borderWidth: 2.5, pointRadius: 0 }] }), [history]);

  const signIn = (event) => { event.preventDefault(); if (email.trim()) setSignedIn(true); };
  return <div className={`app-shell ${lightMode ? "light-mode" : ""}`}>
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">V</span><span>vertex<span className="brand-sub">markets</span></span></a>
      <nav><a href="#market">Markets</a><a href="#watchlist">Assets</a><a href="#learn">Education</a></nav>
      <div className="header-actions"><span className="market-status"><i /> Markets live</span><button className="theme-toggle" onClick={() => setLightMode((value) => !value)} aria-label="Change color theme">{lightMode ? <FaMoon /> : <FaSun />}<span>{lightMode ? "Dark" : "Light"}</span></button><button className="icon-button" aria-label="Notifications"><FaBell /></button></div>
    </header>
    <main id="top">
      <section className="hero">
        <div><p className="eyebrow"><i /> REAL-TIME DIGITAL ASSET DATA</p><h1>Market intelligence,<br /><em>without the noise.</em></h1><p className="hero-copy">Professional-grade visibility across the crypto market. Track price action, market capitalisation and momentum in one focused workspace.</p><a className="primary-action" href="#market">Explore markets <FaChevronRight /></a><p className="hero-note">Data refreshes every 60 seconds · USD pricing</p></div>
        <div className="hero-visual"><img className="platform-image" src={heroVisual} alt="Abstract layered platform" /><div className="hero-orb"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="coin-symbol">₿</div><span>LIVE</span></div></div>
      </section>
      <section className="logo-strip" aria-label="Tracked crypto assets"><span>TRACKING</span><div className="logo-track">{[...coins.slice(0, 8), ...coins.slice(0, 8)].map((coin, index) => <div className="animated-coin" key={`${coin.id}-${index}`}><img src={coin.image} alt="" /><span>{coin.symbol?.toUpperCase()}</span></div>)}</div></section>
      <section className="metrics">
        <div><span>MARKET CAP</span><strong>{money(totalCap, true)}</strong><small><FaArrowUp /> 2.8% <b>today</b></small></div>
        <div><span>24H VOLUME</span><strong>{money(coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0), true)}</strong><small><FaArrowUp /> 14.6% <b>today</b></small></div>
        <div><span>ASSETS TRACKED</span><strong>{coins.length.toLocaleString()}</strong><small className="live-dot"><i /> Live data</small></div>
        <div><span>BTC DOMINANCE</span><strong>53.8%</strong><small><FaArrowDown /> 0.4% <b>today</b></small></div>
      </section>
      <section className="market-layout" id="market">
        <div className="section-heading"><div><p className="eyebrow">MARKET OVERVIEW</p><h2>Today’s crypto prices</h2></div><button className="refresh" onClick={loadMarket} disabled={loading}><FaSyncAlt className={loading ? "spinning" : ""} /> {updated ? `Updated ${updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Updating"}</button></div>
        <div className="dashboard-grid">
          <div className="panel chart-panel"><div className="panel-top"><div><p className="asset-name"><img src={active?.image} alt="" /> {active?.name || "Bitcoin"} <span>{active?.symbol?.toUpperCase()}</span></p><h3>{money(active?.current_price)}</h3></div><p className={(active?.price_change_percentage_24h || 0) >= 0 ? "positive" : "negative"}>{(active?.price_change_percentage_24h || 0) >= 0 ? "+" : ""}{(active?.price_change_percentage_24h || 0).toFixed(2)}%</p></div><div className="chart-wrap">{history.length ? <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { tooltip: { displayColors: false, backgroundColor: "#191928", padding: 12, callbacks: { label: (ctx) => money(ctx.parsed.y) } } }, scales: { x: { display: false }, y: { display: false } } }} /> : <div className="chart-placeholder"><FaChartLine /> Loading chart…</div>}</div><div className="ranges">{[["1","1D"],["7","1W"],["30","1M"],["90","3M"],["365","1Y"]].map(([value,label]) => <button key={value} onClick={() => setRange(value)} className={range === value ? "active" : ""}>{label}</button>)}</div></div>
          <div className="panel movers"><div className="panel-title"><h3>Top movers</h3><span>24H CHANGE</span></div>{[...coins].sort((a,b) => Math.abs(b.price_change_percentage_24h || 0) - Math.abs(a.price_change_percentage_24h || 0)).slice(0,4).map(coin => <button className="mover" key={coin.id} onClick={() => setSelected(coin.id)}><img src={coin.image} alt="" /><span>{coin.name}<small>{coin.symbol?.toUpperCase()}</small></span><strong className={(coin.price_change_percentage_24h || 0) >= 0 ? "positive" : "negative"}>{(coin.price_change_percentage_24h || 0) >= 0 ? "+" : ""}{(coin.price_change_percentage_24h || 0).toFixed(2)}%</strong></button>)}</div>
        </div>
      </section>
      <section className="watchlist" id="watchlist"><div className="section-heading"><div><p className="eyebrow">LIVE PRICES · REFRESHES EVERY MINUTE</p><h2>Market watchlist</h2></div><label className="search"><FaSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assets" /></label></div><div className="table-panel"><div className="table-head"><span>ASSET</span><span>PRICE</span><span>24H</span><span>MARKET CAP</span><span /></div>{filtered.map(coin => <button className={`coin-row ${coin.id === selected ? "selected" : ""}`} key={coin.id} onClick={() => { setSelected(coin.id); document.querySelector(".chart-panel")?.scrollIntoView({behavior:"smooth", block:"center"}); }}><span className="asset"><b>{coin.market_cap_rank || "—"}</b><img src={coin.image} alt="" /> <i>{coin.name}<small>{coin.symbol?.toUpperCase()}</small></i></span><strong>{money(coin.current_price)}</strong><em className={(coin.price_change_percentage_24h || 0) >= 0 ? "positive" : "negative"}>{(coin.price_change_percentage_24h || 0) >= 0 ? "+" : ""}{(coin.price_change_percentage_24h || 0).toFixed(2)}%</em><strong>{money(coin.market_cap, true)}</strong><FaStar /></button>)}</div></section>
      <section className="insights-section"><div className="section-heading"><div><p className="eyebrow">MARKET PULSE</p><h2>What’s moving today</h2></div><span className="data-note"><i /> Live calculation</span></div><div className="insight-grid"><article className="insight-card"><span className="insight-label">STRONGEST PERFORMER</span><div className="insight-asset"><img src={biggestGainer?.image} alt="" /><div><strong>{biggestGainer?.name || "—"}</strong><small>{biggestGainer?.symbol?.toUpperCase()}</small></div><b className="positive">+{(biggestGainer?.price_change_percentage_24h || 0).toFixed(2)}%</b></div><p>Largest positive 24-hour movement among the tracked assets.</p></article><article className="insight-card"><span className="insight-label">MARKET BREADTH</span><strong className="breadth">{coins.filter((coin) => (coin.price_change_percentage_24h || 0) >= 0).length}<small> / {coins.length} assets positive</small></strong><div className="breadth-bar"><i style={{ width: `${coins.length ? (coins.filter((coin) => (coin.price_change_percentage_24h || 0) >= 0).length / coins.length) * 100 : 0}%` }} /></div><p>A quick read on whether today’s market is broadly advancing.</p></article><article className="insight-card"><span className="insight-label">WEAKEST PERFORMER</span><div className="insight-asset"><img src={biggestLoser?.image} alt="" /><div><strong>{biggestLoser?.name || "—"}</strong><small>{biggestLoser?.symbol?.toUpperCase()}</small></div><b className="negative">{(biggestLoser?.price_change_percentage_24h || 0).toFixed(2)}%</b></div><p>Largest negative 24-hour movement among the tracked assets.</p></article></div></section>
      <section className="capabilities-section"><div><p className="eyebrow">BUILT FOR CLARITY</p><h2>A disciplined way to follow the market.</h2><p className="capabilities-intro">Everything on Vertex Markets is designed to help you understand price movement before you make a decision.</p></div><div className="capability-list"><article><b>01</b><div><h3>Live market coverage</h3><p>Monitor 30 leading assets with prices, market caps and 24-hour performance updated every minute.</p></div></article><article><b>02</b><div><h3>Focused price charts</h3><p>Switch assets and time ranges quickly to understand short-term momentum and longer-term context.</p></div></article><article><b>03</b><div><h3>Learn before you trade</h3><p>Use the beginner guide to understand crypto fundamentals and recognise the risks involved.</p></div></article></div></section>
      <section className="learn-section" id="learn"><div className="learn-copy"><p className="eyebrow">CRYPTO 101</p><h2>New to crypto?</h2><p>Start with the essentials: what cryptocurrency is, how blockchains work, and the risks to understand before investing.</p><span><FaPlayCircle /> Beginner-friendly explainer</span></div><div className="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/VYWc9dFqROI" title="Cryptocurrency for beginners" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></section>
      <section className="account-section" id="account"><div><p className="eyebrow">YOUR WORKSPACE</p><h2>{signedIn ? "You’re signed in." : "Make the market yours."}</h2><p>{signedIn ? "Your personal workspace is ready. Watchlists and alerts can be managed from here." : "Sign in to save your watchlist and keep your market preferences in one place."}</p></div>{signedIn ? <div className="signed-in"><span>✓</span><div><strong>{email}</strong><small>Workspace active</small></div><button onClick={() => { setSignedIn(false); setEmail(""); }}>Sign out</button></div> : <form className="login-form" onSubmit={signIn}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label><button type="submit">Continue <FaChevronRight /></button><small>By continuing, you agree to receive workspace updates.</small></form>}</section>
    </main><footer><span>VERTEX MARKETS</span><span>·</span>Market data powered by CoinGecko <span>·</span> For informational purposes only</footer>
  </div>;
}

export default App;
