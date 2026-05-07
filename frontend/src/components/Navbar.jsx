import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ session }) {
  const location = useLocation();
  const role = session?.user?.user_metadata?.role;

  const links = [];
  
  if (session) {
    links.push({ path: "/", label: "Início" });
  }

  if (role) {
    if (role === "batedor") links.push({ path: "/producer", label: "Painel" });
    if (role === "motorista") links.push({ path: "/driver", label: "Rotas" });
    if (role === "olaria") links.push({ path: "/brickyard", label: "Recepção" });
  }

  if (session) {
    links.push({ path: "/profile", label: "Perfil" });
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className="mx-auto max-w-screen-xl bg-black/20 backdrop-blur-lg border border-white/10 rounded-full shadow-lg shadow-black/20 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-xl tracking-tight">
          AçaíLoop
        </Link>
        <div className="flex gap-3 items-center">
          {!session ? (
            <Link
              to="/auth"
              className="text-sm font-medium text-neutral-300 hover:text-white px-4 py-2 rounded-full transition"
            >
              Entrar / Cadastrar
            </Link>
          ) : (
            <>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    location.pathname === link.path
                      ? "bg-white text-neutral-950"
                      : "text-neutral-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}