import { FiCheckSquare } from 'react-icons/fi'
import index from '../index.css'


export default function Title({ children, name, task, id }) {



    return (

        <>
            {name === `Chamado numero ${id}` && task.status === 'Fechado' ?
                <div className='title-container'>
                    <div className='title evalution-hover'>
                        {children}
                        <h1> {name} </h1>
                        <FiCheckSquare className='evalution-hover'  size={28} />
                        <div className='evaluation'>
                            <span>Nota: {task.grade}</span>
                            <span>Comentário: {task.comment}</span>
                        </div>
                    </div>
                </div>
                :
                <div className='title-container'>
                    <div className='title'>
                        {children}
                        <h1> {name} </h1>
                    </div>
                </div>
            }
        </>

    )
}