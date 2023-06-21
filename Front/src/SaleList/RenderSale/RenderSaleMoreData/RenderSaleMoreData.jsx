import './RenderSaleMoreData.css'

export default function RenderGameCategories({ flightdate, starthour, price }) {
  return (
    <span className="my-parent-span">
      <span className="badge rounded-pill bg-dark my-child-span">{flightdate}</span>
      <span className="badge rounded-pill bg-dark my-child-span">{starthour}</span>
      <span className="badge rounded-pill bg-dark my-child-span">{price + '$'}</span>
    </span>
  );
}