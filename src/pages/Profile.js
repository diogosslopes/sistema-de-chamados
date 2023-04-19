import { FiSettings, FiUpload } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import avatar from '../images/avatar.png'
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import ImageCropTool from "../components/ImageCropTool";



export default function Profile() {

    const { user, storage, setUser } = useContext(AuthContext)
    const [name, setName] = useState(user && user.name)
    const [editingName, setEditingName] = useState(user && user.name)
    const [email, setEmail] = useState(user && user.email)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatar)
    const [newAvatar, setNewAvatar] = useState(null)

    const validation = yup.object().shape({
        name: yup.string().required("Nome é obrigatorio")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validation)
    })

    const editLogin = data => {

        handleLogin(data)
    }


    function preview(e) {

        const image = e.target.files[0]

        setNewAvatar(image)
        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setNewAvatar(image)
            setAvatarUrl(URL.createObjectURL(image))
        } else {
            toast.warning("Envie uma imagem do tipo PNG ou JPEG")
            setNewAvatar(null)
            return null
        }
    }

    async function handleLogin() {

        if (newAvatar === null && name !== '') {
            await firebase.firestore().collection('users')
            .doc(user.id)
            .update({
                name: name
            })
            .then(() => {
                let userData = {
                    ...user,
                    name: name
                }
                    toast.success("Edição realizada com sucesso")
                    setUser(userData)
                    storage(userData)
                })
                
            } else if (name !== '' && newAvatar !== null) {
                upload()
            }
            
            
            async function upload() {
                
                
                await firebase.storage().ref(`images/${user.id}/${newAvatar.name}`)
                .put(newAvatar)
                .then(async () => {
                    toast.success("Foto enviada com sucesso")

                    await firebase.storage().ref(`images/${user.id}`)
                        .child(newAvatar.name).getDownloadURL()
                        .then(async (url) => {

                            await firebase.firestore().collection('users')
                                .doc(user.id)
                                .update({
                                    avatar: url,
                                    name: name
                                })
                                .then(() => {
                                    let userData = {
                                        ...user,
                                        avatar: url,
                                        name: name
                                    }

                                    setUser(userData)
                                    storage(userData)
                                })
                        })
                })
        }


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
                <form className="form-profile" onSubmit={handleSubmit(editLogin)}>
                    <ImageCropTool onChange={preview} />
                    <label className="avatar-label">
                        {/* <input type='file' accept='image/*' onChange={preview} /> */}

                        {avatarUrl == null ?
                            <div>
                                <FiUpload color="#FFF" size={25} />
                                <input type='file' accept='image/*' onChange={preview} />
                                {/* <img src={avatar} alt="Foto do usuario" /> */}
                                {/* <ImageCropTool /> */}
                            </div>
                            :
                            <div>
                                <img src={avatarUrl} alt="Foto do usuario" />
                            </div> 
                        }
                    </label>
                    <label>Nome</label>
                    <input id="inputname" type='text' name="name" {...register("name")} value={name} onChange={(e) => setName(e.target.value)} />
                    <p className="error-message" >{errors.name?.message}</p>
                    <label>E-mail</label>
                    <input disabled={true} type='text' value={email} />

                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    )
}