import React, { Component } from 'react';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { About } from './components/About';
import Bookmarks from './components/Bookmarks';
import Exchange from './components/Exchange';
import Market from './components/Market';
import Signin from './components/Signin';
import Signup from './components/Signup';

export default class App extends Component {
	render() {
		return (
			<div>
				<Router>
					<nav>
						<ul className="nav-bar">
							<li className="nav-item">
								<Link className="nav-link" to="/">
									<img
										className="nav-logo"
										src="https://i.ibb.co/8DLW99t/Logo-No-Title.png"
										alt="Logo"
									></img>
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/market">
									Market
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/exchange">
									Exchange
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/bookmarks">
									Bookmarks
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/signin">
									Sign In
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/signup">
									Sign Up
								</Link>
							</li>
						</ul>
					</nav>
					<Routes>
						<Route path="/" element={<About />} />
						<Route path="/market" element={<Market />} />
						<Route path="/exchange" element={<Exchange />} />
						<Route path="/bookmarks" element={<Bookmarks />} />
						<Route path="/signin" element={<Signin />} />
						<Route path="/signup" element={<Signup />} />
					</Routes>
				</Router>
			</div>
		);
	}
}
