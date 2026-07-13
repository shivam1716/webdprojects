import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./CryptoCards.css";

function CryptoCards() {
  const [coins, setCoins] = useState([]);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Detect logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        loadFavorites(currentUser.uid);
      }
    });

    return unsubscribe;
  }, []);

  // Fetch live coins
  useEffect(() => {
    fetchCoins();

    const interval = setInterval(fetchCoins, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchCoins = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true"
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setCoins(data);
      } else {
        setCoins([]);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      setCoins([]);
    }
  };

  // Load favorites
  const loadFavorites = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "favorites", uid));

      if (snap.exists()) {
        setFavorites(snap.data().coins || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add favorite
  const addFavorite = async (coin) => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    const exists = favorites.some((item) => item.id === coin.id);

    if (exists) {
      alert("Already in favorites ⭐");
      return;
    }

    const updated = [...favorites, coin];

    setFavorites(updated);

    try {
      await setDoc(doc(db, "favorites", user.uid), {
        coins: updated,
      });

      alert(`${coin.name} added to favorites ⭐`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="crypto-section">
      <h2>Live Crypto Markets</h2>

      <div className="crypto-container">
        {coins.map((coin) => {
          const change = Number(coin.price_change_percentage_24h ?? 0);

          return (
            <div className="crypto-card" key={coin.id}>
              <div className="coin-header">
                <img src={coin.image} alt={coin.name} />

                <div>
                  <h3>{coin.name}</h3>
                  <span>{coin.symbol?.toUpperCase()}</span>
                </div>
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

              <p className={change >= 0 ? "green" : "red"}>
                {change >= 0 ? "▲" : "▼"} {change.toFixed(2)}%
              </p>

              <button
                className="favorite-btn"
                onClick={() => addFavorite(coin)}
              >
                ⭐ Add Favorite
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CryptoCards;