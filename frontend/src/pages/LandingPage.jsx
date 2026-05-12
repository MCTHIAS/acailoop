import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function LandingPage() {
  const [metrics, setMetrics] = useState({
    total_volume_kg: 0,
    total_trips: 0,
    trees_saved: 0,
    active_partners: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`${API_URL}/metrics`);
        const data = await response.json();
        if (response.ok) {
          setMetrics(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="bg-[#8b5cf6] min-h-screen text-gray-200 font-sans flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
          AçaíLoop
        </h1>
        <p className="text-xl text-purple-100 max-w-2xl mb-12 font-medium">
          Inteligência logística para o descarte sustentável do caroço de açaí. 
          Conectando pontos de coleta, motoristas e olarias em tempo real.
        </p>
        <div className="flex gap-4">
          <Link
            to="/auth"
            className="bg-white text-[#8b5cf6] font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg text-lg"
          >
            Acessar Plataforma
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 py-20 px-4">
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Impacto em Números</h2>
            <p className="text-neutral-400">Métricas geradas em tempo real pelas coletas finalizadas na plataforma.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-800 text-center hover:border-purple-500 transition-colors">
                <span className="block text-4xl font-black text-white mb-2">
                  {metrics.total_volume_kg} <span className="text-xl text-neutral-500">kg</span>
                </span>
                <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">Biomassa Reaproveitada</span>
              </div>

              <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-800 text-center hover:border-green-500 transition-colors">
                <span className="block text-4xl font-black text-white mb-2">
                  {metrics.trees_saved}
                </span>
                <span className="text-sm font-bold text-green-400 uppercase tracking-wider">Árvores Poupadas</span>
              </div>

              <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-800 text-center hover:border-blue-500 transition-colors">
                <span className="block text-4xl font-black text-white mb-2">
                  {metrics.total_trips}
                </span>
                <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Rotas Finalizadas</span>
              </div>

              <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-800 text-center hover:border-orange-500 transition-colors">
                <span className="block text-4xl font-black text-white mb-2">
                  {metrics.active_partners}
                </span>
                <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">Parceiros Conectados</span>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">O Problema e a Visão</h2>
            <div className="text-neutral-400 leading-relaxed space-y-4">
              <p>
                A Região Metropolitana de Belém processa toneladas de açaí diariamente. O resultado desse consumo em larga escala são caroços descartados de forma inadequada por centenas de batedores espalhados pela cidade, gerando graves passivos ambientais urbanos.
              </p>
              <p>
                O <strong>AçaíLoop</strong> nasceu para resolver esse gargalo logístico conectando três atores essenciais em uma cadeia circular:
              </p>
              <ul className="list-none space-y-4 mt-6">
                <li className="flex items-start">
                  <span className="bg-purple-900/50 text-purple-400 p-2 rounded-lg mr-4 mt-1">📦</span>
                  <div>
                    <strong className="text-white block">Batedores de Açaí</strong>
                    <span>Eliminam o descarte inadequado e o custo de remoção do resíduo.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-900/50 text-blue-400 p-2 rounded-lg mr-4 mt-1">🚚</span>
                  <div>
                    <strong className="text-white block">Motoristas de Frete</strong>
                    <span>Aproveitam rotas ociosas e aumentam a ocupação de carga com destinos garantidos.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-900/50 text-orange-400 p-2 rounded-lg mr-4 mt-1">🧱</span>
                  <div>
                    <strong className="text-white block">Olarias</strong>
                    <span>Reduzem drasticamente o custo de aquisição de insumo combustível substituindo-o por biomassa.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-6">Contexto do Projeto</h2>
              <div className="text-neutral-400 leading-relaxed space-y-4">
                <p>
                  Desenvolvido inicialmente como um protótipo de extensão universitária, o AçaíLoop possui um foco inegociável em impacto socioambiental real na Região Metropolitana de Belém, PA.
                </p>
                <p>
                  O objetivo principal da plataforma é validar a adesão de batedores reais, criando uma infraestrutura tecnológica que elimina a fricção de comunicação entre geradores de resíduos e consumidores de biomassa.
                </p>
                <div className="mt-8 pt-6 border-t border-neutral-800">
                  <p className="text-sm text-neutral-500 font-medium">📍 Feito em Belém do Pará</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-6">Inteligência de Roteirização</h2>
              <div className="text-neutral-400 leading-relaxed space-y-4">
                <p>
                  O Serviço de Otimização de Rota garante segurança aos motoristas através de um fluxo rigoroso de três estágios de validação:
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm">1</div>
                    <p className="text-sm">O batedor disponibiliza o volume do resíduo no mercado.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm">2</div>
                    <p className="text-sm">A Olaria capta o pedido, fornecendo a garantia do destino.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-purple-900/20 border border-purple-900/50 p-4 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">3</div>
                    <p className="text-sm text-purple-200">A rota 100% preenchida é liberada para o motorista executar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Engenharia e Arquitetura</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-4">Porquê Clean Architecture?</h3>
                <p className="text-neutral-400 leading-relaxed">
                  A adoção de Clean Architecture garante que o núcleo de negócio do AçaíLoop (a máquina de estados da recolha) não dependa de frameworks externos. Se amanhã o Supabase for substituído por PostgreSQL nativo ou o Flask por FastAPI, as regras de negócio permanecem intactas. As dependências apontam sempre para o centro, isolando o domínio tecnológico do domínio de negócio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Modelo de Domínio</h3>
                  <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 font-mono text-sm text-neutral-300">
                    <ul className="space-y-3">
                      <li><span className="text-blue-400">AcaiProducer</span> (Gera o volume)</li>
                      <li><span className="text-green-400">Brickyard</span> (Garante o destino)</li>
                      <li><span className="text-orange-400">Driver</span> (Executa a rota)</li>
                      <li className="pt-3 border-t border-neutral-800">
                        <span className="text-purple-400 font-bold">Collection Status:</span><br/>
                        AWAITING_BRICKYARD ➔<br/>
                        AWAITING_DRIVER ➔<br/>
                        ON_ROUTE ➔ COMPLETED
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Arquitetura de Componentes</h3>
                  <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 font-mono text-sm text-neutral-300">
                    <ul className="space-y-3">
                      <li><span className="text-white font-bold">Frontend:</span> React 18, Vite, Tailwind CSS (Deploy na Vercel)</li>
                      <li><span className="text-white font-bold">Backend:</span> Python 3, Flask, CORS (Deploy no Render/Railway)</li>
                      <li><span className="text-white font-bold">Base de Dados:</span> Supabase Serverless PostgreSQL</li>
                      <li><span className="text-white font-bold">Infra:</span> Abordagem FinOps (Custo Operacional Zero no MVP)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}