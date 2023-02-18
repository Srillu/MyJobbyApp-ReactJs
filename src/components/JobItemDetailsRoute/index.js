import {Component} from 'react'

import {BsBriefcaseFill} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {FcRating} from 'react-icons/fc'

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

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

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
        <div>
          <div className="each-job-card">
            <div>
              <div>
                <img
                  src={jobDetails.companyLogoUrl}
                  alt="job details company logo"
                />
              </div>
              <div>
                <h1>{jobDetails.title}</h1>
                <p>
                  <FcRating />
                  {jobDetails.rating}
                </p>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <ImLocation />
                  <p>{jobDetails.location}</p>
                </div>
                <div>
                  <BsBriefcaseFill />
                  <p>{jobDetails.employmentType}</p>
                </div>
              </div>
              <p>{jobDetails.packagePerAnnum}</p>
            </div>
            <hr />
            <div>
              <h1>Description</h1>
              <a
                href={jobDetails.companyWebsiteUrl}
                rel="noreferrer"
                target="_blank"
              >
                Visit
              </a>
            </div>
            <p>{jobDetails.jobDescription}</p>
            <h1>Skills</h1>

            <ul>
              {skills.map(eachSkill => (
                <li key={eachSkill.name}>
                  <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <div>
                <h1>Life at Company</h1>
                <p>{jobDetails.description}</p>
              </div>
              <div>
                <img
                  src={jobDetails.lifeAtCompanyImageUrl}
                  alt="life at company"
                />
              </div>
            </div>
          </div>
          <div>
            <h1>Similar Jobs</h1>
          </div>
          <ul className="similar-jobs-items-container">
            {similarJobs.map(jobItem => (
              <li key={jobItem.id} className="similar-list-items">
                <div>
                  <div>
                    <img
                      src={jobItem.company_logo_url}
                      alt="similar job company logo"
                    />
                  </div>
                  <div>
                    <h1>{jobItem.title}</h1>
                    <p>
                      <FcRating />
                      {jobItem.rating}
                    </p>
                  </div>
                </div>
                <h1>Description</h1>
                <p>{jobItem.job_description}</p>
                <div>
                  <div>
                    <div>
                      <ImLocation />
                      <p>{jobItem.location}</p>
                    </div>
                    <div>
                      <BsBriefcaseFill />
                      <p>{jobItem.employment_type}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
