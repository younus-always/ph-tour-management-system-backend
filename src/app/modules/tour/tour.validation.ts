import z from "zod";

export const createTourTypeZodSchema = z.object({
      name: z.string()
});

export const createTourZodSchema = z.object({
      title: z.string(),
      images: z.array(z.string()),
      description: z.string(),
      location: z.string(),
      tourType: z.string(), // <- changed here
      costFrom: z.number(),
      startDate: z.string(),
      endDate: z.string(),
      included: z.array(z.string()),
      excluded: z.array(z.string()),
      amenities: z.array(z.string()),
      tourPlan: z.array(z.string()),
      maxGuest: z.number(),
      minAge: z.number(),
      division: z.string()
});

export const updateTourZodSchema = z.object({
      title: z.string().optional(),
      images: z.array(z.string()).optional(),
      description: z.string().optional(),
      location: z.string().optional(),
      tourType: z.string().optional(), // <- changed here
      costFrom: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      included: z.array(z.string()).optional(),
      excluded: z.array(z.string()).optional(),
      amenities: z.array(z.string()).optional(),
      tourPlan: z.array(z.string()).optional(),
      maxGuest: z.number().optional(),
      minAge: z.number().optional(),
      division: z.string().optional()
});