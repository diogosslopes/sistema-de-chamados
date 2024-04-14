
import { BrowserRouter } from 'react-router-dom';
import Rotas from './routes';
import AuthProvider from './context/auth';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>
          <ToastContainer autoClose={3000} theme="dark" />
          <Rotas />
    </AuthProvider>
  );
}

export default App;
