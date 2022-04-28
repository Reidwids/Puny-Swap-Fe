import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import favSvg from '../favorite.svg';
import chevRight from '../chevRight.svg';

export default function SwapCard(props) {
	const nFormat = new Intl.NumberFormat('en-US');
	// const [bookmarked, setBookmarked] = React.useState(false);
	// useEffect(() => {
	// 	const response = axios.post('swapIsBookmarked', { crypto1: address1, crypto2: address2, user: props.user });
	// 	const checkBookmarked = Promise.resolve(response);
	// 	checkBookmarked.then(function (result) {
	// 		setBookmarked(result.data);
	// 	});
	// }, [props]);
	// const removeSwap = (e) => {
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	axios
	// 		.post('removeSwap', { crypto1: props.crypto1, crypto2: props.crypto2, owner: props.user })
	// 		.then((result) => {
	// 			handleSwapBookmark(props.crypto1, props.crypto1);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	// const checkBookmarked = async (address1, address2) => {
	// 	try {
	// 		return Promise.resolve(response);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
	// function handleSwapBookmark(address1, address2) {
	// 	let isBookmarked = Promise.resolve(checkBookmarked(address1, address2));
	// 	isBookmarked.then(function (result) {
	// 		setFavorite(result.data);
	// 	});
	// }
	// const [bookmarked, setBookmarked] = React.useState(false);
	// const nFormat = new Intl.NumberFormat('en-US');

	// useEffect(() => {
	// 	const checkBookmarked = Promise.resolve(props.data.isBookmarked);
	// 	checkBookmarked.then(function (result) {
	// 		setBookmarked(result.data);
	// 	});
	// }, [props]);

	// const removeFromFavorites = (e, crypto) => {
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	Axios.post('removeBookmark', { crypto, owner: props.user })
	// 		.then((result) => {
	// 			setBookmarked(false);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	return (
		<>
			{/* {bookmarked ? ( */}
			<div className="container">
				<div className="swap-bookmark">
					<div className="swap-bookmark-header">
						Swap {props.crypto1} to {props.crypto2}
					</div>
					<div className="swap-bookmark-body">
						<div className="swap-card-crypto-from">
							<img className="swap-card-crypto-img" src={props.crypto1Img} alt="" />
						</div>
						<img src={chevRight} alt="" />
						<div className="swap-card-crypto-to">
							<img className="swap-card-crypto-img" src={props.crypto2Img} alt="" />
						</div>
					</div>
					<div className="swap-bookmark-footer" onClick={() => props.removeSwapRecord(props.crypto1, props.crypto2)}>
						<img src={favSvg} alt="favorite" />
					</div>
				</div>

				{/* <div className="circle-tile">
						<div className="circle-tile-heading" onClick={(e) => props.populateChart(e, props.data.symbol, '24h', props.data.name)}>
							<div className="circle-tile-image-cont">
								<img className="circle-tile-image" id="card_image" src={props.data.iconUrl} alt="coin"></img>
							</div>
						</div>
						<div className="circle-tile-content">
							<div className="circle-tile-title">{props.data.symbol}</div>
							<div className="circle-tile-description">
								<div className="card-value">
									<div className="card-num-label">Price (USD)</div>
									<div className="card-num">${nFormat.format(Number(props.data.price).toFixed(2))}</div>
								</div>
								<div className="card-value">
									<div className="card-num-label">Market Cap</div>
									<div className="card-num">${nFormat.format(props.data.marketCap)}</div>
								</div>
								<div className="card-value">
									<div className="card-num-label">Daily Change</div>
									<div className="card-num" style={props.data.change >= 0 ? { color: 'rgb(113, 168, 29)' } : { color: 'red' }}>
										{props.data.change >= 0 ? '↑' : '↓'}&nbsp;${nFormat.format(props.data.change)}
									</div>
								</div>
							</div>
							<div className="circle-tile-footer" onClick={(e) => removeFromFavorites(e, props.data.symbol)}>
								UnFav <img src={favSvg} alt="favorite" />
							</div>
						</div>
					</div> */}
			</div>
			{/* ) : (
				<></>
			)} */}
		</>
	);
}
