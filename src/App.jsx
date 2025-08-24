import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { PrimeReactProvider } from 'primereact/api';
import SessionTimeoutModal from './components/SessionTimeoutModal';

const App = () => {
  return (
    <>
      <PrimeReactProvider>
        <AuthProvider>
          <AppRoutes />
          <SessionTimeoutModal />
        </AuthProvider>
      </PrimeReactProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;