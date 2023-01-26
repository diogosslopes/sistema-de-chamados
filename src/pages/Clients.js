import { FiSettings, FiUsers } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";


export default function Clients() {
    return (
        <div className="rigth-container">
            <Sidebar />
            <div className="title">
                <Title name="Clientes">
                    <FiUsers size={22} />
                </Title>
            </div>
        </div>
    )
}