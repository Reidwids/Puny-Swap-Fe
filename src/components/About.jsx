import React from 'react';

export const About = () => {
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
				</div>
			</div>
		</div>
	);
};
