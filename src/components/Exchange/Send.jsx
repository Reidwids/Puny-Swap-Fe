import React, { useContext, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { Container, Form, Button } from 'react-bootstrap';

export default function Send() {
	// const { sendTransaction, connectWallet, currentAccount, formData, handleChange, setFormData } = useContext(TransactionContext);
	const { sendTransaction, formData, handleChange, currentAccount } = useContext(TransactionContext);
	console.log(currentAccount);
	const handleSubmit = (e) => {
		const { addressTo, amount, keyword, message } = formData;
		e.preventDefault();
		if (addressTo.toLowerCase() !== currentAccount) {
			sendTransaction(formData);
		} else {
			alert("Can't send to the same account");
		}
	};
	return (
		<div>
			<div id="send_form">
				<Form.Control className="send_form_field" required name="addressTo" placeholder="Address To" onChange={(e) => handleChange(e, 'addressTo')}></Form.Control>

				<Form.Control className="send_form_field" required name="amount" placeholder="Amount (Eth)" onChange={(e) => handleChange(e, 'amount')}></Form.Control>

				<Form.Control className="send_form_field" required name="keyword" placeholder="Keyword (Gif)" onChange={(e) => handleChange(e, 'keyword')}></Form.Control>

				<Form.Control required name="message" placeholder="Message" onChange={(e) => handleChange(e, 'message')}></Form.Control>
			</div>
			<Button className="exchange_button" onClick={handleSubmit}>
				Send
			</Button>
		</div>
	);
}
