import type { Template, TemplateField, FieldType } from "../types/field.types";
import { labelToFieldName } from "../utils/field-name";

const MOCK_TEMPLATE: Template = {
  id: "tpl-001",
  name: "Complete Blood Count (CBC)",
  category: "general",
  status: "draft",
  createdAt: "2026-06-01T08:00:00Z",
  updatedAt: "2026-06-10T14:30:00Z",
  fields: [
    {
      id: "field-001",
      type: "result",
      label: "Hemoglobin",
      fieldName: "hemoglobin",
      placeholder: "Enter result",
      defaultValue: "14.2",
      required: true,
      order: 0,
      labOptions: {
        unit: "g/dL",
        referenceRange: { male: "13-17", female: "12-15" },
        criticalLow: 7,
        criticalHigh: 20,
      },
      validation: { minValue: 0, maxValue: 25 },
    },
    {
      id: "field-002",
      type: "result",
      label: "White Blood Cell Count",
      fieldName: "wbc_count",
      placeholder: "Enter result",
      required: true,
      order: 1,
      labOptions: {
        unit: "×10³/µL",
        referenceRange: { male: "4.5-11.0", female: "4.5-11.0" },
        criticalLow: 2,
        criticalHigh: 30,
      },
      validation: { minValue: 0, maxValue: 50 },
    },
    {
      id: "field-003",
      type: "result",
      label: "Platelet Count",
      fieldName: "platelet_count",
      placeholder: "Enter result",
      required: true,
      order: 2,
      labOptions: {
        unit: "×10³/µL",
        referenceRange: { male: "150-400", female: "150-400" },
        criticalLow: 50,
        criticalHigh: 1000,
      },
      validation: { minValue: 0, maxValue: 1500 },
    },
  ],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const templateService = {
  async fetchTemplate(id?: string): Promise<Template> {
    await delay(600);
    if (id) {
      return { ...MOCK_TEMPLATE, id };
    }
    return {
      ...MOCK_TEMPLATE,
      id: crypto.randomUUID(),
      name: "Untitled Template",
      category: "general",
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async saveTemplate(template: Template): Promise<Template> {
    await delay(800);
    return {
      ...template,
      updatedAt: new Date().toISOString(),
    };
  },

  async publishTemplate(template: Template): Promise<Template> {
    await delay(1000);
    return {
      ...template,
      status: "published",
      updatedAt: new Date().toISOString(),
    };
  },
};

export function createFieldFromType(
  type: FieldType,
  order: number
): TemplateField {
  const id = crypto.randomUUID();
  const baseLabel = type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const isLabField = [
    "result",
    "unit",
    "reference-range",
    "critical-value",
    "formula",
  ].includes(type);

  return {
    id,
    type,
    label: baseLabel,
    fieldName: labelToFieldName(baseLabel),
    placeholder: `Enter ${baseLabel.toLowerCase()}`,
    required: false,
    order,
    ...(isLabField && {
      labOptions: {
        unit: type === "result" ? "g/dL" : undefined,
        referenceRange: { male: "", female: "" },
        criticalLow: undefined,
        criticalHigh: undefined,
      },
    }),
    validation: type === "number" || type === "result" ? {} : undefined,
  };
}

export function duplicateField(field: TemplateField, order: number): TemplateField {
  return {
    ...structuredClone(field),
    id: crypto.randomUUID(),
    label: `${field.label} (Copy)`,
    fieldName: labelToFieldName(`${field.label} (Copy)`),
    order,
  };
}
