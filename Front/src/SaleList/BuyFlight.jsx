import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import APIService from "../Components/APIService";
import Spinner from "../spinner/Spinner"
import Modal from 'react-modal';
import RenderSale from "./RenderSale/RenderSale";
import "./BuyFlight.css"
import "./SaleList.css";
import { MdOutlineAirplaneTicket } from 'react-icons/md';
import { BsBackspaceFill } from 'react-icons/bs';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';
export default function BuyFlight() {
  const location = useLocation();
  const { userID, user } = location.state;
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userSales, setUserSales] = useState([]);
  const [length, setLength] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(false);
  const toDelete = true
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const getAllUserSales = async () => {
      try {
        setLoading(true);
        const response = await APIService.GetAllUserSales(user[1]);
        const data = await response.json();
        if (Array.isArray(data[1])) {
          const salelist = data[1];
          const newdata = salelist.map((sale) => ({
            saleid: sale[0],
            usernamesale: sale[1],
            fromcity: sale[2],
            fromcountry: sale[3],
            tocity: sale[4],
            tocityimg: sale[5],
            tocountry: sale[6],
            flightdate: sale[7],
            airlineid: sale[8],
            airlinename: sale[9],
            logo: sale[10],
            price: sale[11],
            flightnumber: sale[12],
            starthour: sale[13],
            endhour: sale[14]
          }));
          setUserSales(newdata);
          setLength(newdata.length);
          console.log(newdata);
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    };

    getAllUserSales();
  }, []);
  return (
    <div className="container bootstrap snippets bootdeys">
      <div className="row align-items-center">
        <div className="navbar-dark bg-dark fixed-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/SaleList" className="backward-link" state={userID}>
            <BsBackspaceFill className="backward-icon" size={50} color="white" />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <MdOutlineAirplaneTicket size={75} color="white" />
            <h1 style={{ marginLeft: '10px', color: 'white' }}>USER INFO</h1>
          </div>
          <BsThreeDotsVertical size={30} color="white" onClick={openModal} style={{ cursor: 'pointer' }} />
        </div>
        
        <div className="content"></div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {length === 0 ? (
              <div className="no-flight-message">You have not added any flights yet. Go and add one!</div>
            ) : (
              userSales.map((currentsaledata, key) => (
                <RenderSale
                  key={key}
                  saleid={currentsaledata.saleid}
                  usernamesale={currentsaledata.usernamesale}
                  fromcity={currentsaledata.fromcity}
                  fromcountry={currentsaledata.fromcountry}
                  tocity={currentsaledata.tocity}
                  tocityimg={currentsaledata.tocityimg}
                  tocountry={currentsaledata.tocountry}
                  flightdate={currentsaledata.flightdate}
                  airlineid={currentsaledata.airlineid}
                  airlinename={currentsaledata.airlinename}
                  logo={currentsaledata.logo}
                  price={currentsaledata.price}
                  flightnumber={currentsaledata.flightnumber}
                  starthour={currentsaledata.starthour}
                  endhour={currentsaledata.endhour}
                  userID={userID}
                  user={user}
                  toDelete={toDelete}
                />
              ))
            )}
          </>
        )}
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel=" Modal" style={{
        content: {
          width: '300px',
          height: '400px',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }} >
        <h2>Hello {user[1]}!</h2>
        <p>
          In this page, you can manage your sales. You can remove a flight by pressing the garbage button.
          In addition, you can press on the flight to see full information about it and the option to delete from there as well.
          You currently have {length} flight{length === 1 ? '' : 's'} in your sales.
        </p>
        <button onClick={closeModal}>OK</button>
      </Modal>
    </div>
  );
}
