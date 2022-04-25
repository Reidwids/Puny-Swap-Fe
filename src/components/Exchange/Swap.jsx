import React, { useContext, useState, useEffect } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { Container, Form, Button } from 'react-bootstrap';
import Moralis from 'moralis';
import CoinRow from './CoinRow';

export default function Swap(props) {
	// const serverUrl = process.env.moralisURL;
	const serverUrl = 'https://d8jmhb5ho8gz.usemoralis.com:2053/server';
	// const appId = process.env.moralisID;
	const appId = 'A1ke09rT3uacaTObuqpOhW407Gl4ZBhGnhgnZ6dd';
	const [user, setUser] = useState();
	const [currentTrade, setCurrentTrade] = useState({});
	const [currentSelectSide, setCurrentSelectSide] = useState();
	// let [tokens, setTokens] = useState();
	const [tokens, setTokens] = useState({});
	const [tokenModal, setTokenModal] = useState('none');
	const [currentTradeFrom, setCurrentTradeFrom] = useState([]);
	const [currentTradeTo, setCurrentTradeTo] = useState([]);
	const [initialized, setInitialized] = useState(false);
	let allTokens;

	async function login() {
		//fix login so we don't have to login every time we visit page
		setUser(Moralis.User.current());
		if (!user) {
			try {
				setUser(await Moralis.authenticate());
				//Change below to remove disabled when logged into metamask
				document.getElementById('swap_button').disabled = false;
			} catch (error) {
				console.log(error);
			}
		}
	}
	async function logOut() {
		await Moralis.User.logOut();
		console.log('logged out');
	}
	async function listAvailableTokens() {
		try {
			const result = await Moralis.Plugins.oneInch.getSupportedTokens({
				chain: 'eth',
				// The blockchain you want to use (eth/bsc/polygon)
			});
			console.log(result.tokens);
			setTokens({ ...result.tokens });
		} catch (error) {
			console.log(error);
		}
		console.log(tokens);
		// tokens = result.tokens;
	}
	function selectToken(address) {
		closeModal();
		setCurrentSelectSide(tokens[address]);
		if (currentTrade.from) {
			setCurrentTradeFrom([currentTrade.from.logoURI, currentTrade.from.symbol]);
		}
		if (currentTrade.to) {
			setCurrentTradeTo([currentTrade.to.logoURI, currentTrade.to.symbol]);
		}
		//May be required
		// getQuote();
	}
	function openModal(side) {
		setCurrentSelectSide(side);
		setTokenModal('block');
	}
	function closeModal() {
		setTokenModal('none');
	}
	async function init() {
		if (!initialized) {
			try {
				Moralis.start({ serverUrl, appId });
				await Moralis.initPlugins();
				// await Moralis.enable();
				await listAvailableTokens();
				setUser(Moralis.User.current());
				if (user) {
					setUser(await Moralis.authenticate());
				}
				setInitialized(true);
			} catch (error) {
				console.log(error);
			}
		}
	}
	useEffect(() => {
		init();
	});

	return (
		<div id="swap">
			<div id="swap_form">
				<div className="swapbox">
					<div className="swapbox_select token_select" id="from_token_select" onClick={() => openModal('from')}>
						<img className="token_image" id="from_token_img" src={currentTradeTo[0]} />
						<span id="from_token_text">{currentTradeTo[1]}</span>
					</div>
					<div className="swapbox_select">
						<Form.Control required className="number form-control" placeholder="Amount" id="from_amount"></Form.Control>
						{/* <Form.Control required className="number form-control" placeholder="Amount" id="from_amount" onBlur={getQuote}></Form.Control> */}
					</div>
				</div>
				<div className="swapbox">
					<div className="swapbox_select token_select" id="to_token_select" onClick={() => openModal('to')}>
						<img className="token_image" id="to_token_img" src={currentTradeTo[0]} />
						<span id="to_token_text">{currentTradeTo[1]}</span>
					</div>
					<div className="swapbox_select">
						<Form.Control required className="number form-control" placeholder="Amount" id="to_amount"></Form.Control>
					</div>
				</div>
				<div id="swap_gas">
					Estimated Gas: <span id="gas_estimate"></span> Eth
				</div>
				{/* <!-- Make button below disabled when not logged in --> */}
				{/* <Button className="exchange_button" id="swap_button" onClick={trySwap}> */}
				<Button className="exchange_button" id="swap_button">
					Swap
				</Button>
			</div>
			<button id="btn-login" onClick={login}>
				Moralis Metamask Login
			</button>
			<button id="btn-logout" onClick={logOut}>
				Logout
			</button>
			<div className="modal" id="token_modal" tabIndex="-1" role="dialog" style={{ display: tokenModal }}>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Select Token</h5>
							<button type="button" className="close" id="modal_close" onClick={closeModal} data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal_body">
							<div id="token_list">{allTokens}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
