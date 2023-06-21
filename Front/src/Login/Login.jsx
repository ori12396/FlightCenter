//import userList from "../Users.js";
import $ from 'jquery';
import React from "react";
import { useState } from "react";
import './Login.css'
import APIService from "../Components/APIService"
import { Link, useNavigate, createSearchParams } from "react-router-dom";
export default function Login() {

  document.body.style.backgroundColor = "#1B1A1A";
const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  async function handleLogin() {
    event.preventDefault(); 
    let user = await APIService.GetLogin({ userName, password })
      .then(response => response.json())
      .then((data) => { return data })
    if (typeof user[1] === 'undefined') {
      document.getElementById("unregistered").innerHTML =
        "username or password are incorrect";
    } else {
      //navigate(`/SaleList/${user[1][0]}`)
      navigate('/SaleList',{state:user[1][0]});
    }
  };

  const handleClear = () => {
    setUserName("");
    setPassword("");
  };
  return (
    <form name="LoginForm">
      <div className="field-name d-grid gap-0.8 central-frame">
        <div className="d-flex align-items-center form-headline">
          Login To Flight Center
          <br />
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-sm-3">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label field-label"
              >
                Username
              </label>
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
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label field-label"
              >
                Password
              </label>
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
        <div>
          <label
            id="unregistered"
            className="form-label validation-label"
          ></label>
        </div>
        <button
          type="button"
          className="btn btn-link"
        >
          <Link className="nav-link" to="/Register">Not registered yet? register here</Link>
        </button>

        <div className="d-grid gap-2">
          <button
            className="btn btn-outline-success"
            type="button"
            onClick={() => handleLogin()}
          >
            Log in
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleClear()}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
