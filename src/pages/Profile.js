import { FiSettings, FiUpload } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import avatar from '../images/avatar.png'
import firebase from '../services/firebaseConnection';


export default function Profile() {

    const { user, storage, setUser } = useContext(AuthContext)
    const [name, setName] = useState(user && user.name)
    const [email, setEmail] = useState(user && user.email)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [newAvatar, setNewAvatar] = useState(null)


    function preview(e){

        const image = e.target.files[0]
        setNewAvatar(image)
        setAvatarUrl(URL.createObjectURL(image))

    }

    async function handleEdit(e){
        e.preventDefault()
        alert('Salvo')
        await firebase.firestore().collection('users')
        .doc(user.id)
        .update({
            name: name
        })
        .then(()=>{
            let userData ={
                ...user,
                name: name
            }
            setUser(userData)
            storage(userData)
        })


    }
    
    return (
        <div className="rigth-container">
            <Sidebar />
            <div className="title">
                <Title name="Perfil">
                    <FiSettings size={22} />
                </Title>
            </div>

            <div className="container-profile">
                <form className="form-profile" onSubmit={handleEdit}>
                    <label className="avatar-label">
                        <FiUpload color="#FFF" size={25}  />
                        <input type='file' accept='image/*' onChange={preview} />

                        {avatarUrl == null ?
                            <img src={avatar} alt="Foto do usuario"/>
                            :
                            <img src={avatarUrl} alt="Foto do usuario"/>
                        }
                    </label>
                    <label>Nome</label>
                    <input type='text' value={name} onChange={(e)=> setName(e.target.value)}/>
                    <label>E-mail</label>
                    <input disabled={true} type='text' value={email}/>

                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    )
}