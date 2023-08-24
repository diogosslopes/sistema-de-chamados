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


export default function TasksTable({ tasks }) {

     const { user } = useContext(AuthContext)
    

    const [task, setTask] = useState('')
    const [taskId, setTaskId] = useState('')
    const [type, setType] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [newTask, setNewTask] = useState()


    async function saveTask(task) {
        
        // let taskImages = []
    
        // for (let i = 0; i < images.length; i++) {
        //   await firebase.storage().ref(`task-images/${user.id}/${images[i].name}`)
        //     .put(images[i])
        //     .then(async () => {
        //       await firebase.storage().ref(`task-images/${user.id}`)
        //         .child(images[i].name).getDownloadURL()
        //         .then(async (url) => {
        //           console.log(url)
        //           taskImages.push(url)
        //         })
        //     })
        //   console.log(images[i].name)
        //   console.log(taskImages)
    
        // }
    
        // setNewTask({
        //   client: task.client,
        //   subject: task.subject,
        //   status: task.status,
        //   priority: task.priority,
        //   type: task.taskType,
        //   created: task.created,
        //   obs: task.obs,
        //   userId: task.user.id,
        //   taskImages: task.taskImages
        // })
        await firebase.firestore().collection('completedtasks').doc().set({
          client: task.client,
          subject: task.subject,
          priority: task.priority,
          status: task.status,
          type: task.type,
          created: task.created,
          obs: task.obs,
          userId: user.id,
          taskImages: task.taskImages
        })
          .then(() => {
            toast.success("Chamado registrado !")
            // setTasks('')
            // saveImages(images)
            // closeForm()
            // getDocs()
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
                // close()
                // window.location.reload()
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
                        <th scope="col">Cliente</th>
                        <th scope="col">Assunto</th>
                        <th scope="col">Prioridade</th>
                        <th scope="col">Status</th>
                        <th scope="col">Criado em</th>
                        <th scope="col">#</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {

                        return (
                            <tr className="table-body-line" key={task.id}>
                                <td data-label="Cliente">{task.client}</td>
                                <td data-label="Assunto">{task.subject}</td>
                                <td data-label="Prioridade">{task.priority}</td>
                                <td data-label="Status"><span className="status">{task.status}</span></td>
                                <td data-label="Criado em">{task.created}</td>
                                <td data-label="#">
                                    <button className="task-btn edit" onClick={() => editClient('edit', task)}><FiEdit2 size={17} /></button>
                                    <button className="task-btn search" onClick={() => editClient('show', task)}><FiSearch size={17} /></button>
                                    <button className="task-btn check" onClick={() => completeTask(task)}><FiCheck size={17} /></button>
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
                <DeleteModal id={taskId} close={deleteTask} bd={"tasks"} />
            )}

        </>



    )


}

