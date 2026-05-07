import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("batedor");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setRole(user.user_metadata?.role || "batedor");
        setName(user.user_metadata?.name || "");
      }
    });
  }, []);

  async function handleUpdateProfile() {
    setLoading(true);
    setStatus(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { role, name }
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
      window.location.href = "/auth";
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Negócio ou Usuário</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
            >
              <option value="batedor">Batedor</option>
              <option value="motorista">Motorista</option>
              <option value="olaria">Olaria</option>
            </select>
          </div>
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