import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "./Auth";
export default function AuthStatus() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  function UserSignOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/");
    });
  }

  if (!user) return <Link to="/login">Login</Link>;
  return <button onClick={UserSignOut}>Sign Out</button>;
}
