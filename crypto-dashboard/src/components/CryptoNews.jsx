import { useEffect, useState } from "react";
import "./CryptoNews.css";


function CryptoNews(){


const [news,setNews]=useState([]);

const [search,setSearch]=useState("");





useEffect(()=>{


fetchNews();


},[]);





const fetchNews=async()=>{


try{


const response = await fetch(

"https://min-api.cryptocompare.com/data/v2/news/?lang=EN"

);



const data = await response.json();



setNews(

data.Data.slice(0,12)

);



}

catch(error){

console.log(error);

}


};







const filteredNews=

news.filter(item=>

item.title

.toLowerCase()

.includes(

search.toLowerCase()

)

);







return(


<section className="news-section">


<h2>

📰 Latest Crypto News

</h2>




<input

className="news-search"

placeholder="Search news..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>







<div className="news-grid">



{


filteredNews.map((item)=>(


<div

className="news-card"

key={item.id}

>


<img

src={item.imageurl}

alt=""

/>



<div>


<h3>

{item.title}

</h3>



<p>

{item.body.substring(0,120)}...

</p>




<a

href={item.url}

target="_blank"

rel="noreferrer"

>

Read More →

</a>


</div>



</div>


))


}



</div>




</section>


)


}



export default CryptoNews;