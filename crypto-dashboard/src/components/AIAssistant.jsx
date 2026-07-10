import { useState } from "react";

import "./AIAssistant.css";



function AIAssistant(){


const [message,setMessage]=useState("");

const [chat,setChat]=useState([

{
sender:"ai",
text:"Hello 👋 I am CryptoX AI Assistant. Ask me anything about crypto."
}

]);






const getResponse=(question)=>{


const q=question.toLowerCase();



if(q.includes("bitcoin")){


return "Bitcoin is the first decentralized cryptocurrency created in 2009. It is mainly used as digital money and a store of value.";

}



if(q.includes("ethereum")){


return "Ethereum is a blockchain platform that supports smart contracts and decentralized applications (DApps).";


}




if(q.includes("solana")){


return "Solana is a high-speed blockchain known for fast transactions and low fees.";


}




if(q.includes("market")){


return "Crypto markets change continuously. Always check price charts, volume, market cap and risk before investing.";


}




if(q.includes("buy")){


return "Before buying any cryptocurrency, research the project, team, technology and market conditions.";


}




return "I can help you with Bitcoin, Ethereum, Solana, crypto markets, portfolio concepts and blockchain questions.";

};







const sendMessage=()=>{


if(!message.trim()) return;



const userMessage={

sender:"user",

text:message

};



const aiMessage={

sender:"ai",

text:getResponse(message)

};




setChat(prev=>[

...prev,

userMessage,

aiMessage

]);



setMessage("");



};







return(


<section className="ai-section">


<h2>

🤖 CryptoX AI Assistant

</h2>






<div className="chat-box">



{

chat.map((item,index)=>(


<div

key={index}

className={

item.sender==="ai"

?

"ai-message"

:

"user-message"

}

>


{item.text}


</div>


))


}



</div>







<div className="chat-input">


<input

value={message}

placeholder="Ask about crypto..."

onChange={(e)=>setMessage(e.target.value)}



onKeyDown={(e)=>{

if(e.key==="Enter")

sendMessage();

}}


/>



<button

onClick={sendMessage}

>

Send

</button>



</div>




</section>


);


}



export default AIAssistant;