import { z } from 'zod';

// --- SHARED ---
const emptyToNull = z.string().transform((val) => (val === '' ? null : val));

// --- FINANCES (Expenses) ---
export const ExpenseSchema = z.object({
  description: z.string().trim().nullable().optional(), // Preserve case
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  category: z.string().trim().toLowerCase().pipe(
    z.enum(['fuel', 'equipment', 'maintenance', 'other'])
  ),
});

export type ExpenseInput = z.infer<typeof ExpenseSchema>;

// --- INVENTORY (Tools) ---
export const ToolSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }), // Preserve case
  brand: z.string().trim().nullable().optional().transform(val => val || null), // Preserve case
  status: z.string().trim().toLowerCase().pipe( // Normalize casing
    z.enum(['ok', 'service', 'broken', 'available', 'maintenance'])
  ),
});

export type ToolInput = z.infer<typeof ToolSchema>;

// --- INVENTORY (Supplies) ---
export const SupplySchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }), // Preserve case
  current_stock: z.coerce.number().int().min(0),
  min_stock: z.coerce.number().int().min(0),
  unit: z.string().trim().toLowerCase().min(1, { message: "Unit is required" }), // Normalize unit
});

export type SupplyInput = z.infer<typeof SupplySchema>;

// --- CLIENTS ---
export const ClientSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }), // Preserve case
  phone: z.string().trim().nullable().optional().transform(val => val || null),
  email: z.string().trim().toLowerCase().email().nullable().optional().transform(val => val === '' ? null : val), // Normalize email
  notes: z.string().trim().nullable().optional(), // Preserve case
});

export type ClientInput = z.infer<typeof ClientSchema>;

export const PropertySchema = z.object({
  address: z.string().trim().min(1, { message: "Address is required" }), // Preserve case
  frequency: z.coerce.number().int().positive().nullable().optional(),
});

export type PropertyInput = z.infer<typeof PropertySchema>;

// --- VISITS ---
export const CreateVisitSchema = z.object({
  property_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format YYYY-MM-DD" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Invalid time format HH:mm" }),
  notes: z.string().trim().nullable().optional().transform(val => val || null), // Preserve case
});

export type CreateVisitInput = z.infer<typeof CreateVisitSchema>;

export const UpdateVisitSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format YYYY-MM-DD" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Invalid time format HH:mm" }),
  notes: z.string().trim().nullable().optional().transform(val => val || null),
});

export type UpdateVisitInput = z.infer<typeof UpdateVisitSchema>;

export const DeleteVisitSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteVisitInput = z.infer<typeof DeleteVisitSchema>;

export const CompleteVisitSchema = z.object({
  id: z.string().trim().toLowerCase().uuid(),
  total_price: z.coerce.number().min(0),
  direct_expenses: z.coerce.number().min(0),
  attendees: z.array(z.string().trim().toLowerCase()).min(1, "At least one worker is required"),
  notes: z.string().trim().nullable().optional().transform(val => val || null), // Preserve case
});

export type CompleteVisitInput = z.infer<typeof CompleteVisitSchema>;

// --- WORKERS ---
export const WorkerSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  is_partner: z.boolean().default(false),
  daily_wage: z.coerce.number().min(0).default(0),
});

export type WorkerInput = z.infer<typeof WorkerSchema>;
