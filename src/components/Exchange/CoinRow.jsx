import React from 'react';

export default function CoinRow(props) {
	return (
		<div data-address={props.dataAddress} className={'token_row'} onClick={() => props.selectToken(props.dataAddress, props.side)}>
			<img className="token_list_img" src={props.token.logoURI} alt="Token"></img>
			<span className="token_list_text">{props.token.symbol}</span>
		</div>
	);
}
