import {Component} from 'react'
import Loading from '../Loading'
import FailureView from '../FailureView'
import CategoryItem from '../CategoryItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Home extends Component {
  state = {
    categoryItemsList: [],
    isLoading: false,
    optionId: 'ALL',
    errorMessage: false,
  }

  componentDidMount() {
    this.getCategoryListOnOption()
  }

  componentDidUpdate(prevProps, prevState) {
    const {optionId} = this.state
    if (prevState.optionId !== optionId) {
      this.getCategoryListOnOption()
    }
  }

  onFetchApiFailureRetryFetch = () => {
    this.getCategoryListOnOption()
  }

  getCategoryListOnOption = async () => {
    const {optionId} = this.state
    this.setState({isLoading: true, errorMessage: false})
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${optionId}`
    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const fetchedDetails = await response.json()
        const data = fetchedDetails.projects.map(eachItem => ({
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          name: eachItem.name,
        }))
        this.setState({categoryItemsList: data, isLoading: false})
      } else {
        this.setState({errorMessage: true, isLoading: false})
        console.error('Failed to fetch')
      }
    } catch (error) {
      this.setState({errorMessage: true, isLoading: false})
      console.error('Fetch Failure', error)
    }
  }

  onChangeOptionSelect = event => {
    const selectedOptionId = event.target.value
    this.setState({optionId: selectedOptionId})
  }

  render() {
    const {isLoading, categoryItemsList, errorMessage} = this.state

    return (
      <div className="home-container">
        <select
          className="select-container"
          onChange={this.onChangeOptionSelect}
        >
          {categoriesList.map(eachItem => (
            <option key={eachItem.id} value={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>

        {isLoading && !errorMessage && <Loading />}
        {!isLoading && errorMessage && (
          <FailureView
            onFetchApiFailureRetryFetch={this.onFetchApiFailureRetryFetch}
          />
        )}
        {!isLoading && !errorMessage && (
          <ul className="category-list-items-container">
            {categoryItemsList.map(eachItem => (
              <CategoryItem key={eachItem.id} itemDetails={eachItem} />
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default Home
