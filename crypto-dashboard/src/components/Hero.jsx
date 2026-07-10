import { motion } from "framer-motion";
import { FaArrowRight, FaChartLine } from "react-icons/fa";
import "./Hero.css";


function Hero(){


const goToConverter = () => {

  document
    .getElementById("converter")
    ?.scrollIntoView({
      behavior:"smooth"
    });

};



const goToMarket = () => {

  document
    .getElementById("markets")
    ?.scrollIntoView({
      behavior:"smooth"
    });

};



return (

<section className="hero">


<motion.div

className="hero-content"

initial={{
opacity:0,
y:50
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:1
}}

>


<h1>

The Future Of

<span>
Crypto Conversion
</span>

</h1>



<p>

Convert, track and analyze your favorite
cryptocurrencies with live market data.

</p>



<div className="hero-buttons">



<button

className="primary"

onClick={goToConverter}

>

Start Converting

<FaArrowRight/>

</button>




<button

className="secondary"

onClick={goToMarket}

>


<FaChartLine/>

View Market


</button>



</div>




<div className="stats">



<div>

<h2>
$2.5T+
</h2>

<p>
Crypto Market
</p>

</div>




<div>

<h2>
100+
</h2>

<p>
Coins Supported
</p>

</div>





<div>

<h2>
24/7
</h2>

<p>
Live Tracking
</p>

</div>



</div>



</motion.div>





<motion.div

className="coin"

animate={{

y:[0,-30,0],

rotate:[0,20,-20,0]

}}

transition={{

duration:5,

repeat:Infinity

}}

>

₿


</motion.div>



</section>

);


}


export default Hero;