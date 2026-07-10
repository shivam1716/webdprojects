import { useEffect, useState } from "react";

import {

doc,

getDoc,

setDoc

} from "firebase/firestore";


import {

onAuthStateChanged

} from "firebase/auth";


import {

auth,

db

} from "../firebase";


import "./Favorites.css";




function Favorites(){


const [user,setUser]=useState(null);


const [favorites,setFavorites]=useState([]);





// Detect user login

useEffect(()=>{


const unsubscribe =

onAuthStateChanged(

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







// Remove favorite

const removeFavorite=async(id)=>{


const updated=

favorites.filter(

coin=>coin.id!==id

);



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



};








if(!user){


return(

<section className="favorites-section">


<h2>

⭐ Favorites

</h2>


<p>

Login to save your favorite coins.

</p>


</section>

);


}






return(


<section className="favorites-section">


<h2>

⭐ My Cloud Favorites

</h2>




{

favorites.length===0 ?


<p>

No favorite coins saved.

</p>



:


favorites.map((coin)=>(


<div

className="favorite-card"

key={coin.id}

>


<img

src={coin.image}

alt=""

/>



<div>


<h3>

{coin.name}

</h3>


<p>

${coin.current_price}

</p>


</div>




<button

onClick={()=>removeFavorite(coin.id)}

>

Remove

</button>



</div>


))


}



</section>


);


}



export default Favorites;