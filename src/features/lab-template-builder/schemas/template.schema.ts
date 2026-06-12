import { z } from "zod";

export const referenceRangeSchema = z.object({
  male: z.string(),
  female: z.string(),
});

export const validationRuleSchema = z.object({
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  pattern: z.string().optional(),
  message: z.string().optional(),
});

export const labFieldOptionsSchema = z.object({
  unit: z.string().optional(),
  referenceRange: referenceRangeSchema.optional(),
  criticalLow: z.number().optional(),
  criticalHigh: z.number().optional(),
  formula: z.string().optional(),
});

export const templateFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string().min(1, "Label is required"),
  fieldName: z
    .string()
    .min(1, "Field name is required")
    .regex(/^[a-z][a-z0-9_]*$/, "Field name must be snake_case"),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  required: z.boolean(),
  labOptions: labFieldOptionsSchema.optional(),
  validation: validationRuleSchema.optional(),
  order: z.number(),
});

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required").max(120),
  category: z.enum([
    "general",
    "admin",
    "finance",
    "hr",
    "sales",
    "marketing",
    "operations",
    "healthcare",
    "education",
    "legal",
    "inventory",
    "customer-service",
  ]),
  status: z.enum(["draft", "published"]),
  fields: z.array(templateFieldSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
export type TemplateFieldFormValues = z.infer<typeof templateFieldSchema>;

export const publishTemplateSchema = templateSchema.refine(
  (data) => data.fields.length > 0,
  { message: "Template must contain at least one field before publishing" }
);
