import React, { useState } from "react";
import ButtonTwo from "../components/ButtonTwo";
import SearchInput from "../components/SearchInput";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper.js";

// Configuration
const TEST_WALLET = {
  sourceSeed: 'kewgvatawujuzikurbhwkrisjiubfxgfqkrvcqvfvgfgajphbvhlaos'
};

//To implement, smart contract execution with identity generation
// Utility functions
async function getCurrentTick() {
  const response = await fetch('https://testnet-rpc.qubic.org/v1/status');
  const data = await response.json();
  return data.lastProcessedTick.tickNumber;
}

async function broadcastTransaction(transaction) {
  const encodedTransaction = transaction.encodeTransactionToBase64(transaction.getPackageData());
  const response = await fetch('https://testnet-rpc.qubic.org/v1/broadcast-transaction', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ encodedTransaction })
  });
  return await response.json();
}

async function generateIdentity(seed) {
  const helper = new QubicHelper();
  const identity = await helper.createIdPackage(seed);
  return identity.publicId;
}

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
  const [transactionStatus, setTransactionStatus] = useState({});

  const handleContractExecution = async (service) => {
    try {
      setProcessingServices(prev => [...prev, service.id]);
      
      const publicId = await generateIdentity(TEST_WALLET.sourceSeed);
      console.log("Generated Identity:", publicId);
      
      setTransactionStatus(prev => ({
        ...prev,
        [service.id]: {
          success: true,
          message: `Identity generated: ${publicId}`
        }
      }));

    } catch (error) {
      console.error("Error:", error);
      setTransactionStatus(prev => ({
        ...prev,
        [service.id]: {
          success: false,
          message: `Error: ${error.message}`
        }
      }));
    } finally {
      setProcessingServices(prev => 
        prev.filter(id => id !== service.id)
      );
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
                  className={`text-sm px-4 py-2 whitespace-nowrap ${
                    processingServices.includes(service.id) 
                      ? 'opacity-75 cursor-not-allowed' 
                      : transactionStatus[service.id]?.success 
                        ? 'bg-green-100 text-green-700' 
                        : ''
                  }`}
                  onClick={() => handleContractExecution(service)}
                  disabled={processingServices.includes(service.id)}
                >
                  {processingServices.includes(service.id) ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Procesando...
                    </span>
                  ) : transactionStatus[service.id]?.success ? (
                    "Contratado"
                  ) : (
                    "Contratar"
                  )}
                </ButtonTwo>

                {transactionStatus[service.id]?.message && (
                  <div className={`text-xs mt-2 ${
                    transactionStatus[service.id]?.success 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transactionStatus[service.id].message}
                  </div>
                )}
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
    </div>
  );
}