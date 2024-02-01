
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import AuthProvider from './context/auth';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000} theme="dark" />
          <Routes />
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
