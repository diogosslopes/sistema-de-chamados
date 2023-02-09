import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom'
import Modal from "../components/Modal";
import firebase from '../services/firebaseConnection';


export default function TasksTable(props) {

    const tasks = props
    const [task, setTask] = useState('')
    const [type, setType] = useState('')
    const [showModal, setShowModal] = useState(false)
    console.log(props)

    function editClient(t, item) {
        setType(t)
        setShowModal(!showModal)
        if (t === 'edit') {
            console.log('Aqui 1')
            setTask('')
        } else {
            setTask('25/01/2023')
        }
    }

    return (
        <>
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
                    {tasks.map((task) => {

                        return (
                            <tr className="table-body-line">
                                <td data-label="Codigo">1</td>
                                <td data-label="Cliente">{task.client}</td>
                                <td data-label="Assunto">{task.subject}</td>
                                <td data-label="Status"><span className="status">{task.status}</span></td>
                                <td data-label="Criado em">{task.created}</td>
                                <td data-label="#">
                                    <button className="task-btn edit" onClick={() => editClient('edit', task)}><FiEdit2 size={17} /></button>
                                    <button className="task-btn search" onClick={() => editClient('show', task.created)}><FiSearch size={17} /></button>
                                </td>
                            </tr>
                        )

                    })}
                </tbody>
            </table>
            {showModal && (
                <Modal tipo={type} close={newClient} item={task} />
            )}

        </>



    )


}

