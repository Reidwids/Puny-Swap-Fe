import React, { Component } from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';

export default class Signup extends Component {
	state = {};

	changeHandler = (e) => {
		let temp = { ...this.state };
		temp[e.target.name] = e.target.value;
		this.setState(temp);
	};

	registerHandler = (e) => {
		e.preventDefault();
		this.props.register(this.state);
	};

	render() {
		return (
			<div className="logPage">
				<Container className="logContainer">
					<h4>Register</h4>
					<h6>Join us today!</h6>
					<Form.Group className="row d-flex justify-content-center">
						<Form.Label className="logLabels">First Name</Form.Label>
						<Col className="col-12">
							<Form.Control type="text" name="firstName" onChange={this.changeHandler}></Form.Control>
						</Col>
					</Form.Group>
					<Form.Group className="row d-flex justify-content-center">
						<Form.Label className="logLabels">Last Name</Form.Label>
						<Col className="col-12">
							<Form.Control type="text" name="lastName" onChange={this.changeHandler}></Form.Control>
						</Col>
					</Form.Group>
					<Form.Group className="row d-flex justify-content-center">
						<Form.Label className="logLabels">Email Address</Form.Label>
						<Col className="col-12">
							<Form.Control type="email" name="emailAddress" onChange={this.changeHandler}></Form.Control>
						</Col>
					</Form.Group>
					<Form.Group className="row d-flex justify-content-center">
						<Form.Label className="logLabels">Password</Form.Label>
						<Col className="col-12">
							<Form.Control type="password" name="password" onChange={this.changeHandler}></Form.Control>
						</Col>
					</Form.Group>
					<Button type="submit" className="logSubmit" onClick={(e) => this.registerHandler(e)}>
						Submit
					</Button>
				</Container>
			</div>
		);
	}
}
