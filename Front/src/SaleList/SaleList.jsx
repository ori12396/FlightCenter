
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {
  MDBContainer,
  MDBCollapse,
  MDBNavbar,
  MDBNavbarToggler,
  MDBIcon,
  MDBBtn,
} from 'mdb-react-ui-kit';
import "./SaleList.css";
import { NavDropdown, Button } from 'react-bootstrap';
import { MdOutlineAirplaneTicket, MdSearch, MdLogout } from 'react-icons/md';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoMdAirplane } from 'react-icons/io';
import { IoAirplaneOutline } from 'react-icons/io5';
import { useParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import APIService from "../Components/APIService"
import Spinner from  "../spinner/Spinner"
import RenderSales from "./RenderSale/RenderSales"
import Select from 'react-select'
import flightSalesImg from './FLIGHTSALES.jpg';
import flightlogo from './flightlogo.jpg';
import countryList from 'react-select-country-list'
import { Link, useLocation } from 'react-router-dom';
export default function GameList() {
  const [isSecondCollapseOpen, setIsSecondCollapseOpen] = useState(false);
  const toDelete = false
  const location = useLocation();
  const [userID, setUserID] = useState(location.state);
  const [sales, setSales] = useState([]);
  const [user, setUser] = useState({});
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [selectedfromCountry, setSelectedfromCountry] = useState("")
  const [orderBy, setOrderBy] = useState("None")
  const [selectedtoCountry, setSelectedtoCountry] = useState("")
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    "fromCountry": null,
    "toCountry": null,
    "fromDate": null,
    "maxPrice": null,
    "pageNumber": 0
  })
  const [showAnimated3, setShowAnimated3] = useState(false);
  const options = useMemo(() => {
    const allCountries = countryList().getData();
    const anyOption = { label: "Any", value: "" };
    return [anyOption, ...allCountries];
  }, []);
  const fromCountryChangeHandler = (selectedOption) => {
    setSelectedfromCountry(selectedOption.label)
  }
  const toCountryChangeHandler = (selectedOption) => {
    setSelectedtoCountry(selectedOption.label)
  }
  const clearModal = () => {
    setSelectedfromCountry("");
    setSelectedtoCountry("");
    setFilter({
      fromCountry: null,
      toCountry: null,
      fromDate: null,
      maxPrice: null,
      pageNumber: 0
    });
    document.getElementById("from-date").value = "";
    document.getElementById("max-price").value = "";
  };
  const handleGoToClick = () => {
    setIsSecondCollapseOpen(true);
  };



  const handleNavbarToggle = () => {
    setIsSecondCollapseOpen(true);
    setIsNavbarOpen(!isNavbarOpen);
    setShowAnimated3(!showAnimated3)
  };

  function functionofnewPageNumber(event) {
    setFilter({ ...filter, pageNumber: event.target.value - 1 });
  }

  function functionofnewOrderBy(event) {
    setOrderBy(event.target.value);
  }

  function handleSearch() {
    const fromDate = document.getElementById('from-date').value;
    const fromCountry = selectedfromCountry;
    const toCountry = selectedtoCountry;
    const maxPrice = document.getElementById('max-price').value;
    const selectElement = document.getElementById("exampleFormControlSelect1");
    selectElement.selectedIndex = 0;
    setFilter({
      "fromCountry": fromCountry,
      "toCountry": toCountry,
      "fromDate": fromDate,
      "maxPrice": maxPrice,
      "pageNumber": 0
    })
  }
  function handleDateChange(event) {
    const fromDate = event.target.value;
    setFilter({ filter, fromDate });
  }

  useEffect(() => {
    APIService.FindUserByID(userID)
      .then(response => response.json())
      .then((data) => {
        setUser(data[1][0]);
        setFilter({ ...filter, fromCountry: data[1][0][3] });
      })
  }, []);


  // useEffect(() => {
  //   const fromDate = filter["fromDate"];
  //   const fromCountry = filter["fromCountry"];
  //   const toCountry = filter["toCountry"];
  //   const maxPrice = filter["maxPrice"];


  //   const searchParams = {
  //     fromDate,
  //     fromCountry,
  //     toCountry,
  //     maxPrice
  //   };
  //   APIService.FetchSales(searchParams)
  //     .then(response => response.json())
  //     .then((data) => {
  //       setSales(data);
  //       console.log("pppp")
  //       console.log(data)
  //     });
  // }, [filter]);

