import React, { Component } from 'react'

export default class Signin extends Component {

  state = {}

  changeHandler = (e) => {
      let temp = {...this.state}
      temp[e.target.name] = e.target.value
      this.setState(temp)
  }

  loginHandler = (e)=>{
    e.preventDefault()
    this.props.login(this.state)
  }

  render() {
    return (
      <div className='content-section'>
        <form>
          <label>Email Address</label>
          <input type="email" name="emailAddress" onChange={this.changeHandler}></input>
          <label>Password</label>
          <input type="password" name="password" onChange={this.changeHandler}></input>
          <input type="submit" value="Submit" onClick={(e)=>this.loginHandler(e)}></input>
        </form>
      </div>
    )
  }
}
