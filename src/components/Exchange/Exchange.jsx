import React, { useContext, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { Container, Form, Button } from 'react-bootstrap';
import PropagateLoader from 'react-spinners/PropagateLoader';
import Swap from './Swap';
import Send from './Send';
const { ethereum } = window;

export function Exchange(props) {
	const [filter, setFilter] = useState('send');
	const { isLoading, sendTransaction, connectWallet, currentAccount, formData, handleChange, setFormData } = useContext(TransactionContext);

	const handleFilterClick = (filter) => {
		setFilter(filter);
	};
	if (currentAccount) {
		return (
			<div id="exchange_cont">
				<Container className="exchange_app">
					<div className="exchange_filters">
						<div onClick={() => handleFilterClick('send')} className={filter === 'send' ? 'exchange_filter is-active' : 'exchange_filter'}>
							Send Eth
						</div>
						<div onClick={() => handleFilterClick('swap')} className={filter === 'swap' ? 'exchange_filter is-active' : 'exchange_filter'}>
							Swap Crypto
						</div>
					</div>
					{filter === 'send' ? <Send></Send> : <Swap isLoaded={props.isLoaded}></Swap>}
				</Container>
				{isLoading ? (
					<div className="sendLoader">
						<PropagateLoader size={15}></PropagateLoader>
					</div>
				) : (
					<></>
				)}
			</div>
		);
	} else {
		return (
			<div id="connect_wallet">
				<Button className="connect_wallet_button" onClick={connectWallet}>
					Connect Wallet
				</Button>
			</div>
		);
	}
}
