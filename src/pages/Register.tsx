import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import GlowingButton from "@/components/GlowingButton";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useSignUp, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useAuth();
  const { isLoaded: isClerkLoaded, signUp } = useSignUp();
  const { client } = useClerk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!name) {
      setError("Name is required");
      return;
    }
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!password) {
      setError("Password is required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!isClerkLoaded || !signUp) {
        setError("Registration system is not ready");
        setIsSubmitting(false);
        return;
      }
      
      // Create a new user with Clerk
      const result = await signUp.create({
        firstName: name.split(' ')[0],
        lastName: name.includes(' ') ? name.split(' ').slice(1).join(' ') : '',
        emailAddress: email,
        password: password
      });
      
      if (result.status === "complete") {
        // Sign in the user immediately after successful registration
        await client.signIn.create({
          identifier: email,
          password: password
        });
        
        // Also log in with our auth context
        await login(email, password);
        
        toast.success("Account created successfully!");
        navigate('/dashboard');
      } else if (result.status === "missing_requirements") {
        // Handle email verification or other requirements
        toast.info("Please complete all required steps to finish registration");
      } else {
        // Handle other statuses
        console.log("Sign-up status:", result.status);
        setError("Please complete the registration process");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-aries-purple to-aries-blue flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-2xl">A</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Join Aries and start exploring DeFi analytics</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <Input
              icon={<User className="w-5 h-5 text-gray-500" />}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <Input
              icon={<Mail className="w-5 h-5 text-gray-500" />}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              icon={<Lock className="w-5 h-5 text-gray-500" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Input
              icon={<Lock className="w-5 h-5 text-gray-500" />}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <GlowingButton
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </GlowingButton>
            
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-aries-purple hover:text-aries-blue transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
