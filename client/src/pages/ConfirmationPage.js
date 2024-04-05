import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logo from '../images/Logo.png'
import logoEngrenagem from '../images/logo-engrenagem.png'
import { AuthContext } from '../context/auth'

import firebase from '../services/firebaseConnection'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'


function SignIn() {

  const { logIn, loadingAuth } = useContext(AuthContext)

  const validationLogin = yup.object().shape({
    login: yup.string().email("Digite um email válido").required("Digite seu email"),
    password: yup.string().required("Digite sua senha").min(6, "A senha deve conter mais de 6 caracteres")
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationLogin)
  })

  const handleLogin = (value) => {
    logIn(value)
  }



  return (
    <div className="main-container">
      <div className="logo">
        <img src={logo} />
      </div>
      <div className="container-login">
        <h1>Verifique seu Email</h1>
        <form className="form" onSubmit={handleSubmit(handleLogin)}>
          <input type='text' name="emailToken" placeholder="Digite o codigo enviado por e-mail" {...register("login")} ></input>
          <p>{errors.login?.message}</p>
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Confirmar'}</button>
        </form>
      </div>
    </div>
  );
}


export default SignIn;