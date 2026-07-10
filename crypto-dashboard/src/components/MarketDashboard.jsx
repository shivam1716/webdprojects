import { useEffect, useState } from "react";
import {
  Line
} from "react-chartjs-2";

import {

Chart as ChartJS,

LineElement,

CategoryScale,

LinearScale,

PointElement

} from "chart.js";


import "./MarketDashboard.css";


ChartJS.register(

LineElement,

CategoryScale,

LinearScale,

PointElement

);



function MarketDashboard(){


const [coins,setCoins]=useState([]);

const [btcDominance,setBtcDominance]=useState(0);





const fetchMarket=async()=>{


try{


const market=await fetch(

"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h"

);



const data=await market.json();


setCoins(data);





const global=await fetch(

"https://api.coingecko.com/api/v3/global"

);



const globalData=await global.json();



setBtcDominance(

globalData.data.market_cap_percentage.btc.toFixed(2)

);



}

catch(error){

console.log(error);

}


};






useEffect(()=>{


fetchMarket();


const timer=setInterval(()=>{

fetchMarket();

},30000);



return()=>clearInterval(timer);



},[]);







const gainers=[

...coins

]

.sort(

(a,b)=>

b.price_change_percentage_24h -

a.price_change_percentage_24h

)

.slice(0,5);






const losers=[

...coins

]

.sort(

(a,b)=>

a.price_change_percentage_24h -

b.price_change_percentage_24h

)

.slice(0,5);









const Sparkline=({data,color})=>{


return(

<Line

data={{

labels:data.map((_,i)=>i),

datasets:[{

data:data,

borderColor:color,

borderWidth:2,

pointRadius:0

}]

}}


options={{

responsive:true,

plugins:{

legend:{
display:false
}

},


scales:{

x:{
display:false
},

y:{
display:false
}

}


}}


/>

)

};









return(


<section className="market-dashboard">


<h2>

Market Dashboard

</h2>





<div className="market-stats">


<div>

<h3>

BTC Dominance

</h3>

<p>

{btcDominance}%

</p>

</div>




<div>

<h3>

Total Coins

</h3>

<p>

{coins.length}

</p>

</div>



<div>

<h3>

Live Status

</h3>

<p className="green">

ONLINE

</p>

</div>


</div>








<div className="tables">



<div className="market-box">


<h2>

🚀 Top Gainers

</h2>



{

gainers.map(coin=>(


<div className="market-row"

key={coin.id}

>


<img

src={coin.image}

alt=""

/>


<span>

{coin.name}

</span>



<strong className="green">

+

{coin.price_change_percentage_24h.toFixed(2)}%

</strong>



</div>


))

}



</div>







<div className="market-box">


<h2>

📉 Top Losers

</h2>



{

losers.map(coin=>(


<div className="market-row"

key={coin.id}

>


<img

src={coin.image}

alt=""

/>


<span>

{coin.name}

</span>



<strong className="red">

{coin.price_change_percentage_24h.toFixed(2)}%

</strong>



</div>


))

}



</div>


</div>









<h2>

Live Market Coins

</h2>





<div className="coin-grid">



{

coins.map(coin=>(


<div className="coin-card"

key={coin.id}

>


<div className="coin-title">


<img

src={coin.image}

alt=""

/>


<h3>

{coin.name}

</h3>


</div>





<h2>

${coin.current_price.toLocaleString()}

</h2>





<p>

Market Cap:

$

{coin.market_cap.toLocaleString()}

</p>





<p>

Volume:

$

{coin.total_volume.toLocaleString()}

</p>






<p>

24h High:

$

{coin.high_24h.toLocaleString()}

</p>




<p>

24h Low:

$

{coin.low_24h.toLocaleString()}

</p>







<div className="spark">


<Sparkline

data={coin.sparkline_in_7d.price}

color={

coin.price_change_percentage_24h>0

?

"#00ff99"

:

"#ff4444"

}

/>


</div>



</div>


))

}


</div>




</section>


)

}


export default MarketDashboard;