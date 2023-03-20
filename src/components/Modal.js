import { useEffect, useState } from "react";
import firebase from '../services/firebaseConnection';
import '../index.css'
import { format } from 'date-fns'

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


  // let disable = false


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
      
      const fullDate = format(new Date(), "dd/MM/yyyy hh:mm")
      setCreated(fullDate)
      console.log(created)
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
        <form onSubmit={(e) => { saveTask(e) }} className="form-modal" >
          <div>
            <label>Cliente</label>
            <select disabled={disable} value={client} onChange={changeClient}>

              {clients.map((c, index) => {
                return (
                  <option value={c.client} key={c.id}>{c.client}</option>
                )
              })}
            </select>
          </div>
          <div>
            <label>Assunto</label>
            <select disabled={disable} value={subject} onChange={(e) => { setSubject(e.target.value) }}>

              {subjects.map((s, index) => {
                return (
                  <option value={s} key={index}>{s}</option>
                )
              })}
            </select>
          </div>
          <div className="radio-status">
            <label>Status</label>
            <div className="radio-buttons">
              <input type="radio" name="radio" value='Aberto' onChange={(e) => setStatus(e.target.value)} disabled={disable} />
              <span>Aberto</span>
              <input type="radio" name="radio" value='Em andamento' onChange={(e) => setStatus(e.target.value)} disabled={disable} />
              <span>Em andamento</span>
              <input type="radio" name="radio" value='Enviado p/ tecnico' onChange={(e) => setStatus(e.target.value)} disabled={disable} />
              <span>Enviado p/ tecnico</span>
              <input type="radio" name="radio" value='Fechado' onChange={(e) => setStatus(e.target.value)} disabled={disable} />
              <span>Fechado</span>
            </div>
          </div>
          <div className="status_select">
            <label>Status</label>
            <select disabled={disable} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Aberto</option>
              <option>Em andamento</option>
              <option>Enviado p/ tecnico</option>
              <option>Fechado</option>
            </select>
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