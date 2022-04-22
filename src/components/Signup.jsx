import React, { Component } from 'react'

export default class Signup extends Component {

  state = {}

  changeHandler = (e) => {
      let temp = {...this.state}
      temp[e.target.name] = e.target.value
      this.setState(temp)
  }

  registerHandler = (e)=>{
    e.preventDefault()
    this.props.register(this.state)
  }

  render() {
    return (
      <div className='content-section'>
        <form className='auth-form'>
          <h4>Register</h4>
          <h6>Join us today!</h6>
          <label>First Name</label>
          <input type="text" name="firstName" onChange={this.changeHandler}></input>
          <label>Last Name</label>
          <input type="text" name="lastName" onChange={this.changeHandler}></input>
          <label>Email Address</label>
          <input type="email" name="emailAddress" onChange={this.changeHandler}></input>
          <label>Password</label>
          <input type="password" name="password" onChange={this.changeHandler}></input>
          <input type="submit" value="Submit" onClick={(e)=>this.registerHandler(e)}></input>
        </form>
      </div>
    )
  }
}
