import React from "react";
import ButtonTwo from "./ButtonTwo";

const services = [
  {
    title: "Desarrollo Web Full Stack",
    description: "Desarrolladores especializados en stacks modernos (React, Next.js, Node.js, etc.) para construir desde landing pages hasta plataformas completas.",
    category: "👨‍💻 Desarrollo Web",
    price: "500 QU",
  },
  {
    title: "Aplicaciones Móviles",
    description: "Expertos en Flutter, React Native, Kotlin y Swift. Ideal para MVPs, apps DeFi, wallets y más.",
    category: "📱 Mobile Dev",
    price: "600 QU",
  },
  {
    title: "Smart Contracts & Web3",
    description: "Creación, auditoría y despliegue de contratos inteligentes en Ethereum, Solana, Polygon y más.",
    category: "🧠 Web3",
    price: "800 QU",
  },
  {
    title: "DevOps & Cloud Infrastructure",
    description: "Automatización de CI/CD, configuración de entornos en AWS, GCP, Docker, Kubernetes y más.",
    category: "⚙️ DevOps",
    price: "700 QU",
  },
  {
    title: "UI/UX para Productos Tech",
    description: "Diseñadores que entienden de sistemas de diseño, wireframes funcionales y experiencia de usuario.",
    category: "🎨 Diseño UI/UX",
    price: "400 QU",
  },
  {
    title: "Integraciones API & Backend",
    description: "Programadores expertos en desarrollar APIs RESTful/GraphQL y conectar servicios externos como Stripe, Firebase, IPFS.",
    category: "🧩 Integraciones",
    price: "550 QU",
  },
  {
    title: "Testing & QA Automatizado",
    description: "Testeo automatizado con herramientas como Cypress, Playwright, Selenium. Incluye cobertura de errores y seguridad.",
    category: "🕵️‍♂️ QA & Testing",
    price: "450 QU",
  },
];

const ServiceCard = () => {
  return (
    <div className="relative overflow-hidden mask-fade">
      <div className="flex gap-4 w-max animate-scroll-x hardware-acceleration">
        {[...services, ...services].map((service, index) => (
          <div
            key={index}
            className="bg-white min-w-[300px] max-w-[320px] h-[360px] flex flex-col justify-between rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-out p-4"
          >
            {/* Contenido de la card */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">{service.category}</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-indigo-600 font-bold">{service.price}</span>
              <ButtonTwo className="text-sm px-4 py-1">Ver más</ButtonTwo>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;