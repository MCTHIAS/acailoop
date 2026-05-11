import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { API_URL } from "../api";

export default function DriverPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        fetchCollections(user);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function fetchCollections(currentUser) {
    try {
      const userName = currentUser.user_metadata?.name || "";
      const role = currentUser.user_metadata?.role || "";
      const response = await fetch(`${API_URL}/collections?status=PENDING&user_name=${userName}&role=${role}`);
      const data = await response.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch {
      console.error("Erro ao buscar coletas.");
    } finally {
      setLoading(false);
    }
  }

  async function acceptRoute(collectionId) {
    setUpdating(collectionId);
    try {
      await fetch(`${API_URL}/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ON_ROUTE", driver_name: user.user_metadata.name }),
      });
      fetchCollections(user);
    } catch {
      console.error("Erro ao aceitar rota.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#8b5cf6] px-4 pt-32 pb-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mt-2">Portal do Motorista</h1>
          <p className="text-purple-200 text-sm mt-1">Coletas disponíveis para retirada</p>
        </div>

        {loading ? (
          <p className="text-white text-center">Carregando coletas...</p>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500 mt-4">Nenhuma coleta pendente no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((col) => (
              <div key={col.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{col.producer_name}</p>
                    <p className="text-purple-600 text-xs font-bold uppercase mt-1">Local da Coleta:</p>
                    <p className="text-gray-600 text-sm">{col.origin_address}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                    {col.status}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <p className="text-gray-500 text-xs font-bold uppercase">Destino (Olaria):</p>
                  <p className="font-medium text-gray-800">{col.brickyard_name}</p>
                  <p className="text-gray-600 text-sm">{col.destination_address}</p>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 my-4 bg-gray-50 p-3 rounded-lg">
                  <span><strong>Peso:</strong> {col.collected_volume_kg} kg</span>
                  <span><strong>Data:</strong> {new Date(col.scheduled_at).toLocaleDateString("pt-BR")}</span>
                </div>

                <button
                  onClick={() => acceptRoute(col.id)}
                  disabled={updating === col.id}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                >
                  {updating === col.id ? "Aceitando..." : "Aceitar Rota"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}