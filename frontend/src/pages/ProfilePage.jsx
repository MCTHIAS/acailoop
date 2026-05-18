import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("batedor");
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  const [brickyardName, setBrickyardName] = useState("");
  const [brickyardAddress, setBrickyardAddress] = useState("");
  const [storageCapacity, setStorageCapacity] = useState("");

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        
        const metadata = user.user_metadata || {};
        const currentRole = metadata.role || "batedor";
        
        setRole(currentRole);
        setName(metadata.name || "");
        setAddress(metadata.address || "");
        
        setDriverName(metadata.driver_name || "");
        setDriverPhone(metadata.driver_phone || "");
        setLicensePlate(metadata.license_plate || "");
        setMaxCapacity(metadata.max_capacity_kg?.toString() || "");
        
        setBrickyardName(metadata.brickyard_name || "");
        setBrickyardAddress(metadata.brickyard_address || "");
        setStorageCapacity(metadata.storage_capacity_ton?.toString() || "");
      }
    });
  }, []);

  async function handleUpdateProfile() {
    setLoading(true);
    setStatus(null);

    const updateData = {
      role: role,
      
      name: role === "batedor" ? name : null,
      address: role === "batedor" ? address : null,
      
      driver_name: role === "motorista" ? driverName : null,
      driver_phone: role === "motorista" ? driverPhone : null,
      license_plate: role === "motorista" ? licensePlate : null,
      max_capacity_kg: role === "motorista" ? parseFloat(maxCapacity) || 0 : null,
      
      brickyard_name: role === "olaria" ? brickyardName : null,
      brickyard_address: role === "olaria" ? brickyardAddress : null,
      storage_capacity_ton: role === "olaria" ? parseFloat(storageCapacity) || 0 : null,
    };

    try {
      const { error } = await supabase.auth.updateUser({
        data: updateData
      });
      if (error) throw error;
      
      setStatus({ type: "success", message: "Perfil atualizado! Redirecionando..." });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
    if (!confirmDelete) return;

    setIsDeleting(true);
    setStatus(null);

    try {
      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;

      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      setIsDeleting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8b5cf6] px-4 pt-32 pb-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-purple-900 mb-6 text-center">Meu Perfil</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
            >
              <option value="batedor">Batedor de Açaí</option>
              <option value="motorista">Motorista de Frete</option>
              <option value="olaria">Olaria</option>
            </select>
          </div>

          {role === "batedor" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Negócio</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Açaí do João"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Origem</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, Número, Bairro - Cidade"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {role === "motorista" && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número para Contato</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="(91) 90000-0000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa do Veículo</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (kg)</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="Ex: 1500"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {role === "olaria" && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Olaria</label>
                <input
                  type="text"
                  value={brickyardName}
                  onChange={(e) => setBrickyardName(e.target.value)}
                  placeholder="Ex: Olaria São José"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                <input
                  type="text"
                  value={brickyardAddress}
                  onChange={(e) => setBrickyardAddress(e.target.value)}
                  placeholder="Localização da olaria"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade de Estoque (Toneladas)</label>
                <input
                  type="number"
                  value={storageCapacity}
                  onChange={(e) => setStorageCapacity(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={loading || isDeleting}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 mb-4"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={loading || isDeleting}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {isDeleting ? "Excluindo..." : "Excluir Conta"}
        </button>

        {status && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}