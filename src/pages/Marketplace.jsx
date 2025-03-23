import React, { useState, useEffect } from "react";
import ButtonTwo from "../components/ButtonTwo";
import SearchInput from "../components/SearchInput";
import { useMarketplace } from "../contexts/MarketplaceContext";
import { useQubicConnect } from "../contexts/QubicConnectContext";
import { toast } from "react-toastify"; // Asumiendo que tienes react-toastify instalado
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const services = [
  {
    id: "web3-landing",
    title: "Desarrollo de landing page Web3 en Next.js",
    author: "Luis Morales",
    authorRating: 4.8,
    priceInUsdc: 180,
    deliveryDays: 4,
    category: "frontend",
    tags: ["web3", "nextjs", "seo"],
    description: "Landing moderna, SEO optimizada y conectada a wallet si es necesario. Ideal para tokens o proyectos NFT.",
    completedProjects: 42,
    lastDelivery: "2 horas ago",
    authorVerified: true,
    trending: true,
  },
  {
    id: "erc20-smartcontract",
    title: "Smart Contract ERC-20 listo para producción",
    author: "Camila Ríos",
    authorRating: 4.7,
    priceInUsdc: 250,
    deliveryDays: 3,
    category: "smart-contracts",
    tags: ["solidity", "erc20", "hardhat"],
    description: "Contrato con lógica de emisión, quema y pausado. Incluye test básico en Hardhat.",
    completedProjects: 37,
    lastDelivery: "5 horas ago",
    authorVerified: true,
    trending: false,
  },
  {
    id: "uiux-dashboard",
    title: "Diseño UI/UX de dashboard cripto",
    author: "Iván Ortega",
    authorRating: 4.9,
    priceInUsdc: 200,
    deliveryDays: 5,
    category: "frontend",
    tags: ["figma", "uiux", "dashboard"],
    description: "Diseño en Figma, componentes reutilizables y enfoque en usabilidad. Estilo clean y pro.",
    completedProjects: 52,
    lastDelivery: "1 día ago",
    authorVerified: true,
    trending: true,
  },
  {
    id: "ci-cd-config",
    title: "Configuración CI/CD con GitHub Actions y Docker",
    author: "Ana Delgado",
    authorRating: 4.6,
    priceInUsdc: 150,
    deliveryDays: 3,
    category: "devops",
    tags: ["ci", "docker", "github-actions"],
    description: "Automatiza tu deploy con workflows eficientes y documentación clara.",
    completedProjects: 28,
    lastDelivery: "12 horas ago",
    authorVerified: false,
    trending: false,
  },
  {
    id: "flutter-app",
    title: "Desarrollo de app móvil con Flutter (iOS + Android)",
    author: "Martín Paredes",
    authorRating: 4.5,
    priceInUsdc: 400,
    deliveryDays: 7,
    category: "mobile",
    tags: ["flutter", "mobile", "mvp"],
    description: "App completa con login, navegación y conexión a backend. Ideal para MVPs.",
    completedProjects: 61,
    lastDelivery: "3 días ago",
    authorVerified: true,
    trending: true,
  },
  {
    id: "rest-api-auth",
    title: "API RESTful con autenticación y documentación Swagger",
    author: "Sofía Navarro",
    authorRating: 4.7,
    priceInUsdc: 160,
    deliveryDays: 4,
    category: "devops",
    tags: ["nodejs", "swagger", "jwt"],
    description: "Backend en Node.js + Express. Autenticación JWT y documentación profesional.",
    completedProjects: 31,
    lastDelivery: "6 horas ago",
    authorVerified: true,
    trending: false,
  },
  {
    id: "staking-contract",
    title: "Implementación de staking en Solidity",
    author: "Andrés Villalba",
    authorRating: 4.8,
    priceInUsdc: 300,
    deliveryDays: 5,
    category: "smart-contracts",
    tags: ["solidity", "staking", "defi"],
    description: "Smart contract funcional y probado. Ideal para dApps DeFi.",
    completedProjects: 44,
    lastDelivery: "1 día ago",
    authorVerified: true,
    trending: true,
  },
  {
    id: "figma-kit",
    title: "Diseño de sistema de componentes en Figma",
    author: "Daniela Herrera",
    authorRating: 4.6,
    priceInUsdc: 130,
    deliveryDays: 2,
    category: "frontend",
    tags: ["figma", "design-system", "ui-kit"],
    description: "Kit UI listo para desarrollo. Botones, inputs, modales y más.",
    completedProjects: 35,
    lastDelivery: "8 horas ago",
    authorVerified: false,
    trending: false,
  },
  {
    id: "audit-contract",
    title: "Auditoría básica de contrato inteligente (Solidity)",
    author: "Esteban Quiroga",
    authorRating: 4.9,
    priceInUsdc: 220,
    deliveryDays: 3,
    category: "smart-contracts",
    tags: ["audit", "security", "solidity"],
    description: "Análisis de funciones críticas, vulnerabilidades comunes y reporte PDF.",
    completedProjects: 58,
    lastDelivery: "10 horas ago",
    authorVerified: true,
    trending: false,
  },
  {
    id: "web3-login",
    title: "Implementación de autenticación con Web3 Wallet (Metamask)",
    author: "Nicolás Vargas",
    authorRating: 4.5,
    priceInUsdc: 100,
    deliveryDays: 2,
    category: "frontend",
    tags: ["web3", "wallet", "auth"],
    description: "Login seguro vía Metamask. UX cuidada y lógica de sesión incluida.",
    completedProjects: 22,
    lastDelivery: "6 horas ago",
    authorVerified: false,
    trending: true,
  },
  {
    id: "aws-deploy",
    title: "Deploy en AWS con infraestructura como código (Terraform)",
    author: "Julieta Cárdenas",
    authorRating: 4.8,
    priceInUsdc: 280,
    deliveryDays: 6,
    category: "devops",
    tags: ["aws", "terraform", "iac"],
    description: "Setup de entornos, VPC, S3, RDS y más. Infra limpia y mantenible.",
    completedProjects: 39,
    lastDelivery: "2 días ago",
    authorVerified: true,
    trending: false,
  },
  {
    id: "cypress-e2e",
    title: "Pruebas E2E con Cypress para tu frontend",
    author: "Diego Meneses",
    authorRating: 4.7,
    priceInUsdc: 140,
    deliveryDays: 3,
    category: "frontend",
    tags: ["cypress", "testing", "e2e"],
    description: "Cobertura de rutas clave, interacciones de usuario y errores críticos.",
    completedProjects: 41,
    lastDelivery: "5 horas ago",
    authorVerified: true,
    trending: false,
  }
];

