import Axios from 'axios';
import React, { useEffect } from 'react';
import favSvg from '../favorite.svg';

export default function CryptoCard(props) {
	const [bookmarked, setBookmarked] = React.useState(false);
	const nFormat = new Intl.NumberFormat('en-US');

	useEffect(() => {
		if(props.user){
			const checkBookmarked = Promise.resolve(props.data.isBookmarked);
			checkBookmarked.then(function (result) {
				setBookmarked(result.data);
			});
		}
	}, [props]);

	const removeFromFavorites = (e, crypto) => {
		e.preventDefault();
		e.stopPropagation();
		Axios.post('removeBookmark', { crypto, owner: props.user.user.id })
			.then((result) => {
				setBookmarked(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const addToFavorites = (e, crypto) => {
		e.preventDefault();
		e.stopPropagation();
		Axios.post('addBookmark', { crypto, owner: props.user.user.id })
			.then((result) => {
				setBookmarked(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="container ">
				<div className="circle-tile">
					<div className="circle-tile-heading" onClick={(e) => props.populateChart(e, props.data.symbol, props.data.name, "24h")}>
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
						{bookmarked?
						<div className="circle-tile-footer" onClick={(e) => removeFromFavorites(e, props.data.symbol)}>
							UnFav <img src={favSvg} id="unfav" alt="unFav" />
						</div>:
						<div className="circle-tile-footer" onClick={(e) => addToFavorites(e, props.data.symbol)}>
							Fav <img src={favSvg} id="fav" alt="favorite" />
						</div>
						}
					</div>
				</div>
			</div>
	);
}
