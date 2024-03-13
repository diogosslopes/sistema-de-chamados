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


 

    async function registerUser(value) {
        setLoadingAuth(true)
        console.log(loggedIn)

        Axios.post("http://localhost:3001/registeruser", {
            email: value.login,
            password: value.password,
            name: value.name
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
            storage(userData)
            setUser(userData)
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
        
        Axios.post("http://localhost:3001/login", {
            email: value.login,
            password: value.password
        }).then((response) => {
            
            if (response.data.msg === "inexistente") {
                toast.error("Usuario não cadastrado!")
                setLoadingAuth(false)
            } else if(response.data) {
                console.log(response.data)
                Axios.post("http://localhost:3001/getUser", {
                    email: value.login,
                    password: value.password
                }).then((response)=>{
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
                })                
                
                setLoadingAuth(false)
                setLoggedIn(true)
                
            } else{
                setLoadingAuth(false)
                toast.error("Usuario ou senha incorretos!")
            }

        })



        // await firebase.auth().signInWithEmailAndPassword(value.login, value.password)
        //     .then(async (data) => {
        //         let uid = data.user.uid

        //         const userProfile = await firebase.firestore().collection('users').doc(uid).get()

        //         let userData = {
        //             id: uid,
        //             name: userProfile.data().name,
        //             email: value.login,
        //             avatar: userProfile.data().avatar,
        //             group: userProfile.data().group,
        //         }
        //         setUser(userData)
        //         storage(userData)
        //         setClient(user)
        //         setLoadingAuth(false)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         alert("Erro")
        //         setLoadingAuth(false)
        //     })

    }

    function storage(userData) {
        localStorage.setItem('activeUser', JSON.stringify(userData))
    }

    async function signOut() {
        await firebase.auth().signOut()
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


    // async function getDocs(bd) {
    //     setTasks('')

    //     if (user.group === "admin") {
    //         const docs = await firebase.firestore().collection(bd).orderBy('created', 'desc').limit('2').get()
    //         await loadTasks(docs)
    //     } else {
    //         const docs = await firebase.firestore().collection(bd).orderBy('created', 'desc').where("client", "==", user.name).limit('2').get()
    //         await loadTasks(docs)

    //     }
    // }

    // async function loadTasks(docs) {

    //     const isTaksEmpty = docs.size === 0


    //     if (!isTaksEmpty) {
    //         docs.forEach((doc) => {
    //             console.log(doc.data())
    //             list.push({
    //                 id: doc.id,
    //                 client: doc.data().client,
    //                 created: doc.data().created,
    //                 obs: doc.data().obs,
    //                 priority: doc.data().priority,
    //                 status: doc.data().status,
    //                 type: doc.data().type,
    //                 subject: doc.data().subject,
    //                 userId: doc.data().userId,
    //                 taskImages: doc.data().taskImages
    //             })
    //         })

    //         // console.log(list)

    //         const lastDoc = docs.docs[docs.docs.length - 1]
    //         setLastTask(lastDoc)
    //         setTasks(tasks => [...tasks, ...list])
    //         setLoading(false)

    //     } else {
    //         setIsEmpty(true)
    //         setLoading(false)

    //     }
    //     setLoadingMore(false)
    // }

    // async function filter(e) {
    //     e.preventDefault()
    //     setLoading(true)
    //     setTasks('')
    //     setSelectedType(e.target.value)

    //     if (isAdmin) {
    //       filterDocs = await firebase.firestore().collection('completedtasks').orderBy('created', 'desc').where("type", "==", e.target.value).limit('20').get()
    //     } else {
    //       filterDocs = await firebase.firestore().collection('completedtasks').orderBy('created', 'desc').where("client", "==", user.name)
    //       .where("type", "==", e.target.value).limit('20').get()
    //     }

    //     setIsEmpty(false)
    //     setLoadingMore(false)
    //     loadTasks(filterDocs, e)
    //     console.log(filterDocs.docs)
    //     setIsFiltered(true)

    //   }



    return (
        <AuthContext.Provider value={{
            signed: !!user, user, loading, registerUser, signOut, logIn, loadingAuth, storage, loggedIn
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider