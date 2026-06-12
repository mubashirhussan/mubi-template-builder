"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2 } from "lucide-react";
import type { TemplateField } from "../../types/field.types";
import {
  templateFieldSchema,
  type TemplateFieldFormValues,
} from "../../schemas/template.schema";
import { FIELD_TYPE_LABELS } from "../../constants/component-library";
import { labelToFieldName } from "../../utils/field-name";
import { PropertiesSection } from "./properties-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface PropertiesPanelProps {
  selectedField: TemplateField | null;
  onUpdateField: (fieldId: string, updates: Partial<TemplateField>) => void;
}

export function PropertiesPanel({
  selectedField,
  onUpdateField,
}: PropertiesPanelProps) {
  const form = useForm<TemplateFieldFormValues>({
    resolver: zodResolver(templateFieldSchema),
    defaultValues: selectedField ?? undefined,
    mode: "onBlur",
  });

  const { register, watch, setValue, reset, formState } = form;

  useEffect(() => {
    if (selectedField) {
      reset(selectedField);
    }
  }, [selectedField?.id, selectedField, reset]);

  const commit = (updates: Partial<TemplateField>) => {
    if (selectedField) {
      onUpdateField(selectedField.id, updates);
    }
  };

  if (!selectedField) {
    return (
      <aside
        className="flex h-full w-[350px] shrink-0 flex-col border-l border-border bg-card"
        aria-label="Properties panel"
      >
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            No component selected
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a component on the canvas to edit its properties
          </p>
        </div>
      </aside>
    );
  }

  const showLabSection = selectedField.labOptions !== undefined;
  const showValidationSection =
    selectedField.type === "number" ||
    selectedField.type === "result" ||
    selectedField.validation !== undefined;

  return (
    <aside
      className="flex h-full w-[350px] shrink-0 flex-col border-l border-border bg-card"
      aria-label="Properties panel"
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
          <Badge variant="secondary" className="text-[10px]">
            {FIELD_TYPE_LABELS[selectedField.type]}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground truncate">
          {selectedField.label}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <form className="space-y-6 p-4" onSubmit={(e) => e.preventDefault()}>
          <PropertiesSection title="General">
            <div className="space-y-2">
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                {...register("label", {
                  onBlur: (e) => commit({ label: e.target.value }),
                })}
              />
              {formState.errors.label && (
                <p className="text-xs text-destructive">
                  {formState.errors.label.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input
                id="field-name"
                {...register("fieldName", {
                  onBlur: (e) => commit({ fieldName: e.target.value }),
                })}
                placeholder="e.g. employee_id"
              />
              {formState.errors.fieldName && (
                <p className="text-xs text-destructive">
                  {formState.errors.fieldName.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                JSON key — snake_case (e.g.{" "}
                {labelToFieldName(watch("label") || "")})
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                {...register("placeholder", {
                  onBlur: (e) => commit({ placeholder: e.target.value }),
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-default-value">Default Value</Label>
              <Input
                id="field-default-value"
                {...register("defaultValue", {
                  onBlur: (e) => commit({ defaultValue: e.target.value }),
                })}
                placeholder="Pre-filled value when form loads"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <Label htmlFor="field-required" className="cursor-pointer">
                Required
              </Label>
              <Switch
                id="field-required"
                checked={watch("required")}
                onCheckedChange={(checked) => {
                  setValue("required", checked);
                  commit({ required: checked });
                }}
              />
            </div>
          </PropertiesSection>

          {showLabSection && (
            <>
              <Separator />
              <PropertiesSection title="Lab">
                <div className="space-y-2">
                  <Label htmlFor="field-unit">Unit</Label>
                  <Input
                    id="field-unit"
                    {...register("labOptions.unit", {
                      onBlur: (e) =>
                        commit({
                          labOptions: {
                            ...selectedField.labOptions,
                            unit: e.target.value,
                          },
                        }),
                    })}
                    placeholder="e.g. g/dL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ref-range-male">Reference Range Male</Label>
                  <Input
                    id="ref-range-male"
                    {...register("labOptions.referenceRange.male", {
                      onBlur: (e) =>
                        commit({
                          labOptions: {
                            ...selectedField.labOptions,
                            referenceRange: {
                              male: e.target.value,
                              female:
                                selectedField.labOptions?.referenceRange
                                  ?.female ?? "",
                            },
                          },
                        }),
                    })}
                    placeholder="e.g. 13-17"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ref-range-female">
                    Reference Range Female
                  </Label>
                  <Input
                    id="ref-range-female"
                    {...register("labOptions.referenceRange.female", {
                      onBlur: (e) =>
                        commit({
                          labOptions: {
                            ...selectedField.labOptions,
                            referenceRange: {
                              male:
                                selectedField.labOptions?.referenceRange
                                  ?.male ?? "",
                              female: e.target.value,
                            },
                          },
                        }),
                    })}
                    placeholder="e.g. 12-15"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="critical-low">Critical Low</Label>
                    <Input
                      id="critical-low"
                      type="number"
                      {...register("labOptions.criticalLow", {
                        valueAsNumber: true,
                        onBlur: (e) =>
                          commit({
                            labOptions: {
                              ...selectedField.labOptions,
                              criticalLow: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            },
                          }),
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="critical-high">Critical High</Label>
                    <Input
                      id="critical-high"
                      type="number"
                      {...register("labOptions.criticalHigh", {
                        valueAsNumber: true,
                        onBlur: (e) =>
                          commit({
                            labOptions: {
                              ...selectedField.labOptions,
                              criticalHigh: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            },
                          }),
                      })}
                    />
                  </div>
                </div>
              </PropertiesSection>
            </>
          )}

          {showValidationSection && (
            <>
              <Separator />
              <PropertiesSection title="Validation">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="min-value">Min Value</Label>
                    <Input
                      id="min-value"
                      type="number"
                      {...register("validation.minValue", {
                        valueAsNumber: true,
                        onBlur: (e) =>
                          commit({
                            validation: {
                              ...selectedField.validation,
                              minValue: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            },
                          }),
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-value">Max Value</Label>
                    <Input
                      id="max-value"
                      type="number"
                      {...register("validation.maxValue", {
                        valueAsNumber: true,
                        onBlur: (e) =>
                          commit({
                            validation: {
                              ...selectedField.validation,
                              maxValue: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            },
                          }),
                      })}
                    />
                  </div>
                </div>
              </PropertiesSection>
            </>
          )}
        </form>
      </ScrollArea>
    </aside>
  );
}
