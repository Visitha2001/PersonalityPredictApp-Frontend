import { PersonalityForm } from './components/PersonalityForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer 
        position="bottom-right"
        toastClassName={() => "relative flex p-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-gray-800 text-white"}
        bodyClassName={() => "text-sm font-white font-med block p-3"}
      />
      <PersonalityForm />
    </>
  );
}

export default App;