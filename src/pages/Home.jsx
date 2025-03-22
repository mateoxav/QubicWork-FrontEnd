import React from "react";
import SearchInput from "../components/SearchInput";
import SearchButton from "../components/SearchButton";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Tabs,
  Tab,
} from "@heroui/react";
import { Briefcase, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="px-6 py-10 max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">
            Encuentra talento profesional en la red descentralizada
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un marketplace sin intermediarios construido sobre la blockchain Qubic. Transparente, seguro y sin comisiones abusivas.
          </p>
          <div className="mt-6 flex justify-center items-center gap-2">
            <Input placeholder="Buscar servicios..." className="max-w-md" />
            
            <Button color="success" variant="solid" startContent={<Search className="w-4 h-4" />}>
            </Button>
          </div>
        </section>

        <section id="explorar">
          <h3 className="text-2xl font-bold mb-6">Servicios populares</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm text-gray-500">Diseño Gráfico</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <h4 className="text-lg font-semibold mb-2">
                    Logo para marca Web3
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Diseño profesional de logotipo minimalista para proyectos cripto y blockchain.
                  </p>
                </CardBody>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-indigo-600 font-bold">350 QU</span>
                  <Button size="sm">Ver más</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="publicar" className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Publica tu propio servicio</h3>
          <Tabs aria-label="Publicar servicio" variant="underlined">
            <Tab key="basico" title="Básico">
              <Card className="max-w-2xl mx-auto">
                <CardBody className="space-y-4">
                  <Input placeholder="Título del servicio" />
                  <Input placeholder="Descripción" />
                  <Input placeholder="Precio en QU" />
                  <Button color="primary" className="w-full">
                    Publicar Servicio
                  </Button>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="avanzado" title="Avanzado">
              <Card className="max-w-2xl mx-auto">
                <CardBody className="space-y-4">
                  <Input placeholder="Título" />
                  <Input placeholder="Descripción detallada" />
                  <Input placeholder="Palabras clave" />
                  <Input placeholder="Precio" />
                  <Input placeholder="Tiempo de entrega" />
                  <Button color="primary" className="w-full">
                    Publicar Avanzado
                  </Button>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </section>
      </main>
    </div>
  );
}