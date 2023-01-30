import { FiSettings, FiUsers } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import firebase from '../services/firebaseConnection';


export default function Clients() {

    const [name, setName] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [adress, setAdress] = useState('')
    const [email, setEmail] = useState('')

    const elementForm = document.querySelector('.form-client')
    let list = []
    const elementButton = document.querySelector('.new')

    useEffect(()=>{
        async function loadClients(){
            

           const clients =  await firebase.firestore().collection('clients').get()
            
           clients.forEach((doc)=>{
            list.push({
                name: doc.data().name,
                cnpj: doc.data().cnpj,
                adress: doc.data().adress,
                email: doc.data().email
            })
            return(list)
           })
           console.log(list)
        }
        loadClients()
    },[])
    
    
    function showForm(){
        if(elementForm.classList.contains('hide')){
            elementButton.classList.add('hide')
            elementForm.classList.remove('hide')
        }else{
            elementForm.classList.add('hide')
            elementButton.classList.remove('hide')
            setAdress('')
            setCnpj('')
            setEmail('')
            setName('')
        }
    }

    async function newClient(e){
        e.preventDefault()
        
        
        await firebase.firestore().collection('clients').add({
            name: name,
            cnpj: cnpj,
            adress: adress,
            email: email
        })
        .then(()=>{
            alert('salvou')
            
        })
        .catch((error)=>{
            alert(error)
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
                <form className="form-profile form-client hide" onSubmit={newClient}>

                    <label>Nome</label>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                    <label>CNPJ</label>
                    <input type='text' value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                    <label>Endereço</label>
                    <input type='text' value={adress} onChange={(e) => setAdress(e.target.value)} />
                    <label>E-mail</label>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

                    <div className="buttons">
                        <button type="submit">Salvar</button>
                        <button type="button"  onClick={showForm}>Cancelar</button>
                    </div>
                </form>
                {console.log(list)}
                <div className="clients-list">
                    <label>Nome: </label>
                    <label>CNPJ: </label>
                    <label>Endereço: </label>
                    <label>E-mail: </label>
                </div>
            </div>
        </div>
    )
}

