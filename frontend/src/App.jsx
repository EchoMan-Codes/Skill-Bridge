import { useRef, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChatSidebar from './components/ChatSidebar';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';

function AppRoutes() {
  const lenisRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisRef.current = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user && <ChatSidebar />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
