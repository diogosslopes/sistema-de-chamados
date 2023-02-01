import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom'
import '../index.css'

export default function Modal({tipo}) {

  console.log(tipo)

  const [tasks, setTasks] = useState([''])

  return (
    <div className="modal hide">
      <div className="modal-new">
        <h1>Cadastro de Chamado</h1>
        <form className="form-modal">
          <div>
            <label>Cliente</label>
            <input placeholder="Cliente" />
          </div>
          <div>
            <label>Assunto</label>
            <input placeholder="Assunto" />
          </div>
          <div>
            <label>Status</label>
            <input placeholder="Status" />
          </div>
          <div>
            <label>Criando em</label>
            <input placeholder="Criado em" />
          </div>
          <div>
            <label>Observações</label>
            <textarea placeholder="Observações" />
          </div>
        </form>
        <div className="buttons">
          <button>Salvar</button>
          <button>Cancelar</button>
        </div>
      </div>
    </div>
  )
}