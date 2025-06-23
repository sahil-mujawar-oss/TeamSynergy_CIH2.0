import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

// Define the AuthContext type to match the original AuthContext
type User = {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  profileImage?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: string, options?: { address?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Set up a demo token in localStorage for backward compatibility
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      // Create a mock token for backward compatibility with existing code
      localStorage.setItem('aries_token', 'demo_token_for_hackathon');
    } else {
      // Clear token when signed out
      localStorage.removeItem('aries_token');
    }
  }, [isSignedIn, clerkUser]);

  // Create a compatible user object from Clerk user
  const adaptedUser: User | null = clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.username || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    walletAddress: clerkUser.primaryWeb3Wallet?.web3Wallet || '',
    profileImage: clerkUser.imageUrl || ''
  } : null;

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  // Stub for the login function - Clerk handles this now
  const login = async () => {
    setAuthError(null);
    // This is just a stub - actual login is handled by Clerk components
  };

  // Stub for loginWithProvider - Clerk handles this now
  const loginWithProvider = async () => {
    setAuthError(null);
    // This is just a stub - actual login is handled by Clerk components
  };

  // Use Clerk's signOut method
  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user: adaptedUser,
        isAuthenticated: isSignedIn || false,
        loading,
        authError,
        login,
        loginWithProvider,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
