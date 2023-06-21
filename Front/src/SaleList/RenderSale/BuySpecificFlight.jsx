import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import RenderSale from './RenderSale';
import Modal from 'react-modal';
import APIService from '../../Components/APIService';

function BuySpecificFlight() {
  const navigateTo = useNavigate();
  const location = useLocation();
  const {
    saleid,
    usernamesale,
    fromcity,
    fromcountry,
    tocity,
    tocityimg,
    tocountry,
    flightdate,
    airlineid,
    airlinename,
    logo,
    price,
    flightnumber,
    starthour,
    endhour,
    userID,
    user,
    toDelete,
  } = location.state;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveFlight = () => {
    setIsModalOpen(true);
  };

  const handleConfirmation = async () => {
    setIsModalOpen(false);
    try {
      await APIService.DeleteSale(saleid);
      console.log('Flight deleted successfully');
      navigateTo('/BuyFlight', { state: { userID, user } });
      // Perform any necessary actions after deleting the flight
    } catch (error) {
      console.error('Error deleting flight:', error);
      // Handle error while deleting the flight
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="item-img-wrap">
                <img src={tocityimg} className="img-responsive standard-height" alt="workimg" id="gameImg" />
                <div className="item-img-overlay">
                  <span></span>
                </div>
              </div>
              <br></br>
              <span className="my-parent-span">
                <span className="badge rounded-pill bg-black my-child-span">flight date: {flightdate}</span>
                <span className="badge rounded-pill bg-dark my-child-span">departure time: {starthour}</span>
                <span className="badge rounded-pill bg-dark my-child-span">price: {price + '$'}</span>
              </span>
              <hr />
              <div className="form-group"></div>
              <hr />
              <h5 className="card-title">{`${fromcountry} -> ${tocountry}`}</h5>
              <h5 className="card-title">{`${fromcity} -> ${tocity}`}</h5>
              <p className="card-text">Date: {flightdate}</p>
              <p>Airline: {airlinename} ({airlineid})</p>
              <p>Flight Number: {flightnumber}</p>
              <p>Departure Time: {starthour}</p>
              <p>Arrival Time: {endhour}</p>
              <div className="form-group">
                <label htmlFor="price">Price: {price + '$'}</label>
                <br></br>
                <br></br>
                {/* <input
                  type="text"
                  id="price"
                  name="price"
                  value={price + '$'}
                  readOnly
                  className="form-control"
                /> */}
                {toDelete ? (
                  <button className="btn btn-danger mr-2" onClick={handleRemoveFlight}>
                    Remove Flight
                  </button>
                ) : (
                  <Link to="/PayForFlight" state={{ saleid, usernamesale, fromcity, fromcountry, tocity, tocityimg, tocountry, flightdate, airlineid, airlinename, logo, price, flightnumber, starthour, endhour, userID, user, toDelete }}
                    className="btn btn-primary mr-2">Proceed To Buy Ticket
                  </Link>
                )}
                {toDelete ? (
                  <Link to="/BuyFlight" className="btn btn-secondary" state={{ userID, user }}>
                    Cancel
                  </Link>
                ) : (
                  <Link to="/SaleList" className="btn btn-secondary" state={userID}>
                    Cancel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        contentLabel="Modal"
        style={{
          content: {
            width: '300px',
            height: '200px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <h2>Hello {user[1]}!</h2>
        <p>Are you sure you want to delete this flight?</p>
        <div className="modal-buttons">
          <button onClick={handleConfirmation}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default BuySpecificFlight;
