import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiMessageSquare } from "react-icons/fi";


export default function Dashboard(){

  

  return(
    <div className="rigth-container">
      <Sidebar/>
      <div className="title">
        <Title name="Chamados">
          <FiMessageSquare size={22} />
        </Title>
      </div>

      
    </div>
  )
}