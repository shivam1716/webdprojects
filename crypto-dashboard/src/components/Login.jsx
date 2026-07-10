import { useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  auth
} from "../firebase";

import "./Login.css";



function Login(){


const [user,setUser]=useState(null);



// Check login status

useEffect(()=>{


const unsubscribe = onAuthStateChanged(

auth,

(currentUser)=>{

setUser(currentUser);

}

);


return unsubscribe;


},[]);






// Google login

const loginWithGoogle=async()=>{


try{


const provider = new GoogleAuthProvider();


await signInWithPopup(

auth,

provider

);


}

catch(error){

console.log(error);

}


};






// Logout

const logout=async()=>{


await signOut(auth);


};







return(


<section className="login-section">



<h2>

🔐 CryptoX Account

</h2>





{

user ?


<div className="user-card">


<img

src={user.photoURL}

alt="profile"

/>



<h3>

{user.displayName}

</h3>




<p>

{user.email}

</p>





<button

onClick={logout}

className="logout-btn"

>

Logout

</button>


</div>



:


<button

onClick={loginWithGoogle}

className="google-login"

>

🔵 Continue with Google

</button>


}



</section>


);


}



export default Login;