
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/api/client";

interface User {
  id: number;
  email: string;
  username: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("refreshToken", response.refresh);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("isLoggedIn", "true");
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register({
        username: userData.email,
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName
      });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
      // Optionally auto-login after registration
      // localStorage.setItem("authToken", response.tokens.access);
      // localStorage.setItem("refreshToken", response.tokens.refresh);
      // localStorage.setItem("user", JSON.stringify(response.user));
      // setUser(response.user);
      // setIsAuthenticated(true);
      // navigate("/products");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
