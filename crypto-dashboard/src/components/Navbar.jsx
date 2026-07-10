import {useEffect,useState} from "react";


import {

FaBitcoin,

FaMoon,

FaSun,

FaBars,

FaTimes

} from "react-icons/fa";


import "./Navbar.css";





function Navbar(){



const [dark,setDark]=useState(true);

const [menuOpen,setMenuOpen]=useState(false);






useEffect(()=>{


const saved=

localStorage.getItem("theme");



if(saved==="light"){


document.body.classList.add("light");

setDark(false);


}


},[]);







const toggleTheme=()=>{


if(dark){


document.body.classList.add("light");


localStorage.setItem(

"theme",

"light"

);


setDark(false);


}

else{


document.body.classList.remove("light");


localStorage.setItem(

"theme",

"dark"

);


setDark(true);


}


};









const scrollToSection=(id)=>{


const element=

document.getElementById(id);



if(element){


element.scrollIntoView({

behavior:"smooth"

});


}



setMenuOpen(false);


};








const links=[


{

name:"Home",

id:"home"

},


{

name:"Dashboard",

id:"dashboard"

},


{

name:"Markets",

id:"markets"

},


{

name:"Converter",

id:"converter"

},


{

name:"Chart",

id:"chart"

},


{

name:"Portfolio",

id:"portfolio"

},


{

name:"Alerts",

id:"alerts"

},


{

name:"News",

id:"news"

},


{

name:"AI Assistant",

id:"ai"

},


{

name:"Favorites",

id:"favorites"

}


];






return(



<nav className="navbar">





<div

className="logo"

onClick={()=>scrollToSection("home")}

>


<FaBitcoin />


<span>

CryptoX

</span>


</div>







<div

className={

menuOpen

?

"nav-links active"

:

"nav-links"

}

>


{


links.map((link)=>(


<button

key={link.id}

onClick={()=>scrollToSection(link.id)}

>

{link.name}

</button>


))


}




<button

className="login-btn"

onClick={()=>scrollToSection("login")}

>

🔐 Login

</button>



</div>







<div className="nav-actions">



<button

className="theme-btn"

onClick={toggleTheme}

>

{

dark

?

<FaMoon />

:

<FaSun />

}


</button>






<button

className="menu-btn"

onClick={()=>setMenuOpen(!menuOpen)}

>


{

menuOpen

?

<FaTimes />

:

<FaBars />

}



</button>



</div>






</nav>


);


}



export default Navbar;