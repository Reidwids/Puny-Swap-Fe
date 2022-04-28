import CryptoCard from './CryptoCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Market(props) {
	const sortData = (searchData) => {
		searchData.sort((a, b) => {
			return b.price - a.price;
		});
	};

	const checkBookmarked = async (data) => {
		try {
			const response = await axios.post('isBookmarked', { crypto: data.symbol, user: props.user.user.id });
			return Promise.resolve(response);
		} catch (error) {
			return null
		}
	};

	const mapData = (searchData) => {
		sortData(searchData);
		const newerData = searchData.map((data, idx) => {
			const isBookmarked = checkBookmarked(data);
			return { ...data, isBookmarked};
		});
		const newData = newerData.map((data, idx) => {
			return <CryptoCard data={data} key={idx} populateChart={populateChart} user={props.user}></CryptoCard>;
		});
		return newData;
	};

	const searchChange = (e) => {
		if (!e.target.value) {
			setState({ ...state, displayedCoins: props.coins });
		} else {
			const newData = props.coins.filter((coin) => coin.name.toLowerCase().includes(e.target.value.toLowerCase()));
			setState({ ...state, displayedCoins: newData });
		}
	};

	const populateChart = (e, symbol, name, time) => {
		if(e !== undefined){
			e.preventDefault();
		}
		let parameters = {
			symbol: symbol,
			time: time,
			name: name,
		};
		axios
			.post('coinData', parameters)
			.then((result) => {
				const convertedData = result.data.data.coins[0].sparkline.map((str, idx) => {
					return Math.round(Number(str));
				});
				const min = Math.min(...convertedData)
				const max = Math.max(...convertedData)
				
				const sparkline = convertedData.map((num, idx) => {
					return { name: `${idx}`, Price: num, dataMin: min, dataMax: max };
				});
				setState({ ...state, sparkline: sparkline, selectedCoin: result.data.data.coins[0].name, selectedSymbol: result.data.data.coins[0].symbol, time: time });
			})
			.catch((err) => {
				console.log(err);
			});
	};


	const changeTimeframe = (e, time)=>{
		e.preventDefault()
		populateChart(undefined, state.selectedSymbol, state.selectedCoin, time)
	}

	const [state, setState] = useState({
		sparkline: [],
		selectedCoin: null,
		selectedSymbol: null,
		displayedCoins: null,
		initialLoad: true,
		cryptoCardData: [],
		time: "24h"
	});

	useEffect(() => {
		if (state.initialLoad) {
			setState({ ...state, displayedCoins: props.coins, initialLoad: false, cryptoCardData: mapData(props.coins) });
		} else {
			setState({ ...state, cryptoCardData: mapData(state.displayedCoins) });
		}
	}, [state.displayedCoins]);

	return (
		<div className="market-page">
			<div className="search-container">
				<input type="text" placeholder="Search.." onChange={(e) => searchChange(e)}></input>
			</div>
			<div className="card-container">{state.cryptoCardData}</div>
			<div className="totals-container">
				<p>Total Crypto: {props.stats.total}</p>
				<p>Total Market Cap: {props.stats.totalMarketCap}</p>
				<p>Total Markets: {props.stats.totalMarkets}</p>
				<p>Total Exchanges: {props.stats.totalExchanges}</p>
				<p>Total 24hr Volume: {props.stats.total24hVolume}</p>
			</div>
			<div className="chart-container">
				{state.selectedCoin ? <div id='selectedCoin'>{state.selectedCoin}</div> : <></>}
				<ul className='selectTimeframe'>
					<li><button className={state.time==="24h"?"clicked":""} onClick={(e)=>changeTimeframe(e, "24h")}>24h</button></li>
					<li><button className={state.time==="30d"?"clicked":""} onClick={(e)=>changeTimeframe(e, "30d")}>30d</button></li>
					<li><button className={state.time==="1y"?"clicked":""} onClick={(e)=>changeTimeframe(e, "1y")}>1y</button></li>
					<li><button className={state.time==="5y"?"clicked":""} onClick={(e)=>changeTimeframe(e, "5y")}>5y</button></li>
				</ul>
				<LineChart width={500} height={300} data={state.sparkline} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<XAxis dataKey="name"/>
					<YAxis type="number" domain={['dataMin', 'dataMax']}/>
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="Price" stroke="#8884d8" />
				</LineChart>
			</div>
		</div>
	);
}
