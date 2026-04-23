import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateCar } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const sellSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  trim: z.string().optional(),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  priceBhd: z.coerce.number().min(1, "Price must be greater than 0"),
  mileageKm: z.coerce.number().min(0, "Mileage cannot be negative"),
  fuel: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  transmission: z.enum(["automatic", "manual"]),
  bodyType: z.enum(["sedan", "suv", "coupe", "hatchback", "convertible", "pickup", "van", "wagon"]),
  color: z.string().min(1, "Color is required"),
  condition: z.enum(["new", "used"]),
  location: z.string().min(1, "Location is required"),
  sellerName: z.string().min(2, "Name is required"),
  sellerPhone: z.string().min(8, "Phone is required"),
  description: z.string().min(20, "Provide a detailed description"),
  images: z.array(z.string().url()).min(1, "At least one image URL is required"),
});

export function Sell() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createCar = useCreateCar();
  const [images, setImages] = useState<string[]>([""]);

  const form = useForm<z.infer<typeof sellSchema>>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      make: "", model: "", trim: "", year: new Date().getFullYear(),
      priceBhd: 0, mileageKm: 0, fuel: "petrol", transmission: "automatic",
      bodyType: "sedan", color: "", condition: "used", location: "Capital",
      sellerName: "", sellerPhone: "", description: "", images: []
    }
  });

  const onSubmit = (values: z.infer<typeof sellSchema>) => {
    // filter out empty image strings
    const finalImages = images.filter(img => img.trim() !== "");
    if (finalImages.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "Please provide at least one valid image URL" });
      return;
    }

    createCar.mutate({
      data: { ...values, images: finalImages }
    }, {
      onSuccess: (car) => {
        toast({ title: "Success", description: "Your vehicle has been listed!" });
        setLocation(`/listings/${car.id}`);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to list vehicle" });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Sell Your Vehicle</h1>
          <p className="text-xl text-muted-foreground">List your luxury vehicle on Bahrain's premier automotive marketplace.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Vehicle Details Section */}
            <section className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6 pb-4 border-b border-border">Vehicle Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="make" render={({ field }) => (
                  <FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g. Porsche" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="model" render={({ field }) => (
                  <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g. 911" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="trim" render={({ field }) => (
                  <FormItem><FormLabel>Trim (Optional)</FormLabel><FormControl><Input placeholder="e.g. Carrera S" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="year" render={({ field }) => (
                  <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bodyType" render={({ field }) => (
                  <FormItem><FormLabel>Body Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {["sedan", "suv", "coupe", "hatchback", "convertible", "pickup", "van", "wagon"].map(t => (
                          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="color" render={({ field }) => (
                  <FormItem><FormLabel>Color</FormLabel><FormControl><Input placeholder="e.g. Jet Black Metallic" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </section>

            {/* Specifications Section */}
            <section className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6 pb-4 border-b border-border">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="condition" render={({ field }) => (
                  <FormItem><FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="new">Brand New</SelectItem>
                        <SelectItem value="used">Pre-owned</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="mileageKm" render={({ field }) => (
                  <FormItem><FormLabel>Mileage (km)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fuel" render={({ field }) => (
                  <FormItem><FormLabel>Fuel Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select fuel" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {["petrol", "diesel", "hybrid", "electric"].map(t => (
                          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="transmission" render={({ field }) => (
                  <FormItem><FormLabel>Transmission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select transmission" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
              </div>
            </section>

            {/* Pricing & Description */}
            <section className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6 pb-4 border-b border-border">Listing Details</h2>
              <div className="space-y-6">
                <FormField control={form.control} name="priceBhd" render={({ field }) => (
                  <FormItem><FormLabel>Price (BHD)</FormLabel><FormControl><Input type="number" className="text-xl font-bold text-primary" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Detailed Description</FormLabel><FormControl><Textarea rows={6} placeholder="Describe the vehicle's history, features, and condition..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <div>
                  <FormLabel className="mb-4 block">Vehicle Images (URLs)</FormLabel>
                  <div className="space-y-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          value={img} 
                          onChange={(e) => {
                            const newImages = [...images];
                            newImages[idx] = e.target.value;
                            setImages(newImages);
                            form.setValue("images", newImages.filter(i => i.trim() !== ""));
                          }} 
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            const newImages = images.filter((_, i) => i !== idx);
                            setImages(newImages.length ? newImages : [""]);
                            form.setValue("images", newImages.filter(i => i.trim() !== ""));
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setImages([...images, ""])}
                      className="w-full border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Another Image
                    </Button>
                  </div>
                  {form.formState.errors.images && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.images.message}</p>}
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6 pb-4 border-b border-border">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="sellerName" render={({ field }) => (
                  <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sellerPhone" render={({ field }) => (
                  <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Governorate</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {["Capital", "Muharraq", "Northern", "Southern"].map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
              </div>
            </section>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" size="lg" className="w-full md:w-auto px-12 text-lg h-14" disabled={createCar.isPending}>
                {createCar.isPending ? "Submitting Listing..." : "List Vehicle"}
              </Button>
            </div>
          </form>
        </Form>
      </main>

      <SiteFooter />
    </div>
  );
}
