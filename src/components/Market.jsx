import CryptoCard from './CryptoCard'
import {useEffect, useState} from 'react'

export default function Market(props) {

  const sortData = (searchData)=>{
    searchData.sort((a,b)=>{
    return b.price-a.price
    })
  }

  const mapData = (searchData)=>{
    sortData(searchData)
    const newData = searchData.map((data,idx)=>{
    return <CryptoCard data={data} key={idx} populateChart={populateChart}></CryptoCard>
    })
    return newData
  }

  const searchChange=(e)=>{
    if(!e.target.value){
      setState({
        newTestData: mapData(props.coins)
      })
    }
    else{
      const newData = props.coins.filter(coin => (
        coin.name.toLowerCase().includes(e.target.value.toLowerCase())
      ))
      setState({
        newTestData: mapData(newData)
      })
    }
  }

  const populateChart = (coinName)=>{
    console.log(coinName)
  }

  const [state, setState] = useState({
		newTestData: null
	});

  useEffect(() => {
    setState({
      newTestData: mapData(props.coins)
    })
	}, [props]);
  
  return (
    <div className='market-page'>
      <div className='search-container'>
        <input type="text" placeholder="Search.." onChange={(e)=>searchChange(e)}></input>
      </div>
      <div className='card-container'>
        {state.newTestData}
      </div>
      <div className='totals-container'>
        <p>Total Crypto: {props.stats.total}</p>
        <p>Total Market Cap: {props.stats.totalMarketCap}</p>
        <p>Total Markets: {props.stats.totalMarkets}</p>
        <p>Total Exchanges: {props.stats.totalExchanges}</p>
        <p>Total 24hr Volume: {props.stats.total24hVolume}</p>
      </div>
      <div className='chart-container'>
        <div>
          HELLO WORLD
        </div>
      </div>
    </div>
  )
}

