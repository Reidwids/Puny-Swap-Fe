import React, { useContext, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { Container, Form, Button } from 'react-bootstrap';

export default function Swap() {
	return (
		<div id="swap_form">
			<div id="form">
				<div class="swapbox">
					<div class="swapbox_select token_select" id="from_token_select">
						<img class="token_image" id="from_token_img" />
						<span id="from_token_text"></span>
					</div>
					<div class="swapbox_select">
						<input class="number form-control" placeholder="amount" id="from_amount" />
					</div>
				</div>
				<div class="swapbox">
					<div class="swapbox_select token_select" id="to_token_select">
						<img class="token_image" id="to_token_img" />
						<span id="to_token_text"></span>
					</div>
					<div class="swapbox_select">
						<input class="number form-control" placeholder="amount" id="to_amount" />
					</div>
				</div>
				<div>
					Estimated Gas: <span id="gas_estimate"></span> Eth
				</div>
				{/* <!-- Make button below disabled when not logged in --> */}
				<Button className="exchange_button">Swap</Button>
			</div>
		</div>
	);
}
