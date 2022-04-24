import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Container, Form, Button } from 'react-bootstrap';

export const About = () => {
	const { sendTransaction, connectWallet, currentAccount, formData, handleChange, setFormData } = useContext(TransactionContext);

	const handleSubmit = (e) => {
		// const {addressTo, amount, keyword, message} = formData;
		e.preventDefault();
		sendTransaction(formData);
	};

	return (
		<div className="content-section" id="about">
			<div className="left">
				<img src="https://i.ibb.co/23tM3w6/Logo.png" alt="Logo with Title" className="full-logo"></img>
			</div>
			<div className="right">
				<div>
					<h3>Welcome to PunySwap</h3>
					<h5>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis odit, itaque, quisquam rem molestias nesciunt corporis iure, delectus dolorem illo neque officiis expedita error aut ipsam ipsa praesentium! Saepe, sunt.</h5>
					<a href="http://localhost:3000/signup" className="btn">
						Get Started
					</a>
					<Container>
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
						<Button varient="primary" onClick={handleSubmit}>
							Send Now
						</Button>
					</Container>

					{!currentAccount && (
						<button type="button" onClick={connectWallet}>
							Connect Wallet
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
