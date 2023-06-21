import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login/Login';
import Register from './Register/Register';
import SaleList from './SaleList/SaleList';
import BuyFlight from './SaleList/BuyFlight';
import SellFlight from './SaleList/SellFlight';
import BuySpecificFlight from './SaleList/RenderSale/BuySpecificFlight.jsx';
import PayForFlight from './SaleList/RenderSale/PayForFlight.jsx';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PayPalScriptProvider options={{ "client-id": "AeqyMHi_ZJoeof8Nbud_2REfWLQhyZERgUywd2m-b--x7MPRPp-gWKccDD8ukn3tSNPbFQJ0SQ2fBFW9" }}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='SaleList' element={<SaleList />} />
          <Route path='BuyFlight' element={<BuyFlight />} />
          <Route path='SellFlight' element={<SellFlight />} />
          <Route path='BuySpecificFlight' element={<BuySpecificFlight />} />
          <Route path='PayForFlight' element={<PayForFlight />} />
        </Routes>
      </PayPalScriptProvider>
    </BrowserRouter>
  </React.StrictMode>
);
