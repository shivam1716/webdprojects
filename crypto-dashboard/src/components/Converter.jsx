import { useEffect, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import "./Converter.css";


function Converter(){

const [coins,setCoins]=useState([]);

const [crypto,setCrypto]=useState("bitcoin");

const [currency,setCurrency]=useState("usd");

const [amount,setAmount]=useState(1);

const [price,setPrice]=useState(null);

const [search,setSearch]=useState("");

const [loading,setLoading]=useState(false);



useEffect(()=>{


const getCoins=async()=>{


const res=await fetch(

"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"

);


const data=await res.json();


setCoins(data);


};



getCoins();


},[]);





const convert=async()=>{


setLoading(true);


try{


const res=await fetch(

`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`

);



const data=await res.json();



setPrice(

data[crypto][currency]*amount

);



}

catch(error){

console.log(error);

}


setLoading(false);


};





const swap=()=>{


if(currency==="usd")

setCurrency("inr");


else

setCurrency("usd");


};




const filteredCoins=

coins.filter((coin)=>

coin.name

.toLowerCase()

.includes(search.toLowerCase())

);



return(


<section className="converter-section">


<h2>

Crypto Converter

</h2>



<div className="converter-card">



<input

className="search"

placeholder="Search Coin..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>



<select

value={crypto}

onChange={(e)=>setCrypto(e.target.value)}

>


{

filteredCoins.map((coin)=>(

<option

key={coin.id}

value={coin.id}

>

{coin.name}

</option>


))


}


</select>





<input

type="number"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

placeholder="Amount"

/>





<button

className="swap"

onClick={swap}

>

<FaExchangeAlt/>

</button>





<select

value={currency}

onChange={(e)=>setCurrency(e.target.value)}

>


<option value="usd">

USD

</option>


<option value="inr">

INR

</option>


<option value="eur">

EUR

</option>


</select>





<button

className="convert"

onClick={convert}

>


{

loading ?

"Loading..."

:

"Convert"

}


</button>





{

price &&

<div className="answer">


<h3>

Result

</h3>


<h1>

{price.toLocaleString()}

{" "}

{currency.toUpperCase()}

</h1>


</div>


}



</div>


</section>


)


}


export default Converter;