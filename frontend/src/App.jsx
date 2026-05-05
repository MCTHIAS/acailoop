import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./components/Navbar";
import ProducerPage from "./pages/ProducerPage";
import DriverPage from "./pages/DriverPage";
import BrickyardPage from "./pages/BrickyardPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-purple-950 flex items-center justify-center">
      <span className="text-white text-xl">🫐 Carregando...</span>
    </div>
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar session={session} />
        <Routes>
          <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/" element={session ? <ProducerPage /> : <Navigate to="/auth" />} />
          <Route path="/driver" element={session ? <DriverPage /> : <Navigate to="/auth" />} />
          <Route path="/brickyard" element={session ? <BrickyardPage /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}