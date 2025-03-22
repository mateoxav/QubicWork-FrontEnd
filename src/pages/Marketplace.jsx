import { Card, CardBody } from '@heroui/react';

function Marketplace() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
      {/* Aquí se mapearán los servicios disponibles */}
      <Card>
        <CardBody>
          <h2 className="text-2xl font-bold">Servicio Ejemplo</h2>
          <p>Descripción del servicio...</p>
        </CardBody>
      </Card>
    </div>
  );
}

export default Marketplace;
