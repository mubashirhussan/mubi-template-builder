export type {
  FieldType,
  TemplateCategory,
  TemplateStatus,
  ReferenceRange,
  ValidationRule,
  LabFieldOptions,
  TemplateField,
  Template,
  ComponentLibraryItem,
  ComponentCategory,
  TemplateBuilderState,
  DragSource,
  DragData,
} from "./field.types";

export const TEMPLATE_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "admin", label: "Admin" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "HR & Payroll" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "legal", label: "Legal" },
  { value: "inventory", label: "Inventory" },
  { value: "customer-service", label: "Customer Service" },
] as const;

export const DEFAULT_TEMPLATE = {
  name: "Untitled Template",
  category: "general" as const,
};

export function getCategoryLabel(category: string): string {
  return (
    TEMPLATE_CATEGORIES.find((c) => c.value === category)?.label ?? category
  );
}
