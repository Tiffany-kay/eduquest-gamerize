
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import ConnectWallet from "@/components/ConnectWallet";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowRight, Award, BookOpen, CheckCircle, Coins, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Index = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define the background shapes for animation
  const backgroundShapes = [
    { shape: "circle", size: "w-32 h-32", position: "top-20 left-10", animation: "animate-float", delay: "0s", opacity: "opacity-10" },
    { shape: "square", size: "w-24 h-24", position: "top-40 right-20", animation: "animate-bounce-soft", delay: "0.5s", opacity: "opacity-10" },
    { shape: "circle", size: "w-40 h-40", position: "bottom-20 left-40", animation: "animate-spin-slow", delay: "1s", opacity: "opacity-5" },
    { shape: "square", size: "w-16 h-16", position: "bottom-40 right-10", animation: "animate-float", delay: "1.5s", opacity: "opacity-10" },
    { shape: "circle", size: "w-20 h-20", position: "top-1/3 left-1/3", animation: "animate-bounce-soft", delay: "2s", opacity: "opacity-5" },
  ];

  const features = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Interactive Learning",
      description: "Engaging modules that make blockchain education fun and accessible for everyone.",
    },
    {
      icon: <Coins className="h-5 w-5" />,
      title: "Token Rewards",
      description: "Earn EDU tokens as you complete modules to use within the EduChain ecosystem.",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Achievement Badges",
      description: "Collect NFT badges that showcase your expertise and learning journey.",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Certified Skills",
      description: "Earn verifiable credentials that prove your blockchain knowledge on-chain.",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Animated background shapes */}
      {backgroundShapes.map((shape, index) => (
        <div
          key={index}
          className={cn(
            "absolute rounded-full z-0",
            shape.size,
            shape.position,
            shape.animation,
            shape.opacity,
            theme === "dark" ? "bg-purple-700" : "bg-purple-300"
          )}
          style={{ animationDelay: shape.delay }}
        />
      ))}

      {/* Header */}
      <header className="relative z-10 px-4 py-6 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-2xl">
            Edu<span className="text-purple-600 dark:text-purple-400">Quest</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <ConnectWallet />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium animate-fade-in">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Learning becomes an adventure with EduQuest</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Learn Blockchain, <br /> 
            <span className="text-gradient">Earn While You Learn</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Join the EduQuest platform where education meets gamification.
            Complete interactive modules, earn EDU tokens, and collect achievement NFTs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <ConnectWallet size="lg" className="w-full sm:w-auto" />
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                Explore Modules <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-muted/50 backdrop-blur-sm border-t px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduQuest?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-zoom-in"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-card border-t px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2023 EduQuest. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
