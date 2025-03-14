
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import ConnectWallet from "./ConnectWallet";
import { Book, Lightbulb, LayoutDashboard, Menu, X, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: <Lightbulb className="h-4 w-4 mr-1" /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-1" /> },
    { name: "Modules", path: "/modules", icon: <Book className="h-4 w-4 mr-1" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6",
        isScrolled
          ? "py-2 backdrop-blur-lg bg-background/80 border-b border-border shadow-sm"
          : "py-4 bg-transparent"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center animate-pulse-soft group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-4 w-4 text-white absolute -top-2 -right-1 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce" />
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-xl text-foreground">
            Edu<span className="text-primary relative inline-block">
              Quest
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors relative overflow-hidden group",
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}
            >
              {link.icon}
              {link.name}
              {location.pathname !== link.path && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              )}
            </Link>
          ))}
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <ConnectWallet />
        </div>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle className="h-9 w-9" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground animate-in fade-in zoom-in" />
            ) : (
              <Menu className="h-5 w-5 text-foreground animate-in fade-in zoom-in" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card animate-slide-down fixed top-[62px] left-0 right-0 border-t z-40">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-lg flex items-center text-sm font-medium transition-colors animate-fade-in",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="pt-2 pb-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <ConnectWallet className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
