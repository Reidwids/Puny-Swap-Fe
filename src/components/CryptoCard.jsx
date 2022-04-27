import React from 'react'

export default function CryptoCard(props) {

  return (
    <div className='crypto-card' onClick={(e)=>props.populateChart(e, props.data.symbol, "24h", props.data.name)}>
        <img src={props.data.iconUrl} alt="coin"></img>
        <h5>{props.data.symbol}</h5>
        <button onClick={(e)=>props.addToFavorites(e, props.data.symbol)}>Fav</button>
        <hr></hr>
        <p id='price'>Price: ${Number(props.data.price).toFixed(2)}</p>
        <p id='market'>Market Cap: {props.data.marketCap}</p>
        <p id='change'>Daily Change: {props.data.change}</p>
    </div>
  )
}
