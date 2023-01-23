import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import logo from '../images/Logo.png'

function SignIn() {
  return (
    <div className="main-container">
      <div className="logo">
        <img src={logo}/>
      </div>
      <div className="container-login">
        <h1>Login</h1>
        <form className="form">
          <input type='text' placeholder="Digite seu Login" ></input>
          <input type='password' placeholder="Digite sua senha"></input>
          <button type="submit">Logar</button>
        </form>
        <Link to='/register'>Cadastrar</Link>
      </div>
    </div>
  );
}

export default SignIn;
