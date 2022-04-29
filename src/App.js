import React, { useEffect } from 'react';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { About } from './components/About';
import Bookmarks from './components/Bookmarks';
import { Exchange } from './components/Exchange/Exchange';
import Market from './components/Market';
import Signin from './components/Signin';
import Signup from './components/Signup';
import logoNT from './logoNoTitle.svg';
import githubSVG from './githubSVG.svg';
import linkedInSVG from './linkedIn.png';

export default function App() {
	const [state, setState] = React.useState({
		coins: null,
		stats: null,
		isLoaded: false,
	});
	const [userState, setUserState] = React.useState({
		isAuth: false,
		user: null,
		message: null,
	});

	const navigate = useNavigate();

	useEffect(() => {
		let token = localStorage.getItem('token');
		if (token != null) {
			let user = jwtDecode(token);
			if (user) {
				setUserState({ ...userState, user, isAuth: true });
			} else {
				localStorage.removeItem('token');
				setUserState({ ...userState, isAuth: false });
			}
		}
		Axios.get('allCoins')
			.then((result) => {
				setState({
					...state,
					coins: result.data.data.coins,
					stats: result.data.data.stats,
					isLoaded: true,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const registerHandler = (user) => {
		Axios.post('auth/signup', user)
			.then((result) => {
				if (result.data.message === 'User created successfully') {
					navigate('/signin');
				} else {
					setUserState({ ...userState, message: result.data.message });
					setTimeout(() => {
						setUserState({
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
		console.log('run');
		Axios.post('auth/signin', cred)
			.then((result) => {
				if (result.data.token) {
					localStorage.setItem('token', result.data.token);
					let user = jwtDecode(result.data.token);
					setUserState({ ...userState, isAuth: true, user: user });
					navigate('/');
				} else {
					setUserState({ ...userState, message: result.data.message });
					setTimeout(() => {
						setUserState({
							message: '',
						});
					}, 3000);
				}
			})
			.catch((err) => {
				console.log(err);
				setUserState({ ...userState, isAuth: false });
			});
	};

	const logoutHandler = (e) => {
		e.preventDefault();
		localStorage.removeItem('token');
		setUserState({
			...userState,
			isAuth: false,
			user: null,
			message: 'Successfully Logged Out',
		});
		navigate('/');
		setTimeout(() => {
			setUserState({
				message: '',
			});
		}, 3000);
	};

	return (
		<>
			{state.isLoaded ? (
				<div>
					<nav>
						<ul className="nav-bar">
							<li className="nav-item">
								<Link className="nav-link" to="/">
									<img className="nav-logo" src={logoNT} alt="Logo"></img>
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
								<Link className="nav-link" to={userState.isAuth ? '/bookmarks' : '/signin'}>
									Bookmarks
								</Link>
							</li>
							{!userState.isAuth ? (
								<li className="nav-item">
									<Link className="nav-link" to="/signin">
										Sign In
									</Link>
								</li>
							) : (
								<></>
							)}
							{!userState.isAuth ? (
								<li className="nav-item">
									<Link className="nav-link" to="/signup">
										Sign Up
									</Link>
								</li>
							) : (
								<></>
							)}
							{userState.isAuth ? (
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
					{userState.message ? <div className="notification">{userState.message}</div> : <></>}
					<Routes>
						<Route path="/market" element={<Market coins={state.coins} stats={state.stats} user={userState.user} />} />
						<Route path="/bookmarks" element={<Bookmarks coins={state.coins} stats={state.stats} user={userState.user ? userState.user : null} />} />
						<Route path="/exchange" isLoaded={state.isLoaded} element={<Exchange user={userState.user} />} />
						<Route path="/signin" element={<Signin login={loginHandler} />} />
						<Route path="/signup" element={<Signup register={registerHandler} />} />
						<Route path="/" element={<About />} />
					</Routes>
					<footer id="footer">
						Derek Reid-Wilkinson &nbsp;
						<a className="nameLinks" href="https://github.com/Reidwids">
							<img className="footerSVG" src={githubSVG} alt="github Logo"></img>
						</a>
						&nbsp;
						<a className="nameLinks" href="https://www.linkedin.com/in/derek-reid-wilkinson-b20833228/">
							<img className="footerSVGL" src={linkedInSVG} alt="github Logo"></img>
						</a>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Brandon Samaroo&nbsp;
						<a className="nameLinks" href="https://github.com/BrandonSamaroo">
							<img className="footerSVG" src={githubSVG} alt="github Logo"></img>
						</a>
						&nbsp;
						<a className="nameLinks" href="https://www.linkedin.com/in/brandonsamaroo/">
							<img className="footerSVGL" src={linkedInSVG} alt="github Logo"></img>
						</a>
					</footer>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
