import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { API_URL } from "../api";

export default function ProducerPage() {
  const [volume, setVolume] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  async function handleRequestCollection() {
    if (!volume || parseFloat(volume) <= 0) {
      setStatus({ type: "error", message: "Informe um volume válido." });
      return;
    }

    if (!user) {
      setStatus({ type: "error", message: "Usuário não autenticado." });
      return;
    }

    setLoading(true);
    setStatus(null);

    const metadata = user.user_metadata;

    try {
      const response = await fetch(`${API_URL}/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producer: {
            business_name: metadata.name || "Batedor",
            latitude: -1.4558,
            longitude: -48.4902,
          },
          driver: {
            name: "A alocar",
            license_plate: "N/A",
            max_capacity_kg: 1000.0,
          },
          brickyard: {
            company_name: "A definir",
            latitude: -1.4321,
            longitude: -48.4711,
            storage_capacity_ton: 50.0,
          },
          volume_kg: parseFloat(volume),
          origin_address: metadata.address || "Endereço não informado",
          destination_address: "A definir pela olaria",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: `Coleta solicitada com sucesso! ID: ${data.collection_id}`,
        });
        setVolume("");
      } else {
        setStatus({ type: "error", message: data.error });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Erro ao conectar com o servidor.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8b5cf6] px-4 pt-32 pb-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-purple-900 mt-2">AçaíLoop</h1>
          <p className="text-gray-500 text-sm mt-1">Portal do Batedor</p>
          {user && (
            <p className="text-purple-700 text-sm font-medium mt-2">
              Olá, {user.user_metadata.name || user.email}!
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volume disponível para coleta (kg)
          </label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="Ex: 150"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleRequestCollection}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50"
        >
          {loading ? "Solicitando..." : "Solicitar Coleta"}
        </button>

        {status && (
          <div
            className={`mt-4 p-4 rounded-lg text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}