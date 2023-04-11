import { FiSettings, FiUsers } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import firebase from '../services/firebaseConnection';

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/auth";




export default function Clients() {

    const validation = yup.object().shape({
        name: yup.string().required("Nome é obrigatório").min(6,"Nome deve conter mínimo 6 caracteres"),
        email: yup.string().required("Email é obrigatório").email("Digitie um e-mail válido")
    })

    const [name, setName] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [adress, setAdress] = useState('')
    const [email, setEmail] = useState('')
    const [clientList, setClientList] = useState([])

    const elementForm = document.querySelector('.form-client')
    let list = []
    const elementButton = document.querySelector('.new')

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validation)
    })

    const save = data => {
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
    }, [])


    function showForm() {
        if (elementForm.classList.contains('hide')) {
            elementButton.classList.add('hide')
            elementForm.classList.remove('hide')
        } else {
            elementForm.classList.add('hide')
            elementButton.classList.remove('hide')
            setAdress('')
            setCnpj('')
            setEmail('')
            setName('')
        }
    }

    async function newClient(e) {
        // e.preventDefault()
        await firebase.firestore().collection('clients').add({
            name: name,
            cnpj: cnpj,
            adress: adress,
            email: email
        })
            .then(() => {
                toast.success("Cliente cadastrado com sucesso !")
                showForm()
            })
            .catch((error) => {
                toast.error("Erro ao cadastrar cliente")
                console.log(error)
            })


    }


    return (
        <div className="rigth-container">
            <Sidebar />
            <div className="title">
                <Title name="Clientes">
                    <FiUsers size={22} />
                </Title>
            </div>
            <button onClick={showForm} className="new">Novo Cliente</button>
            <div className="container-profile ">
                <form className="form-profile form-client hide" onSubmit={handleSubmit(save)}>

                    <div>
                        <label>Nome</label>
                        <input type='text' name="name" {...register("name")} value={name} onChange={(e) => setName(e.target.value)} />
                        <label>Endereço</label>
                        <input type='text' name="adress" {...register("adress")} value={adress} onChange={(e) => setAdress(e.target.value)} />
                        <label>E-mail</label>
                        <input type='text' name="email" {...register("email")} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="buttons">
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={showForm}>Cancelar</button>
                    </div>
                    </div>

                    <article className="error-message">
                        <p>{errors.name?.message}</p>
                        <p>{errors.email?.message}</p>
                    </article>
                </form>
                {clientList.map((c) => {
                    return (
                        <div key={c.id} className="clients-list">
                            <label>Nome: {c.name}</label>
                            <label>Endereço: {c.adress} </label>
                            <label>E-mail: {c.email}</label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

