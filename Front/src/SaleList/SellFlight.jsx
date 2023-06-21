import React, { useState, useMemo, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import countryList from 'react-select-country-list'
import Modal from 'react-modal';
import Select from 'react-select'
import { MdOutlineAirplaneTicket } from 'react-icons/md';
import { BsBackspaceFill } from 'react-icons/bs';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import APIService from "../Components/APIService"
import Spinner from "../spinner/Spinner"
Modal.setAppElement('#root');
export default function SellFlight() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userID, user } = location.state;
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [price, setPrice] = useState("");
  const [departureTime, setDepartureTime] = useState('');
  const [landingTime, setLandingTime] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const options = useMemo(() => countryList().getData(), [])
  const [airlineList, setAirlineList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const fromCountryChangeHandler = (selectedOption) => {
    setFromCountry(selectedOption.label)
  }
  const toCountryChangeHandler = (selectedOption) => {
    setToCountry(selectedOption.label)
  }
  useEffect(() => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(user)
    const getAirlineList = async () => {
      try {
        const response = await APIService.GetAirlines();
        const data = await response.json();
        setAirlineList(data[1]);
      } catch (error) {
        console.error(error);
      }
    }

    getAirlineList();
  }, []);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "fromCity":
        setFromCity(value);
        break;
      case "toCity":
        setToCity(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
      case "departureTime":
        setDepartureTime(value);
        break;
      case "landingTime":
        setLandingTime(value);
        break;
      case "airlineName":
        setAirlineName(value);
        break;
      case "flightNumber":
        setFlightNumber(value);
        break;
      case "price":
        setPrice(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       setLoading(true);
      // Get city image
      const cityImgResponse = await APIService.GetCityImage(toCity);
      const cityImgData = await cityImgResponse.json();
      const cityImg = cityImgData ? cityImgData[1] : null;

      // Get airline ID
      const airlineIdResponse = await APIService.GetAirlineIdByName(airlineName);
      const airlineIdData = await airlineIdResponse.json();
      const airlineId = airlineIdData ? airlineIdData[1] : null;

      // Get airline logo
      const airlineLogoResponse = await APIService.GetAirlineLogoByName(airlineName);
      const airlineLogoData = await airlineLogoResponse.json();
      const airlineLogo = airlineLogoData ? airlineLogoData[1] : null;

      // Get sale user name
      const saleUserResponse = await APIService.FindUserByID(userID);
      const saleUserData = await saleUserResponse.json();
      const saleUserName = saleUserData ? saleUserData[1][0][1] : null;

      // Create new sale object
      const myNewSale = {
        usersale: saleUserName,
        fromcity: fromCity,
        fromcountry: fromCountry,
        tocity: toCity,
        tocityimg: cityImg,
        tocountry: toCountry,
        flightdate: startDate.toString(),
        airlineid: airlineId,
        airlinename: airlineName,
        logo: airlineLogo,
        price: price.toString(),
        flightnumber: flightNumber,
        starthour: departureTime.toString(),
        endhour: landingTime.toString(),
      };

      // Insert new sale and navigate to sale list
      const insertSaleResponse = await APIService.InsertSale(myNewSale);
      const insertSaleData = await insertSaleResponse.json();
      const isSucceedAddNewSale = insertSaleData ? true : false;

      if (isSucceedAddNewSale) {
        navigate('/SaleList', { state: userID });
      }
    } catch (error) {
      console.error(error);
    }finally {
       setLoading(false);
    }
  };


  const handleClear = () => {
    setFromCountry("");
    setFromCity("");
    setToCountry("");
    setToCity("");
    setStartDate("");
    setDepartureTime("");
    setLandingTime("");
    setAirlineName("");
    setFlightNumber("");
    setPrice("");
  };

  return (
    <div className="container">
      <div className="container bootstrap snippets bootdeys">
        <div className="row align-items-center">
          <div className="navbar-dark bg-dark fixed-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/SaleList" className="backward-link" state={userID}>
              <BsBackspaceFill className="backward-icon" size={50} color="white" />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <MdOutlineAirplaneTicket size={75} color="white" />
              <h1 style={{ marginLeft: '10px', color: 'white' }}>SELL FLIGHT </h1>
            </div>
            <BsThreeDotsVertical size={30} color="white" onClick={openModal} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
      {loading ? (<Spinner/>):(
      <form onSubmit={handleSubmit} className="content">

        <div className="mb-3">
          <label htmlFor="fromCountry" className="form-label" style={{ color: "white" }}>From Country:</label>
          <Select options={options} value={{ label: fromCountry, value: fromCountry }} onChange={fromCountryChangeHandler} required />
        </div>
        <div className="mb-3">
          <label htmlFor="fromCity" className="form-label" style={{ color: "white" }}>From City:</label>
          <input type="text" className="form-control" id="fromCity" name="fromCity" value={fromCity} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="toCountry" className="form-label" style={{ color: "white" }}>To Country:</label>
          <Select options={options} value={{ label: toCountry, value: toCountry }} onChange={toCountryChangeHandler} placeholder="Select your country" required />
        </div>
        <div className="mb-3">
          <label htmlFor="toCity" className="form-label" style={{ color: "white" }}>To City:</label>
          <input type="text" className="form-control" id="toCity" name="toCity" value={toCity} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label" style={{ color: "white" }}>Flight Date:</label>
          <input type="date" className="form-control" id="startDate" name="startDate" value={startDate} onChange={handleChange} required />
        </div>
        <Form.Group controlId="formDepartureTime">
          <Form.Label className="form-label" style={{ color: "white" }} >Departure Time</Form.Label>
          <Form.Control type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
        </Form.Group>

        <Form.Group style={{ color: "white" }} controlId="formLandingTime">
          <Form.Label>Landing Time</Form.Label>
          <Form.Control type="time" value={landingTime} onChange={(e) => setLandingTime(e.target.value)} required />
        </Form.Group>

        <div className="mb-3">
          <label htmlFor="airlineName" className="form-label" style={{ color: "white" }}>Airline Name:</label>
          <select name="airlineName" className="form-select" value={airlineName} onChange={handleChange} required >
            <option value="">-- Select Airline --</option>
            {airlineList.map((airline) => (
              <option key={airline.airlineid} value={airline.airlinename}>
                {airline}
              </option>
            ))}
          </select>
        </div>

        <Form.Group controlId="formFlightNumber">
          <Form.Label style={{ color: "white" }}>Flight Number</Form.Label>
          <Form.Control type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} required />
        </Form.Group>
        <div className="mb-3">
          <label htmlFor="price" className="form-label" style={{ color: "white" }}>Price:</label>
          <input type="number" className="form-control" id="price" name="price" value={price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="fr" className="form-label" style={{ color: "red", fontSize: '25px' }}>Before You Submit This Form, Please Open Your Phone And Save The Number: +14155238886 As "Flights Center", Then, Send In Whatsapp To This Number The Next Message: join old-memory.</label>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary me-md-2">Submit</button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>Clear</button>
        </div>
      </form>
          )}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel=" Modal" style={{
        content: {
          width: '300px',
          height: '230px',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }} >
        <h2>Hello {user[1]}!</h2>
        <p>
          In this page you can submit new sale to your sale list , and let other users the option to buy your ticket .
        </p>
        <button onClick={closeModal}>OK</button>
      </Modal>
    </div>
  );
}
