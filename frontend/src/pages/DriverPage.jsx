import { useState, useEffect } from "react";

export default function DriverPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  async function fetchCollections() {
    try {
      const response = await fetch("http://127.0.0.1:5000/collections");
      const data = await response.json();
      setCollections(data);
    } catch {
      console.error("Erro ao buscar coletas.");
    } finally {
      setLoading(false);
    }
  }

  async function acceptRoute(collectionId) {
    setUpdating(collectionId);
    try {
      await fetch(`http://127.0.0.1:5000/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ON_ROUTE" }),
      });
      await fetchCollections();
    } catch {
      console.error("Erro ao aceitar rota.");
    } finally {
      setUpdating(null);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div
      className="flex flex-col items-center bg-blue-950 p-6"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl">🚛</span>
          <h1 className="text-2xl font-bold text-white mt-2">Portal do Motorista</h1>
          <p className="text-blue-300 text-sm mt-1">Coletas disponíveis para retirada</p>
        </div>

        {loading ? (
          <p className="text-white text-center">Carregando coletas...</p>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <span className="text-4xl">📭</span>
            <p className="text-gray-500 mt-4">Nenhuma coleta pendente no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((col) => (
              <div key={col.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{col.producer_name}</p>
                    <p className="text-gray-500 text-sm">Destino: {col.brickyard_name}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                    {col.status}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>⚖️ {col.collected_volume_kg} kg</span>
                  <span>📅 {new Date(col.scheduled_at).toLocaleDateString("pt-BR")}</span>
                </div>

                <button
                  onClick={() => acceptRoute(col.id)}
                  disabled={updating === col.id}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                >
                  {updating === col.id ? "Aceitando..." : "✅ Aceitar Rota"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}