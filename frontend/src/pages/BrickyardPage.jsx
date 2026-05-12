import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { API_URL } from "../api";

export default function BrickyardPage() {
  const [availableCollections, setAvailableCollections] = useState([]);
  const [incomingCollections, setIncomingCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        fetchData(user);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function fetchData(currentUser) {
    try {
      const userName = currentUser.user_metadata?.name || "";
      const role = currentUser.user_metadata?.role || "";

      const resAvailable = await fetch(`${API_URL}/collections?status=AWAITING_BRICKYARD&role=${role}`);
      const dataAvailable = await resAvailable.json();

      const resIncoming = await fetch(`${API_URL}/collections?status=ON_ROUTE&user_name=${userName}&role=${role}`);
      const dataIncoming = await resIncoming.json();

      setAvailableCollections(Array.isArray(dataAvailable) ? dataAvailable : []);
      setIncomingCollections(Array.isArray(dataIncoming) ? dataIncoming : []);
    } catch {
      console.error("Erro ao buscar coletas.");
    } finally {
      setLoading(false);
    }
  }

  async function acceptCollection(collectionId) {
    setUpdating(collectionId);
    try {
      await fetch(`${API_URL}/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "AWAITING_DRIVER",
          brickyard_name: user.user_metadata.name,
          destination_address: user.user_metadata.address
        }),
      });
      fetchData(user);
    } catch {
      console.error("Erro ao aceitar coleta.");
    } finally {
      setUpdating(null);
    }
  }

  async function confirmReceipt(collectionId) {
    setUpdating(collectionId);
    try {
      await fetch(`${API_URL}/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      fetchData(user);
    } catch {
      console.error("Erro ao confirmar recebimento.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#8b5cf6] px-4 pt-32 pb-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mt-2">Portal da Olaria</h1>
          <p className="text-purple-200 text-sm mt-1">Gerencie a entrada de biomassa</p>
        </div>

        {loading ? (
          <p className="text-white text-center">Carregando dados...</p>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4 border-b border-purple-400 pb-2">Novas Solicitações no Mercado</h2>
              {availableCollections.length === 0 ? (
                <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-purple-100">Nenhuma carga disponível para captação no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableCollections.map((col) => (
                    <div key={col.id} className="bg-white rounded-2xl shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{col.producer_name}</p>
                          <p className="text-purple-600 text-xs font-bold uppercase mt-1">Origem:</p>
                          <p className="text-gray-600 text-sm">{col.origin_address}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                          DISPONÍVEL
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 my-4 bg-gray-50 p-3 rounded-lg">
                        <span><strong>Volume:</strong> {col.collected_volume_kg} kg</span>
                        <span><strong>Data:</strong> {new Date(col.scheduled_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <button
                        onClick={() => acceptCollection(col.id)}
                        disabled={updating === col.id}
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                      >
                        {updating === col.id ? "Processando..." : "Aceitar Carga (Tornar Destino)"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-4 border-b border-purple-400 pb-2">Cargas a Caminho (Sua Olaria)</h2>
              {incomingCollections.length === 0 ? (
                <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-purple-100">Nenhuma carga a caminho da sua olaria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingCollections.map((col) => (
                    <div key={col.id} className="bg-white rounded-2xl shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{col.producer_name}</p>
                          <p className="text-gray-500 text-sm mt-1">Motorista em Rota: <strong>{col.driver_name}</strong></p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                          EM ROTA
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                        <span><strong>Volume:</strong> {col.collected_volume_kg} kg</span>
                      </div>
                      <button
                        onClick={() => confirmReceipt(col.id)}
                        disabled={updating === col.id}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                      >
                        {updating === col.id ? "Confirmando..." : "Confirmar Recebimento"}
                      </button>
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