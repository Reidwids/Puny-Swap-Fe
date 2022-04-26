import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Moralis from 'moralis';
import CoinRow from './CoinRow';

export default function Swap(props) {
	// const serverUrl = process.env.moralisURL;
	const serverUrl = 'https://d8jmhb5ho8gz.usemoralis.com:2053/server';
	// const appId = process.env.moralisID;
	const appId = 'A1ke09rT3uacaTObuqpOhW407Gl4ZBhGnhgnZ6dd';
	const [user, setUser] = useState();
	const [tokenModal, setTokenModal] = useState('none');
	const [currentTradeFrom, setCurrentTradeFrom] = useState([]);
	const [currentTradeTo, setCurrentTradeTo] = useState([]);
	const [initialized, setInitialized] = useState(false);
	const [displayTokens, setDisplayTokens] = useState([]);
	const [tokensObj, setTokensObj] = useState();
	const [tokensArr, setTokensArr] = useState();
	const [toAmount, setToAmount] = useState('');
	const [gasEstimate, setGasEstimate] = useState('');
	const [side, setSide] = useState();
	const [chainFilter, setChainFilter] = useState('eth');

	async function login() {
		//fix login so we don't have to login every time we visit page
		setUser(Moralis.User.current());
		if (!user) {
			try {
				setUser(await Moralis.authenticate());
				//Change below to remove disabled when logged into metamask
				// document.getElementById('swap_button').disabled = false;
				console.log('Logged in');
			} catch (error) {
				console.log(error);
			}
		}
	}
	// async function logOut() {
	// 	await Moralis.User.logOut();
	// 	console.log('logged out');
	// }
	async function listAvailableTokens() {
		try {
			const result = await Moralis.Plugins.oneInch.getSupportedTokens({
				chain: chainFilter,
				// The blockchain you want to use (eth/bsc/polygon)
			});
			setTokensArr(Object.entries(result.tokens));
			setTokensObj(result.tokens);
			setDisplayTokens(Object.entries(result.tokens));
		} catch (error) {
			console.log(error);
		}
	}
	function selectToken(address, side) {
		closeModal();
		if (side === 'from') {
			setCurrentTradeFrom(tokensObj[address]);
		}
		if (side === 'to') {
			setCurrentTradeTo(tokensObj[address]);
		}
		//May be required
		// getQuote();
	}

	function openModal(tempSide) {
		setSide(tempSide);
		const tempTokens = Object.entries(tokensObj);
		setDisplayTokens(tempTokens);
		setTokenModal('block');
	}
	function searchChange(e) {
		setDisplayTokens(tokensArr.filter((token) => token[1].symbol.toLowerCase().includes(e.target.value)));
	}
	function closeModal() {
		document.getElementById('searchModal').value = '';
		setTokenModal('none');
	}
	async function getQuote(e) {
		if (!currentTradeFrom || !currentTradeTo) return;
		let amount = Number(e.target.value * 10 ** currentTradeFrom.decimals);
		const quote = await Moralis.Plugins.oneInch.quote({
			chain: chainFilter,
			// The blockchain you want to use (eth/bsc/polygon)
			fromTokenAddress: currentTradeFrom.address,
			// The token you want to swap
			toTokenAddress: currentTradeTo.address,
			// The token you want to receive
			amount: amount,
		});
		console.log(quote);
		setGasEstimate((quote.estimatedGas * 0.000000000905).toFixed(6));
		setToAmount(quote.toTokenAmount / 10 ** quote.toToken.decimals);
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
	async function trySwap() {
		let address = Moralis.User.current().get('ethAddress');
		let amount = Number(document.getElementById('from_amount').value * 10 ** currentTradeFrom.decimals);
		if (currentTradeFrom.symbol !== 'ETH') {
			const allowance = await Moralis.Plugins.oneInch.hasAllowance({
				chain: chainFilter,
				// The blockchain you want to use (eth/bsc/polygon)
				fromTokenAddress: currentTradeFrom.address,
				// The token you want to swap
				fromAddress: address,
				// Your wallet address
				amount: amount,
			});
			console.log(allowance);
			if (!allowance) {
				await Moralis.Plugins.oneInch.approve({
					chain: chainFilter,
					// The blockchain you want to use (eth/bsc/polygon)
					tokenAddress: currentTradeFrom.address,
					// The token you want to swap
					fromAddress: address,
					// Your wallet address
				});
			}
		}
		console.log(currentTradeFrom);
		console.log(amount);
		console.log(address);
		await doSwap(address, amount);
	}

	async function doSwap(userAddress, amount) {
		console.log('before swap');
		try {
			return await Moralis.Plugins.oneInch.swap({
				chain: chainFilter,
				// The blockchain you want to use (eth/bsc/polygon)
				fromTokenAddress: currentTradeFrom.address,
				// The token you want to swap
				toTokenAddress: currentTradeTo.address,
				// The token you want to receive
				amount: amount,
				fromAddress: userAddress,
				// Your wallet address
				slippage: 1,
			});
		} catch (error) {
			console.log(error);
			alert('Swap Failed');
		}
	}

	useEffect(() => {
		init();
	});
	// useEffect(() => {
	// 	console.log(displayTokens);
	// }, [displayTokens]);

	function toAmountChange() {
		console.log('Changing toAmount..');
	}
	function handleChainFilter(chain) {
		setChainFilter(chain);
	}
	return (
		<div id="swap">
			<div id="swap_form">
				<div className="chain_filters">
					<div className="exchange_filters">
						<div onClick={() => handleChainFilter('eth')} className={chainFilter === 'eth' ? 'exchange_filter is-active' : 'exchange_filter'}>
							Eth
						</div>
						<div onClick={() => handleChainFilter('bsc')} className={chainFilter === 'bsc' ? 'exchange_filter is-active' : 'exchange_filter'}>
							Bsc
						</div>
						<div onClick={() => handleChainFilter('polygon')} className={chainFilter === 'polygon' ? 'exchange_filter is-active' : 'exchange_filter'}>
							Ply
						</div>
						<div onClick={() => handleChainFilter('avalanche')} className={chainFilter === 'avalanche' ? 'exchange_filter is-active' : 'exchange_filter'}>
							Ava
						</div>
					</div>
				</div>
				<div className="swapbox">
					<div className="swapbox_select token_select" id="from_token_select" onClick={() => openModal('from')}>
						<img className="token_image" id="from_token_img" src={currentTradeFrom.logoURI} />
						<span id="from_token_text">&nbsp; {currentTradeFrom.symbol}</span>
					</div>
					<div className="swapbox_select">
						<Form.Control required className="number form-control" placeholder="Amount" id="from_amount" onBlur={(e) => getQuote(e)}></Form.Control>
					</div>
				</div>
				<div className="swapbox">
					<div className="swapbox_select token_select" id="to_token_select" onClick={() => openModal('to')}>
						<img className="token_image" id="to_token_img" src={currentTradeTo.logoURI} />
						<span id="to_token_text">&nbsp; {currentTradeTo.symbol}</span>
					</div>
					<div className="swapbox_select">
						<Form.Control required className="number form-control" placeholder="Amount" id="to_amount" value={toAmount} onChange={toAmountChange}></Form.Control>
					</div>
				</div>
				<div id="swap_gas">
					{gasEstimate ? (
						<div>
							Fees: <span id="gas_estimate">{gasEstimate}</span> {chainFilter}{' '}
						</div>
					) : (
						<div></div>
					)}
				</div>
				{/* <!-- Make button below disabled when not logged in --> */}
				<Button className="exchange_button" id="swap_button" onClick={user ? trySwap : login}>
					{user ? 'Swap' : 'Moralis Login'}
				</Button>
			</div>
			{/* <button id="btn-login" onClick={login}>
				Moralis Metamask Login
			</button>
			<button id="btn-logout" onClick={logOut}>
				Logout
			</button> */}
			<div className="modal" id="token_modal" tabIndex="-1" role="dialog" style={{ display: tokenModal }}>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Select Token</h5>
							<button className="btn-close" id="modal_close" onClick={closeModal} data-dismiss="modal"></button>
						</div>
						<div className="modal_body">
							<Form.Control className=" form-control" placeholder="Search" id="searchModal" onChange={(e) => searchChange(e)}></Form.Control>
							<div id="token_list">
								{displayTokens.map((token, i) => {
									return <CoinRow key={i} token={token[1]} dataAddress={token[0]} side={side} selectToken={selectToken}></CoinRow>;
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
