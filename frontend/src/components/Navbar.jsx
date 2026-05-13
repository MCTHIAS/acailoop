import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ session }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const role = session?.user?.user_metadata?.role;

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const links = [];
  
  if (session) {
    links.push({ path: "/", label: "Início" });
  }

  if (role) {
    if (role === "batedor") links.push({ path: "/producer", label: "Solicitar Coleta" });
    if (role === "motorista") links.push({ path: "/driver", label: "Rotas" });
    if (role === "olaria") links.push({ path: "/brickyard", label: "Recepção" });
    links.push({ path: "/history", label: "Minhas Coletas" });
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
      <nav className={`mx-auto max-w-screen-xl bg-transparent backdrop-blur-md border border-white/10 shadow-lg shadow-black/10 transition-colors duration-500 ease-in-out rounded-[2rem] md:rounded-full ${isMobileMenuOpen ? 'bg-neutral-900/60' : ''}`}>
        
        <div className="px-6 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-3 text-white font-bold text-xl tracking-tight transition-transform duration-300 ${isMobileMenuOpen ? 'scale-105' : 'scale-100'}`}>
            <img src="/favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
            AçaíLoop
          </Link>

          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none p-1 transition-transform duration-300 active:scale-90"
            >
              <div className={`relative w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6 absolute inset-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                  <svg className="w-6 h-6 absolute inset-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                )}
              </div>
            </button>
          </div>

          <div className="hidden md:flex gap-2 items-center">
            {!session ? (
              <Link
                to="/auth"
                className="px-5 py-2 font-semibold rounded-full transition-all ease-linear hover:bg-purple-400/20 hover:shadow-inner focus:bg-gradient-to-r focus:from-purple-400 focus:to-purple-600 focus:text-white text-neutral-200 hover:text-white"
              >
                Entrar / Cadastrar
              </Link>
            ) : (
              <>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-5 py-2 font-semibold rounded-full transition-all ease-linear hover:bg-purple-400/20 hover:shadow-inner focus:bg-gradient-to-r focus:from-purple-400 focus:to-purple-600 focus:text-white ${
                      location.pathname === link.path
                        ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md"
                        : "text-neutral-200 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="ml-2 px-5 py-2 font-semibold rounded-full transition-all ease-linear hover:bg-red-500/20 hover:shadow-inner focus:bg-gradient-to-r focus:from-red-400 focus:to-red-600 focus:text-white text-neutral-200 hover:text-white"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        </div>

        <div className={`md:hidden grid transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className={`px-4 pt-2 pb-6 flex flex-col gap-2 transition-all duration-500 ease-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="h-[1px] w-full bg-white/10 mb-2" />
              {!session ? (
                <Link
                  to="/auth"
                  onClick={toggleMenu}
                  className="block text-center px-5 py-4 font-semibold rounded-full transition-all ease-linear hover:bg-purple-400/20 hover:shadow-inner focus:bg-gradient-to-r focus:from-purple-400 focus:to-purple-600 focus:text-white text-neutral-200 hover:text-white active:scale-95"
                >
                  Entrar / Cadastrar
                </Link>
              ) : (
                <>
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={toggleMenu}
                      className={`block px-5 py-4 font-semibold rounded-full transition-all ease-linear hover:bg-purple-400/20 hover:shadow-inner focus:bg-gradient-to-r focus:from-purple-400 focus:to-purple-600 focus:text-white active:scale-95 ${
                        location.pathname === link.path
                          ? "bg-gradient-to-r from-purple-400 to-purple-600 text-black shadow-md"
                          : "text-purple-900 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      toggleMenu();
                      handleLogout();
                    }}
                    className="mt-2 w-full text-left px-5 py-4 font-semibold rounded-full transition-all ease-linear hover:bg-red-500/20 hover:shadow-inner focus:bg-gradient-to-r focus:from-red-400 focus:to-red-600 focus:text-white text-purple-900 hover:text-white active:scale-95"
                  >
                    Sair
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}