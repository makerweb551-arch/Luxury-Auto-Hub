import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled || !isHome
          ? "bg-background/80 backdrop-blur-md border-border py-4"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex flex-col cursor-pointer">
            <span className="font-serif text-xl font-bold tracking-tight uppercase leading-none">
              Auto List
            </span>
            <span className="text-[10px] tracking-widest text-primary uppercase font-bold">
              Bahrain
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/listings" className="text-sm font-medium hover:text-primary transition-colors">
            Browse Cars
          </Link>
          <Link href="/sell">
            <Button variant={isScrolled || !isHome ? "default" : "outline"} className={cn(!isScrolled && isHome && "bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground")}>
              Sell Your Car
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 shadow-xl">
          <Link
            href="/listings"
            className="text-lg font-medium p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Browse Cars
          </Link>
          <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full">Sell Your Car</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
