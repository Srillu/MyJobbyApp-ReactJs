import {Component} from 'react'

import {BsBriefcaseFill} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {AiFillStar} from 'react-icons/ai'
import {FiExternalLink} from 'react-icons/fi'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    jobDetails: '',
    similarJobs: [],
    skills: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.progress})
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    console.log(apiUrl)
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetailsData = await data.job_details
      console.log(jobDetailsData)
      const jobDetails = {
        companyLogoUrl: jobDetailsData.company_logo_url,
        companyWebsiteUrl: jobDetailsData.company_website_url,
        employmentType: jobDetailsData.employment_type,
        id: jobDetailsData.id,
        description: jobDetailsData.life_at_company.description,
        lifeAtCompanyImageUrl: jobDetailsData.life_at_company.image_url,
        jobDescription: jobDetailsData.job_description,
        location: jobDetailsData.location,
        packagePerAnnum: jobDetailsData.package_per_annum,
        rating: jobDetailsData.rating,
        title: jobDetailsData.title,
      }
      console.log(jobDetails)
      const similarJobs = await data.similar_jobs
      const skills = await data.job_details.skills
      const skillDetails = skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))
      this.setState({
        jobDetails,
        similarJobs,
        skills: skillDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderOnSuccess = () => {
    const {jobDetails, similarJobs, skills} = this.state
    return (
      <>
        <div className="jobcard-container">
          <div className="each-jobitem-card">
            <div>
              <div>
                <img
                  className="company-logo-url"
                  src={jobDetails.companyLogoUrl}
                  alt="job details company logo"
                />
              </div>
              <div>
                <h1 className="jobcard-headings">{jobDetails.title}</h1>
                <p>
                  <AiFillStar className="jobdetails-star" />
                  {jobDetails.rating}
                </p>
              </div>
            </div>
            <div className="middle-wise-container">
              <div style={{display: 'flex'}}>
                <div className="middle-container">
                  <ImLocation />
                  <p style={{marginRight: '10px'}}>{jobDetails.location}</p>
                </div>
                <div className="middle-container">
                  <BsBriefcaseFill />
                  <p>{jobDetails.employmentType}</p>
                </div>
              </div>
              <p>{jobDetails.packagePerAnnum}</p>
            </div>
            <hr className="line" />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h1 className="jobcard-headings">Description</h1>

              <a
                href={jobDetails.companyWebsiteUrl}
                rel="noreferrer"
                target="_blank"
                className="visit-link-a"
              >
                Visit
                <FiExternalLink className="job-visit-link-icon" />
              </a>
            </div>
            <p>{jobDetails.jobDescription}</p>
            <h1 className="jobcard-headings">Skills</h1>

            <ul className="skills-container">
              {skills.map(eachSkill => (
                <li key={eachSkill.name} className="skills-list-item">
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skill-image"
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-company-container">
              <div style={{marginRight: '20px'}}>
                <h1 className="jobcard-headings">Life at Company</h1>
                <p className="life-at-company-description">
                  {jobDetails.description}
                </p>
              </div>
              <div>
                <img
                  src={jobDetails.lifeAtCompanyImageUrl}
                  alt="life at company"
                  className="life-at-company-image"
                />
              </div>
            </div>
          </div>
          <div className="similar-jobscontainer">
            <h1 style={{marginLeft: '70px'}}>Similar Jobs</h1>
            <ul className="similar-jobs-items-container">
              {similarJobs.map(jobItem => (
                <li key={jobItem.id} className="similar-list-items">
                  <div>
                    <div>
                      <img
                        className="company-logo-url"
                        src={jobItem.company_logo_url}
                        alt="similar job company logo"
                      />
                    </div>
                    <div>
                      <h1 className="jobcard-headings">{jobItem.title}</h1>
                      <p>
                        <AiFillStar className="jobdetails-star" />
                        {jobItem.rating}
                      </p>
                    </div>
                  </div>
                  <h1 className="jobcard-headings">Description</h1>
                  <p>{jobItem.job_description}</p>
                  <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <ImLocation />
                      <p style={{marginRight: '10px'}}>{jobItem.location}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <BsBriefcaseFill />
                      <p>{jobItem.employment_type}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <div>
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
        </div>
        <button type="button" onClick={this.getJobDetails}>
          Retry
        </button>
      </div>
    </>
  )

  renderLoader = () => (
    <div className="jobdetail-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  jobsDetails = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderOnSuccess()
      case apiStatusConstants.progress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    return (
      <div className="job-bg-container">
        <Header />
        {this.jobsDetails(apiStatus)}
      </div>
    )
  }
}

export default JobItemDetailsRoute
