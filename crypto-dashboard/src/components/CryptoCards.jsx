import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import {
  auth,
  db
} from "../firebase";

import {
  onAuthStateChanged
} from "firebase/auth";

import "./CryptoCards.css";



function CryptoCards(){


const [coins,setCoins]=useState([]);

const [user,setUser]=useState(null);

const [favorites,setFavorites]=useState([]);





// Detect login user

useEffect(()=>{


const unsubscribe = onAuthStateChanged(

auth,

(currentUser)=>{

setUser(currentUser);


if(currentUser){

loadFavorites(currentUser.uid);

}

}

);


return unsubscribe;


},[]);







// Fetch live coins

useEffect(()=>{


fetchCoins();


const interval=setInterval(()=>{

fetchCoins();

},30000);



return()=>clearInterval(interval);



},[]);







const fetchCoins=async()=>{


try{


const response=await fetch(

"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true"

);



const data=await response.json();



setCoins(data);



}

catch(error){

console.log(error);

}


};









// Load favorites from Firebase

const loadFavorites=async(uid)=>{


const ref=

doc(

db,

"favorites",

uid

);



const snap=

await getDoc(ref);



if(snap.exists()){


setFavorites(

snap.data().coins || []

);


}



};









// Add favorite

const addFavorite=async(coin)=>{


if(!user){


alert(

"Please login first to save favorites"

);


return;


}




const exists=

favorites.find(

item=>item.id===coin.id

);



if(exists){


alert(

"Already in favorites ⭐"

);


return;


}





const updated=[

...favorites,

coin

];



setFavorites(updated);



await setDoc(

doc(

db,

"favorites",

user.uid

),

{

coins:updated

}

);



alert(

`${coin.name} added to favorites ⭐`

);



};









return(


<section className="crypto-section">



<h2>

Live Crypto Markets

</h2>





<div className="crypto-container">





{

coins.map((coin)=>(


<div

className="crypto-card"

key={coin.id}

>




<div className="coin-header">


<img

src={coin.image}

alt={coin.name}

/>



<div>

<h3>

{coin.name}

</h3>


<span>

{coin.symbol.toUpperCase()}

</span>


</div>



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







<p

className={

coin.price_change_percentage_24h >=0

?

"green"

:

"red"

}

>


{

coin.price_change_percentage_24h >=0

?

"▲"

:

"▼"

}



{" "}



{

coin.price_change_percentage_24h

?

coin.price_change_percentage_24h.toFixed(2)

:

"0"

}%


</p>








<button

className="favorite-btn"

onClick={()=>addFavorite(coin)}

>

⭐ Add Favorite

</button>






</div>


))


}



</div>





</section>


);


}



export default CryptoCards;