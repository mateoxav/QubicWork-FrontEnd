import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ButtonTwo from './ButtonTwo';
import { useAuth } from '../contexts/AuthContext';

export default function RegistrationForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'freelancer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      ...formData
    };
    login(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Únete a QubicWork
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiero registrarme como:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-4 rounded-lg border ${
                  formData.userType === 'freelancer' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setFormData({...formData, userType: 'freelancer'})}
              >
                🛠️ Freelancer
              </button>
              <button
                type="button"
                className={`p-4 rounded-lg border ${
                  formData.userType === 'client' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setFormData({...formData, userType: 'client'})}
              >
                💼 Cliente
              </button>
            </div>
          </div>

          <ButtonTwo type="submit" className="w-full py-3">
            Crear cuenta
          </ButtonTwo>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}