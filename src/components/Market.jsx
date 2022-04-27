import CryptoCard from './CryptoCard'
import {useEffect, useState} from 'react'
import axios from 'axios'
import { LineChart, Line } from 'recharts';

export default function Market(props) {

  const sortData = (searchData)=>{
    searchData.sort((a,b)=>{
    return b.price-a.price
    })
  }

  const mapData = (searchData)=>{
    sortData(searchData)
    const newData = searchData.map((data,idx)=>{
      return <CryptoCard data={data} key={idx} populateChart={populateChart} searchData={searchData} addToFavorites={props.addToFavorites}></CryptoCard>
    })
    return newData
  }

  const searchChange=(e)=>{
    if(!e.target.value){
      setState({...state,
        displayedCoins: props.coins
      })
    }
    else{
      const newData = props.coins.filter(coin => (
        coin.name.toLowerCase().includes(e.target.value.toLowerCase())
        ))
      setState({...state,
        displayedCoins: newData
      })
    }
  }

  const populateChart = (e, symbol, time, name)=>{
    e.preventDefault()
    let parameters = {
      symbol: symbol,
      time: time,
      name: name
    }
    axios.post("coinData", parameters)
    .then((result) => {
      const sparkline = result.data.data.coins[0].sparkline.map((str, idx)=>{
        return {name: `Unit ${idx}`,uv: Math.round(Number(str)), pv: Math.round(Number(str)), amt: Math.round(Number(str))}
      })
      setState({...state,
        sparkline: sparkline,
        selectedCoin: result.data.data.coins[0].name,
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  const [state, setState] = useState({
    sparkline: [],
    selectedCoin: null,
    displayedCoins: null,
    initialLoad: true,
    cryptoCardData: []
  });
  
  useEffect(() => {
    if(state.initialLoad){
      setState({...state,
          displayedCoins: props.coins,
          initialLoad: false,
          cryptoCardData: mapData(props.coins)
        })
    }else{
      setState({...state,
        cryptoCardData: mapData(state.displayedCoins)
      })
    }


	}, [state.displayedCoins]);

  return (
    <div className='market-page'>
      <div className='search-container'>
        <input type="text" placeholder="Search.." onChange={(e)=>searchChange(e)}></input>
      </div>
      <div className='card-container'>
        {state.cryptoCardData}
      </div>
      <div className='totals-container'>
        <p>Total Crypto: {props.stats.total}</p>
        <p>Total Market Cap: {props.stats.totalMarketCap}</p>
        <p>Total Markets: {props.stats.totalMarkets}</p>
        <p>Total Exchanges: {props.stats.totalExchanges}</p>
        <p>Total 24hr Volume: {props.stats.total24hVolume}</p>
      </div>
      <div className='chart-container'>
          {state.selectedCoin?<div>{state.selectedCoin}</div>:<></>}
          <LineChart width={400} height={400} data={state.sparkline}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          </LineChart>
      </div>
    </div>
  )
}
