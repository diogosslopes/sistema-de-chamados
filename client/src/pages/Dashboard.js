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
import TasksReport from "../documents/TasksReport";
import Axios from "axios";


const validation = yup.object().shape({
  client: yup.string(),
  subject: yup.string().required("Assunto obrigatorio"),
  obs: yup.string().required('Descrição é obrigatorio').min(10, 'Minimo de 10 caracteres').max(300, 'Maximo de 300 caracteres'),
})



export default function Dashboard() {

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
  const [priority, setPriority] = useState()
  const [subject, setSubject] = useState()
  const [taskType, setTaskType] = useState(['TI', 'Estrutura'])
  const [selectedType, setSelectedType] = useState('')
  const [status, setStatus] = useState('Criado')
  const [created, setCreated] = useState()
  const [obs, setObs] = useState([])
  const [prioritys, setPrioritys] = useState(['Baixa', 'Média', 'Alta'])
  const [subjectsTi, setSubjectsTi] = useState(['Impressora', 'Sistema', 'Internet'])
  const [subjectsGeneral, setSubjectsGeneral] = useState(['Eletrica', 'Pintura', 'Ar Condicionado', 'Hidraulico', 'Portas', 'Outros'])
  const [subjects, setSubjects] = useState([])
  const [stats, setStats] = useState(['Criado', 'Aberto', 'Em andamento', 'Enviado p/ tec', 'Aguardando liberação', 'Fechado'])
  const [disable, setDisable] = useState(true)
  const [images, setImages] = useState([])
  const [newList, setNewList] = useState([])
  const [taskImages, setTaskImages] = useState([])
  let taskkkk
  let fullDate = ''
  let obsList = []
  let imagesList = []
  let newTasks = []
  let newObsList = []


  console.log(user)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validation)
  })


  useEffect(() => {

    async function loadClients() {

      Axios.get("http://localhost:3001/getUsers").then((response)=>{
        console.log(response.data)
        let list = []
        setClients(response.data)

      })

      // await firebase.firestore().collection('clients').orderBy('name', 'asc').get()
      //   .then((snapshot) => {
      //     let list = []

      //     snapshot.forEach((doc) => {
      //       list.push({
      //         id: doc.id,
      //         client: doc.data().name
      //       })
      //     })
      //     setClients(list)

      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })

      }
      
      loadClients()
      getDocs()
      
      if (user.group === 'admin') {
        setIsAdmin(true)
        setDisable(false)
      }
      
      
    }, [])

  useEffect(() => {

    if (taskType === "TI") {
      setSubjects(subjectsTi)
    } else {
      setSubjects(subjectsGeneral)
    }



  }, [taskType])

  async function getDocs() {

    setTasks([])
    Axios.get("http://localhost:3001/getObsList").then((response) => {
      // loadTasks(response.data)
      newObsList = response.data
      Axios.get("http://localhost:3001/getTasks").then((response) => {
        // loadTasks(response.data)
        newTasks = response.data
        // loadTasks(newTasks, newObsList)
        
        if (user.group === "admin") {
          loadTasks(newTasks, newObsList)
          
        } else {
          const tasksDocs = newTasks.filter((t) => user.email === t.userEmail)
          const obsDocs = newObsList.filter((o) => user.name === o.client)
          loadTasks(tasksDocs, obsDocs)
          
          
        }
      })
    })
    

  }

  async function loadTasks(docs, obs) {
    
    const isTaksEmpty = docs.length === 0
    console.log(isEmpty)
    
    if (!isTaksEmpty) {
      docs.forEach((doc) => {
        obsList = obs.filter((o) => doc.taskId === o.taskid)
        list.push({
          taskId: doc.taskId,
          client: doc.client,
          created: doc.created,
          obs: obsList,
          priority: doc.priority,
          status: doc.status,
          type: doc.type,
          subject: doc.subject,
          userId: doc.userId,
          taskImages: doc.taskImages,
          userEmail: doc.userEmail
        })
        obsList = []
      })
      console.log(list)
      
      
      const lastDoc = docs[docs.length - 1]
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

  const templateParams = {
    unity: client,
    subject: subject,
    message: obs
  }
  
  function sendEmail() {
    emailjs.send("service_lv8kn8j", "template_a9s048m", templateParams, "BrAq6Nxcac_3F_GXo")
    .then((response) => {
      console.log("Email enviado ", response.status, response.text)
    })
  }
  
  
  async function saveTask(e) {
    
    let taskImagesList = []
    
    
    for (let i = 0; i < images.length; i++) {
      await firebase.storage().ref(`task-images/${user.id}/${images[i].name}`)
        .put(images[i])
        .then(async () => {
          await firebase.storage().ref(`task-images/${user.id}`)
            .child(images[i].name).getDownloadURL()
            .then(async (url) => {
              console.log(url)
              taskImagesList.push(url)
            })
          })
          console.log(images[i].name)
          
        }
        console.log(taskImages)
        setTaskImages(taskImagesList)
    
    setNewTask({
      client: client,
      subject: subject,
      status: status,
      priority: priority,
      type: taskType,
      created: created,
      obs: obs,
      userId: user.id,
      // taskImages: taskImagesList,
      userEmail: user.email
    })

    Axios.post("http://localhost:3001/registertask", {
      client: client,
      subject: subject,
      priority: priority,
      status: status,
      type: taskType,
      created: created,
      obs: obs,
      userId: user.id,
      // taskImages: taskImagesList,
      userEmail: user.email
    }).then(() => {
      Axios.post("http://localhost:3001/searchtask", {
        client: client,
        created: created,
        obs: obs,
        userEmail: user.email,
        userId: user.id
      }).then((response) => {
        console.log(response)
        saveObs(response.data[0])
        saveImages(response.data[0], taskImages)
        const newObs = {
          client: response.data[0].client,
          created: response.data[0].created,
          obs: response.data[0].obs,
          taskid: response.data[0].id
        }

        const newImage = {
          client: response.data[0].client,
          created: response.data[0].created,
          image: response.data[0].obs,
          taskid: response.data[0].id
        }
        obsList.push(newObs)
        imagesList.push(newImage)
        setTasks([
          ...tasks,
          {
            id: response.data[0].id,
            client: client,
            subject: subject,
            priority: priority,
            status: status,
            type: taskType,
            created: created,
            obs: obsList,
            userId: user.id,
            taskImages: imagesList,
            userEmail: user.email
          }
        ])
      })
    })

    toast.success("Chamado registrado !")
    setTasks('')
    // saveImages(images)
    closeForm()
    getDocs()
    // sendEmail()


  }

  async function moreTasks() {

    setLoadingMore(true)

    if (selectedType !== "" && isAdmin === false) {
      const newDocs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').where("client", "==", user.name)
        .where("type", "==", selectedType).limit('10').startAfter(lastTask).get()
      await loadTasks(newDocs)
    } else if (selectedType === "" && isAdmin === false) {
      const newDocs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').where("client", "==", user.name)
        .limit('10').startAfter(lastTask).get()
      await loadTasks(newDocs)
    } else if (selectedType !== "" && isAdmin === true) {
      const newDocs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').where("type", "==", selectedType)
        .limit('10').startAfter(lastTask).get()
      await loadTasks(newDocs)
    } else if (selectedType === "" && isAdmin === true) {
      const newDocs = await firebase.firestore().collection('tasks').orderBy('created', 'desc').limit('10').startAfter(lastTask).get()
      await loadTasks(newDocs)
    }


  }

  // function newClient(t, item) {
  //   setType(t)
  //   setShowModal(!showModal)
  //   if (t === 'new') {
  //     setTask('')
  //   } else {
  //     setTask('25/01/2023')
  //   }
  // }

  function showForm(e) {
    e.preventDefault()
    console.log(clients)
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

  async function filter(e) {

    console.log(tasks)
    e.preventDefault()
    setLoading(true)
    setTasks('')
    setSelectedType(e.target.value)
    let filterDocs = ""

    if (user.group === "admin") {
      Axios.get("http://localhost:3001/getTasks").then((response)=>{
        setIsEmpty(false)
        setLoadingMore(false)
        const tasksDocs = response.data.filter((t) => t.type === e.target.value )
       loadTasks(tasksDocs, newObsList)
      })
    } else {
      Axios.get("http://localhost:3001/getTasks").then((response)=>{
        const tasksDocs = response.data.filter((t) => t.type === e.target.value && user.email === t.userEmail )
        const obsDocs = newObsList.filter((o) => user.name === o.client)
        setIsEmpty(false)
        setLoadingMore(false)
        loadTasks(tasksDocs, obsDocs)
      })

      

    }


    console.log(filterDocs)
    // loadTasks(filterDocs, newObsList)
  }

  async function orderBy(e) {
    setTasks('')

    if (e === 'concluded') {
      const order = 'created'
      const docs = await firebase.firestore().collection('tasks').orderBy(order, 'asc').get()
      await loadTasks(docs)
    } else {
      const order = e
      const docs = await firebase.firestore().collection('tasks').orderBy(order, 'asc').get()
      await loadTasks(docs)
    }

  }

  async function saveObs(doc) {

    console.log(doc)

    Axios.post("http://localhost:3001/registerobs", {
      client: doc.client,
      created: doc.created,
      obs: doc.obs,
      taskid: doc.taskId
    })


  }

  async function saveImages(doc, images) {

    console.log(images)
    images.map((i)=>{

      console.log(i)
      Axios.post("http://localhost:3001/registerImage", {
        client: doc.client,
        created: doc.created,
        image: i,
        taskid: doc.taskId
      })
    })


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
      <div className="container-task">
        <form className="form-task hide" onSubmit={handleSubmit(save)}>
          <div className="form-div form-div-task">
            <div className="tipo_select">
              <label>Tipo</label>
              <select name="taskType" {...register("taskType")} value={taskType} onChange={(e) => { setTaskType(e.target.value) }}>
                <option hidden value={''} >Selecione o tipo de chamado</option>
                <option>TI</option>
                <option>Estrutura</option>
              </select>

            </div>
            <div className="subject_select">
              <label>Assunto</label>
              <select name="subject" {...register("subject")} value={subject} onChange={(e) => { setSubject(e.target.value) }}>
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
              <select name="priority" {...register("priority")} value={priority} onChange={(e) => { setPriority(e.target.value) }}>
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
              <select disabled={disable} name="status" {...register("status")} value={status} onChange={(e) => { setStatus(e.target.value) }}>
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
            <div>
              <label>Anexos</label>
              <input type="file" multiple='multiple' onChange={(e) => { setImages(e.target.files) }} />
            </div>
            <div id="obs">
              <label>Observações</label>
              <textarea value={obs} name="obs" {...register("obs")} onChange={(e) => setObs(e.target.value)} placeholder="Observações" />

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
            <div className="filter-select">
              <label>Filtrar</label>
              <select name="selectedType" {...register("selectedType")} value={selectedType} onChange={(e) => { filter(e) }}>
                <option hidden value={''} >Selecione o tipo de chamado</option>
                <option value="TI">TI</option>
                <option value="Estrutura">Estrutura</option>
              </select>
            </div>

          </>
          :
          <div>
            <div className="new-task more-task">
              <Link to='#' className="new button-hover" onClick={showForm}> <FiPlus size={25} /> Abrir Chamado</Link>
              <div className="filter-select">
                <label>Filtrar</label>
                <select name="selectedType" {...register("selectedType")} value={selectedType} onChange={(e) => { filter(e) }}>
                  <option hidden value={''} >Selecione o tipo de chamado</option>
                  <option value="TI">TI</option>
                  <option value="Estrutura">Estrutura</option>
                </select>
              </div>
            </div>
            <TasksTable tasks={tasks} order={orderBy} getDoc={getDocs} disable='true' />
            {loadingMore && <h3>Carregando...</h3>}

            {!loadingMore && !isEmpty && <button className="button-hover" onClick={moreTasks}>Carregar Mais</button>}
            <button className="button-hover" onClick={(e) => TasksReport(tasks)}>Imprimir</button>

          </div>
        }
      </div>
    </div>
  )
}