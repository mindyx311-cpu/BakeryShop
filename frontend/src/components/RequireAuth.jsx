// src/components/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth.js';


export default function RequireAuth({ children }) {
  const auth = useAuth();             
  const user = auth?.user || null;
  const location = useLocation();

  // Redirecting to /login if not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render child components when logged in
  return children;
}