export default function Marketplace() {
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
    maxPrice: 1000,
    minRating: 0,
    deliveryTime: "any"
  });

  const [sortBy, setSortBy] = useState("trending");
  const [processingServices, setProcessingServices] = useState([]);
  const [successfulAgreements, setSuccessfulAgreements] = useState({});
  
  // Obtener funciones del contexto de Marketplace
  const { createAgreement, state: marketplaceState } = useMarketplace();
  // Obtener datos del usuario conectado
  const { wallet, connected } = useQubicConnect();

  // Identidad fija del vendedor para todos los servicios
  const SELLER_IDENTITY = "WEVWZOHASCHODGRVRFKZCGUDGHEDWCAZIZXWBUHZEAMNVHKZPOIZKUEHNQSJ";

  // Función para manejar el clic en "Contratar"
  const handleHire = async (serviceId) => {
    // Verificar si el usuario está conectado
    if (!connected || !wallet) {
      toast.error("Necesitas conectar tu cartera primero");
      return;
    }
    
    try {
      // Marcar el servicio como "en proceso"
      setProcessingServices(prev => [...prev, serviceId]);
      
      // Encontrar el servicio seleccionado
      const selectedService = services.find(s => s.id === serviceId);
      
      if (!selectedService) {
        throw new Error("Servicio no encontrado");
      }
      
      // Obtener datos del servicio
      const description = selectedService.title;
      const amount = selectedService.priceInUsdc;
      // Calcular el deadline basado en días de entrega (convertir a timestamp)
      const deadlineInDays = selectedService.deliveryDays;
      
      console.log(`Iniciando contrato para: ${description}`);
      console.log(`Monto: ${amount} USDC`);
      console.log(`Plazo de entrega: ${deadlineInDays} días`);
      
      // Crear el acuerdo en el contrato inteligente
      const result = await createAgreement(
        wallet.publicKey, // Buyer: cartera del usuario actual
        SELLER_IDENTITY, // Seller: identidad fija proporcionada
        amount,          // Amount: precio en USDC
        description,     // Description: título del servicio
        deadlineInDays   // Deadline: días para entrega
      );
      
      // Si se procesa correctamente
      if (result) {
        console.log("Contrato creado con éxito:", result);
        
        // Guardar información del acuerdo
        setSuccessfulAgreements(prev => ({
          ...prev,
          [serviceId]: {
            agreementId: result.txResult?.id || "unknown",
            targetTick: result.targetTick
          }
        }));
        
        toast.success("¡Servicio contratado con éxito!");
      }
      
    } catch (err) {
      console.error("Error al contratar servicio:", err);
      toast.error(err.message || "Error al contratar el servicio");
      
      // Quitar el servicio de "procesando" en caso de error
      setProcessingServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  const filteredServices = services
    .filter(service => 
      service.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
    .filter(service => 
      filters.category === "all" || service.category === filters.category
    )
    .filter(service => 
      service.priceInUsdc <= filters.maxPrice
    )
    .filter(service =>
      service.authorRating >= filters.minRating
    )
    .sort((a, b) => {
      switch(sortBy) {
        case "priceAsc": return a.priceInUsdc - b.priceInUsdc;
        case "priceDesc": return b.priceInUsdc - a.priceInUsdc;
        case "rating": return b.authorRating - a.authorRating;
        default: return b.trending - a.trending;
      }
    });

  const categories = [
    { id: "all", name: "Todos" },
    { id: "frontend", name: "Frontend Web3" },
    { id: "smart-contracts", name: "Smart Contracts" },
    { id: "devops", name: "DevOps & Cloud" },
    { id: "mobile", name: "Desarrollo Móvil" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Qubic Talent Marketplace
        </h1>
        <p className="text-gray-600 text-lg">Contrata expertos Web3 certificados</p>
      </div>

      {/* Filtros Superiores */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchInput
            placeholder="Buscar servicios..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full"
          />
          
          <select
            className="select select-bordered w-full"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Precio máximo: ${filters.maxPrice}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="range range-primary range-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Ordenar por:</label>
            <select
              className="select select-bordered w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="trending">Relevancia</option>
              <option value="rating">Mejor valorados</option>
              <option value="priceAsc">Precio: Menor a Mayor</option>
              <option value="priceDesc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="mb-6 flex justify-between items-center px-2">
        <span className="text-gray-600 text-sm">
          {filteredServices.length} resultados encontrados
        </span>
        <div className="flex gap-2">
          <button className="badge badge-outline">🔒 Pagos Seguros</button>
          <button className="badge badge-outline">⭐ Expertos Verificados</button>
        </div>
      </div>

      {/* Grid de Servicios Mejorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-all border border-gray-100"
          >
            {/* Badges de Estado */}
            <div className="relative mb-8">
              {service.trending && (
                <span className="absolute top-0 right-0 badge badge-accent badge-sm">
                  🔥 Trending
                </span>
              )}
              {service.authorVerified && (
                <span className="absolute top-0 left-0 badge badge-success badge-sm">
                  ✅ Verificado
                </span>
              )}
            </div>

            {/* Contenido Principal */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {service.description}
              </p>
              
              {/* Autor y Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="avatar placeholder">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <span className="font-medium">{service.author[0]}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">{service.author}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">
                      {service.authorRating} ({service.completedProjects})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer de la Card */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-lg font-bold text-indigo-600">
                    ${service.priceInUsdc}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span>⏳</span>
                    {service.deliveryDays} días
                  </p>
                </div>
                <ButtonTwo 
                  className={`text-sm px-4 py-2 whitespace-nowrap ${processingServices.includes(service.id) ? 'bg-indigo-800 opacity-75 cursor-not-allowed' : ''}`}
                  onClick={() => handleHire(service.id)}
                  disabled={processingServices.includes(service.id)}
                >
                  {processingServices.includes(service.id) ? "Procesando..." : "Contratar"}
                </ButtonTwo>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="badge badge-outline badge-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado Vacío */}
      {filteredServices.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron servicios</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}