import Header from '../Header'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <Header />
    <div className="not-found">
      <img
        alt="not found"
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      />
      <h1 className="heading-not-found">Page Not Found</h1>
      <p className="paragraph-not-found">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  </div>
)

export default NotFound
