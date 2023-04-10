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


const validation = yup.object().shape({
  client: yup.string().required("Unidade obrigatoria"),
  subject: yup.string().required("Assunto obrigatorio").min(5,"Minimo de 5 caracteres").max(15, "Maximo de 15 caracteres"),
  status: yup.string().required('Status é obrigatorio'),
  obs: yup.string().required('Descrição é obrigatorio').min(10,'Minimo de 10 caracteres').max(100, 'Maximo de 100 caracteres'),
})




export default function Modal({ tipo, close, item }) {


  const {user} = useContext(AuthContext)
  const [task, setTask] = useState(item)
  const [newTask, setNewTask] = useState({})
  const [client, setClient] = useState(item.client)
  const [clients, setClients] = useState([])
  const [subject, setSubject] = useState(item.subject)
  const [status, setStatus] = useState( item.status)
  const [created, setCreated] = useState(item.created)
  const [obs, setObs] = useState(item.obs)
  const [subjects, setSubjects] = useState(['Impressora', 'Sistema', 'Internet'])
  const [disable, setDisable] = useState(false)

  
  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(validation)
  })
  
  
  
  useEffect(() => {
    
    async function loadClients() {
      await firebase.firestore().collection('clients').get()
      .then((snapshot) => {
        let list = []
        
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            client: doc.data().name
          })
        })
        setClients(list)
        
      })
      .catch((error) => {
        console.log(error)
      })
      
    }
    
    loadClients()
    if (tipo === 'new') {
      
       
      const fullDate = format(new Date(), "dd/MM/yyyy HH:mm")
      setCreated(fullDate)
    }
    
    if (tipo === 'show') {
      setDisable(true)
      setSubject(item.subject)
      return
    }
        
  }, [])
  
  const save = data => {
    saveTask()
  }
  console.log(created)
  
  
  async function saveTask(e) {
    // e.preventDefault()

    if (tipo === 'new') {
      setNewTask({
        client: client,
        subject: subject,
        status: status,
        created: created,
        obs: obs,
        userId: user.id
      })
      await firebase.firestore().collection('tasks').doc().set({
        client: client,
        subject: subject,
        status: status,
        created: created,
        obs: obs,
        userId: user.id
      })
        .then(() => {
          console.log('Salvo')
          toast.success("Chamado registrado !")
          close()
        })
        .catch((error) => {
          console.log(error)
        })
    } else if (tipo === 'edit') {
      await firebase.firestore().collection('tasks').doc(item.id).update({
        client: client,
        subject: subject,
        status: status,
        obs: obs
      })
        .then(() => {
          alert('Editou')
          close()
        })
        .catch((error) => {
          alert(error)
        })
    }

  }




  async function deleteTask(e) {
    e.preventDefault()

    await firebase.firestore().collection('tasks').doc(item.id).delete()
      .catch(() => {
        alert('Chamado apagado')
      })
      .catch((error) => {
        alert(error)
      })
  }
  return (
    <div className="modal">
      <div className="modal-new">
        <h1>Cadastro de Chamado</h1>
        <form onSubmit={handleSubmit(saveTask)} className="form-modal" >
          <div>
            <label>Cliente</label>
            <select disabled={disable} name="client" {...register("client")} value={client}  onChange={(e) => { setClient(e.target.value) }} >
              <option value={''}>Selecione a unidade</option>

              {clients.map((c, index) => {
                return (
                  <option value={c.client} key={c.id}>{c.client}</option>
                )
              })}
            </select>
          </div>
          <div>   
            <label>Assunto</label>
            <select  disabled={disable} name="subject" {...register("subject")} value={subject} onChange={(e) => { setSubject(e.target.value) }}>
              <option value={''} >Selecione o assunto</option>
              {subjects.map((s, index) => {
                return (
                  <option  value={s} key={index}>{s}</option>
                  )
                })}
            </select>
          </div>

          <div className="status_select">
            <label>Status</label>
            <select disabled={disable} name="status" {...register("status")} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value={''}>Selecione o status</option>
              <option>Aberto</option>
              <option>Em andamento</option>
              <option>Enviado p/ tecnico</option>
              <option>Fechado</option>
            </select>
          </div>
          <div>
            <label>Criando em</label>
            <input value={created} name="created" {...register("created")} onChange={(e) => setCreated(e.target.value)} disabled={disable} placeholder="Criado em" />
          </div>
          <div id="obs">
            <label>Observações</label>
            <textarea value={obs} name="obs" {...register("obs")} onChange={(e) => setObs(e.target.value)} disabled={disable} placeholder="Observações" />
          </div>

            <article  className="error-message">
            <p>{errors.client?.message}</p>
            <p>{errors.subject?.message}</p>
            <p>{errors.status?.message}</p>
            <p>{errors.obs?.message}</p>
            </article>
          <div className="buttons">
            <button type='submit' >Salvar</button>
            <button onClick={close}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}