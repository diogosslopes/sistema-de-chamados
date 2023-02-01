import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom'
import '../index.css'

export default function Modal({ tipo, close, item }) {

  const [tasks, setTasks] = useState(item)
  let disable = false

  if (tipo === 'edit') {
    disable = false
  } else if (tipo === 'new') {
    disable = false
  } else {
    disable = true
  }

  return (
    <div className="modal">
        <div className="modal-new">
          <h1>Cadastro de Chamado</h1>
          <form className="form-modal">
            <div>
              <label>Cliente</label>
              <input value={tasks} onChange={(e) => setTasks(e.target.value)} disabled={disable} placeholder="Cliente" />
            </div>
            <div>
              <label>Assunto</label>
              <input value={tasks} onChange={(e) => setTasks(e.target.value)} disabled={disable} placeholder="Assunto" />
            </div>
            <div>
              <label>Status</label>
              <input value={tasks} onChange={(e) => setTasks(e.target.value)} disabled={disable} placeholder="Status" />
            </div>
            <div>
              <label>Criando em</label>
              <input value={tasks} onChange={(e) => setTasks(e.target.value)} disabled={disable} placeholder="Criado em" />
            </div>
            <div>
              <label>Observações</label>
              <textarea value={tasks} onChange={(e) => setTasks(e.target.value)} disabled={disable} placeholder="Observações" />
            </div>
          </form>
          <div className="buttons">
            <button>Salvar</button>
            <button onClick={close}>Cancelar</button>
          </div>
        </div>


    </div>
  )
}