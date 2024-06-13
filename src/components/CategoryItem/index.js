import './index.css'

const CategoryItem = props => {
  const {itemDetails} = props
  const {imageUrl, name} = itemDetails
  return (
    <li className="item-container">
      <img className="item-image" src={imageUrl} alt={name} />
      <p className="item-name">{name}</p>
    </li>
  )
}

export default CategoryItem
