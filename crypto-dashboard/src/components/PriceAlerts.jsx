import {useEffect,useState} from "react";

import "./PriceAlerts.css";



function PriceAlerts(){


const [coin,setCoin]=useState("bitcoin");

const [target,setTarget]=useState("");

const [alerts,setAlerts]=useState([]);

const [prices,setPrices]=useState({});





useEffect(()=>{


const saved=

JSON.parse(

localStorage.getItem("alerts")

)||[];


setAlerts(saved);



requestNotificationPermission();



fetchPrices();



const timer=setInterval(()=>{


fetchPrices();


},30000);



return()=>clearInterval(timer);



},[]);








// Browser notification permission

const requestNotificationPermission=()=>{


if(

"Notification" in window

&& Notification.permission!=="granted"

){


Notification.requestPermission();


}


};








// Get live prices

const fetchPrices=async()=>{


const response=await fetch(

"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,ripple&vs_currencies=usd"

);



const data=await response.json();



setPrices(data);



checkAlerts(data);



};








// Check targets

const checkAlerts=(data)=>{


alerts.forEach(alert=>{


const current=

data[alert.coin]?.usd;



if(

current &&

current>=alert.target

){



if(Notification.permission==="granted"){



new Notification(

"🚀 CryptoX Price Alert",

{

body:

`${alert.coin.toUpperCase()} reached $${current}`

}

);


}



}



});


};







const addAlert=()=>{


const newAlert={

coin,

target:Number(target)

};



const updated=[

...alerts,

newAlert

];



setAlerts(updated);



localStorage.setItem(

"alerts",

JSON.stringify(updated)

);



setTarget("");



};







return(


<section className="alerts">


<h2>

🔔 Live Price Alerts

</h2>




<div className="alert-box">



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




<input

type="number"

placeholder="Target price"

value={target}

onChange={(e)=>setTarget(e.target.value)}

/>





<button onClick={addAlert}>

Set Alert

</button>



</div>





{

alerts.map((item,index)=>(


<div className="alert-card"

key={index}

>


<h3>

{item.coin}

</h3>


<p>

Target:

${item.target}

</p>



</div>


))


}



</section>


);


}


export default PriceAlerts;