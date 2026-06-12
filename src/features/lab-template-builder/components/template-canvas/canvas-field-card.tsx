"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
import type { TemplateField } from "../../types/field.types";
import { FIELD_TYPE_LABELS } from "../../constants/component-library";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CanvasFieldCardProps {
  field: TemplateField;
  isSelected: boolean;
  dragData: { source: "canvas"; fieldId: string };
  onSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function CanvasFieldCard({
  field,
  isSelected,
  dragData,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
}: CanvasFieldCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    data: dragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isLabField = field.labOptions !== undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border bg-card shadow-sm transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "border-border hover:border-primary/30 hover:shadow-md",
        isDragging && "opacity-50 shadow-lg"
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`${field.label} field`}
    >
      <div className="flex items-start gap-2 p-4">
        <button
          type="button"
          className="mt-0.5 cursor-grab touch-none rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {field.label}
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Result Type: {FIELD_TYPE_LABELS[field.type] ?? field.type}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {field.required && (
                <Badge variant="outline" className="text-[10px]">
                  Required
                </Badge>
              )}
            </div>
          </div>

          {isLabField && field.labOptions && (
            <div className="mt-3 space-y-1 rounded-md bg-muted/50 px-3 py-2">
              {field.labOptions.unit && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Unit:</span>{" "}
                  {field.labOptions.unit}
                </p>
              )}
              {field.labOptions.referenceRange &&
                (field.labOptions.referenceRange.male ||
                  field.labOptions.referenceRange.female) && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Reference Range:
                    </span>{" "}
                    M: {field.labOptions.referenceRange.male || "—"} | F:{" "}
                    {field.labOptions.referenceRange.female || "—"}
                  </p>
                )}
              {(field.labOptions.criticalLow !== undefined ||
                field.labOptions.criticalHigh !== undefined) && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Critical:</span>{" "}
                  {field.labOptions.criticalLow ?? "—"} –{" "}
                  {field.labOptions.criticalHigh ?? "—"}
                </p>
              )}
            </div>
          )}

          {(field.defaultValue || field.placeholder) && (
            <div className="mt-2 space-y-0.5">
              {field.defaultValue && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Default:</span>{" "}
                  {field.defaultValue}
                </p>
              )}
              {field.placeholder && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Placeholder:
                  </span>{" "}
                  {field.placeholder}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 border-t border-border px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className="h-3 w-3" />
          Duplicate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}
