import { useEffect, useState, createContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Firebase } from "../../utils/firebase";

const AuthContext = createContext(null);

const auth = Firebase.auth();

function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider value={[user, loading, error]}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
