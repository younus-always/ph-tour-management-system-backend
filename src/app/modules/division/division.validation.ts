import z from "zod";

export const createDivisionSchema = z.object({
      name: z.string({ error: "Division name is required!" }),
      description: z.string().optional(),
      thumbnail: z.string().optional()
});
export const updateDivisionSchema = z.object({
      name: z.string({ error: "Division name is required!" }).optional(),
      description: z.string().optional(),
      thumbnail: z.string().optional()
});