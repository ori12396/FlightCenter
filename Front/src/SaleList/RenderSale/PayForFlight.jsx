import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RenderSale from './RenderSale';
import Modal from 'react-modal';
import { BsBackspaceFill } from 'react-icons/bs';
import APIService from '../../Components/APIService';
import Spinner from '../../spinner/Spinner'
import PaypalCheckoutButton from './PaypalCheckoutButton';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineAirplaneTicket } from 'react-icons/md';
import './PayForFlight.css';

function PayForFlight() {
  const navigate = useNavigate();
  const location = useLocation();
  const [buyPassport, setBuyPassport] = useState("");
  const [userSale, setUserSale] = useState({});
  const [isOtherInMiddle, setIsOtherInMiddle] = useState(false);
  const [isMeInMiddle, setIsMeInMiddle] = useState(false);
  const [salephonenumber, setsalephonenumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [toDisable, setToDisable] = useState(true);
  const [isPassportNameEntered, setIsPassportNameEntered] = useState(false)
  const [showError, setShowError] = useState(false);
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

  const myobj = {
    'saleid': saleid,
    'usersale': usernamesale,
    'salenumber': userSale[5],
    'buynumber': user[5],
    'userbuy': user[1],
    'passportbuyname': buyPassport,
    'buymail': user[4],
    'fromcity': fromcity,
    'fromcountry': fromcountry,
    'tocity': tocity,
    'tocountry': tocountry,
    'flightdate': flightdate,
    'airlinename': airlinename,
    'price': parseInt(price) + 10,
    'flightnumber': flightnumber,
    'starthour': starthour,
    'endhour': endhour,
    'userID': userID,
  };

  useEffect(() => {
    setLoading(true);
    APIService.IsSaleInMiddleWithSomeone(saleid, flightnumber)
      .then((response) => response.json())
      .then((data) => {
        if (data['1'] === 'found') {
          setIsOtherInMiddle(true);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    APIService.IsSaleInMiddleWithMe(saleid, userID, flightnumber)
      .then((response) => response.json())
      .then((data) => {
        if (data['1'] === 'found') {
          setIsMeInMiddle(true);
          setLoading(false);
        }
      });
  }, [isOtherInMiddle]);

  useEffect(() => {
    APIService.FindUserByName(usernamesale)
      .then((response) => response.json())
      .then((data) => {
        setUserSale(data[1][0]);
      });
  }, []);

  const buyyerpay = async () => {
    try {
      setLoading(true);
      await APIService.PayForSale(myobj);
      setIsOtherInMiddle(true);
      setIsMeInMiddle(true);
      setBuyPassport("");
      // Perform any necessary actions after deleting the flight
    } catch (error) {
      console.error('Error pay flight:', error);
      // Handle error while deleting the flight
    }finally{
      setLoading(false);
    }
  };

  const buyyergotticket = async () => {
    try {
      setLoading(true);
      const sendTo = userSale[4];
      const sendTo2 = user[4];
      await APIService.initiatePayPalPayment(sendTo, sendTo2, price);
      await APIService.BuyyerGotTicket(myobj);
      navigate('/SaleList', { state: userID });
      // Perform any necessary actions after deleting the flight
    } catch (error) {
      console.error('Error sale the flight:', error);
      // Handle error while deleting the flight
    }finally{
      setLoading(false);
    }
  };
const handleChangePass = (e) => {
  setBuyPassport(e.target.value);
  setIsPassportNameEntered(e.target.value.trim() !== "");
  setToDisable(false);
  setShowError(false);
};


const handleClick = () => {
  if (!isPassportNameEntered) {
    setShowError(true);
    
    console.log("click");
  } 
};
  const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent form submission
  }
};




return (
  <div>
    <div className="navbar-dark bg-dark fixed-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/SaleList" className="backward-link" state={userID}>
        <BsBackspaceFill className="backward-icon" size={50} color="white" />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <MdOutlineAirplaneTicket size={75} color="white" />
        <h1 style={{ marginLeft: '10px', color: 'white' }}>Payment Page</h1>
      </div>
      <BsThreeDotsVertical size={30} color="white" style={{ cursor: 'pointer' }} />
    </div>
      
    {loading ? (
      <div className="paycontainer">
        <Spinner />
      </div>
    ) : (
      <div className="paycontainer">
        {isOtherInMiddle && isMeInMiddle && (
          <div>
            <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={buyyergotticket}>
              Click Me After You Got Your Ticket, then I'll return you $10
            </button>
          </div>
        )}
        {isOtherInMiddle && !isMeInMiddle && (
          <div className="">
            <label htmlFor="fr" className="bubble">
              Sorry, someone else is already in the process of buying this ticket.
            </label>
          </div>
        )}
        {!isOtherInMiddle && !isMeInMiddle && (
          <div className="">
            <label htmlFor="fr" className="form-label" style={{ color: "red", fontSize: '25px' }}>Please open your phone and save the number: +14155238886 as "Flights Center". Then, send the following message via WhatsApp to this number: join old-memory. After that, make a payment of $129, enter your passport full name, and press the button.</label>
            <br />
            <a href="https://wa.me/14155238886?text=join+old-memory" target="_blank" rel="noopener noreferrer">CLICK ME</a>
            <br />
            <br />
            <form className="payment-form" onSubmit={buyyerpay}>
              <div className="form-group">
                <label htmlFor="buypassport" className="input-label">
                  PASSPORT NAME
                </label>
                <div className="input-error-container">
                  <input
                    type="text"
                    className={`form-control input-field ${!isPassportNameEntered && showError ? 'error' : ''}`}
                    id="buypassport"
                    value={buyPassport}
                    placeholder="Your Passport Full Name"
                    onChange={handleChangePass}
                    onKeyDown={handleKeyDown}
                  />
                  {!isPassportNameEntered && showError && (
                    <div className="error-message">
                      <strong>You cannot proceed until you enter your passport name.</strong>
                    </div>
                  )}
                </div>
              </div>
              <div className="paypal-button-container">
                <PaypalCheckoutButton
                  toDisable={!isPassportNameEntered || toDisable}
                  product={myobj}
                  buyyerpay={buyyerpay}
                  userSale={userSale}
                  handleClick={handleClick}
                />
              </div>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {isOtherInMiddle && isMeInMiddle && (
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-secondary btn-lg btn-block"
                        onClick={buyyergotticket}
                      >
                        Click Me After You Got Your Ticket, then I'll return you $10
                      </button>
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        )}
      </div>
    )}
  </div>
);


}

export default PayForFlight;
