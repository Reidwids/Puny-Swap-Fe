import React from 'react';
import { Button } from 'react-bootstrap';
import logoText from '../logoText.svg';

export const About = () => {
	return (
		<div className="content-section" id="about">
			<div className="left">
				<img src="https://i.ibb.co/23tM3w6/Logo.png" alt="Logo with Title" className="full-logo"></img>
			</div>
			<div className="right">
				<div id="about_cont">
					<h3 id="about_cont_title">Welcome to</h3>
					<img id="logo_text" src={logoText} alt="" />
					<p id="about_cont_body">A uniswap clone that allows you to send and swap crypto currencies! We provide services for sending ethereum, or swapping any tokens from 3 of the most popular networks - ETH, BSC, and Polygon. </p>
					<Button href="/signup" id="about_button">
						<span>Get Started</span>
					</Button>
				</div>
			</div>
		</div>
	);
};
