import { useState, createContext, useEffect } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom'
import Axios from 'axios';

export const AuthContext = createContext({})

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useHistory()


    const [tasks, setTasks] = useState([])
    let list = []
    const [task, setTask] = useState('')
    const [type, setType] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [lastTask, setLastTask] = useState()
    const [loadingMore, setLoadingMore] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)


    const [newTask, setNewTask] = useState({})
    const [client, setClient] = useState('')
    const [clients, setClients] = useState([])
    const [priority, setPriority] = useState()
    const [subject, setSubject] = useState()
    const [taskType, setTaskType] = useState(['TI', 'Estrutura'])
    const [selectedType, setSelectedType] = useState('')
    const [status, setStatus] = useState('Criado')
    const [created, setCreated] = useState()
    const [obs, setObs] = useState()
    const [prioritys, setPrioritys] = useState(['Baixa', 'Média', 'Alta'])
    const [subjectsTi, setSubjectsTi] = useState(['Impressora', 'Sistema', 'Internet'])
    const [subjectsGeneral, setSubjectsGeneral] = useState(['Eletrica', 'Pintura', 'Ar Condicionado', 'Hidraulico', 'Portas', 'Outros'])
    const [subjects, setSubjects] = useState([])
    const [stats, setStats] = useState(['Criado', 'Aberto', 'Em andamento', 'Enviado p/ tec', 'Aguardando liberação', 'Fechado'])
    const [disable, setDisable] = useState(true)
    const [images, setImages] = useState([])
    let filterDocs = ""

    useEffect(() => {


        function userLoged() {
            const activeUser = localStorage.getItem('activeUser')

            if (activeUser) {
                setUser(JSON.parse(activeUser))
                setClient(user)
                setLoading(false)
                setLoggedIn(true)
            }


            setLoading(false)
        }
        userLoged()
    }, [])


    // const baseURL = "https://server-three-navy.vercel.app"
    const baseURL = "http://localhost:3001"
 

    async function registerUser(value) {

        const numbers = {
            n1: Math.floor(Math.random()*10),
            n2: Math.floor(Math.random()*10),
            n3: Math.floor(Math.random()*10),
            n4: Math.floor(Math.random()*10),
        }
        const emailToken = `${numbers.n1}${numbers.n2}${numbers.n3}${numbers.n4}` 


        setLoadingAuth(true)
        console.log(loggedIn)
        console.log(value.name)
        // const emailToken = Math.random(1)
        Axios.post(`${baseURL}/registeruser`, {
            email: value.login,
            password: value.password,
            name: value.name,
            adress: value.adress,
            emailToken: emailToken
        }).then((response) => {
            if (response.data.msg === 'cadastrado') {
                toast.error("Email já cadastrado!!!")
                setLoadingAuth(false)
                return
            }
            let userData = {
                name: value.name,
                email: value.login,
                avatar: null,
                group: null
            }
            toast.success("Cadastrado com sucesso!")
            // storage(userData)
            // setUser(userData)
            setLoadingAuth(false)
            setLoggedIn(true)
        }).catch((error) => {
            setLoggedIn(false)
            console.log(error)
            setLoadingAuth(true)
        })


    }

    async function logIn(value) {
        setLoadingAuth(true)
        
        Axios.post(`${baseURL}/login`, {
            email: value.login,
            password: value.password
        }).then((response) => {
            
            if (response.data.msg === "inexistente") {
                toast.error("Usuario não cadastrado!")
                setLoadingAuth(false)
            } else if(response.data) {
                Axios.post(`${baseURL}/getUser`, {
                    email: value.login,
                    password: value.password
                }).then((response)=>{
                    console.log(response.data)
                    if(response.data[0].isVerified === '0'){
                        toast.warn("Email não verificado")
                    }else if (response.data[0].isVerified === '1'){
                        
                        let userData = {
                            id: response.data[0].clientId,
                            name: response.data[0].name,
                            email: value.login,
                            avatar: response.data[0].avatar,
                            group: response.data[0].group,
                            
                        }
                        console.log(response)
                        storage(userData)
                        setUser(userData)
                    }
                })                
                
                setLoadingAuth(false)
                setLoggedIn(true)
                
            } else{
                setLoadingAuth(false)
                toast.error("Usuario ou senha incorretos!")
            }

        })



    }

    function storage(userData) {
        localStorage.setItem('activeUser', JSON.stringify(userData))
    }

    async function signOut() {
        // await firebase.auth().signOut()
        localStorage.removeItem('activeUser')
        setUser(null)
    }


    async function loadClients() {
        await firebase.firestore().collection('clients').get()
            .then((snapshot) => {
                let list = []

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        client: doc.data().name
                    })
                })
                setClients(list)

            })
            .catch((error) => {
                console.log(error)
            })

    }


    return (
        <AuthContext.Provider value={{
            signed: !!user, user, baseURL, loading, registerUser, signOut, logIn, loadingAuth, storage, loggedIn
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider