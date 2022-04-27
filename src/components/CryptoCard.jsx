import axios from 'axios';
import React, { useEffect } from 'react';

export default function CryptoCard(props) {

  const [bookmarked, setBookmarked] = React.useState(
    false
  )

  useEffect(()=>{
    const checkBookmarked = Promise.resolve(props.data.isBookmarked);
    checkBookmarked.then(function(result) {
      setBookmarked(result.data)
    });
  }, [props])



  return (
    <div className='crypto-card' onClick={(e)=>props.populateChart(e, props.data.symbol, "24h", props.data.name)}>
        <img src={props.data.iconUrl} alt="coin"></img>
        <h5>{props.data.symbol}</h5>
        {bookmarked?<button onClick={(e)=>props.removeFromFavorites(e, props.data.symbol)}>UnFav</button>:<button onClick={(e)=>props.addToFavorites(e, props.data.symbol)}>Fav</button>}
        <hr></hr>
        <p id='price'>Price: ${Number(props.data.price).toFixed(2)}</p>
        <p id='market'>Market Cap: {props.data.marketCap}</p>
        <p id='change'>Daily Change: {props.data.change}</p>
    </div>
  )
}
