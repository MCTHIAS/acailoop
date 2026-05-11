import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./components/Navbar";
import ProducerPage from "./pages/ProducerPage";
import DriverPage from "./pages/DriverPage";
import BrickyardPage from "./pages/BrickyardPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import HistoryPage from "./pages/HistoryPage";

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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <span className="text-white text-xl">Carregando...</span>
    </div>
  );

  const getHomeRoute = () => {
    if (!session) return "/auth";
    const role = session.user.user_metadata?.role;
    if (!role) return "/profile";
    if (role === "motorista") return "/driver";
    if (role === "olaria") return "/brickyard";
    return "/producer";
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar session={session} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to={getHomeRoute()} />} />
          
          <Route path="/producer" element={
            !session ? <Navigate to="/auth" /> : 
            session.user.user_metadata?.role === "batedor" ? <ProducerPage /> : <Navigate to={getHomeRoute()} />
          } />
          
          <Route path="/driver" element={
            !session ? <Navigate to="/auth" /> : 
            session.user.user_metadata?.role === "motorista" ? <DriverPage /> : <Navigate to={getHomeRoute()} />
          } />
          
          <Route path="/brickyard" element={
            !session ? <Navigate to="/auth" /> : 
            session.user.user_metadata?.role === "olaria" ? <BrickyardPage /> : <Navigate to={getHomeRoute()} />
          } />

          <Route path="/history" element={!session ? <Navigate to="/auth" /> : <HistoryPage />} />

          <Route path="/profile" element={!session ? <Navigate to="/auth" /> : <ProfilePage />} />

          <Route path="*" element={<Navigate to={getHomeRoute()} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}