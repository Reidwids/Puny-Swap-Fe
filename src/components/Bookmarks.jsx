import BookmarkedCard from './BookmarkedCard';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SwapCard from './SwapCard';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { usePromiseTracker, trackPromise } from 'react-promise-tracker';
import useDraggableScroll from 'use-draggable-scroll';

export default function Bookmarks(props) {
	// let pos = { top: 0, left: 0, x: 0, y: 0 };
	const { promiseInProgress } = usePromiseTracker();
	const getUserSwaps = async () => {
		axios
			.get(`userSwaps?userId=${props.user.user.id}`)
			.then((response) => {
				setState({ ...state, userSwaps: response.data });
				// return response.data.map((swap) => {
				// 	return <SwapCard swap={swap}></SwapCard>;
				// });
			})
			.catch((error) => {
				console.log(error);
			});
	};
	// const handleScroll = (e) => {
	// 	const bottom = e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;
	// 	if (bottom) {
	// 	}
	// };
	// const ele = document.getElementById('bookmark-cont');
	// const mouseDownHandler = function (e) {
	// 	ele.style.cursor = 'grabbing';
	// 	ele.style.userSelect = 'none';
	// 	pos = {
	// 		// The current scroll
	// 		left: ele.scrollLeft,
	// 		top: ele.scrollTop,
	// 		// Get the current mouse position
	// 		x: e.clientX,
	// 		y: e.clientY,
	// 	};

	// 	document.addEventListener('mousemove', mouseMoveHandler);
	// 	document.addEventListener('mouseup', mouseUpHandler);
	// };
	// const mouseMoveHandler = function (e) {
	// 	// How far the mouse has been moved
	// 	const dx = e.clientX - pos.x;
	// 	const dy = e.clientY - pos.y;

	// 	// Scroll the element
	// 	ele.scrollTop = pos.top - dy;
	// 	ele.scrollLeft = pos.left - dx;
	// };
	// const mouseUpHandler = function () {
	// 	document.removeEventListener('mousemove', mouseMoveHandler);
	// 	document.removeEventListener('mouseup', mouseUpHandler);

	// 	ele.style.cursor = 'grab';
	// 	ele.style.removeProperty('user-select');
	// };

	const sortData = (data) => {
		data.sort((a, b) => {
			return b.price - a.price;
		});
	};

	const checkBookmarked = async (data) => {
		try {
			const response = await trackPromise(axios.post('isBookmarked', { crypto: data.symbol, user: props.user.user.id }));
			return response;
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
	const removeSwapRecord = (crypto1, crypto2) => {
		axios
			.post('removeSwap', { crypto1, crypto2, owner: props.user })
			.then((result) => {
				console.log(result);
				getUserSwaps();
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
		getUserSwaps();
	}, []);

	useEffect(() => {
		setState({ ...state, displayedCoins: props.coins, initialLoad: false, cryptoCardData: mapDataBookmarks(props.coins) });
	}, [state.displayedCoins]);
	if (!promiseInProgress) {
		return (
			<div className="bookmarks-page">
				<h3 style={{ textAlign: 'center' }}>Crypto Bookmarks</h3>
				<div id="bookmark-cont" className="scrolling-wrapper">
					{state.cryptoCardData}
				</div>
				<br></br>
				<h3 style={{ textAlign: 'center' }}>Swap Bookmarks</h3>
				<div id="swap-cont" className="scrolling-wrapper">
					{state.userSwaps.map((swap, i) => {
						return <SwapCard removeSwapRecord={removeSwapRecord} key={i} {...swap} user={props.user.user.id}></SwapCard>;
					})}
				</div>
			</div>
		);
	} else {
		return (
			<div className="bookmarks-page">
				<div className="bookmarks-loader">
					<PropagateLoader size={15}></PropagateLoader>
				</div>
				<div id="bookmark-cont" style={{ display: 'none' }} className="scrolling-wrapper">
					{state.cryptoCardData}
				</div>
				<div id="swap-cont" style={{ display: 'none' }} className="scrolling-wrapper">
					{state.userSwaps.map((swap, i) => {
						return <SwapCard removeSwapRecord={removeSwapRecord} key={i} {...swap} user={props.user.user.id}></SwapCard>;
					})}
				</div>
			</div>
		);
	}
}
