import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom'
import Modal from "../components/Modal";
import firebase from '../services/firebaseConnection';
import TasksTable from "../components/TasksTable"

import { AuthContext } from "../context/auth";
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns'
import emailjs from '@emailjs/browser'


const validation = yup.object().shape({

})



export default function Reports() {

  const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000))

  const { user } = useContext(AuthContext)
  const [tasks, setTasks] = useState([])
  let list = []
  const [task, setTask] = useState('')
  const [type, setType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastTask, setLastTask] = useState()
  const [loadingMore, setLoadingMore] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)


  const [newTask, setNewTask] = useState({})
  const [client, setClient] = useState(user.name)
  const [clients, setClients] = useState([])
  const [priority, setPriority] = useState('')
  const [subject, setSubject] = useState('')
  const [taskType, setTaskType] = useState(['TI', 'Estrutura'])
  const [selectedType, setSelectedType] = useState('')
  const [status, setStatus] = useState('')
  const [created, setCreated] = useState()
  const [concluded, setConcluded] = useState('')
  const [obs, setObs] = useState()
  const [prioritys, setPrioritys] = useState(['Baixa', 'Média', 'Alta'])
  const [subjects, setSubjects] = useState(['Impressora', 'Sistema', 'Internet'])
  const [stats, setStats] = useState(['Criado', 'Aberto', 'Em andamento', 'Enviado p/ tec', 'Aguardando liberação', 'Fechado'])
  const [disable, setDisable] = useState(true)
  const [images, setImages] = useState([])



  const { register, handleSubmit, formState: { errors } } = useForm({
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
    getDocs()

    if (user.group === 'admin') {
      setIsAdmin(true)
      setDisable(false)
    }

  }, [])

  async function getDocs() {
    if (user.group === "admin") {
      const docs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').limit('2').get()
      await loadTasks(docs)
    } else {
      const docs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').where("client", "==", user.name).limit('2').get()
      await loadTasks(docs)

    }


  }
  async function loadTasks(docs) {

    const isTaksEmpty = docs.size === 0

    if (!isTaksEmpty) {
      docs.forEach((doc) => {
        list.push({
          id: doc.id,
          client: doc.data().client,
          created: doc.data().created,
          obs: doc.data().obs,
          priority: doc.data().priority,
          status: doc.data().status,
          type: doc.data().type,
          subject: doc.data().subject,
          userId: doc.data().userId,
          taskImages: doc.data().taskImages
        })
      })

      console.log(list)

      const lastDoc = docs.docs[docs.docs.length - 1]
      setLastTask(lastDoc)
      setTasks(tasks => [...tasks, ...list])
      setLoading(false)

    } else {
      setIsEmpty(true)
      setLoading(false)

    }
    setLoadingMore(false)
  }



  async function moreTasks() {

    setLoadingMore(true)

    const newDocs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').where("client", "==", user.name).limit('2').startAfter(lastTask).get()
    await loadTasks(newDocs)




  }

  function newClient(t, item) {
    setType(t)
    setShowModal(!showModal)
    if (t === 'new') {
      setTask('')
    } else {
      setTask('25/01/2023')
    }
  }

  function showForm(e) {
    e.preventDefault()

    const fullDate = format(new Date(), "dd/MM/yyyy HH:mm")
    setCreated(fullDate)

    const elementForm = document.querySelector('.form-task')
    const elementButton = document.querySelector('.new')

    if (elementForm.classList.contains('hide')) {
      elementButton.classList.add('hide')
      elementForm.classList.remove('hide')
    } else {
      elementForm.classList.add('hide')
      elementButton.classList.remove('hide')

    }
  }

  function closeForm() {
    const elementForm = document.querySelector('.form-task')
    const elementButton = document.querySelector('.new')
    if (!elementForm.classList.contains('hide')) {
      elementForm.classList.add('hide')
      elementButton.classList.remove('hide')
    }
  }

  async function filter(value, name) {


    console.log(value, name)
    setTasks('')
    const docs = await firebase.firestore().collection('tasks').orderBy('created', 'asc').where(name, "==", value).get()
    await loadTasks(docs)

  }

  async function orderBy(e){
    const order = e.target.value

    setTasks('')
    const docs = await firebase.firestore().collection('tasks').orderBy(order, 'asc').get()
    await loadTasks(docs)
  }


  if (loading) {
    return (

      <div className="rigth-container">
        <Sidebar />
        <div className="title">
          <Title name="Relatorios">
            <FiMessageSquare size={22} />
          </Title>
          <div className="new-task title">
            <span>Carregando chamados !</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rigth-container">
      <Sidebar />
      <div className="title">
        <Title name="Relatorios">
          <FiMessageSquare size={22} />
        </Title>
      </div>
      <div className="container-task">
        <form className="form-task form-filter hide" onSubmit={handleSubmit(filter)} >
          <div>
            <div className="tipo_select">
              <label>Tipo</label>
              <select name="taskType" {...register("taskType")} value={taskType} onChange={(e) => { filter(e.target.value, "type") && setSubject(e.target.value) }}>
                <option hidden value={''} >Selecione o tipo de chamado</option>
                <option>TI</option>
                <option>Estrutura</option>
              </select>
              
            </div>
            <div className="subject_select">
              <label>Assunto</label>
              <select name="subject" {...register("subject")} value={subject} onChange={(e) => { filter(e.target.value, e.target.name) && setSubject(e.target.value) }}>
                <option hidden value={''} >Selecione o assunto</option>
                {subjects.map((s, index) => {
                  return (
                    <option value={s} key={index}>{s}</option>
                  )
                })}
              </select>
            </div>
            <div className="priority_select">
              <label>Prioridade</label>
              <select name="priority" {...register("priority")} value={priority} onChange={(e) => { filter(e.target.value, e.target.name) && setSubject(e.target.value) }}>
                <option hidden value={''} >Selecione a prioridade</option>
                {prioritys.map((p, index) => {
                  return (
                    <option value={p} key={index}>{p}</option>
                  )
                })}
              </select>
            </div>
            <div className="status_select">
              <label>Status</label>
              <select disabled={disable} name="status" {...register("status")} value={status} onChange={(e) => { filter(e.target.value, e.target.name) && setSubject(e.target.value) }}>
                <option hidden value={''} >Selecione o status</option>
                {stats.map((s, index) => {
                  return (
                    <option value={s} key={index}>{s}</option>
                  )
                })}
              </select>
            </div>
            <div className="created">
              <label>Criando em</label>
              <input value={created} name="created" disabled={true} {...register("created")} onChange={(e) => { setCreated(e.target.value) }} placeholder="Criado em" />
            </div>
            <div className="created">
              <label>Concluido em</label>
              <input value={concluded} name="concluded" disabled={true} {...register("concluded")} onChange={(e) => { setConcluded(e.target.value) }} placeholder="Concluido em" />
            </div>
            <div className="buttons">
              <button type='submit'>Filtrar</button>
              <button onClick={(e) => showForm(e)}>Cancelar</button>
            </div>
          </div>

        </form>
        {tasks.length === 0 ?
          <>
            <div className="new-task">
              <span>Não existem chamados registrados...</span>
            </div>
            <div className="filter-select">
              <label>Filtrar</label>
              <select name="selectedType" {...register("selectedType")} value={selectedType} onChange={(e) => { orderBy(e) }}>
                <option hidden value={''} >Selecione o tipo de chamado</option>
                <option value="status">Status</option>
                <option value="type">Tipo</option>
                <option value="subject">Assunto</option>
                <option value="priority">Prioridade</option>
                <option value="client">Unidade</option>
              </select>
              <button className="new" onClick={showForm}>Filtros</button>
            </div>

          </>
          :
          <div>
            <div className="new-task more-task">
              
              <div className="filter-select">
                <label>Filtrar</label>
                <select name="selectedType" {...register("selectedType")} value={selectedType} onChange={(e) => { orderBy(e) }}>
                <option hidden value={''} >Selecione o tipo de chamado</option>
                <option value="status">Status</option>
                <option value="type">Tipo</option>
                <option value="subject">Assunto</option>
                <option value="priority">Prioridade</option>
                <option value="client">Unidade</option>
              </select>
               <button className="new" onClick={showForm}>Filtros</button>
              </div>
            </div>
            <TasksTable tasks={tasks} />
            {loadingMore && <h3>Carregando...</h3>}

            {!loadingMore && !isEmpty && <button className="button-hover" onClick={moreTasks}>Carregar Mais</button>}

          </div>
        }
      </div>
      {showModal && (
        <Modal tipo={type} close={newClient} item={task} />
      )}
    </div>
  )
}