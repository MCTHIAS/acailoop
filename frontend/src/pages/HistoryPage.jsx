import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { API_URL } from "../api";

export default function HistoryPage() {
  const [activeCollections, setActiveCollections] = useState([]);
  const [completedCollections, setCompletedCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        fetchHistory(user);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function fetchHistory(currentUser) {
    try {
      const userName = currentUser.user_metadata?.name || "";
      const role = currentUser.user_metadata?.role || "";
      
      const response = await fetch(
        `${API_URL}/collections?user_name=${userName}&role=${role}`
      );
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setActiveCollections(data.filter(col => col.status !== "COMPLETED"));
        setCompletedCollections(data.filter(col => col.status === "COMPLETED"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      AWAITING_BRICKYARD: { label: "Aguardando Olaria", style: "bg-orange-100 text-orange-800" },
      AWAITING_DRIVER: { label: "Aguardando Motorista", style: "bg-yellow-100 text-yellow-800" },
      ON_ROUTE: { label: "Em Rota", style: "bg-blue-100 text-blue-800" },
      COMPLETED: { label: "Finalizada", style: "bg-green-100 text-green-800" }
    };
    const current = config[status] || { label: status, style: "bg-gray-100 text-gray-800" };

    return (
      <span className={`${current.style} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
        {current.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#8b5cf6] px-4 pt-32 pb-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mt-2">Painel de Acompanhamento</h1>
          <p className="text-purple-200 text-sm mt-1">Monitore suas coletas em tempo real e acesse o histórico</p>
        </div>

        {loading ? (
          <p className="text-white text-center font-medium">Carregando dados...</p>
        ) : (
          <>
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-purple-400 pb-2">Coletas em Andamento</h2>
              {activeCollections.length === 0 ? (
                <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-purple-100 font-medium">Nenhuma coleta em andamento no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCollections.map((col) => (
                    <div key={col.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:scale-[1.01] transition-transform">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusBadge(col.status)}
                          <span className="text-sm font-medium text-gray-500">
                            {new Date(col.scheduled_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="font-bold text-gray-800 text-lg mb-1">Origem: {col.producer_name}</p>
                        <p className="text-gray-600 text-sm">Destino: {col.brickyard_name || "Aguardando aceite..."}</p>
                        <p className="text-gray-600 text-sm">Motorista: {col.driver_name || "Aguardando motorista..."}</p>
                      </div>
                      
                      <div className="bg-purple-50 px-6 py-4 rounded-xl border border-purple-100 text-center min-w-[140px]">
                        <span className="block text-3xl font-black text-purple-700">{col.collected_volume_kg}</span>
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Quilos</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 border-b border-purple-400 pb-2">Histórico Finalizado</h2>
              {completedCollections.length === 0 ? (
                <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-purple-100 font-medium">Nenhuma coleta finalizada até o momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedCollections.map((col) => (
                    <div key={col.id} className="bg-white opacity-80 hover:opacity-100 rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-opacity">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusBadge(col.status)}
                          <span className="text-sm font-medium text-gray-500">
                            {new Date(col.scheduled_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="font-bold text-gray-800 text-lg mb-1">Origem: {col.producer_name}</p>
                        <p className="text-gray-600 text-sm">Destino: {col.brickyard_name}</p>
                        <p className="text-gray-600 text-sm">Motorista: {col.driver_name}</p>
                      </div>
                      
                      <div className="bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 text-center min-w-[140px]">
                        <span className="block text-2xl font-black text-gray-600">{col.collected_volume_kg}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quilos</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}