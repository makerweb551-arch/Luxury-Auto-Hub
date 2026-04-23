import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { 
  useGetMarketplaceSummary, 
  useGetFeaturedCars, 
  useGetMakes, 
  useGetBodyTypes, 
  useGetRecentCars 
} from "@workspace/api-client-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSearch } from "@/components/HeroSearch";
import { CarCard } from "@/components/CarCard";
import { formatBhd } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function Home() {
  const { data: summary } = useGetMarketplaceSummary({ query: { queryKey: ["/api/marketplace/summary"] } });
  const { data: featured } = useGetFeaturedCars({ query: { queryKey: ["/api/cars/featured"] } });
  const { data: makes } = useGetMakes({ query: { queryKey: ["/api/marketplace/makes"] } });
  const { data: bodyTypes } = useGetBodyTypes({ query: { queryKey: ["/api/marketplace/body-types"] } });
  const { data: recent } = useGetRecentCars({ limit: 8 }, { query: { queryKey: ["/api/cars/recent", { limit: 8 }] } });

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop" 
            alt="Luxury Car Showcase" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-background/40" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-tight">
              The Kingdom's Premier <br/> <span className="text-primary italic">Automotive</span> Collection
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
              Discover unparalleled luxury, performance, and heritage. Curated exclusively for discerning drivers in Bahrain.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <HeroSearch />
          </motion.div>
        </div>
      </section>

      {/* Market Stats */}
      {summary && (
        <section className="border-y border-border bg-card/30">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50 text-center">
              <div className="px-4">
                <p className="text-3xl font-serif font-bold text-primary">{summary.totalListings}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-semibold">Total Vehicles</p>
              </div>
              <div className="px-4">
                <p className="text-3xl font-serif font-bold text-primary">{formatBhd(summary.averagePriceBhd)}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-semibold">Average Value</p>
              </div>
              <div className="px-4">
                <p className="text-3xl font-serif font-bold text-primary">{summary.newCount}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-semibold">New Models</p>
              </div>
              <div className="px-4">
                <p className="text-3xl font-serif font-bold text-primary">{summary.makes}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-semibold">Global Marques</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Vehicles */}
      {featured && featured.length > 0 && (
        <section className="py-24 container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Featured Collection</h2>
              <p className="text-muted-foreground">Handpicked excellence from our showroom to you.</p>
            </div>
            <Link href="/listings?featured=true" className="hidden md:flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
              View all featured <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Browse by Make & Body Type */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Marques */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-8">Popular Marques</h2>
              <div className="flex flex-wrap gap-3">
                {makes?.map((make) => (
                  <Link key={make.make} href={`/listings?make=${encodeURIComponent(make.make)}`}>
                    <div className="px-5 py-3 rounded-full border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group text-sm font-medium flex items-center gap-2">
                      <span>{make.make}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary/70">
                        {make.count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Body Types */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-8">Body Styles</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {bodyTypes?.map((bt) => (
                  <Link key={bt.bodyType} href={`/listings?bodyType=${encodeURIComponent(bt.bodyType)}`}>
                    <div className="p-4 border border-border bg-background rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group flex flex-col items-center text-center">
                      <span className="capitalize font-medium mb-1">{bt.bodyType}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary/70">
                        {bt.count} vehicles
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Arrivals */}
      {recent && recent.length > 0 && (
        <section className="py-24 container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Recent Arrivals</h2>
              <p className="text-muted-foreground">The latest additions to the Kingdom's finest garage.</p>
            </div>
            <Link href="/listings?sort=newest" className="hidden md:flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
              View all inventory <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recent.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center md:hidden">
            <Link href="/listings">
              <Button variant="outline" className="w-full sm:w-auto">View All Inventory</Button>
            </Link>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
