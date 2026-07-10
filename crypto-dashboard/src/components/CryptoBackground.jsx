import { motion } from "framer-motion";
import "./CryptoBackground.css";


function CryptoBackground(){

const symbols=[

"₿",
"Ξ",
"◎",
"₮",
"◈",
"◆"

];


return(

<div className="crypto-bg">


{

symbols.map((item,index)=>(


<motion.div

key={index}

className="floating-coin"


initial={{

y:100,

opacity:0

}}


animate={{

y:[0,-300,0],

x:[0,50,-50,0],

opacity:[0.3,1,0.3],

rotate:360


}}


transition={{

duration:

8+index*2,

repeat:Infinity,

delay:index

}}


>

{item}


</motion.div>


))


}



<div className="blob one"></div>

<div className="blob two"></div>

<div className="blob three"></div>



</div>


)

}


export default CryptoBackground;