import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChartBar, Search, Shield, BarChart, Layers } from "lucide-react";
import GlowingButton from "@/components/GlowingButton";
import FeatureCard from "@/components/FeatureCard";
import EthereumGlobe from "@/components/EthereumGlobe";
import FloatingIcons from "@/components/FloatingIcons";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="py-6 px-8 flex justify-between items-center relative z-10 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aries-purple to-aries-blue flex items-center justify-center">
            <span className="font-bold text-white">A</span>
          </div>
          <span className="font-bold text-xl">Aries</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#about" className="text-sm text-gray-300 hover:text-white transition-colors">About</a>
          <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Blog</a>
        </div>
        <div className="flex gap-4">
          <SignedIn>
            <Link to="/dashboard">
              <GlowingButton size="sm">Dashboard</GlowingButton>
            </Link>
          </SignedIn>
          <SignedOut>
            
            <Link to="/sign-up">
              <GlowingButton size="sm">Get Started</GlowingButton>
            </Link>
          </SignedOut>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative py-20 md:py-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <FloatingIcons />
        <div className="bg-hero-gradient absolute inset-0 z-0" />
        
        {/* Animated entry */}
        <div
          className={`relative z-10 max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text glow-text">
            Aries: DeFi Analysis Engine
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Revolutionizing DeFi Analysis with Intelligence and Insight.
            Visualize your portfolio like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <GlowingButton size="lg" className="flex items-center gap-2 whitespace-nowrap">
                <span className="flex items-center">Get Started <ArrowRight className="w-5 h-5 ml-1" /></span>
              </GlowingButton>
            </Link>
            <a href="#features">
              <GlowingButton size="lg" variant="secondary">
                Explore Features
              </GlowingButton>
            </a>
          </div>
        </div>

        {/* 3D Globe */}
        <div className="w-full h-[400px] mt-16">
          <EthereumGlobe />
        </div>
      </section>

      {/* About section */}
      <section id="about" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">About Aries</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              In the rapidly evolving DeFi landscape, making informed decisions is crucial. 
              Aries provides cutting-edge analysis tools to help you navigate the complexities 
              of decentralized finance with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Why Analysis Matters</h3>
              <p className="text-gray-400 mb-4">
                The DeFi ecosystem offers unprecedented opportunities but comes with complex risks.
                Our hybrid portfolio management system gives you the complete picture across both 
                traditional and decentralized finance.
              </p>
              <p className="text-gray-400 mb-6">
                Aries bridges the gap between fiat and crypto analysis, providing a unified view
                of your financial landscape with advanced risk visualization.
              </p>
              <GlowingButton 
                variant="secondary" 
                className="flex items-center gap-2"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </GlowingButton>
            </div>
            <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-black/40 to-aries-purple/10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-aries-purple/20 flex items-center justify-center">
                    <ChartBar className="w-5 h-5 text-aries-purple" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Data-Driven Insights</h4>
                    <p className="text-sm text-gray-400">Advanced analytics for informed decisions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-aries-blue/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-aries-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Risk Management</h4>
                    <p className="text-sm text-gray-400">Visualize and mitigate potential risks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-aries-purple/20 flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-aries-purple" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Portfolio Optimization</h4>
                    <p className="text-sm text-gray-400">Balance and enhance your investments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 px-6 relative bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Feature Highlights</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore the powerful tools that Aries provides to revolutionize your DeFi experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Smart Contract Analysis"
              description="Deep dive into contract security, gas efficiency, and interaction patterns with our advanced analysis tools."
              icon={<Search className="w-10 h-10" />}
            />
            <FeatureCard 
              title="Yield & Trend Analysis"
              description="Track historical performance and predict future trends with our AI-powered analytics engine."
              icon={<ChartBar className="w-10 h-10" />}
            />
            <FeatureCard 
              title="XP Risk Visualization"
              description="Experience immersive 3D visualizations of your portfolio risk exposure across the DeFi ecosystem."
              icon={<Layers className="w-10 h-10" />}
            />
            <FeatureCard 
              title="Fiat-Crypto Hybrid Profiles"
              description="Unify your traditional and crypto portfolios for comprehensive risk assessment and optimization."
              icon={<BarChart className="w-10 h-10" />}
            />
            <FeatureCard 
              title="Privacy-Preserving Architecture"
              description="Your data stays yours with our advanced security protocols and zero-knowledge infrastructure."
              icon={<Shield className="w-10 h-10" />}
            />
            <div className="feature-card flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-aries-purple to-aries-blue flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">+</span>
              </div>
              <p className="text-lg text-gray-300">More features coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto glass-card rounded-2xl overflow-hidden">
          <div className="p-10 md:p-16 bg-gradient-to-br from-aries-purple/20 to-aries-blue/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Transform Your DeFi Experience?</h2>
                <p className="text-gray-300 mb-6">
                  Join Aries today and unlock powerful insights into your crypto portfolio.
                  Start making data-driven decisions with confidence.
                </p>
                <div className="flex gap-4">
                  <Link to="/sign-up">
                    <GlowingButton size="lg" className="whitespace-nowrap">Get Started</GlowingButton>
                  </Link>
                  <a href="mailto:aakifmudel@gmail.com">
                    <GlowingButton variant="secondary" size="lg" className="whitespace-nowrap">Contact Us</GlowingButton>
                  </a>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-aries-purple to-aries-blue rounded-full opacity-20 animate-pulse-soft"></div>
                  <div className="absolute inset-4 border-2 border-white/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-aries-purple to-aries-blue flex items-center justify-center">
                      <span className="font-bold text-2xl text-white">A</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aries-purple to-aries-blue flex items-center justify-center">
                  <span className="font-bold text-white">A</span>
                </div>
                <span className="font-bold text-xl">Aries</span>
              </div>
              <p className="text-gray-400 text-sm">Revolutionizing DeFi Analysis with Intelligence and Insight</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-sm">X</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-sm">D</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-sm">T</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 Aries DeFi Analysis Engine. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white text-sm">GitHub</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
