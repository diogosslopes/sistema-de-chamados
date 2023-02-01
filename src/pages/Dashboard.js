import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import {Link} from 'react-router-dom'
import Modal from "./Modal";


export default function Dashboard(){

  const [ tasks, setTasks ] = useState([])
  const [type, setType] = useState('')
  const [showModal, setShowModal] = useState(false)

  console.log(type)

  function newClient(t){
    setType(t)
    setShowModal(!showModal)
    console.log(t)
    console.log(type)
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
          <div className="new-task">
            <span>Não existem chamados registrados...</span>
            
            <button  onClick={ () => newClient("type")}>
              Abrir Chamado
              {/* <Link to='' > <FiPlus size={25}/> Abrir Chamado</Link> */}
            </button>
          </div>
          :
          <div>
            <div className="new-task more-task">
              <Link to='/newtask' > <FiPlus size={25}/> Abrir Chamado</Link>
            </div>
            <table className="table-tasks">
              <thead>
                <tr className="table-head">
                  <th scope="col">Codigo</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Criado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-body-line">
                  <td data-label="Codigo">1</td>
                  <td data-label="Cliente">Diogo</td>
                  <td data-label="Assunto">Internet</td>
                  <td data-label="Status"><span className="status">Aberto</span></td>
                  <td data-label="Criado em">25/01/2023</td>
                  <td data-label="#">
                    <button className="task-btn edit"><FiEdit2 size={17}/></button>
                    <button className="task-btn search"><FiSearch size={17}/></button>
                  </td>
                </tr>
                <tr className="table-body-line">
                  <td data-label="Codigo">1</td>
                  <td data-label="Cliente">Diogo</td>
                  <td data-label="Assunto">Internet</td>
                  <td data-label="Status"><span className="status">Aberto</span></td>
                  <td data-label="Criado em">25/01/2023</td>
                  <td data-label="#">
                    <button className="task-btn edit"><FiEdit2 size={17}/></button>
                    <button className="task-btn search"><FiSearch size={17}/></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      </div>
      <Modal tipo={type} show={showModal} />
    </div>
  )
}