import $ from 'jquery';
import Navbar from './Navbar.jsx'
import 'bootstrap/dist/css/bootstrap.css';
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
import { useParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import APIService from "../Components/APIService"
import RenderSales from "./RenderSale/RenderSales"
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { Link, useLocation } from 'react-router-dom';
export default function NNavbar() {
  const [showAnimated3, setShowAnimated3] = useState(false);
  return(
    <div>
        <section className='mb-3'>
        <MDBNavbar dark bgColor='info'>
          <MDBContainer fluid>
            <MDBNavbarToggler
              type='button'
              className='third-button'
              data-target='#navbarToggleExternalContent'
              aria-controls='navbarToggleExternalContent'
              aria-expanded='false'
              aria-label='Toggle navigation'
              onClick={() => setShowAnimated3(!showAnimated3)}
            >
              <div className={`animated-icon3 ${showAnimated3 && 'open'}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </MDBNavbarToggler>
          </MDBContainer>
        </MDBNavbar>

        <MDBCollapse show={showAnimated3}>
          <div className='bg-light shadow-3 p-4'>
            <MDBBtn block className='border-bottom m-0' color='link'>
              Link 1
            </MDBBtn>
            <MDBBtn block className='border-bottom m-0' color='link'>
              Link 2
            </MDBBtn>
            <MDBBtn block className='border-bottom m-0' color='link'>
              Link 2
            </MDBBtn>
          </div>
        </MDBCollapse>
      </section>
    </div>
  )
    
  
 
}