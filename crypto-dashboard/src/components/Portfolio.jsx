import { useEffect, useState } from "react";
import "./Portfolio.css";


function Portfolio(){


const [coin,setCoin]=useState("bitcoin");

const [amount,setAmount]=useState("");

const [portfolio,setPortfolio]=useState([]);

const [prices,setPrices]=useState({});





useEffect(()=>{


const saved =

JSON.parse(

localStorage.getItem("portfolio")

)

|| [];


setPortfolio(saved);


fetchPrices();


},[]);






const fetchPrices=async()=>{


try{


const response=await fetch(

"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin,ripple&vs_currencies=usd"

);



const data=await response.json();


setPrices(data);



}

catch(error){

console.log(error);

}


};







const addCoin=()=>{


const item={


coin,

amount:Number(amount)


};



const updated=[

...portfolio,

item

];



setPortfolio(updated);



localStorage.setItem(

"portfolio",

JSON.stringify(updated)

);



setAmount("");



};







const removeCoin=(index)=>{


const updated=

portfolio.filter(

(_,i)=>i!==index

);



setPortfolio(updated);



localStorage.setItem(

"portfolio",

JSON.stringify(updated)

);


};







const totalValue=

portfolio.reduce(

(total,item)=>{


return total +

(

prices[item.coin]?.usd *

item.amount

||0

);


},

0

);







return(


<section className="portfolio">


<h2>

💼 Portfolio Tracker

</h2>




<div className="portfolio-box">



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

placeholder="Quantity"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

/>





<button

onClick={addCoin}

>

Add Holding

</button>



</div>







<div className="total-value">


<h2>

Total Portfolio Value

</h2>


<h1>

${totalValue.toLocaleString()}

</h1>


</div>








<div className="portfolio-list">


{


portfolio.map((item,index)=>(


<div

className="portfolio-card"

key={index}

>



<div>


<h3>

{item.coin.toUpperCase()}

</h3>


<p>

Amount:

{item.amount}

</p>


</div>




<div>


<h3>

$

{(

prices[item.coin]?.usd *

item.amount

||0

).toLocaleString()}

</h3>




<button

onClick={()=>removeCoin(index)}

>

Remove

</button>


</div>



</div>


))


}



</div>



</section>


)


}



export default Portfolio;