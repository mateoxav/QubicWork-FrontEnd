import React, { useState, useMemo } from "react";
import ButtonTwo from "../components/ButtonTwo";
import SearchInput from "../components/SearchInput";
import { QubicTransaction } from "@qubic-lib/qubic-ts-library";


// Wallet de prueba
const TEST_WALLET = {
  sourceId: 'CZCHJOVMPLVYZCJJXWCYZNOLUQLBZCVUDHGKIDAPQEJYBMCTYETVOLADTWJI',
  sourceSeed: 'zwoggmzfbdhuxrikdhqrmcxaqmpmdblgsdjzlesfnyogxquwzutracm',
  destinationId: 'RPBXQFCVTFECGBVJKZTDLIECARDCWKHIJTEKUHARCABHXDSMABEFNGGHILJB'
};

// Obtener tick actual
async function getCurrentTick() {
  const response = await fetch('https://testnet-rpc.qubic.org/v1/status');
  const data = await response.json();
  return data.lastProcessedTick.tickNumber;
}

// Enviar transacción
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

// Lista de servicios
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

const ServiceMarketplace = () => {
  const [sortBy, setSortBy] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingServices, setProcessingServices] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState({});

  // Filtrar y ordenar servicios
  const filteredServices = useMemo(() => {
    let filtered = services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "trending") {
      filtered = filtered.sort((a, b) => b.trending - a.trending);
    } else if (sortBy === "price") {
      filtered = filtered.sort((a, b) => a.priceInUsdc - b.priceInUsdc);
    } else if (sortBy === "delivery") {
      filtered = filtered.sort((a, b) => a.deliveryDays - b.deliveryDays);
    }

    return filtered;
  }, [searchTerm, sortBy]);

  // Contratar servicio
  const handleHire = async (serviceId, price) => {
    try {
      setProcessingServices(prev => [...prev, serviceId]);
      const currentTick = await getCurrentTick();
      const targetTick = currentTick + 15;

      const tx = new QubicTransaction()
        .setSourcePublicKey(TEST_WALLET.sourceId)
        .setDestinationPublicKey(TEST_WALLET.destinationId)
        .setAmount(price)
        .setTick(targetTick);

      await tx.build(TEST_WALLET.sourceSeed);
      const response = await broadcastTransaction(tx);

      if (response.error) throw new Error(response.error);

      setTransactionStatus(prev => ({
        ...prev,
        [serviceId]: {
          success: true,
          txId: response.transactionId,
          message: `✅ Transacción exitosa: ${response.transactionId}`
        }
      }));
    } catch (error) {
      setTransactionStatus(prev => ({
        ...prev,
        [serviceId]: {
          success: false,
          message: `❌ Error: ${error.message}`
        }
      }));
    } finally {
      setProcessingServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10 max-w-7xl mx-auto">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <SearchInput
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar servicios..."
        />
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              sortBy === "trending" ? "bg-indigo-600 text-white" : "bg-white border"
            }`}
            onClick={() => setSortBy("trending")}
          >
            Tendencia
          </button>
          <button
            className={`px-4 py-2 rounded ${
              sortBy === "price" ? "bg-indigo-600 text-white" : "bg-white border"
            }`}
            onClick={() => setSortBy("price")}
          >
            Precio
          </button>
          <button
            className={`px-4 py-2 rounded ${
              sortBy === "delivery" ? "bg-indigo-600 text-white" : "bg-white border"
            }`}
            onClick={() => setSortBy("delivery")}
          >
            Entrega
          </button>
        </div>
      </div>

      {/* Servicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-all border border-gray-100"
          >
            <div>
              <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                ✍️ {service.author} • ⭐ {service.authorRating}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-lg font-bold text-indigo-600">${service.priceInUsdc}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    ⏳ Entrega en {service.deliveryDays} días
                  </p>
                </div>
                <ButtonTwo
                  className={`text-sm px-4 py-2 whitespace-nowrap ${
                    processingServices.includes(service.id)
                      ? 'bg-indigo-800 opacity-75 cursor-not-allowed'
                      : transactionStatus[service.id]?.success
                        ? 'bg-green-100 text-green-700'
                        : transactionStatus[service.id]?.success === false
                          ? 'bg-red-100 text-red-700'
                          : ''
                  }`}
                  onClick={() => handleHire(service.id, service.priceInUsdc)}
                  disabled={processingServices.includes(service.id)}
                >
                  {processingServices.includes(service.id)
                    ? "Procesando..."
                    : transactionStatus[service.id]?.success
                      ? "✅ Contratado"
                      : transactionStatus[service.id]?.success === false
                        ? "❌ Error"
                        : "Contratar"}
                </ButtonTwo>
              </div>

              {transactionStatus[service.id]?.message && (
                <div className={`text-xs mt-2 ${
                  transactionStatus[service.id]?.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transactionStatus[service.id].message}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {service.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredServices.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron servicios</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default ServiceMarketplace;
