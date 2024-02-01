import { FiUsers, FiTrash, FiEdit2 } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { useContext, useEffect, useState } from "react";
import firebase from '../services/firebaseConnection';

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../components/DeleteModal";
import { AuthContext } from "../context/auth";
import Axios from "axios"




export default function Clients() {

    const validation = yup.object().shape({
        name: yup.string().required("Nome é obrigatório").min(6, "Nome deve conter mínimo 6 caracteres"),
        login: yup.string().required("Email é obrigatório").email("Digitie um e-mail válido")
    })

    const { registerUser } = useContext(AuthContext)
    const [name, setName] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [adress, setAdress] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [clientList, setClientList] = useState([])
    const [disable, setDisable] = useState(false)
    const [editing, setEditing] = useState()
    const [showModal, setShowModal] = useState(false)
    const [unitId, setUnitId] = useState()

    const elementForm = document.querySelector('.form-client')
    let list = []
    const elementButton = document.querySelector('.new')

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validation)
    })

    const save = value => {


        // if (editing === true) {
        //     editClient()
        // } else {
        //     firebase.auth().createUserWithEmailAndPassword(value.login, value.password)
        //     .then(() => {
        //         console.log("Sucesso")
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //         })
        //     firebase.auth().createUserWithEmailAndPassword(value.login, value.password)
        //         .then(async (data) => {
        //             let uid = data.user.uid
        //             newClient()
        //             await firebase.firestore().collection("users")
        //                 .doc(uid).set({
        //                     id: uid,
        //                     name: value.name,
        //                     email: data.user.email,
        //                     avatar: null,
        //                     group: null
        //                 })
        //         }).catch((error) => {
        //             console.log(error)
        //         })
        // }

        newClient()

    }



    useEffect(() => {
        async function loadClients() {


            const clients = await firebase.firestore().collection('clients').orderBy("name").get()

            clients.forEach((doc) => {
                list.push({
                    id: doc.id,
                    name: doc.data().name,
                    cnpj: doc.data().cnpj,
                    adress: doc.data().adress,
                    email: doc.data().email
                })

            })
            setClientList(list)
        }
        loadClients()
    }, [newClient])


    function showForm() {
        if (elementForm.classList.contains('hide')) {
            elementButton.classList.add('hide')
            elementForm.classList.remove('hide')
        } else {
            elementForm.classList.add('hide')
            elementButton.classList.remove('hide')
            setAdress('')
            setCnpj('')
            setLogin('')
            setName('')
            setPassword('')
        }
    }

    // async function newClient(e) {
    //     // e.preventDefault()
    //     await firebase.firestore().collection('clients').add({
    //         name: name,
    //         cnpj: cnpj,
    //         adress: adress,
    //         email: login
    //     })
    //         .then(() => {
    //             toast.success("Cliente cadastrado com sucesso !")
    //             showForm()
    //         })
    //         .catch((error) => {
    //             toast.error("Erro ao cadastrar cliente")
    //             console.log(error)
    //         })
    // }


    async function editClient() {
        toast.success("Editado com sucesso")
    }
    function editingClient(c) {
        setEditing(true)
        setName(c.name)
        setAdress(c.adress)
        setLogin(c.email)
        showForm()
        // toast.success("Editado com sucesso")
    }

    function deleteItem(id) {
        setShowModal(!showModal)
        setUnitId(id)
    }




//--------------------------------------------------- MYSQL ---------------------------------------------------------------------------------------

function newClient () {
 console.log("Cadastrado")
 Axios.post("http://localhost:3001/registeruser", {
    name: name,
    adress: adress, 
    email: login,
    password: password
  }).then((response)=>{
    console.log(response)
  })
}




    return (
        <div className="rigth-container">
            <Sidebar />
            <div className="title">
                <Title name="Unidades">
                    <FiUsers size={22} />
                </Title>
            </div>
            <button onClick={showForm} className="new">Nova Unidade</button>
            <div className="container-client ">
                <form className="form-profile form-client hide" onSubmit={handleSubmit(save)}>
                    <div className="form-div">
                        <div >
                            <label>Nome</label>
                            <input type='text' name="name" {...register("name")} value={name} onChange={(e) => setName(e.target.value)} />
                            <label>Endereço</label>
                            <input type='text' name="adress" {...register("adress")} value={adress} onChange={(e) => setAdress(e.target.value)} />
                            <label>E-mail</label>
                            <input type='text' name="login" disabled={disable}  {...register("login")} value={login} onChange={(e) => setLogin(e.target.value)} />
                            <label>Senha</label>
                            <input type='password' name="password" disabled={disable}  {...register("password")} value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className="buttons">
                                <button type="submit">Salvar</button>
                                <button type="button" onClick={showForm}>Cancelar</button>
                            </div>
                        </div>
                        <article className="error-message">
                            <p>{errors.name?.message}</p>
                            <p>{errors.login?.message}</p>
                        </article>
                    </div>
                </form>
                {clientList.map((c) => {
                    return (
                        <div key={c.id} className="clients-list">
                            <label>Nome: {c.name}</label>
                            <label>Endereço: {c.adress} </label>
                            <label>E-mail: {c.email}</label>
                            <div className="icons">
                                <FiEdit2 className="client-btn edit" onClick={() => editingClient(c)} />
                                <FiTrash className="client-btn delete" onClick={() => deleteItem(c.id)} />
                            </div>
                        </div>
                    )
                })}
            </div>
            {showModal && (
                <DeleteModal close={deleteItem} id={unitId} bd={"clients"} />
            )}
        </div>
    )
}

