// Profile.jsx
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ButtonTwo from '../components/ButtonTwo';

// Datos de ejemplo extendidos
const initialUsers = [
  {
    id: 1,
    username: 'Adrián',
    email: 'adrian@qubicwork.com',
    role: 'freelancer',
    skills: ['Solidity', 'React', 'Node.js'],
    completedProjects: 42,
    hiredJobs: 15,
    reputation: 4.9,
    bio: 'Desarrollador Full-Stack Web3 con 5 años de experiencia construyendo dApps escalables',
    joinDate: '2022-01-15',
    activeProjects: 3,
    recentActivity: [
      'Completó proyecto "Wallet Integración"',
      'Nueva oferta en "Smart Contract NFT"',
      'Reseña recibida: ★★★★★'
    ]
  },
  {
    id: 2,
    username: 'David',
    email: 'david@qubicwork.com',
    role: 'client',
    company: 'CryptoStartups',
    completedProjects: 28,
    hiredJobs: 19,
    reputation: 4.7,
    bio: 'CEO de CryptoStartups - Especializados en lanzamiento de proyectos blockchain',
    joinDate: '2022-03-10',
    activeProjects: 2,
    recentActivity: [
      'Publicó nuevo proyecto "Exchange Descentralizado"',
      'Contrató a 3 desarrolladores',
      'Actualizó requerimientos de proyecto'
    ]
  },
  {
    id: 3,
    username: 'María',
    email: 'maria@qubicwork.com',
    role: 'freelancer',
    skills: ['UI/UX', 'Figma', 'Webflow'],
    completedProjects: 35,
    hiredJobs: 8,
    reputation: 4.8,
    bio: 'Diseñadora UX/UI especializada en productos Web3 y fintech',
    joinDate: '2022-02-20',
    activeProjects: 4,
    recentActivity: [
      'Diseñó sistema de componentes para DAO',
      'Recibió badge "Top Designer"',
      'Actualizó portafolio'
    ]
  }
];

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const profileUser = initialUsers.find(u => u.id === Number(userId)) || currentUser;

  if (!profileUser) return <div>Perfil no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header del perfil */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold">
              {profileUser.username[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileUser.username}</h1>
              <p className="text-gray-600">{profileUser.bio}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {profileUser.role === 'freelancer' ? '🚀 Freelancer' : '💼 Cliente'}
                </span>
                <span className="text-gray-500 text-sm">
                  Miembro desde 23 de Enero, 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-indigo-600">{profileUser.completedProjects}</div>
            <div className="text-gray-600 text-sm">Trabajos Realizados</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-indigo-600">{profileUser.reputation}/5</div>
            <div className="text-gray-600 text-sm">Reputación</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-indigo-600">{profileUser.hiredJobs}</div>
            <div className="text-gray-600 text-sm">Clientes Satisfechos</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-indigo-600">{profileUser.activeProjects}</div>
            <div className="text-gray-600 text-sm">Proyectos Activos</div>
          </div>
        </div>

        {/* Sección principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Habilidades */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🛠 Habilidades Técnicas</h2>
              <div className="flex flex-wrap gap-2">
                {profileUser.skills?.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Actividad reciente */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">📅 Actividad Reciente</h2>
              <div className="space-y-4">
                {profileUser.recentActivity?.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-2 w-2 bg-indigo-500 rounded-full mr-3" />
                    <span className="text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        {currentUser?.id === profileUser.id && (
          <div className="mt-6 flex justify-end gap-4">
            <ButtonTwo className="px-6 py-2">
              Editar Perfil
            </ButtonTwo>
            <ButtonTwo variant="outline" className="px-6 py-2">
              Compartir Perfil
            </ButtonTwo>
          </div>
        )}
      </div>
    </div>
  );
}