import { z } from "zod";

export const BUDGET_BANDS = ["under-1500", "1500-3000", "3000-5000", "over-5000"] as const;
export const PACES = ["relaxed", "balanced", "packed"] as const;
export const INTERESTS = [
  "history", "food", "desert", "coast", "mountains", "photography", "shopping", "family", "wellness",
] as const;

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const leadSchema = z
  .object({
    tripType: z.enum(["tailor-made", "itinerary"]),
    itinerarySlug: z.string().max(120).optional().nullable(),
    regionSlug: z.string().max(120).optional().nullable(),
    startDate: z.string().max(20).optional().nullable(),
    endDate: z.string().max(20).optional().nullable(),
    flexibleDates: z.boolean().default(false),
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(20),
    infants: z.number().int().min(0).max(10),
    budgetBand: z.enum(BUDGET_BANDS),
    pace: z.enum(PACES),
    interests: z.array(z.enum(INTERESTS)).min(1).max(9),
    fullName: z.string().min(2).max(120),
    email: z.string().regex(emailRe, "Enter a valid email").max(160),
    phone: z.string().max(40).optional().nullable(),
    notes: z.string().max(2000).optional().nullable(),
    locale: z.string().max(5).default("en"),
  })
  .refine((d) => d.tripType !== "itinerary" || !!d.itinerarySlug, {
    message: "Choose an itinerary",
    path: ["itinerarySlug"],
  });

export type LeadInput = z.infer<typeof leadSchema>;
