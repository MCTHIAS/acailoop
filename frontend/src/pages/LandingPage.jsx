import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-[#8b5cf6] min-h-screen text-gray-200 font-sans flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
          AçaíLoop
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mb-12">
          Inteligência logística para o descarte sustentável do caroço de açaí. 
          Conectando pontos de coleta, motoristas e olarias.
        </p>
        <div className="flex gap-4">
          <Link
            to="/auth"
            className="bg-white text-neutral-950 font-bold px-8 py-3 rounded-md hover:bg-neutral-200 transition"
          >
            Acessar Plataforma
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Impacto em Números</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-950 p-8 rounded-lg border border-neutral-800">
              <h3 className="text-lg font-medium text-neutral-400 mb-2">Economia Local</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Geração de receita extra para motoristas e redução de custos operacionais para batedores.
              </p>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4"></div>
              </div>
            </div>

            <div className="bg-neutral-950 p-8 rounded-lg border border-neutral-800">
              <h3 className="text-lg font-medium text-neutral-400 mb-2">Meio Ambiente</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Redução drástica do descarte irregular de resíduos orgânicos em vias públicas.
              </p>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-white w-4/5"></div>
              </div>
            </div>

            <div className="bg-neutral-950 p-8 rounded-lg border border-neutral-800">
              <h3 className="text-lg font-medium text-neutral-400 mb-2">Eficiência Energética</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Fornecimento de biomassa sustentável e de alto poder calorífico para as olarias.
              </p>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-white w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}