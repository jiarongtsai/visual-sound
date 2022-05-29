import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Loader from "../Loader";
import { AuthContext } from "./Auth";

export default function RequireAuth({ children }) {
  const [user, loading, error] = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
