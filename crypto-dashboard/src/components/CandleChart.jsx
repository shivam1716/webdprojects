import { 
    useEffect, 
    useRef, 
    useState 
} from "react";


import {

    createChart,

    CandlestickSeries

} from "lightweight-charts";


import "./CandleChart.css";



function CandleChart(){


const chartContainer = useRef(null);

const chart = useRef(null);

const candleSeries = useRef(null);



const [coin,setCoin] = useState("bitcoin");


const [days,setDays] = useState("1");





// Create chart

useEffect(()=>{


if(!chartContainer.current) return;



chart.current = createChart(

chartContainer.current,

{

layout:{

background:{

color:

document.body.classList.contains("light")

?

"#ffffff"

:

"#111827"

},


textColor:

document.body.classList.contains("light")

?

"#111111"

:

"#ffffff"


},



grid:{

vertLines:{

color:"#333333"

},


horzLines:{

color:"#333333"

}

},



width:

chartContainer.current.clientWidth,


height:500,


}

);







// v5 Candlestick creation

candleSeries.current =

chart.current.addSeries(

CandlestickSeries,

{


upColor:"#00ff99",

downColor:"#ff4444",

borderVisible:false,

wickUpColor:"#00ff99",

wickDownColor:"#ff4444"


}

);





loadChart();







return()=>{


if(chart.current){


chart.current.remove();


}


};



},[]);









// Reload when coin/time changes

useEffect(()=>{


if(candleSeries.current){


loadChart();


}



},[coin,days]);









// Fetch OHLC data

const loadChart = async()=>{


try{


const response = await fetch(


`https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=usd&days=${days}`


);



const data = await response.json();






const candles = data.map((item)=>(


{


time:item[0]/1000,


open:item[1],


high:item[2],


low:item[3],


close:item[4]


}


));






candleSeries.current.setData(

candles

);





chart.current.timeScale().fitContent();




}

catch(error){


console.log(

"Chart Error:",

error

);


}


};









return(


<section className="candle-section">


<h2>

📊 Live Candlestick Market Chart

</h2>







<div className="candle-controls">





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

value={days}

onChange={(e)=>setDays(e.target.value)}

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







<div

ref={chartContainer}

className="candle-chart"

/>






</section>


);


}



export default CandleChart;