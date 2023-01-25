import { useState, createContext, useEffect } from 'react'
import firebase from '../services/firebaseConnection'

export const AuthContext = createContext({})

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

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
                        avatar: null
                    })
                        .then(() => {
                            let userData = {
                                id: uid,
                                name: value.name,
                                email: value.login,
                                avatar: null
                            }

                            setUser(userData)
                            storage(userData)
                            setLoadingAuth(false)
                        })

                }).catch((error)=>{
                    console.log(error)
                    setLoadingAuth(true)
                })
        

    }

    async function logIn(value){
        setLoadingAuth(true)
        console.log(value.login)
        await firebase.auth().signInWithEmailAndPassword(value.login, value.password)
        .then(async(data)=>{
            let uid = data.user.uid

            const userProfile = await firebase.firestore().collection('users').doc(uid).get()

            let userData = {
                id: uid,
                name: userProfile.data().name,
                email: value.login,
                avatar: userProfile.data().avatar
            }
            setUser(userData)
            storage(userData)   
            setLoadingAuth(false)
            console.log(userData)
        })
        .catch((error)=>{
            console.log(error)
            setLoadingAuth(false)
        })

    }

    function storage(userData){
        localStorage.setItem('activeUser', JSON.stringify(userData))
    }

    async function signOut(){
        await firebase.auth().signOut()
        localStorage.removeItem('activeUser')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, registerUser, signOut, logIn, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider