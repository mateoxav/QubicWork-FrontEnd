import { useNavigate } from 'react-router-dom';
import ButtonTwo from './ButtonTwo';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleDemoLogin = (userNumber) => {
    const demoUsers = [
      { id: 1, username: 'Adrián', email: 'adrian@qubicwork.com' },
      { id: 2, username: 'David', email: 'david@qubicwork.com' },
      { id: 3, username: 'María', email: 'maria@qubicwork.com' }
    ];
    
    login(demoUsers[userNumber - 1]);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Bienvenido de nuevo
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <ButtonTwo 
            className="w-full py-3" 
            onClick={() => handleDemoLogin(1)} // Usuario demo por defecto
          >
            Iniciar sesión
          </ButtonTwo>

          <div className="text-center">
            <button className="text-sm text-indigo-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm text-gray-600 text-center mb-3">Demo Users</h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleDemoLogin(1)}
                className="text-sm p-2 bg-indigo-50 rounded hover:bg-indigo-100"
              >
                Adrián (1)
              </button>
              <button 
                onClick={() => handleDemoLogin(2)}
                className="text-sm p-2 bg-indigo-50 rounded hover:bg-indigo-100"
              >
                David (2)
              </button>
              <button 
                onClick={() => handleDemoLogin(3)}
                className="text-sm p-2 bg-indigo-50 rounded hover:bg-indigo-100"
              >
                María (3)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

