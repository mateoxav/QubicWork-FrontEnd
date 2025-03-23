
import { useState } from "react";
import ButtonTwo from "../components/ButtonTwo";

const categories = [
    { id: "frontend", name: "Frontend Web3" },
    { id: "smart-contracts", name: "Smart Contracts" },
    { id: "devops", name: "DevOps & Cloud" },
    { id: "mobile", name: "Desarrollo Móvil" },
    { id: "design", name: "UI/UX & Diseño" }
  ];
  
  export default function PublicarTarea() {
    const [form, setForm] = useState({
      title: "",
      description: "",
      category: "frontend",
      budget: "",
      deliveryDays: "",
      wallet: ""
    });
  
    const handleChange = (field, value) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Tarea publicada:", form);
      alert("🎉 Tarea publicada con éxito!");
    };
  
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📝 Publicar nueva tarea</h1>
  
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block mb-1 font-medium">Título de la tarea</label>
            <Input
              placeholder="Ej: Crear landing para proyecto NFT"
              value={form.title}
              onChange={e => handleChange("title", e.target.value)}
              required
            />
          </div>
  
          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <Textarea
              placeholder="Describe lo que necesitas, requisitos técnicos, referencias, etc."
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              rows={6}
              required
            />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Categoría</label>
              <Select
                value={form.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
            <div>
              <label className="block mb-1 font-medium">Presupuesto estimado (USDC)</label>
              <Input
                type="number"
                placeholder="Ej: 150"
                value={form.budget}
                onChange={e => handleChange("budget", e.target.value)}
                required
              />
            </div>
  
            <div>
              <label className="block mb-1 font-medium">Tiempo de entrega (días)</label>
              <Input
                type="number"
                placeholder="Ej: 3"
                value={form.deliveryDays}
                onChange={e => handleChange("deliveryDays", e.target.value)}
                required
              />
            </div>
  
            <div>
              <label className="block mb-1 font-medium">Wallet de pago (USDC)</label>
              <Input
                type="text"
                placeholder="0x..."
                value={form.wallet}
                onChange={e => handleChange("wallet", e.target.value)}
                required
              />
            </div>
          </div>
  
          <div className="pt-4 border-t mt-4 flex justify-end">
            <ButtonTwo type="submit" className="px-6 py-2 text-sm">Publicar tarea</ButtonTwo>
          </div>
        </form>
      </div>
    );
  }
  