import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, User, Github, Globe } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  avatar?: string;
  provider?: string;
};

export type AuthProvider = "google" | "github" | "email" | "wallet";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: AuthProvider, options?: { address?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "aries_user";
const TOKEN_STORAGE_KEY = "aries_token";
const AUTH_PERSISTENCE_KEY = "aries_auth_state";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        const persistedAuth = localStorage.getItem(AUTH_PERSISTENCE_KEY);
        
        console.log("Checking auth state:", { hasStoredUser: !!storedUser, hasToken: !!token });
        
        if (storedUser && token) {
          // For hackathon demo: Skip token validation and just use the stored user
          try {
            // Parse the stored user without validating the token
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            // Persist authenticated state
            localStorage.setItem(AUTH_PERSISTENCE_KEY, "true");
            console.log("User authenticated from stored session (demo mode)");
          } catch (e) {
            console.error("Error parsing stored user:", e);
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(AUTH_PERSISTENCE_KEY);
          }
        } else if (persistedAuth === "true") {
          // If persistence key exists but actual data is missing, clear it
          localStorage.removeItem(AUTH_PERSISTENCE_KEY);
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(AUTH_PERSISTENCE_KEY);
      } finally {
        // Add a short delay before finishing the loading state
        // This prevents UI flashing and premature redirects
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Validation
      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      
      // For development, we'll use a mock login instead of calling the API
      // This is a temporary solution until the backend is fully set up
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        walletAddress: "0x" + Math.random().toString(36).substring(2, 40),
        provider: "email",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email.split('@')[0]}`,
      };
      
      // Generate mock token
      const mockToken = btoa(JSON.stringify({
        sub: mockUser.id,
        email: mockUser.email,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
      }));
      
      // Save user and token
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
      localStorage.setItem(AUTH_PERSISTENCE_KEY, "true");
      
      // Update state
      setUser(mockUser);
      toast.success("Login successful");
      
      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setAuthError(message);
      toast.error(message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = async (provider: AuthProvider, options?: { address?: string }) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Check if we're dealing with a wallet authentication
      if (provider === 'wallet' && options?.address) {
        // Handle wallet authentication
        const userData = {
          id: `wallet-${options.address.toLowerCase()}`,
          name: `Wallet ${options.address.slice(0, 6)}`,
          email: `${options.address.toLowerCase()}@wallet.eth`,
          walletAddress: options.address,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${options.address.slice(0, 6)}`,
          provider: 'wallet',
        };
        
        // Store user data in localStorage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_STORAGE_KEY, 'wallet-token-' + Date.now());
        localStorage.setItem(AUTH_PERSISTENCE_KEY, 'true');
        setUser(userData);
        setIsAuthenticated(true);
        toast.success(`Connected with wallet: ${options.address.slice(0, 6)}...${options.address.slice(-4)}`);
        navigate('/dashboard');
        return;
      }
      
      // For GitHub authentication, use a more reliable approach
      if (provider === 'github') {
        const userData = {
          id: `github-${Date.now()}`,
          name: "GitHub User",
          email: "github_user@example.com",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GH",
          provider: 'github',
        };
        
        // Store user data in localStorage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_STORAGE_KEY, 'github-token-' + Date.now());
        localStorage.setItem(AUTH_PERSISTENCE_KEY, 'true');
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('GitHub authentication successful');
        navigate('/dashboard');
        return;
      }
      
      // For other OAuth providers
      const providerData = {
        google: {
          name: "Google User",
          email: "google_user@gmail.com",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GO",
          provider: 'google',
        },
        email: {
          name: "Email User",
          email: "email_user@example.com",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EM",
          provider: 'email',
        },
        wallet: {
          name: options?.address ? `Wallet ${options.address.slice(0, 6)}` : "Wallet User",
          email: "crypto_wallet@example.com",
          walletAddress: options?.address || ("0x" + Math.random().toString(36).substring(2, 40)),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${options?.address?.slice(0, 6) || "WA"}`,
          provider: 'wallet',
        },
      };
      
      if (providerData[provider]) {
        const userData = providerData[provider];
        // Mock successful login
        const mockUser = {
          id: `${provider}_${Math.random().toString(36).substring(2, 9)}`,
          name: userData.name,
          email: userData.email,
          walletAddress: provider === "wallet" ? (userData as any).walletAddress : undefined,
          provider,
          avatar: userData.avatar,
        };
        
        // Generate mock token
        const mockToken = btoa(JSON.stringify({
          sub: mockUser.id,
          email: mockUser.email,
          provider,
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
        }));
        
        // Save user and token
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
        localStorage.setItem(AUTH_PERSISTENCE_KEY, "true");
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success(`Login with ${provider} successful`);
        
        // Navigate to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : `Login with ${provider} failed`;
      setAuthError(message);
      toast.error(message);
      console.error(`${provider} login error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_PERSISTENCE_KEY);
    // Clear user from state
    setUser(null);
    setIsAuthenticated(false);
    // Show success message
    toast.success("Logged out successfully");
    // Navigate to home page
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithProvider,
        logout,
        isAuthenticated,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
