import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-sm px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          QubicWork
        </Link>
        <nav className="flex gap-4 text-gray-800 font-medium">
          <Link to="/marketplace" className="hover:underline">Marketplace</Link>
          <Link to="/post-task" className="hover:underline">Publicar Tarea</Link>
          <Link to="/profile" className="hover:underline">Perfil</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;