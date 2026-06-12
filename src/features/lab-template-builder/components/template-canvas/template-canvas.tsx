"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { TemplateField } from "../../types/field.types";
import { CanvasEmptyState } from "./canvas-empty-state";
import { CanvasFieldCard } from "./canvas-field-card";
import { cn } from "@/lib/utils";

interface TemplateCanvasProps {
  fields: TemplateField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onDuplicateField: (id: string) => void;
  onDeleteField: (id: string) => void;
  getCanvasDragData: (fieldId: string) => { source: "canvas"; fieldId: string };
}

export function TemplateCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onDuplicateField,
  onDeleteField,
  getCanvasDragData,
}: TemplateCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-zone",
  });

  const fieldIds = fields.map((f) => f.id);

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-muted/30">
      <div className="border-b border-border bg-card px-6 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Template Canvas
        </h2>
        <p className="text-xs text-muted-foreground">
          {fields.length === 0
            ? "No components added yet"
            : `${fields.length} component${fields.length !== 1 ? "s" : ""} in template`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div
          ref={setNodeRef}
          className={cn(
            "mx-auto min-h-[480px] max-w-3xl rounded-xl border-2 border-dashed bg-card p-6 transition-colors",
            isOver
              ? "border-primary bg-primary/5"
              : "border-border",
            fields.length === 0 && "flex items-center justify-center"
          )}
        >
          {fields.length === 0 ? (
            <CanvasEmptyState />
          ) : (
            <SortableContext
              items={fieldIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {fields.map((field) => (
                  <CanvasFieldCard
                    key={field.id}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    dragData={getCanvasDragData(field.id)}
                    onSelect={() => onSelectField(field.id)}
                    onEdit={() => onSelectField(field.id)}
                    onDuplicate={() => onDuplicateField(field.id)}
                    onDelete={() => onDeleteField(field.id)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </main>
  );
}
