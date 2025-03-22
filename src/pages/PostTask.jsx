import { Input, Button, Textarea } from '@heroui/react';

function PostTask() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Publicar Nueva Tarea</h1>
      <form>
        <Input label="Título de la Tarea" placeholder="Ingrese el título" className="mb-4" />
        <Textarea label="Descripción" placeholder="Describa la tarea" className="mb-4" />
        <Input label="Presupuesto" placeholder="Ingrese el presupuesto en Qubic coins" className="mb-4" />
        <Button color="primary" type="submit">Publicar</Button>
      </form>
    </div>
  );
}

export default PostTask;
