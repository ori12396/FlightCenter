import './RenderCategory.css'

export default function RenderCategory({ category, func }) {
  const text = category[1];
  return <a href="#" className="dropdown-item" onClick={() => func(category)}>{text}</a>;
}