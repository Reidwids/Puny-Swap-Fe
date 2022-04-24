import React, { useContext, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { Container, Form, Button } from 'react-bootstrap';

export default function Send() {
	const { sendTransaction, connectWallet, currentAccount, formData, handleChange, setFormData } = useContext(TransactionContext);
	const handleSubmit = (e) => {
		// const {addressTo, amount, keyword, message} = formData;
		e.preventDefault();
		sendTransaction(formData);
	};
	return (
		<div id="send_form">
			<Form.Group>
				<Form.Control required name="addressTo" placeholder="Address To" onChange={(e) => handleChange(e, 'addressTo')}></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Control required name="amount" placeholder="Amount (Eth)" onChange={(e) => handleChange(e, 'amount')}></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Control required name="keyword" placeholder="Keyword (Gif)" onChange={(e) => handleChange(e, 'keyword')}></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Control required name="message" placeholder="Message" onChange={(e) => handleChange(e, 'message')}></Form.Control>
			</Form.Group>
			<Button className="exchange_button" onClick={handleSubmit}>
				Send
			</Button>
		</div>
	);
}
