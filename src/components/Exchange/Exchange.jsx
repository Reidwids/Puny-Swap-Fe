import React, { useContext, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { Container, Form, Button } from 'react-bootstrap';
import Swap from './Swap';
import Send from './Send';

export function Exchange() {
	const [filter, setFilter] = useState('send');
	const { sendTransaction, connectWallet, currentAccount, formData, handleChange, setFormData } = useContext(TransactionContext);

	const handleFilterClick = (filter) => {
		console.log(`Filter is ${filter}`);
		setFilter(filter);
	};

	return (
		<div className="content-section">
			<Container className="col-4">
				<div className="exchange_filters">
					<div onClick={() => handleFilterClick('send')} className={filter === 'send' ? 'exchange_filter is-active' : 'exchange_filter'}>
						Send Eth
					</div>
					<div onClick={() => handleFilterClick('swap')} className={filter === 'swap' ? 'exchange_filter is-active' : 'exchange_filter'}>
						Swap Crypto
					</div>
				</div>
				{filter === 'send' ? <Send></Send> : <Swap></Swap>}
			</Container>
			{!currentAccount && (
				<Button className="exchange_button" onClick={connectWallet}>
					Connect Wallet
				</Button>
			)}
		</div>
	);
}
