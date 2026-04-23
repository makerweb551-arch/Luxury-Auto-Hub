import { Link } from "wouter";

export function SiteFooter() {
  const governorates = ["Capital", "Muharraq", "Northern", "Southern"];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <div className="flex flex-col cursor-pointer mb-4 w-fit">
                <span className="font-serif text-2xl font-bold tracking-tight uppercase leading-none text-foreground">
                  Auto List
                </span>
                <span className="text-xs tracking-widest text-primary uppercase font-bold">
                  Bahrain
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              The Kingdom's premier destination for high-end and luxury vehicles.
              Experience the showroom from anywhere.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/listings" className="hover:text-primary transition-colors">
                  All Listings
                </Link>
              </li>
              <li>
                <Link href="/listings?condition=new" className="hover:text-primary transition-colors">
                  New Cars
                </Link>
              </li>
              <li>
                <Link href="/listings?condition=used" className="hover:text-primary transition-colors">
                  Pre-owned
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-primary transition-colors">
                  Sell Your Car
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4 text-foreground">Locations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {governorates.map((gov) => (
                <li key={gov}>{gov} Governorate</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} Auto List Bahrain. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
