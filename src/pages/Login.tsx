
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn, UserPlus, Github, Globe } from "lucide-react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import GlowingButton from "@/components/GlowingButton";
import { Input } from "@/components/ui/input";
import Web3WalletButton from "@/components/Web3WalletButton";
import { useSignIn, useUser, useClerk, SignIn } from "@clerk/clerk-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithProvider, loading, authError } = useAuth();
  const { isLoaded: isClerkLoaded, signIn } = useSignIn();
  const { user: clerkUser, isSignedIn } = useUser();
  const navigate = useNavigate();
  
  // Check if user is already signed in with Clerk
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      console.log('User already signed in with Clerk:', clerkUser.id);
      
      // Check if the user has a connected wallet
      const web3Wallets = clerkUser.web3Wallets;
      if (web3Wallets && web3Wallets.length > 0) {
        const walletAddress = web3Wallets[0].web3Wallet;
        console.log('User has connected wallet:', walletAddress);
        
        // Automatically log in with the connected wallet
        loginWithProvider('wallet', { address: walletAddress });
        navigate('/dashboard');
      }
    }
  }, [isSignedIn, clerkUser, loginWithProvider, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isClerkLoaded || !signIn) {
      toast.error("Authentication system is not ready");
      return;
    }
    
    try {
      // Use Clerk's sign-in with email/password
      const result = await signIn.create({
        identifier: email,
        password: password
      });
      
      if (result.status === "complete") {
        // After successful Clerk authentication, integrate with our auth context
        await login(email, password);
        toast.success("Successfully logged in");
        navigate('/dashboard');
      } else if (result.status === "needs_second_factor") {
        // Handle 2FA if enabled
        toast.info("Please complete two-factor authentication");
      } else if (result.status === "needs_identifier" || result.status === "needs_first_factor") {
        toast.error("Please provide both email and password");
      } else {
        // Handle other statuses
        console.log("Sign-in status:", result.status);
      }
    } catch (error) {
      console.error('Error during Clerk authentication:', error);
      toast.error('Authentication failed. Please check your credentials.');
    }
  };
  
  const handleProviderLogin = async (provider: AuthProvider) => {
    if (!isClerkLoaded || !signIn) {
      toast.error("Authentication system is not ready");
      return;
    }
    
    try {
      // Use Clerk's OAuth sign-in
      if (provider === 'google') {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.href,
          redirectUrlComplete: '/dashboard'
        });
      } else if (provider === 'github') {
        try {
          await signIn.authenticateWithRedirect({
            strategy: 'oauth_github',
            redirectUrl: window.location.href,
            redirectUrlComplete: '/dashboard'
          });
        } catch (error) {
          console.error('GitHub OAuth error:', error);
          // Fall back to our custom auth implementation if Clerk's GitHub OAuth fails
          toast.info("Using alternative GitHub authentication method");
          await loginWithProvider(provider);
        }
      } else if (provider === 'wallet') {
        // For wallet authentication, we'll use the Web3WalletButton component
        // which handles the connection and authentication process
        toast.info("Please select a wallet provider");
      } else {
        // Fall back to our existing auth implementation for other providers
        await loginWithProvider(provider);
      }
    } catch (error) {
      console.error(`Error during ${provider} login:`, error);
      toast.error(`${provider} login failed`);
    }
  };
  
  const handleWalletLogin = async (address: string) => {
    try {
      if (!address) {
        // If wallet was disconnected
        return;
      }
      
      console.log('Attempting to login with wallet address:', address);
      
      // First authenticate with Clerk using the wallet address
      if (isClerkLoaded && signIn) {
        try {
          // Now we're using the real Clerk Web3 authentication
          // The actual signature process happens in the useWeb3Auth hook
          // Here we just need to handle the successful authentication
          
          // After successful Clerk authentication, integrate with our auth context
          await loginWithProvider('wallet', { address });
          toast.success(`Authenticated with wallet: ${address.slice(0, 6)}...${address.slice(-4)}`);
          
          // Navigate to dashboard after successful login
          navigate('/dashboard');
        } catch (error) {
          console.error('Error during Clerk Web3 authentication:', error);
          toast.error('Failed to authenticate with Clerk');
        }
      }
    } catch (error) {
      console.error('Error during wallet login:', error);
      toast.error('Wallet login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black to-gray-900">
      <div className="w-full max-w-md relative">
        {/* Background elements */}
        <div className="absolute inset-0 blur-3xl -z-10 bg-aries-purple/10 rounded-xl"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-aries-purple to-aries-blue rounded-xl opacity-20"></div>
        
        {/* Login form */}
        <div className="relative bg-black/60 backdrop-blur-xl p-8 rounded-lg border border-white/10 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-aries-purple to-aries-blue flex items-center justify-center">
              <span className="font-bold text-2xl text-white">A</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Login to Aries
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900/50 border-gray-800 text-white"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900/50 border-gray-800 text-white"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-aries-purple hover:text-aries-blue transition-colors">
                Forgot password?
              </Link>
            </div>
            
            <GlowingButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </div>
              )}
            </GlowingButton>
            
            {authError && (
              <div className="p-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-200">
                {authError}
              </div>
            )}
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black/60 px-2 text-xs text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleProviderLogin("google")}
              className="flex justify-center items-center gap-2 py-2 px-4 bg-gray-800/50 hover:bg-gray-700/50 transition-colors rounded-lg border border-white/10"
              disabled={loading}
            >
              <Globe className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => {
                toast.info("Connecting to GitHub...");
                handleProviderLogin("github");
              }}
              className="flex justify-center items-center gap-2 py-2 px-4 bg-gray-800/50 hover:bg-gray-700/50 transition-colors rounded-lg border border-white/10"
              disabled={loading}
            >
              <Github className="w-4 h-4 text-white" />
            </button>
            <div className="flex justify-center items-center">
              <Web3WalletButton 
                onSuccess={handleWalletLogin}
                className="w-full h-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-white/10"
              />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">Don't have an account?</span>
            <Link to="/register" className="flex items-center gap-1 justify-center text-aries-purple hover:text-aries-blue transition-colors mt-2">
              <UserPlus className="w-4 h-4" /> 
              <span>Create Account</span>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <Link to="/" className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-1">
              <ArrowRight className="w-3 h-3" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
