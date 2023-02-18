import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', error: '', isShowingError: false}

  submitSuccess = jwtToken => {
    console.log(jwtToken)
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  showFailure = error => {
    this.setState({isShowingError: true, error})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitButton = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.showFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, error, isShowingError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form onSubmit={this.onSubmitButton} className="form-container">
          <img
            className="logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />

          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Username"
            className="input-el"
            id="username"
            type="text"
          />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
            className="input-el"
            id="password"
            type="password"
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {isShowingError ? <p className="error-msg"> *{error}</p> : null}
        </form>
      </div>
    )
  }
}

export default LoginRoute
