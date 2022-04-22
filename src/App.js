import React, { useEffect } from 'react';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { About } from './components/About';
import Bookmarks from './components/Bookmarks';
import Exchange from './components/Exchange';
import Market from './components/Market';
import Signin from './components/Signin';
import Signup from './components/Signup';

export default function App() {
	const [state, setState] = React.useState({
		isAuth: false,
		user: null,
		message: null,
		coins: null,
		stats: null,
		isLoaded: false
	});
	const navigate = useNavigate();

	useEffect(() => {
		let token = localStorage.getItem('token');
		if (token != null) {
			let user = jwtDecode(token);
			if (user) {
				setState({ ...state, isAuth: true, user: user });
			} else {
				localStorage.removeItem('token');
				setState({ ...state, isAuth: false });
			}
		}
		Axios.get('allCoins')
		.then((result) => {
			console.log(result.data.data.coins)
			setState({...state,
				coins: result.data.data.coins,
				stats: result.data.data.stats,
				isLoaded: true
			})
		}).catch((err) => {
			console.log(err)
		});
	}, []);

	const registerHandler = (user) => {
		Axios.post('auth/signup', user)
			.then((result) => {
				if (result.data.message === 'User created successfully') {
					navigate('/signin');
				} else {
					setState({ ...state, message: result.data.message });
					setTimeout(() => {
						setState({
							message: '',
						});
					}, 3000);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const loginHandler = (cred) => {
		Axios.post('auth/signin', cred)
			.then((result) => {
				if (result.data.token) {
					localStorage.setItem('token', result.data.token);
					let user = jwtDecode(result.data.token);
					setState({ ...state, isAuth: true, user: user });
					navigate('/');
				} else {
					setState({ ...state, message: result.data.message });
					setTimeout(() => {
						setState({
							message: '',
						});
					}, 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				setState({ ...state, isAuth: false });
			});
	};

	const logoutHandler = (e) => {
		e.preventDefault();
		localStorage.removeItem('token');
		console.log(state.coins)
		setState({
			...state,
			isAuth: false,
			user: null,
			message: 'Successfully Logged Out',
		});
		setTimeout(() => {
			setState({
				message: '',
			});
		}, 3000);
	};

	return (
		<>{state.isLoaded?
		<div>
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
						<Link
							className="nav-link"
							to={state.isAuth ? '/bookmarks' : '/signin'}
						>
							Bookmarks
						</Link>
					</li>
					{!state.isAuth ? (
						<li className="nav-item">
							<Link className="nav-link" to="/signin">
								Sign In
							</Link>
						</li>
					) : (
						<></>
					)}
					{!state.isAuth ? (
						<li className="nav-item">
							<Link className="nav-link" to="/signup">
								Sign Up
							</Link>
						</li>
					) : (
						<></>
					)}
					{state.isAuth ? (
						<li className="nav-item">
							<Link className="nav-link" to="/signout" onClick={logoutHandler}>
								Log Out
							</Link>
						</li>
					) : (
						<></>
					)}
				</ul>
			</nav>
			{state.message ? (
				<div className="notification">{state.message}</div>
			) : (
				<></>
			)}
			<Routes>
				<Route path="/market" element={<Market coins={state.coins} stats={state.stats}/>} />
				<Route path="/exchange" element={<Exchange />} />
				<Route path="/bookmarks" element={<Bookmarks />} />
				<Route path="/signin" element={<Signin login={loginHandler} />} />
				<Route
					path="/signup"
					element={
						<Signup message={state.message} register={registerHandler} />
					}
				/>
				<Route path="/" element={<About />} />
			</Routes>
		</div>
		:
		<></>}</>
	);
}
