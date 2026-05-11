import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { API_URL } from "../api";

export default function HistoryPage() {
  const [collections, setCollections] = useState([]);
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
        `${API_URL}/collections?status=COMPLETED&user_name=${userName}&role=${role}`
      );
      const data = await response.json();
      
      setCollections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#8b5cf6] px-4 pt-32 pb-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mt-2">Histórico de Coletas</h1>
          <p className="text-purple-200 text-sm mt-1">Registros das rotas finalizadas com sucesso</p>
        </div>

        {loading ? (
          <p className="text-white text-center font-medium">Carregando histórico...</p>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
            <p className="text-gray-500 font-medium">Nenhuma coleta finalizada até o momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((col) => (
              <div key={col.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Finalizada
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {new Date(col.scheduled_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800 text-xl">{col.producer_name}</p>
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 text-center">
                    <span className="block text-2xl font-black text-purple-700">{col.collected_volume_kg}kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Coleta</p>
                    <p className="text-sm text-gray-700">{col.origin_address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Entrega (Olaria)</p>
                    <p className="text-sm text-gray-700">{col.destination_address} ({col.brickyard_name})</p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400 font-medium">
                  Motorista responsável: {col.driver_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}