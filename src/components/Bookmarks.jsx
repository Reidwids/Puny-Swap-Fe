import BookmarkedCard from './BookmarkedCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line } from 'recharts';

export default function Bookmarks(props) {
	const sortData = (data) => {
		data.sort((a, b) => {
			return b.price - a.price;
		});
	};
  
	const checkBookmarked = async (data) => {
    try {
      const response = await axios.post('isBookmarked', { crypto: data.symbol, user: props.user.user.id });
			return Promise.resolve(response);
		} catch (error) {
      console.log(error);
		}
	};
  
  const mapData = (coinData) => {
    sortData(coinData);
    const newerData = coinData.map((data, idx) => {
      const isBookmarked = checkBookmarked(data);
      return { ...data, isBookmarked };
    });
    const newData = newerData.map((data, idx) => {
      return <BookmarkedCard data={data} key={idx} populateChart={populateChart} user={props.user.user.id}></BookmarkedCard>;
    });
    return newData;
  };
  
  
	const populateChart = (e, symbol, time, name) => {
		e.preventDefault();
		let parameters = {
			symbol: symbol,
			time: time,
			name: name,
		};
		axios
			.post('coinData', parameters)
			.then((result) => {
				const sparkline = result.data.data.coins[0].sparkline.map((str, idx) => {
					return { name: `Unit ${idx}`, uv: Math.round(Number(str)), pv: Math.round(Number(str)), amt: Math.round(Number(str)) };
				});
				setState({ ...state, sparkline: sparkline, selectedCoin: result.data.data.coins[0].name });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const [state, setState] = useState({
		sparkline: [],
		selectedCoin: null,
		displayedCoins: null,
		cryptoCardData: [],
	});

	useEffect(() => {
			setState({ ...state, displayedCoins: props.coins, initialLoad: false, cryptoCardData: mapData(props.coins) });
	}, [state.displayedCoins]);

	return (
		<div className="market-page">
			<div className="card-container">
        {state.cryptoCardData}
      </div>
			<div className="chart-container">
				{state.selectedCoin ? <div>{state.selectedCoin}</div> : <></>}
				<LineChart width={400} height={400} data={state.sparkline}>
					<Line type="monotone" dataKey="uv" stroke="#8884d8" />
				</LineChart>
			</div>
		</div>
	);
}
