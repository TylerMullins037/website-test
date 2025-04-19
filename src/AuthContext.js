import React, { createContext, useState, useContext } from "react";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use authentication
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to log in
  const login = () => {
    setIsAuthenticated(true);
  };

  // Function to log out
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};