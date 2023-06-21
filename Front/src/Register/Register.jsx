import "./Register.css";
import $ from 'jquery';
import React, { useState, useMemo } from 'react'
import { Link } from "react-router-dom";
import APIService from "../Components/APIService"
import Select from 'react-select'
import countryList from 'react-select-country-list'
import PhonePrefixSelect from './PhonePrefixSelect'
export default function Register() {

  document.body.style.backgroundColor = "#1B1A1A";
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("")
  const [phonePrefix, setPhonePrefix] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const options = useMemo(() => countryList().getData(), [])

  const countryChangeHandler = (selectedOption) => {
    setSelectedCountry(selectedOption.label)
  }
  const handlePhonePrefixChange = (selectedPrefix) => {
    console.log("event",event.target.value)
    console.log("prefix",phonePrefix)
    setPhonePrefix(selectedPrefix);
  };


  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };


  async function handleSubmit() {
    let isValid = true;
    const emailRegex = /^\S+@\S+\.\S+$/;
    let fullPhoneNumber = '';

   if (phoneNumber.startsWith('0')) {
  // Remove the leading '0' and replace it with the prefix
  fullPhoneNumber = "+" + phonePrefix + phoneNumber.substr(1);
} else {
  // Just assign the prefix and phone number
  fullPhoneNumber = "+" + phonePrefix + phoneNumber;
}
    console.log("end",fullPhoneNumber)

    const phoneRegex = /^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;


    if (!phoneRegex.test(fullPhoneNumber)) {
      document.getElementById("ValidatePhone").innerHTML = "Please enter a valid phone number";
      isValid = false;
    } else {
      document.getElementById("ValidatePhone").innerHTML = "";
    }
    




    if (!emailRegex.test(email)) {
      document.getElementById("ValidateEmail").innerHTML = "Please enter a valid email address";
      isValid = false;
    } else {
      document.getElementById("ValidateEmail").innerHTML = "";
    }
    if (userName.length < 2) {
      document.getElementById("ValidateUsername").innerHTML = "Username too short(needs to be 2 or more letters)";
      isValid = false;
    } else {
      document.getElementById("ValidateUsername").innerHTML = "";
    }
    if (password.length < 6 || password.length > 14) {
      document.getElementById("ValidatePassword").innerHTML = "Password needs to be 6-14 letters";
      isValid = false;
    } else {
      document.getElementById("ValidatePassword").innerHTML = "";
    }
    if (password !== confirmPassword) {
      document.getElementById("ValidateConfirmPassword").innerHTML = "Passwords do not match";
      isValid = false;
    } else {
      document.getElementById("ValidateConfirmPassword").innerHTML = "";
    }

    if (selectedCountry === "") {
      document.getElementById("ValidateCountry").innerHTML = "Please select your country";
      isValid = false;
    } else {
      document.getElementById("ValidateCountry").innerHTML = "";
    }




    if (isValid === true) {
      let user = await APIService.GetLogin({ userName, password })
        .then(response => response.json())
        .then((data) => { return data })
      if (typeof user[1] === 'undefined') {
        let response = await APIService.InsertUser({ userName, password, country: selectedCountry, email, phonenumber: fullPhoneNumber })
        .then(response => response.json())
        .then((data) => { return data });
        console.log("success")
        document.getElementById("ValidateAlreadyExists").innerHTML = "";
        document.getElementById("success").innerHTML = "successfuly registered you may log in now"

      } else {
        console.log("failure")
        document.getElementById("success").innerHTML = "";
        document.getElementById("ValidateAlreadyExists").innerHTML = "User name already exists";
      }
    }
  };


  const handleClear = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSelectedCountry("");
    document.getElementById("ValidateAlreadyExists").innerHTML = "";
    document.getElementById("success").innerHTML = "";
  };




  // userName={userName} displayName = {displayName} password = {password} confirmPassword = {confirmPassword}

  return (
    <form name="MyForm">
      <div className="field-name d-grid gap-0.8 central-frame">
        <div className="d-flex align-items-center form-headline">
          Register To Flight Center
        </div>
        <br />
        <div className="mb-3">
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="exampleFormControlInput1" className="form-label field-label">
                Username
              </label>
              <br />
            </div>
            <div className="col-sm-9">
              <label
                htmlFor="exampleFormControlInput1"
                id="ValidateUsername"
                className="form-label validation-label"
              ></label>
              <br />
            </div>
          </div>
          <input
            type="text"
            className="form-control"
            id="username"
            value={userName}
            placeholder="My Username"
            onChange={(e) => setUserName(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="exampleFormControlInput1" className="form-label field-label">
                Password
              </label>
              <br />
            </div>
            <div className="col-sm-9">
              <label
                htmlFor="exampleFormControlInput1"
                id="ValidatePassword"
                className="form-label validation-label"
              ></label>
              <br />
            </div>
          </div>
          <input
            type="password"
            className="form-control"
            id="psw"
            value={password}
            rows="3"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="exampleFormControlInput1" className="form-label field-label">
                Confirm Password
              </label>
              <br />
            </div>
            <div className="col-sm-9">
              <label
                htmlFor="exampleFormControlInput1"
                id="ValidateConfirmPassword"
                className="form-label validation-label"
              ></label>
              <br />
            </div>
          </div>
          <input
            type="password"
            className="form-control"
            id="conf"
            value={confirmPassword}
            rows="3"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="exampleFormControlInput1" className="form-label field-label">
                Email
              </label>
              <br />
            </div>
            <div className="col-sm-9">
              <label
                htmlFor="exampleFormControlInput1"
                id="ValidateEmail"
                className="form-label validation-label"
              ></label>
              <br />
            </div>
          </div>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            placeholder="My Email"
            onChange={(e) => setEmail(e.target.value)} required
          ></input>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="exampleFormControlInput1" className="form-label field-label">
                Country
              </label>
              <br />
            </div>
            <div className="col-sm-9">
              <label
                htmlFor="exampleFormControlInput1"
                id="ValidateCountry"
                className="form-label validation-label"
              ></label>
              <br />
            </div>
          </div>
          <Select id="select-country" options={options} value={{ label: selectedCountry, value: selectedCountry }} onChange={countryChangeHandler} placeholder="Select your country" />
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="exampleFormControlInput1" className="form-label field-label">
                Phone
              </label>
              <br />
            </div>
            <div className="col-sm-9">
              <label
                htmlFor="exampleFormControlInput1"
                id="ValidatePhone"
                className="form-label validation-label"
              ></label>
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <PhonePrefixSelect
                selectedPhonePrefix={phonePrefix}
                onChange={handlePhonePrefixChange}
              />
            </div>
            <div className="col-sm-8">
              <input
                type="number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter your phone number"
                className="form-control"
              />
            </div>
          </div>
        </div>


        <div className="col-sm-4">
          <label
            htmlFor="exampleFormControlInput1"
            id="ValidateAlreadyExists"
            className="form-label validation-label"
          ></label>
          <label htmlFor="exampleFormControlInput1"
            id="success"
            className="form-label succesfull-register"
          ></label>
        </div>
        <button
          type="button"
          className="btn btn-link" >
          <Link className="nav-link" to="/">Already registered? log in here</Link>
        </button>

        <div className="d-grid gap-3">
          <button className="btn btn-outline-success" type="button" onClick={() => handleSubmit()}>
            Register
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>

      </div>
    </form>
  );
}

