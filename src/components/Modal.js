import { useEffect, useState } from "react";
import firebase from '../services/firebaseConnection';
import '../index.css'
import { format } from 'date-fns'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'

const validation = yup.object().shape({
  client: yup.string().required("Unidade obrigatoria"),
  subject: yup.string().required("Assunto obrigatorio").min(5,"Minimo de 5 caracteres").max(15, "Maximo de 15 caracteres"),
  status: yup.string().required(),
  obs: yup.string().min(10, "Minimo de 10 caracteres").max(100, "Maximo de 100 caracteres")
})




export default function Modal({ tipo, close, item }) {

  const [task, setTask] = useState(item)
  const [newTask, setNewTask] = useState({})
  const [client, setClient] = useState(item.client)
  const [clients, setClients] = useState([])
  const [subject, setSubject] = useState('Sistema')
  const [status, setStatus] = useState(item.status)
  const [created, setCreated] = useState(item.created)
  const [obs, setObs] = useState(item.obs)
  const [subjects, setSubjects] = useState(['Impressora', 'Sistema', 'Internet',])
  const [disable, setDisable] = useState(false)

  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(validation)
  })


  const save = data => console.log(data)

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

    if (tipo === 'show') {
      setDisable(true)
      setSubject(item.subject)
      return
    }

    if (!created) {
      
      const fullDate = format(new Date(), "dd/MM/yyyy HH:mm")
      setCreated(fullDate)
    }
    


  }, [])


  async function saveTask(e) {
    e.preventDefault()
    console.log(subject)
    console.log(client)


    if (tipo === 'new') {
      setNewTask({
        client: client,
        subject: subject,
        status: status,
        created: created,
        obs: obs
      })
      await firebase.firestore().collection('tasks').doc().set({
        client: client,
        subject: subject,
        status: status,
        created: created,
        obs: obs
      })
        .then(() => {
          console.log('Salvo')
          close()
        })
        .catch((error) => {
          console.log(error)
        })
    } else if (tipo === 'edit') {
      console.log(item.id)
      await firebase.firestore().collection('tasks').doc(item.id).update({
        client: client,
        subject: subject,
        status: status,
        obs: obs
      })
        .then(() => {
          alert('Editou')
        })
        .catch((error) => {
          alert(error)
        })
    }

  }


  function changeClient(e) {
    e.preventDefault()
    setClient(e.target.value)
    console.log(client)
  }
  function changeSubject(e) {
    e.preventDefault()
    setClient(e.target.value)
    console.log(client)
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
        <form onSubmit={handleSubmit(save)} className="form-modal" >
          <div>
            <label>Cliente</label>
            <select disabled={disable} name="client" {...register("client")} value={client} onChange={changeClient}>

              {clients.map((c, index) => {
                return (
                  <option value={c.client} key={c.id}>{c.client}</option>
                )
              })}
            </select>
          </div>
            <span>{errors.client?.message}</span>
          <div>
            <label>Assunto</label>
            <select disabled={disable} name="subject" {...register("subject")} value={subject} onChange={(e) => { setSubject(e.target.value) }}>

              {subjects.map((s, index) => {
                return (
                  <option value={s} key={index}>{s}</option>
                )
              })}
            </select>
          </div>
            {errors.subject?.message}
          <div className="radio-status">
            <label>Status</label>
            <div className="radio-buttons">
              <input type="radio" name="radio" {...register("radio")} value='Aberto' onChange={(e) => setStatus(e.target.value)} disabled={disable} checked={ status === 'Aberto' } />
              <span>Aberto</span>
              <input type="radio" name="radio" {...register("radio")} value='Em andamento' onChange={(e) => setStatus(e.target.value)} disabled={disable} checked={ status === 'Em andamento' } />
              <span>Em andamento</span>
              <input type="radio" name="radio" {...register("radio")} value='Enviado p/ tecnico' onChange={(e) => setStatus(e.target.value)} disabled={disable} checked={ status === 'Enviado p/ tecnico' } />
              <span>Enviado p/ tecnico</span>
              <input type="radio" name="radio" {...register("radio")} value='Fechado' onChange={(e) => setStatus(e.target.value)} disabled={disable} checked={ status === 'Fechado' } />
              <span>Fechado</span>
            </div>
          </div>
            {errors.status?.message}
          <div className="status_select">
            <label>Status</label>
            <select disabled={disable} name="status" {...register("status")} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Aberto</option>
              <option>Em andamento</option>
              <option>Enviado p/ tecnico</option>
              <option>Fechado</option>
            </select>
          </div>
            {errors.status?.message}
          <div>
            <label>Criando em</label>
            <input value={created} name="created" {...register("created")} onChange={(e) => setCreated(e.target.value)} disabled={true} placeholder="Criado em" />
          </div>
          <div>
            <label>Observações</label>
            <textarea value={obs} name="obs" {...register("obs")} onChange={(e) => setObs(e.target.value)} disabled={disable} placeholder="Observações" />
          </div>
            {errors.obs?.message}
          <div className="buttons">
            <button type='submit' >Salvar</button>
            <button onClick={close}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}