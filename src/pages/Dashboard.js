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


const validation = yup.object().shape({
  client: yup.string().required("Unidade obrigatoria"),
  subject: yup.string().required("Assunto obrigatorio").min(5, "Minimo de 5 caracteres").max(15, "Maximo de 15 caracteres"),
  status: yup.string().required('Status é obrigatorio'),
  obs: yup.string().required('Descrição é obrigatorio').min(10, 'Minimo de 10 caracteres').max(100, 'Maximo de 100 caracteres'),
})



export default function Dashboard() {

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


  const [newTask, setNewTask] = useState({})
  const [client, setClient] = useState()
  const [clients, setClients] = useState([])
  const [subject, setSubject] = useState()
  const [status, setStatus] = useState()
  const [created, setCreated] = useState()
  const [obs, setObs] = useState()
  const [subjects, setSubjects] = useState(['Impressora', 'Sistema', 'Internet'])
  const [disable, setDisable] = useState(false)



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

  }, [])

  async function getDocs() {
    const docs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').where("userId", "==", user.id).limit('2').get()
    await loadTasks(docs)
    console.log(docs)

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
          status: doc.data().status,
          subject: doc.data().subject,
          userId: doc.data().userId
        })
      })

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


  const save = data => {
    saveTask()
  }


  async function saveTask(e) {

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
        toast.success("Chamado registrado !")
        setTasks('')
        closeForm()
        getDocs()
      })
      .catch((error) => {
        toast.error("Erro ao registrar chamado !")
        console.log(error)
      })


  }

  async function moreTasks() {

    setLoadingMore(true)
    const newDocs = await firebase.firestore().collection('tasks').orderBy('created').where("userId", "==", user.id).limit('2').startAfter(lastTask).get()

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


  if (loading) {
    return (

      <div className="rigth-container">
        <Sidebar />
        <div className="title">
          <Title name="Chamados">
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
        <Title name="Chamados">
          <FiMessageSquare size={22} />
        </Title>
      </div>
      <div className="container-profile">
        <form className="form-task hide" onSubmit={handleSubmit(save)}>
          <div>
            <div>
              <label>Cliente</label>
              <select disabled={disable} name="client" {...register("client")} value={client} onChange={(e) => { setClient(e.target.value) }} >
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
              <select disabled={disable} name="subject" {...register("subject")} value={subject} onChange={(e) => { setSubject(e.target.value) }}>
                <option value={''} >Selecione o assunto</option>
                {subjects.map((s, index) => {
                  return (
                    <option value={s} key={index}>{s}</option>
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
              <input value={created} name="created" disabled = {true} {...register("created")} onChange={(e) => setCreated(e.target.value)} placeholder="Criado em" />
            </div>
            <div id="obs">
              <label>Observações</label>
              <textarea value={obs} name="obs" {...register("obs")} onChange={(e) => setObs(e.target.value)} disabled={disable} placeholder="Observações" />
            </div>
            <div className="buttons">
              <button type='submit' >Salvar</button>
              <button onClick={(e) => showForm(e)}>Cancelar</button>
            </div>
          </div>
          <article className="error-message">
            <p>{errors.client?.message}</p>
            <p>{errors.subject?.message}</p>
            <p>{errors.status?.message}</p>
            <p>{errors.obs?.message}</p>
          </article>
        </form>
        {tasks.length === 0 ?
          <>
            <div className="new-task">
              <span>Não existem chamados registrados...</span>

              <Link to='#' className="new button-hover" onClick={showForm}> <FiPlus size={25} /> Abrir Chamado</Link>
            </div>

          </>
          :
          <div>
            <div className="new-task more-task">
              <Link to='#' className="new button-hover" onClick={showForm}> <FiPlus size={25} /> Abrir Chamado</Link>
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