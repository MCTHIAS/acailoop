import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("batedor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      setStatus({ type: "error", message: "Preencha e-mail e senha." });
      return;
    }

    if (!isLogin) {
      if (!name || !contact) {
        setStatus({ type: "error", message: "Preencha os campos obrigatórios." });
        return;
      }
      if (role === "motorista" && (!plate || !capacity)) {
        setStatus({ type: "error", message: "Preencha a placa e a capacidade." });
        return;
      }
      if (role === "olaria" && !address) {
        setStatus({ type: "error", message: "Preencha o endereço." });
        return;
      }
    }

    setLoading(true);
    setStatus(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              name,
              contact,
              plate: role === "motorista" ? plate : null,
              capacity: role === "motorista" ? capacity : null,
              address: role === "olaria" ? address : null,
            }
          }
        });
        if (error) throw error;
        
        setStatus({
          type: "success",
          message: "Conta criada! Verifique sua caixa de entrada para confirmar o e-mail.",
        });
        return;
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex items-center justify-center bg-purple-950 p-4"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 my-8">
        <div className="text-center mb-6">
          <span className="text-5xl">🫐</span>
          <h1 className="text-2xl font-bold text-purple-900 mt-2">AçaíLoop</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Faça login para continuar" : "Crie sua conta"}
          </p>
        </div>

        {!isLogin && (
          <div className="mb-6 flex bg-gray-100 rounded-lg p-1">
            {["batedor", "motorista", "olaria"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition ${
                  role === r ? "bg-white shadow text-purple-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {!isLogin && (
          <div className="space-y-4 mb-4 border-b pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === "motorista" ? "Nome do Motorista" : role === "olaria" ? "Nome da Olaria" : "Nome do Ponto de Açaí"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número para Contato</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="(91) 90000-0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {role === "motorista" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="ABC-1234"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (kg)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Ex: 1000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {role === "olaria" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
        </button>

        {status && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setStatus(null); }}
            className="text-purple-700 font-medium hover:underline"
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
}