import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";


type AuthStateType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthState = createContext<AuthStateType | null>(null);

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "demo123";
const STORAGE_KEY = "pingo_demo_auth";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (!storedAuth) return;
    try {
      const parsedAuth = JSON.parse(storedAuth);
      if (parsedAuth.isAuthenticated) {
        setIsAuthenticated(true);
        setUsername(parsedAuth.username ?? null);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  async function login(usernameInput: string, passwordInput: string) {
    const cleanUsername = usernameInput.trim();
    const cleanPassword = passwordInput.trim();

    if (cleanUsername !== DEMO_USERNAME || cleanPassword !== DEMO_PASSWORD) {
      throw new Error("Invalid demo credentials.");
    };

    const authState = {
      isAuthenticated: true,
      username: cleanUsername,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    setIsAuthenticated(true);
    setUsername(cleanUsername);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setUsername(null);
  }

  return (
    <AuthState.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthState.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthState);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}