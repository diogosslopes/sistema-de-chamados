import { useContext, useEffect, useState } from "react";
import firebase from '../services/firebaseConnection';
import '../index.css'
import { format } from 'date-fns'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/auth";
import  Axios  from "axios";





export default function DeleteModal({ id, close, bd, getDoc }) {

  const { getDocs, setTasks } = useContext(AuthContext)



  async function deleteItem() {

    console.log(id)
    Axios.delete(`http://localhost:3001/deleteobs/${id}`).then((response)=>{
      Axios.delete(`http://localhost:3001/deletetask/${id}`).then((response)=>{
        close()
        console.log(response)
        toast.success("Deletado com sucesso")
        getDoc()
      }).catch((error)=>{
         toast.error("Erro ao excluir !")
      })

    })

    // await firebase.firestore().collection(bd).doc(id).delete()
    //   .then(() => {
        
    //     // getDoc()
    //     close()
    //     setTasks('')
    //     getDocs()
    //     // window.location.reload()
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
  }



  return (
    <div className="modal">
      <div className="delete-modal">
        <h3>Tem certeza que deseja excluir?</h3>
        <div className="buttons">
          <button onClick={deleteItem} >Sim</button>
          <button onClick={close}>Não</button>
        </div>
      </div>
    </div>
  )
}