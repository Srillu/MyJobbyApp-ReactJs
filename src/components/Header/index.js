import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'

import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <ul className="nav-header">
      <div className="blog-container">
        <Link to="/">
          <li>
            <img
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </li>
        </Link>
      </div>
      <div className="nav-menu">
        <Link className="nav-link" to="/">
          <li>Home</li>
        </Link>
        <Link className="nav-link" to="/jobs">
          <li>Jobs</li>
        </Link>
      </div>
      <div>
        <button
          type="button"
          className="header-logout-button"
          onClick={onClickLogOut}
        >
          Logout
        </button>
      </div>
    </ul>
  )
}
export default withRouter(Header)
