import '../index.css'
import { FiHome, FiUser, FiSettings, FiUsers, FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../context/auth'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../images/avatar.png'


export default function Sidebar() {

    const { user, signOut } = useContext(AuthContext)



    return (
        <div className='sidebar'>
            <div className='avatar'>
                <img src={user.avatar === null ? avatar : user.avatar} />
            </div>

            <div className="links">
                <Link to='/dashboard'>
                    <FiHome />
                    Chamados
                </Link>
                <Link to='/completedtasks'>
                    <FiHome />
                    Chamados Concluidos
                </Link>
                {user.group === "admin" ? 
                <Link to='/clients'>
                    <FiUsers />
                    Unidades
                </Link> : <></>
                }
                <Link to='/profile'>
                    <FiSettings />
                    Configurações
                </Link>
                <a href="" onClick={signOut}><FiLogOut />Sair</a>
            </div>
        </div>
    )
}