import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'

import {FaBriefcase} from 'react-icons/fa'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-headers">
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

      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <div className="blog-container">
            <Link to="/">
              <li>
                <img
                  alt="website logo"
                  className="header-mobile-logo"
                  src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                />
              </li>
            </Link>
          </div>
          <div className="nav-icon-container">
            <li className="nav-menu-item-mobile">
              <Link to="/" className="nav-link">
                <AiFillHome className="nav-bar-img" />
              </Link>
            </li>

            <li className="nav-menu-item-mobile">
              <Link to="/jobs" className="nav-link">
                <FaBriefcase className="nav-bar-img" />
              </Link>
            </li>

            <li className="nav-menu-item-mobile">
              <button
                type="button"
                className="mobile-logout-button"
                onClick={onClickLogOut}
              >
                <FiLogOut className="nav-bar-img" />
              </button>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
