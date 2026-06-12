export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "date"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "result"
  | "unit"
  | "reference-range"
  | "critical-value"
  | "formula"
  | "table"
  | "rich-text"
  | "image"
  | "barcode"
  | "qrcode"
  | "signature";

export type TemplateCategory =
  | "general"
  | "admin"
  | "finance"
  | "hr"
  | "sales"
  | "marketing"
  | "operations"
  | "healthcare"
  | "education"
  | "legal"
  | "inventory"
  | "customer-service";

export type TemplateStatus = "draft" | "published";

export interface ReferenceRange {
  male: string;
  female: string;
}

export interface ValidationRule {
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  message?: string;
}

export interface LabFieldOptions {
  unit?: string;
  referenceRange?: ReferenceRange;
  criticalLow?: number;
  criticalHigh?: number;
  formula?: string;
}

export interface TemplateField {
  id: string;
  type: FieldType;
  label: string;
  fieldName: string;
  placeholder?: string;
  defaultValue?: string;
  required: boolean;
  labOptions?: LabFieldOptions;
  validation?: ValidationRule;
  order: number;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  status: TemplateStatus;
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
}

export interface ComponentLibraryItem {
  type: FieldType;
  title: string;
  description: string;
  category: ComponentCategory;
  icon: string;
}

export type ComponentCategory =
  | "basic"
  | "selection"
  | "lab"
  | "advanced";

export interface TemplateBuilderState {
  template: Template;
  selectedFieldId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
}

export type DragSource = "library" | "canvas";

export interface DragData {
  source: DragSource;
  fieldType?: FieldType;
  fieldId?: string;
}
