import '../index.css'
import { FiHome, FiUser, FiSettings,FiUsers } from 'react-icons/fi'
import { AuthContext } from '../context/auth'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../images/avatar.png'


export default function Sidebar() {

    const { user } = useContext(AuthContext)

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
                <Link to='/dashboard'>
                    <FiUsers />
                    Clientes
                </Link>
                <Link to='/dashboard'>
                    <FiSettings />
                    Configurações
                </Link>
            </div>
        </div>
    )
}