import { FiSettings, FiUpload } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/auth";
import avatar from '../images/avatar.png'
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import ImageCropTool from "../components/ImageCropTool";

import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";

import { generateDownload } from "../components/cropImage";


import { createRoot } from 'react-dom/client';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

const getSrcFromFile = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
    });
};



export default function Profile() {
    
    const inputRef = useRef();
    

    const [fileList, setFileList] = useState([]);

    const onload = ({ fileList: newFileList }) => {
         setFileList(newFileList);
         console.log(fileList.length)



        
        // const image = fileList[0] 
        // const  imageType = fileList[0].type
        // setNewAvatar(image)
        // if (imageType === 'image/jpeg' || imageType === 'image/png') {
        //     setNewAvatar(image)
        //     setAvatarUrl(URL.createObjectURL(image))
        // } else {
        //     toast.warning("Envie uma imagem do tipo PNG ou JPEG")
        //     setNewAvatar(null)
        //     return null
        // }



    };
    const onPreview = async (file) => {
        const src = file.url || (await getSrcFromFile(file));
        const imgWindow = window.open(src);
        
        if (imgWindow) {
            console.log(fileList[0].type)
            const image = new Image();
            image.src = src;
            imgWindow.document.write(image.outerHTML);
            console.log("AQUI!!!!!!!!!!!!!")
        } else {
            window.location.href = src;
            console.log("AQUI 2!!!!!!!!!!!!!")
        }
    };




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


    // function preview(file) {

    //     console.log(file)
    //     const image = file
        
        

    //     setNewAvatar(image)
    //     if (image.type === 'image/jpeg' || image.type === 'image/png') {
    //         setNewAvatar(image)
    //         setAvatarUrl(URL.createObjectURL(image))
    //     } else {
    //         toast.warning("Envie uma imagem do tipo PNG ou JPEG")
    //         setNewAvatar(null)
    //         return null
    //     }
    // }

    async function handleLogin() {
        
        setNewAvatar(fileList[0])
        console.log(newAvatar.thumbUrl)
        
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
                                    avatar: newAvatar.thumbUrl,
                                    name: name
                                })
                                .then(() => {
                                    let userData = {
                                        ...user,
                                        avatar: newAvatar.thumbUrl,
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
                <ImgCrop className="crop" showGrid rotationSlider aspectSlider showReset>

                    <Upload listType="picture-card" onChange={onload} onPreview={onPreview}>
                        {fileList.length === 0 && <Button>Carregar</Button>}
                    </Upload>
                </ImgCrop>




                <form className="form-profile" onSubmit={handleSubmit(editLogin)}>

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