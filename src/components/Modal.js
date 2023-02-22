import { useEffect, useState } from "react";
import firebase from '../services/firebaseConnection';
import '../index.css'

export default function Modal({ tipo, close, item }) {

  const [task, setTask] = useState(item)
  const [newTask, setNewTask] = useState({})
  const [client, setClient] = useState(item.client)
  const [subject, setSubject] = useState(item.subject)
  const [status, setStatus] = useState(item.status)
  const [created, setCreated] = useState(item.created)
  const [obs, setObs] = useState(item.obs)

  console.log(tipo)

  let disable = false

  if(tipo ==='show'){
    disable = true
  }

  useEffect(() => {

    if (!created) {
      const data = new Date()
      const day = String(data.getDate()).padStart(2, '0')
      const month = String(data.getMonth() + 1).padStart(2, '0')
      const year = String(data.getFullYear())
      const hour = String(data.getHours())
      const minutes = String(data.getMinutes())

      const fullDate = `${day}/${month}/${year} - ${hour}:${minutes}`
      setCreated(fullDate)
      console.log(created)
    }

  }, [])


  async function saveTask(e) {
    e.preventDefault()

    if(tipo === 'new'){
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
    }else if( tipo === 'edit'){
      console.log(item.id)
      await firebase.firestore().collection('tasks').doc(item.id).update({
        client: client,
        subject: subject,
        status: status,
        obs: obs
      })
      .then(()=>{
        alert('Editou')
      })
      .catch((error)=>{
        alert(error)
      })
    } 
    
  }
  
  async function deleteTask(e){
    e.preventDefault()
    
    await firebase.firestore().collection('tasks').doc(item.id).delete()
    .catch(()=>{
      alert('Chamado apagado')
    })
    .catch((error)=>{
      alert(error)
    })
  }
  return (
    <div className="modal">
      <div className="modal-new">
        <h1>Cadastro de Chamado</h1>
        <form onSubmit={(e) => { saveTask(e) }} className="form-modal" >
          <div>
            <label>Cliente</label>
            <input value={client} onChange={(e) => setClient(e.target.value)} disabled={disable} placeholder="Cliente" />
          </div>
          <div>
            <label>Assunto</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} disabled={disable} placeholder="Assunto" />
          </div>
          <div>
            <label>Status</label>
            <input value={status} onChange={(e) => setStatus(e.target.value)} disabled={disable} placeholder="Status" />
          </div>
          <div>
            <label>Criando em</label>
            <input value={created} onChange={(e) => setCreated(e.target.value)} disabled={true} placeholder="Criado em" />
          </div>
          <div>
            <label>Observações</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} disabled={disable} placeholder="Observações" />
          </div>
          <div className="buttons">
            <button type='submit' >Salvar</button>
            <button onClick={close}>Cancelar</button>
          </div>
        </form>
      </div>


    </div>
  )
}