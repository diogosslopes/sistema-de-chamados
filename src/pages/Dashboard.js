import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import {Link} from 'react-router-dom'
import Modal from "../components/Modal";
import firebase from '../services/firebaseConnection';
import TasksTable from "../components/TasksTable"


export default function Dashboard(){

  const [tasks, setTasks ] = useState([])
  let list = []
  const [task, setTask] = useState('')
  const [type, setType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [ loading, setLoading] = useState(true)

  useEffect(()=>{

    async function loadTasks(){

      const docs = await firebase.firestore().collection('tasks').get()
      
      docs.forEach((doc)=>{
        list.push({
          id: doc.id,
          client: doc.data().client,
          created: doc.data().created,
          obs: doc.data().obs,
          status: doc.data().status,
          subject: doc.data().subject
        }) 
      })
      setTasks(list)
      setLoading(false)
    }
    loadTasks()
    console.log(tasks)
  },[])

  function newClient(t , item){
    setType(t)
    setShowModal(!showModal)
    if(t === 'new'){
      console.log('Aqui 1')
      setTask('')
    }else{
      setTask('25/01/2023')
    }
  }



  return(
    <div className="rigth-container">
      <Sidebar/>
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
              <Link to='#' onClick={ () => newClient("new")}> <FiPlus size={25}/> Abrir Chamado</Link>
          </div>
            <div className="new-task title">
              <span>Carregando chamados !</span>
            </div>        
        </>
          :
          <div>
            <div className="new-task more-task">
              <Link to='#' onClick={ () => newClient("new")}> <FiPlus size={25}/> Abrir Chamado</Link>
            </div>
            <TasksTable tasks={tasks}/>
          </div>
        }
      </div>
      {showModal && (
        <Modal tipo={type} close={newClient} item={task}  />        
      )}
    </div>
  )
}