import { useContext, useEffect, useState } from "react";
import { FiEdit2, FiSearch, FiDelete, FiTrash, FiCheck } from "react-icons/fi";
import firebase from '../services/firebaseConnection';
import '../index.css'
import { format } from 'date-fns'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/auth";
import Modal from "./Modal";
import DeleteModal from "./DeleteModal";


export default function TasksTable({ tasks, order }) {

     const { user } = useContext(AuthContext)
    

    const [task, setTask] = useState('')
    const [taskId, setTaskId] = useState('')
    const [type, setType] = useState('')
    const [concluded, setConcluded] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [newTask, setNewTask] = useState()

    

    async function saveTask(task) {
        
        const fullDate = format(new Date(), "dd/MM/yyyy HH:mm")
        setConcluded(fullDate)
 

        await firebase.firestore().collection('completedtasks').doc().set({
          client: task.client,
          subject: task.subject,
          priority: task.priority,
          status: task.status,
          type: task.type,
          created: task.created,
          concluded: fullDate,
          obs: task.obs,
          userId: user.id,
          taskImages: task.taskImages
        })
          .then(() => {
            toast.success("Chamado registrado !")

          })
          .catch((error) => {
            toast.error("Erro ao registrar chamado !")
            console.log(error)
          })
    
    
      }


    function editClient(t, item) {
        setType(t)
        setShowModal(!showModal)
        if (t === 'edit') {
            setTask(item)
        } else {
            setTask(item)
        }
    }


    async function deleteTask(id) {
        setTaskId(id)
        setShowDeleteModal(!showDeleteModal)

        }

    async function completeTask(task) {

        console.log(task)

        saveTask(task)
               
        await firebase.firestore().collection("tasks").doc(task.id).delete()
            .then(() => {

                toast.success("Chamado encerrado")
            })
            .catch((error) => {
                toast.error("Erro ao excluir !")
                console.log(error)
            })
    }


    return (
        <>
            <table className="table-tasks">
                <thead>
                    <tr className="table-head">
                        <th scope="col" onClick={() => order('client')}>Cliente</th>
                        <th scope="col" onClick={() => order('subject')}>Assunto</th>
                        <th scope="col" onClick={() => order('priority')}>Prioridade</th>
                        <th scope="col" onClick={() => order('status')}>Status</th>
                        <th scope="col" onClick={() => order('created')}>Criado em</th>
                        <th scope="col" onClick={() => order('concluded')}>Concluido em</th>
                        <th scope="col">#</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {

                        return (
                            <tr className="table-body-line" key={task.id}>
                                <td data-label="Cliente" >{task.client}</td>
                                <td data-label="Assunto">{task.subject}</td>
                                <td data-label="Prioridade">{task.priority}</td>
                                <td data-label="Status"><span className="status">{task.status}</span></td>
                                <td data-label="Criado em">{task.created}</td>
                                <td data-label="Concluido em">{task.concluded}</td>
                                <td data-label="#">
                                    <button className="task-btn edit" onClick={() => editClient('edit', task)}><FiEdit2 size={17} /></button>
                                    <button className="task-btn search" onClick={() => editClient('show', task)}><FiSearch size={17} /></button>
                                    {user.group === 'admin' &&(
                                        <button className="task-btn check" onClick={() => completeTask(task)}><FiCheck size={17} /></button>
                                    )}
                                    <button className="task-btn delete" onClick={() => deleteTask(task.id)}><FiTrash size={17} /></button>
                                </td>
                            </tr>
                        )

                    })}
                </tbody>
            </table>
            {showModal && (
                <Modal tipo={type} close={editClient} item={task} />
            )}
            {showDeleteModal && (
                <DeleteModal id={taskId} close={deleteTask} bd={"tasks"}  />
            )}

        </>



    )


}

