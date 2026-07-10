import {useEffect,useState} from "react";

import {Line} from "react-chartjs-2";


import {

Chart as ChartJS,

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

} from "chart.js";


import "./Chart.css";


ChartJS.register(

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

);



function Chart(){


const [coin,setCoin]=useState("bitcoin");


const [period,setPeriod]=useState("1");


const [prices,setPrices]=useState([]);


const [labels,setLabels]=useState([]);






const fetchChart=async()=>{


const res=await fetch(

`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${period}`

);


const data=await res.json();



setPrices(

data.prices.map(

p=>p[1]

)

);



setLabels(

data.prices.map(

p=>new Date(p[0])

.toLocaleDateString()

)

);



};







useEffect(()=>{


fetchChart();



const timer=setInterval(()=>{


fetchChart();



},30000);



return()=>clearInterval(timer);



},[coin,period]);








const chartData={


labels,


datasets:[{


label:

coin.toUpperCase()+" Price USD",



data:prices,



borderColor:"#00ff99",


backgroundColor:

"rgba(0,255,153,.2)",


fill:true,


tension:.4,


pointRadius:0



}]


};









const options={


responsive:true,


plugins:{


legend:{


labels:{


color:

document.body.classList.contains("light")

?

"#111"

:

"#fff"


}


}

},




scales:{


x:{


ticks:{


color:

document.body.classList.contains("light")

?

"#111"

:

"#fff",


maxTicksLimit:8


}

},



y:{


ticks:{


color:

document.body.classList.contains("light")

?

"#111"

:

"#fff"


}

}


}


};







return(


<section className="chart-section">


<h2>

Live Crypto Market Chart

</h2>





<div className="chart-controls">


<select

value={coin}

onChange={(e)=>setCoin(e.target.value)}

>

<option value="bitcoin">

Bitcoin

</option>


<option value="ethereum">

Ethereum

</option>


<option value="solana">

Solana

</option>


<option value="dogecoin">

Dogecoin

</option>


<option value="ripple">

XRP

</option>


</select>





<select

value={period}

onChange={(e)=>setPeriod(e.target.value)}

>


<option value="1">

24 Hours

</option>


<option value="7">

7 Days

</option>


<option value="30">

1 Month

</option>


<option value="365">

1 Year

</option>


</select>


</div>






<div className="chart-box">


<Line

data={chartData}

options={options}

/>


</div>



</section>


);


}



export default Chart;