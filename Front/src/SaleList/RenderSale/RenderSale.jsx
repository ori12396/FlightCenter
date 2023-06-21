import './RenderSale.css';
import RenderSaleMoreData from "./RenderSaleMoreData/RenderSaleMoreData";
import { Link } from 'react-router-dom';

export default function RenderSale({ saleid, usernamesale, fromcity, fromcountry, tocity, tocityimg, tocountry, flightdate, airlineid, airlinename, logo, price, flightnumber, starthour, endhour, userID, user, toDelete }) {
  return (
    <div className="col-sm-4 margin40">
      <Link to="/BuySpecificFlight" state={{ saleid, usernamesale, fromcity, fromcountry, tocity, tocityimg, tocountry, flightdate, airlineid, airlinename, logo, price, flightnumber, starthour, endhour, userID, user, toDelete }}
      >


        <div className="item-img-wrap">
          <img src={tocityimg} className="img-responsive standard-height" alt="workimg" id="gameImg" />
          <div className="item-img-overlay">
            <span></span>
          </div>
        </div>
      </Link>

      <div className="work-desc">
        <div className="d-flex justify-content-between">
          <h3>
            <a style={{ whiteSpace: 'pre-wrap' }}>
              {((tocity && tocountry) ? (tocity.toLowerCase().includes(tocountry.toLowerCase()) ? tocity : (tocity + ", " + tocountry)) + "." : "")}
            </a>
          </h3>
          <div className="d-flex justify-content-end gap-1 get-margin-up">
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <RenderSaleMoreData
              flightdate={flightdate}
              starthour={starthour}
              price={price} />
          </div>
          <div className="d-flex justify-content-end gap-1">
            <img src={logo} className="flex justify-content-center align-items-center img-responsive img-rounded img-small logo" alt={airlinename}></img>
          </div>
        </div>
      </div>
    </div>
  );
}
