import { Card, CardBody, Avatar } from '@heroui/react';

function Profile() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardBody>
          <div className="flex items-center">
            <Avatar src="/path-to-avatar.jpg" alt="Avatar" className="mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Nombre del Usuario</h1>
              <p>Descripción breve del usuario...</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;
