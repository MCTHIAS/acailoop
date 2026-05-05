import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ session }) {
  const location = useLocation();
  const role = session?.user?.user_metadata?.role;

  const links = [];
  
  if (role) {
    if (role === "batedor") links.push({ path: "/", label: "Batedor" });
    if (role === "motorista") links.push({ path: "/driver", label: "Motorista" });
    if (role === "olaria") links.push({ path: "/brickyard", label: "Olaria" });
  }

  if (session) {
    links.push({ path: "/profile", label: "Perfil" });
  }

  return (
    <nav className="bg-purple-900 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-lg">AçaíLoop</span>
        <div className="flex gap-2 items-center">
          {session && links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === link.path
                  ? "bg-white text-purple-900"
                  : "text-white hover:bg-purple-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <button
              onClick={() => supabase.auth.signOut()}
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white border border-white hover:bg-purple-700 transition"
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}