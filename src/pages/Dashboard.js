import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import Sidebar from "../components/Sidebar";


export default function Dashboard(){

  const { signOut } = useContext(AuthContext)

  return(
    <div>
      <Sidebar/>
      <h1>PAGINA DASHBOARD</h1>

      <button onClick={signOut}>Sair</button>
    </div>
  )
}