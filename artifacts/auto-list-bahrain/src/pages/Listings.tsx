import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CarCard } from "@/components/CarCard";
import { useListCars } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function Listings() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    make: searchParams.get("make") || "all",
    bodyType: searchParams.get("bodyType") || "all",
    fuel: searchParams.get("fuel") || "all",
    transmission: searchParams.get("transmission") || "all",
    condition: searchParams.get("condition") || "all",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== "all") params.set(k, v);
    });
    setLocation(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      q: "", make: "all", bodyType: "all", fuel: "all", transmission: "all", 
      condition: "all", sort: "newest", minPrice: "", maxPrice: ""
    });
    setLocation("/listings");
  };

  const listParams = {
    ...(filters.q && { q: filters.q }),
    ...(filters.make !== "all" && { make: filters.make }),
    ...(filters.bodyType !== "all" && { bodyType: filters.bodyType }),
    ...(filters.fuel !== "all" && { fuel: filters.fuel }),
    ...(filters.transmission !== "all" && { transmission: filters.transmission }),
    ...(filters.condition !== "all" && { condition: filters.condition as any }),
    ...(filters.sort && { sort: filters.sort as any }),
    ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
    ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) }),
    limit: 24,
    offset: 0
  };

  const { data, isLoading } = useListCars(listParams, {
    query: { queryKey: ["/api/cars", listParams] }
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input 
          placeholder="Model, trim, keywords..." 
          value={filters.q} 
          onChange={e => updateFilter("q", e.target.value)} 
        />
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select value={filters.condition} onValueChange={v => updateFilter("condition", v)}>
          <SelectTrigger><SelectValue placeholder="Any Condition" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Condition</SelectItem>
            <SelectItem value="new">Brand New</SelectItem>
            <SelectItem value="used">Pre-owned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Make</Label>
        <Input 
          placeholder="e.g. Porsche" 
          value={filters.make === "all" ? "" : filters.make} 
          onChange={e => updateFilter("make", e.target.value || "all")} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price (BHD)</Label>
          <Input type="number" placeholder="0" value={filters.minPrice} onChange={e => updateFilter("minPrice", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Max Price (BHD)</Label>
          <Input type="number" placeholder="Any" value={filters.maxPrice} onChange={e => updateFilter("maxPrice", e.target.value)} />
        </div>
      </div>

      <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
      <Button variant="outline" className="w-full" onClick={clearFilters}>Clear All</Button>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold">Inventory</h1>
            <p className="text-muted-foreground mt-2">
              {data ? `Showing ${data.items.length} of ${data.total} vehicles` : "Loading inventory..."}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden flex-1">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[340px] overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filter Inventory</SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>

            <Select value={filters.sort} onValueChange={v => { updateFilter("sort", v); applyFilters(); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="year_desc">Year: Newest First</SelectItem>
                <SelectItem value="mileage_asc">Mileage: Lowest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6 font-serif font-bold text-lg">
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </div>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="animate-pulse bg-card rounded-xl h-[400px]" />
                ))}
              </div>
            ) : data && data.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-card/30 rounded-xl border border-border border-dashed">
                <h3 className="font-serif text-2xl font-bold mb-2">No vehicles found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any vehicles matching your current criteria. Try adjusting your filters or clearing them completely.
                </p>
                <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
