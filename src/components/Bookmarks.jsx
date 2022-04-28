import BookmarkedCard from './BookmarkedCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line } from 'recharts';
import scrollRight from '../scrollRight.png';
import SwapCard from './SwapCard';

export default function Bookmarks(props) {
	const ele = document.getElementById('bookmark-cont');
	let pos = { top: 0, left: 0, x: 0, y: 0 };

	// const getUserSwaps = async () => {
	// 	try {
	// 		const response = await axios.get('userSwaps', { user: props.user.user.id });
	// 		return Promise.resolve(response);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
	const handleScroll = (e) => {
		const bottom = e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;
		if (bottom) {
		}
	};
	const mouseDownHandler = function (e) {
		ele.style.cursor = 'grabbing';
		ele.style.userSelect = 'none';
		pos = {
			// The current scroll
			left: ele.scrollLeft,
			top: ele.scrollTop,
			// Get the current mouse position
			x: e.clientX,
			y: e.clientY,
		};

		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	};
	const mouseMoveHandler = function (e) {
		// How far the mouse has been moved
		const dx = e.clientX - pos.x;
		const dy = e.clientY - pos.y;

		// Scroll the element
		ele.scrollTop = pos.top - dy;
		ele.scrollLeft = pos.left - dx;
	};
	const mouseUpHandler = function () {
		document.removeEventListener('mousemove', mouseMoveHandler);
		document.removeEventListener('mouseup', mouseUpHandler);

		ele.style.cursor = 'grab';
		ele.style.removeProperty('user-select');
	};

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

	const mapDataBookmarks = (coinData) => {
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
	// const mapDataSwap = (coinData) => {
	// 	sortData(coinData);
	// 	const newerData = coinData.map((data, idx) => {
	// 		const isBookmarked = checkBookmarkedSwap(data);
	// 		return { ...data, isBookmarked };
	// 	});
	// 	const newData = newerData.map((data, idx) => {
	// 		return <BookmarkedCard data={data} key={idx} populateChart={populateChart} user={props.user.user.id}></BookmarkedCard>;
	// 	});
	// 	return newData;
	// };
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
		userSwaps: [],
	});

	useEffect(() => {
		setState({ ...state, displayedCoins: props.coins, initialLoad: false, cryptoCardData: mapDataBookmarks(props.coins) });
		// userSwaps: getUserSwaps()
	}, [state.displayedCoins]);

	return (
		<div className="bookmarks-page">
			{/* <div className="card-container">{state.cryptoCardData}</div> */}
			<div id="bookmark-cont" className="scrolling-wrapper" onMouseDown={mouseDownHandler} onScroll={handleScroll}>
				{state.cryptoCardData}
			</div>
			<div id="swap-cont" className="scrolling-wrapper" onMouseDown={mouseDownHandler} onScroll={handleScroll}>
				{/* {state.userSwaps.map((swap) => (
					<SwapCard swap={swap}></SwapCard>
				))} */}
			</div>
			{/* <div className="chart-container">
				{state.selectedCoin ? <div>{state.selectedCoin}</div> : <></>}
				<LineChart width={400} height={400} data={state.sparkline}>
					<Line type="monotone" dataKey="uv" stroke="#8884d8" />
				</LineChart>
			</div> */}
		</div>
	);
}
