import { z } from "zod";

export const personSchema = z.object({
  name: z.string().min(1, "Name is required").max(60, "Name is too long"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val.replace(/\s+/g, "")),
      "Enter a valid 10-digit Indian mobile number"
    ),
});

export const billFormSchema = z.object({
  receiverName: z
    .string()
    .min(1, "Your name is required")
    .max(60, "Name is too long"),
  receiverUpiId: z
    .string()
    .min(1, "UPI ID is required")
    .regex(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
      "Enter a valid UPI ID (e.g., name@upi, mobile@paytm)"
    ),
  occasion: z.string().max(100, "Occasion is too long").optional().default("Shared Bill"),
  totalAmount: z
    .number()
    .refine(val => typeof val === "number", { message: "Enter a valid amount" })
    .positive("Amount must be greater than ₹0")
    .max(10_000_000, "Amount is too large"),
  people: z
    .array(personSchema)
    .min(1, "Add at least one person")
    .max(50, "Maximum 50 people"),
});

export type BillFormValues = z.infer<typeof billFormSchema>;
export type PersonValues = z.infer<typeof personSchema>;
