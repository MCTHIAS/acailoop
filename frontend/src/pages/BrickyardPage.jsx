import { useState, useEffect } from "react";

export default function BrickyardPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  async function fetchCollections() {
    try {
      const response = await fetch("http://127.0.0.1:5000/collections?status=ON_ROUTE");
      const data = await response.json();
      setCollections(data);
    } catch {
      console.error("Erro ao buscar coletas.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmReceipt(collectionId) {
    setUpdating(collectionId);
    try {
      await fetch(`http://127.0.0.1:5000/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      await fetchCollections();
    } catch {
      console.error("Erro ao confirmar recebimento.");
    } finally {
      setUpdating(null);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#8b5cf6] px-4 pt-32 pb-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mt-2">Portal da Olaria</h1>
          <p className="text-orange-300 text-sm mt-1">Coletas em rota para recebimento</p>
        </div>

        {loading ? (
          <p className="text-white text-center">Carregando coletas...</p>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500 mt-4">Nenhuma coleta em rota no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((col) => (
              <div key={col.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{col.producer_name}</p>
                    <p className="text-gray-500 text-sm">Motorista: {col.driver_name}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {col.status}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>Peso: {col.collected_volume_kg} kg</span>
                  <span>Data: {new Date(col.scheduled_at).toLocaleDateString("pt-BR")}</span>
                </div>

                <button
                  onClick={() => confirmReceipt(col.id)}
                  disabled={updating === col.id}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                >
                  {updating === col.id ? "Confirmando..." : "Confirmar Recebimento"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}