import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom'
import Modal from "../components/Modal";
import firebase from '../services/firebaseConnection';
import TasksTable from "../components/TasksTable"
import { collection, getDocs, orderBy, limit, startAfter, query, } from 'firebase/firestore'
import { AuthContext } from "../context/auth";


export default function Dashboard() {

  const {user} = useContext(AuthContext)
  const [tasks, setTasks] = useState([])
  let list = []
  const [task, setTask] = useState('')
  const [type, setType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastTask, setLastTask] = useState()
  const [loadingMore, setLoadingMore] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)


  useEffect(() => {

    async function getDocs() {
      const docs = await firebase.firestore().collection('tasks').orderBy('created').where("userId", "==", user.id).limit('2').get()
      await loadTasks(docs)
      console.log(docs)

    }
    getDocs()

  }, [])

  async function loadTasks(docs) {

    console.log(docs.size)
    const isTaksEmpty = docs.size === 0
    console.log(isTaksEmpty)

    if(!isTaksEmpty){
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
      
    }else{
      setIsEmpty(true)
      setLoading(false)
      
    }
    setLoadingMore(false)
    

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
        {tasks.length === 0 ?
          <>
            <div className="new-task">
              <span>Não existem chamados registrados...</span>
              <Link to='#' onClick={() => newClient("new")}> <FiPlus size={25} /> Abrir Chamado</Link>
            </div>

          </>
          :
          <div>
            <div className="new-task more-task">
              <Link to='#' onClick={() => newClient("new")}> <FiPlus size={25} /> Abrir Chamado</Link>
            </div>
            <TasksTable tasks={tasks} />
            {loadingMore && <h3>Carregando...</h3>}

            {!loadingMore && !isEmpty && <button onClick={moreTasks}>Carregar Mais</button> }
            
          </div>
        }
      </div>
      {showModal && (
        <Modal tipo={type} close={newClient} item={task} />
      )}
    </div>
  )
}