useEffect(() => {
  setLoading(true);
  const howMany = 15;
  const start = filter["pageNumber"] * howMany;

  const fetchSales = async () => {
    try {
      const response = await APIService.FetchSales(filter, howMany, start, orderBy, userID);
      const data = await response.json();
      setSales(data);
      
    } catch (error) {
      console.log('Error fetching sales:', error);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };

  fetchSales();
}, [filter, orderBy, userID]);

  return (

    <div className="container bootstrap snippets bootdeys">
      <div className="row align-items-center">
        <section className='mb-3'>
          <MDBNavbar className="navbar-dark bg-dark fixed-top">
            <MDBContainer fluid>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MDBNavbarToggler
                  type='button'
                  className='third-button'
                  data-bs-target='#navbarToggleExternalContent'
                  aria-controls='navbarToggleExternalContent'
                  aria-expanded='false'
                  aria-label='Toggle navigation'
                  onClick={() => handleNavbarToggle()}
                >
                  <div className={`animated-icon3 ${showAnimated3 && 'open'}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </MDBNavbarToggler>
                <span style={{ fontSize: '25px', fontWeight: 'bold', color: 'white' }} className="btn-group">Hello {user[1]} &nbsp;</span></div>
              <div className="cvheckk" style={{ display: 'flex', alignItems: 'center' }}>
                <a className="navbar-brand text-center" href="#" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  <MdOutlineAirplaneTicket size={75} color="white" />
                  FLIGHT SALES</a>
                <span className="cccc"> <button type="button" style={{ border: 'none' }} className="btn btn-outline-info dropdown-toggle" data-bs-toggle="modal" data-bs-target="#filterFlights">
                  Search Flight
                </button></span>
              </div>
              <span style={{ fontSize: '25px', fontWeight: 'bold', color: 'white' }} className="takemesapnright nav-link">From: {filter["fromCountry"] ? filter["fromCountry"] : "Any"}</span>
            </MDBContainer>
            <MDBCollapse show={showAnimated3} className="">
              <ul className='דcollapsed-content list-unstyled ms-3'>
                <Link className="nav-link border-bottom m-0" to="/BuyFlight" state={{ userID, user }}>
                  <IoIosInformationCircleOutline className="me-2" /> My Sales
                </Link>

                <Link className="nav-link border-bottom m-0" to="/SellFlight" state={{ userID, user }}>
                  <MdSearch className="me-2" /> Sell Flight
                </Link>


                <Link className="nav-link border-bottom m-0" to="/">
                  <MdLogout className="me-2" /> Logout
                </Link>
              </ul>
            </MDBCollapse>
          </MDBNavbar>
        </section>
         
        <div className='content'>
          {loading ? (<Spinner/>):(
          <div className="row align-items-center">
            <RenderSales sales={sales} userID={userID} user={user} toDelete={toDelete} />
          </div>
      )}
          <div className="form-group mmm">
            <label htmlFor="exampleFormControlSelect1" style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>PAGE NUMBER</label>
            <select className="form-control" id="exampleFormControlSelect1" onChange={functionofnewPageNumber}>
              <option value="1">1</option>
              {[...Array(1289)].map((_, i) => (
                <option key={i}>{i + 2}</option>
              ))}
            </select>
            <br></br>
          </div>
          <div className="form-group mmm">
            <label htmlFor="exampleFormControlSelect2" style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>ORDER BY</label>
            <select className="form-control" id="exampleFormControlSelect3" onChange={functionofnewOrderBy}>
              <option value="None">None</option>
              <option key="Price">Price</option>
              <option key="Close Date">Close Date</option>
              <option key="Our Recommendation">Our Recommendation</option>
            </select>
            <br></br>
          </div>
        </div>
     
      </div>
      
      <div className="modal fade" id="filterFlights" tabIndex="-1" aria-labelledby="filterFlightsLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="filterFlightsLabel">Search Flights</h5>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={clearModal}>
                <span aria-hidden="true">&times;</span>
              </button>

            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="from-date">Flight Date:</label>
                <input type="date" className="form-control" id="from-date" onChange={handleDateChange} />
              </div>
              <div className="form-group">
                <label htmlFor="from-country">From Country:</label>
                <Select options={options} value={{ label: selectedfromCountry, value: selectedfromCountry }} onChange={fromCountryChangeHandler} placeholder="Select your country" />
              </div>
              <div className="form-group">
                <label htmlFor="to-country">To Country:</label>
                <Select options={options} value={{ label: selectedtoCountry, value: selectedtoCountry }} onChange={toCountryChangeHandler} placeholder="Select your country" />
              </div>
              <div className="form-group">
                <label htmlFor="max-price">Maximum Price:</label>
                <input type="number" className="form-control" id="max-price" />
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-secondary" onClick={clearModal}>Rest Filters </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
}

