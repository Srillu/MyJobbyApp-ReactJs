import {Component} from 'react'

import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagRemoveSharp} from 'react-icons/io5'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

// import JobItemDetailsRoute from '../JobItemDetailsRoute'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileList: [],
    apiStatus: apiConstants.initial,
    jobsApiStatus: apiConstants.initial,
    employeeType: [],
    expectedSalary: '',
    inputValue: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({jobsApiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedProfileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileList: updatedProfileDetails,
        jobsApiStatus: apiConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiConstants.failure})
    }
  }

  retryButton = () => this.getProfile()

  renderProfileFailureView = () => (
    <div
      style={{
        display: 'flex',
        padding: '50px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button
        className="header-logout-button"
        type="button"
        onClick={this.retryButton}
      >
        Retry
      </button>
    </div>
  )

  jobProfileOnSuccess = () => {
    const {profileList} = this.state
    const {name, profileImageUrl, shortBio} = profileList
    return (
      <div className="profile-details-container">
        <img alt="profile" src={profileImageUrl} />
        <h1 className="profile-name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileBasedOnApi = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.jobProfileOnSuccess()
      case apiConstants.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {employeeType, expectedSalary, inputValue} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType}&minimum_package=${expectedSalary}&search=${inputValue}`
    console.log(apiUrl)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  searchInput = () => {
    this.getJobs()
  }

  onChangeSearchInput = event => {
    this.setState({inputValue: event.target.value})
  }

  onChangeEmployee = event => {
    const {employeeType} = this.state
    console.log(event.target.id)

    const filterArray = employeeType.filter(
      eachItem => eachItem === event.target.id,
    )

    if (filterArray.length === 0) {
      this.setState(
        prevState => ({
          employeeType: [...prevState.employeeType, event.target.id],
        }),
        this.getJobs,
      )
    } else {
      const filteredArray = employeeType.filter(
        eachItem => eachItem !== event.target.id,
      )

      this.setState({employeeType: filteredArray}, this.getJobs)
    }
  }

  onChangeSalary = event => {
    console.log(event.target.id)
    this.setState({expectedSalary: event.target.id}, this.getJobs)
  }

  renderTypeOfEmployment = () => (
    <ul className="type-employment-container">
      <h1 className="heading">Type of Employment</h1>
      {employmentTypesList.map(eachItem => (
        <li key={eachItem.employmentTypeId} className="employee-item">
          <input
            type="checkbox"
            id={eachItem.employmentTypeId}
            onChange={this.onChangeEmployee}
          />
          <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  renderSalaryRangesList = () => (
    <ul className="type-employment-container">
      <h1 className="heading">Salary Range</h1>
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId} className="employee-item">
          <input
            type="radio"
            id={eachItem.salaryRangeId}
            name="radioBox"
            onChange={this.onChangeSalary}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  renderJobsBasedOnApi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onClickRetryJobsButton = () => {
    this.getJobs()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <div>
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.onClickRetryJobsButton}>
          Retry
        </button>
      </div>
    </div>
  )

  noJobsView = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs"
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-para">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  allJobs = () => {
    const {jobsList, employeeType} = this.state
    // console.log(jobsList)
    console.log(employeeType)
    return (
      <ul className="jobs-list">
        {jobsList.map(jobs => (
          <li className="each-job-card" key={jobs.id}>
            <Link to={`/jobs/${jobs.id}`} className="link-item">
              <div className="logo-container">
                <img
                  alt="company logo"
                  className="company-logo"
                  src={jobs.companyLogoUrl}
                />
                <div>
                  <h1 className="title-heading">{jobs.title}</h1>
                  <div className="star-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{jobs.rating}</p>
                  </div>
                </div>
              </div>
              <div className="middle-wise-container">
                <div style={{display: 'flex'}}>
                  <div className="middle-container">
                    <IoLocationSharp className="location-icon" />
                    <p className="rating">{jobs.location}</p>
                  </div>

                  <div className="middle-container">
                    <IoBagRemoveSharp className="location-icon" />
                    <p className="rating">{jobs.employmentType}</p>
                  </div>
                </div>
                <div className="package">
                  <p>{jobs.packagePerAnnum}</p>
                </div>
              </div>
              <hr className="line" />
              <h1 className="description">Description</h1>
              <p className="description-paragraph">{jobs.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderSuccessView = () => {
    const {jobsList} = this.state
    const isShowJobsList = jobsList.length === 0

    return isShowJobsList ? this.noJobsView() : this.allJobs()
  }

  renderJobsList = () => {
    const {inputValue} = this.state
    return (
      <>
        <div className="job-container">
          <div className="search-input-container-mobile">
            <input
              type="search"
              className="input-box"
              placeholder="search"
              onChange={this.onChangeSearchInput}
              value={inputValue}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-icon-button"
              onClick={this.searchInput}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div>
            {this.renderProfileBasedOnApi()}
            <hr />
            <div className="profile-container">
              {this.renderTypeOfEmployment()}
              <hr />
              {this.renderSalaryRangesList()}
            </div>
          </div>
          <div>
            <div className="search-input-container">
              <input
                type="search"
                className="input-box"
                placeholder="search"
                onChange={this.onChangeSearchInput}
                value={inputValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon-button"
                onClick={this.searchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsBasedOnApi()}
          </div>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <>
        <div className="job-bg-container">
          <Header />
          {this.renderJobsList()}
        </div>
      </>
    )
  }
}

export default Jobs
