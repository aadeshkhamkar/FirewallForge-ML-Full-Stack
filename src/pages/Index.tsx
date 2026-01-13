// src/pages/Index.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // or a small loader

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default Index;
