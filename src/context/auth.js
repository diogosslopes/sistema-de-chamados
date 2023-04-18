import { useState, createContext, useEffect } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom'

export const AuthContext = createContext({})

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useHistory()

    useEffect(() => {

        function userLoged() {
            const activeUser = localStorage.getItem('activeUser')

            if (activeUser) {
                setUser(JSON.parse(activeUser))
                setLoading(false)
            }

            setLoading(false)
        }
        userLoged()
    }, [])

   


    async function registerUser(value) {
        setLoadingAuth(true)



        await firebase.auth().createUserWithEmailAndPassword(value.login, value.password)
            .then(async (data) => {
                let uid = data.user.uid
                await firebase.firestore().collection("users")
                    .doc(uid).set({
                        id: uid,
                        name: value.name,
                        email: data.user.email,
                        avatar: null,
                        group: null
                    })
                    .then(() => {
                        let userData = {
                            id: uid,
                            name: value.name,
                            email: value.login,
                            avatar: null,
                            group: null
                        }

                        // setUser(userData)
                        storage(userData)
                        setLoadingAuth(false)
                    })

            }).catch((error) => {
                console.log(error)
                setLoadingAuth(true)
            })


    }

    async function logIn(value) {
        setLoadingAuth(true)
        await firebase.auth().signInWithEmailAndPassword(value.login, value.password)
            .then(async (data) => {
                let uid = data.user.uid

                const userProfile = await firebase.firestore().collection('users').doc(uid).get()

                let userData = {
                    id: uid,
                    name: userProfile.data().name,
                    email: value.login,
                    avatar: userProfile.data().avatar,
                    group: userProfile.data().group,
                }
                setUser(userData)
                storage(userData)
                setLoadingAuth(false)
            })
            .catch((error) => {
                console.log(error)
                toast.error("Usuario ou senha invalido!")
                alert("Erro")
                setLoadingAuth(false)
            })

    }

    function storage(userData) {
        localStorage.setItem('activeUser', JSON.stringify(userData))
    }

    async function signOut() {
        await firebase.auth().signOut()
        localStorage.removeItem('activeUser')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, registerUser, signOut, logIn, loadingAuth, storage, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider