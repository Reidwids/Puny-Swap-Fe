import React from 'react';

export default function CoinRow(props) {
	return (
		<div data-address={props.dataAddress} className={'token_row'} onClick={props.selectToken}>
			<img class="token_list_img" src={props.token.logoURI}></img>
			<span class="token_list_text">{props.token.symbol}</span>
		</div>
	);
}
