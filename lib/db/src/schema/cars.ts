import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const carsTable = pgTable("cars", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  trim: text("trim"),
  year: integer("year").notNull(),
  priceBhd: numeric("price_bhd", { precision: 12, scale: 2 }).notNull(),
  mileageKm: integer("mileage_km").notNull(),
  fuel: text("fuel").notNull(),
  transmission: text("transmission").notNull(),
  bodyType: text("body_type").notNull(),
  color: text("color").notNull(),
  condition: text("condition").notNull(),
  location: text("location").notNull(),
  sellerName: text("seller_name").notNull(),
  sellerPhone: text("seller_phone").notNull(),
  description: text("description").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Car = typeof carsTable.$inferSelect;
export type NewCar = typeof carsTable.$inferInsert;

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  carId: integer("car_id")
    .notNull()
    .references(() => carsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Inquiry = typeof inquiriesTable.$inferSelect;
export type NewInquiry = typeof inquiriesTable.$inferInsert;
