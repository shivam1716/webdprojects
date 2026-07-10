import "./App.css";


import CryptoBackground from "./components/CryptoBackground";

import Navbar from "./components/Navbar";

import Hero from "./components/Hero";

import MarketDashboard from "./components/MarketDashboard";

import CryptoCards from "./components/CryptoCards";

import Converter from "./components/Converter";

import CandleChart from "./components/CandleChart";

import Portfolio from "./components/Portfolio";

import PriceAlerts from "./components/PriceAlerts";

import CryptoNews from "./components/CryptoNews";

import AIAssistant from "./components/AIAssistant";

import Favorites from "./components/Favorites";

import Login from "./components/Login";

import Footer from "./components/Footer";





function App(){


return(


<div className="app">


<CryptoBackground />


<Navbar />



<main>



<section id="home">

<Hero />

</section>







<section id="dashboard">

<MarketDashboard />

</section>







<section id="markets">

<CryptoCards />

</section>







<section id="converter">

<Converter />

</section>







<section id="chart">

<CandleChart />

</section>







<section id="portfolio">

<Portfolio />

</section>







<section id="alerts">

<PriceAlerts />

</section>







<section id="news">

<CryptoNews />

</section>







<section id="ai">

<AIAssistant />

</section>







<section id="favorites">

<Favorites />

</section>







<section id="login">

<Login />

</section>



</main>




<Footer />



</div>


);


}



export default App;