import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetCar, useGetSimilarCars, useCreateInquiry } from "@workspace/api-client-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ImageGallery } from "@/components/ImageGallery";
import { CarCard } from "@/components/CarCard";
import { formatBhd, formatMileage } from "@/lib/format";
import { MapPin, Calendar, Gauge, Fuel, Settings, User, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  message: z.string().min(10, "Please provide a brief message")
});

export function ListingDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();

  const { data: car, isLoading } = useGetCar(id, { 
    query: { enabled: !!id, queryKey: ["/api/cars", id] } 
  });
  
  const { data: similar } = useGetSimilarCars(id, { 
    query: { enabled: !!id, queryKey: ["/api/cars/similar", id] } 
  });

  const createInquiry = useCreateInquiry();

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", phone: "", email: "", message: "I am interested in this vehicle and would like to arrange a viewing." }
  });

  const onSubmit = (values: z.infer<typeof inquirySchema>) => {
    createInquiry.mutate({
      data: { carId: id, ...values }
    }, {
      onSuccess: () => {
        toast({
          title: "Inquiry Sent",
          description: "The seller will contact you shortly.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send inquiry. Please try again."
        });
      }
    });
  };

  if (isLoading) return <div className="min-h-screen bg-background pt-24"><div className="container mx-auto px-4">Loading...</div></div>;
  if (!car) return <div className="min-h-screen bg-background pt-24"><div className="container mx-auto px-4">Vehicle not found.</div></div>;

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/listings" className="hover:text-primary">Inventory</Link>
                <ChevronRight className="w-3 h-3" />
                <span>{car.make}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">{car.model}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                {car.year} {car.make} {car.model} {car.trim}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <span className="text-3xl font-sans font-bold text-primary">{formatBhd(car.priceBhd)}</span>
                <div className="flex items-center gap-2 text-muted-foreground bg-card px-3 py-1.5 rounded-full border border-border">
                  <MapPin className="w-4 h-4 text-primary" /> {car.location}
                </div>
                {car.condition === "new" && (
                  <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                    Brand New
                  </span>
                )}
              </div>
            </div>

            <ImageGallery images={car.images} />

            <section className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                <SpecItem icon={<Gauge />} label="Mileage" value={formatMileage(car.mileageKm)} />
                <SpecItem icon={<Calendar />} label="Year" value={car.year.toString()} />
                <SpecItem icon={<Fuel />} label="Fuel Type" value={car.fuel} />
                <SpecItem icon={<Settings />} label="Transmission" value={car.transmission} />
                <SpecItem label="Body Type" value={car.bodyType} />
                <SpecItem label="Color" value={car.color} />
              </div>
            </section>

            <section className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Description</h2>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                {car.description}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-xl p-6 shadow-xl shadow-black/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listed by</p>
                    <p className="font-serif font-bold text-lg">{car.sellerName}</p>
                  </div>
                </div>

                <a href={`tel:${car.sellerPhone}`} className="block w-full">
                  <Button size="lg" className="w-full mb-6 text-lg font-bold h-14">
                    <Phone className="w-5 h-5 mr-2" /> {car.sellerPhone}
                  </Button>
                </a>

                <Separator className="mb-6" />

                <h3 className="font-serif font-bold text-xl mb-4">Send Inquiry</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Your Name" {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Phone Number" {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Email (Optional)" {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl><Textarea placeholder="Message" rows={4} {...field} className="bg-background resize-none" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant="secondary" className="w-full" disabled={createInquiry.isPending}>
                      {createInquiry.isPending ? "Sending..." : "Message Seller"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>

        {similar && similar.length > 0 && (
          <section className="mt-24 pt-12 border-t border-border">
            <h2 className="text-3xl font-serif font-bold mb-8">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.slice(0, 4).map(c => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon?: React.ReactNode, label: string, value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        {icon && <span className="text-primary/70">{icon}</span>}
        {label}
      </div>
      <div className="font-medium capitalize text-lg">{value}</div>
    </div>
  );
}

function ChevronRight(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
}
