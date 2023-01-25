import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import logo from '../images/Logo.png'
import { AuthContext } from "../context/auth";

import firebase from '../services/firebaseConnection'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'


export default function Dashboard(){

  const { signOut } = useContext(AuthContext)

  return(
    <div>
      <h1>PAGINA DASHBOARD</h1>

      <button onClick={signOut}>Sair</button>
    </div>
  )
}