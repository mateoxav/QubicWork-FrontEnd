import { Link } from 'react-router-dom';
import ButtonTwo from './ButtonTwo';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          QubicWork
        </Link>
        <ConnectLink />
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-gray-800 font-medium">
            <Link to="/marketplace" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
            {user && (
              <Link to="/post-task" className="hover:text-indigo-600 transition-colors">Publicar Tarea</Link>
            )}
            <Link to="/profile" className="hover:text-indigo-600 transition-colors">Perfil</Link>
          </div>
          
          <div className="flex gap-3 ml-2">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Hola, {user.username}</span>
                <ButtonTwo 
                  onClick={logout}
                  className="px-4 py-2 text-sm"
                >
                  Cerrar sesión
                </ButtonTwo>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <ButtonTwo className="px-2 py-2 text-sm">
                    Iniciar Sesión
                  </ButtonTwo>
                </Link>
                <Link to="/register">
                  <ButtonTwo className="px-2 py-2 text-sm">
                    Registrarse
                  </ButtonTwo>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;