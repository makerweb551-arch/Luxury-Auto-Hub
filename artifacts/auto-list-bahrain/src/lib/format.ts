import React from "react";

export function formatBhd(amount: number) {
  return "BHD " + amount.toLocaleString("en-BH", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  });
}

export function formatMileage(km: number) {
  return km.toLocaleString() + " km";
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
