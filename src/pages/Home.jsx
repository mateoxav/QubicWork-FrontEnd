import React from "react";
import SearchInput from "../components/SearchInput";
import SearchButton from "../components/SearchButton";
import ButtonOne from "../components/ButtonOne";
import ButtonTwo from "../components/ButtonTwo";
import ServiceCard from "../components/ServiceCard";

export default function Home() {
  const [tab, setTab] = React.useState("basico");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="px-6 py-10 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">
            Encuentra talento profesional en la red descentralizada
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un marketplace sin intermediarios construido sobre la blockchain Qubic. Transparente, seguro y sin comisiones abusivas.
          </p>
          <div className="mt-6 flex justify-center items-center gap-2">
            <SearchInput placeholder="Buscar servicios..." />
            <SearchButton />
          </div>
        </section>

        {/* Servicios populares */}
        <section id="explorar">
          <h3 className="text-2xl font-bold mb-6">Servicios populares</h3>
          <ServiceCard />
        </section>

        {/* Publicar servicio */}
        <section id="publicar" className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Publica tu propio servicio</h3>

          <div className="mb-4 flex justify-center gap-2">
            <ButtonTwo className="text-sm px-4 py-1" onClick={() => setTab("basico")}>Básico</ButtonTwo>
            <ButtonTwo className="text-sm px-4 py-1" onClick={() => setTab("avanzado")}>Avanzado</ButtonTwo>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <input
              type="text"
              placeholder="Título"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder={tab === "basico" ? "Descripción" : "Descripción detallada"}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {tab === "avanzado" && (
              <>
                <input
                  type="text"
                  placeholder="Palabras clave"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Tiempo de entrega"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </>
            )}
            <input
              type="text"
              placeholder="Precio en QU"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <ButtonTwo className="w-full text-sm py-2">
              {tab === "basico" ? "Publicar Servicio" : "Publicar Avanzado"}
            </ButtonTwo>
          </div>
        </section>
      </main>
    </div>
  );
}
