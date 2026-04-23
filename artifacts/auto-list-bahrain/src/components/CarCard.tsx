import { Car } from "@workspace/api-client-react";
import { formatBhd, formatMileage } from "@/lib/format";
import { Calendar, Gauge, MapPin, Fuel, Settings } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export function CarCard({ car }: { car: Car }) {
  const leadImage = car.images?.[0] || "https://placehold.co/600x400/2a2a2a/ffffff?text=No+Image";

  return (
    <Link href={`/listings/${car.id}`}>
      <Card className="overflow-hidden group hover-elevate border-border bg-card/50 transition-all cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={leadImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {car.condition === "new" && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider uppercase text-[10px]">
                Brand New
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2">
              {car.year} {car.make} {car.model} {car.trim}
            </h3>
            <span className="font-sans font-bold text-primary whitespace-nowrap ml-4">
              {formatBhd(car.priceBhd)}
            </span>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                <span>{formatMileage(car.mileageKm)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{car.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
              <Badge variant="secondary" className="bg-secondary/50 font-normal text-xs gap-1.5 px-2 py-0.5 rounded">
                <Fuel className="w-3 h-3" />
                <span className="capitalize">{car.fuel}</span>
              </Badge>
              <Badge variant="secondary" className="bg-secondary/50 font-normal text-xs gap-1.5 px-2 py-0.5 rounded">
                <Settings className="w-3 h-3" />
                <span className="capitalize">{car.transmission}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
