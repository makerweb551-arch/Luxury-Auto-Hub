import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function HeroSearch() {
  const [, setLocation] = useLocation();
  const [make, setMake] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (make.trim()) {
      setLocation(`/listings?make=${encodeURIComponent(make.trim())}`);
    } else {
      setLocation("/listings");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-3 p-2 bg-background/20 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl max-w-2xl w-full"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by make (e.g., Porsche, Mercedes-Benz)..."
          className="w-full pl-12 pr-4 h-14 bg-background/80 border-none text-base focus-visible:ring-1 focus-visible:ring-primary rounded-md"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="h-14 px-8 text-base font-medium">
        Search Inventory
      </Button>
    </form>
  );
}
