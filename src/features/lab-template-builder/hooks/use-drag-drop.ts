"use client";

import { useCallback, useState } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { FieldType, DragData } from "../types/field.types";
import type { TemplateBuilderReturn } from "./use-template-builder";

export function useDragDrop(builder: TemplateBuilderReturn) {
  const [activeDragData, setActiveDragData] = useState<DragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined;
    if (data) {
      setActiveDragData(data);
    }
  }, []);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Reordering is handled on drag end to avoid excessive state updates
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragData(null);

      if (!over) return;

      const activeData = active.data.current as DragData | undefined;
      const overId = String(over.id);

      if (activeData?.source === "library" && activeData.fieldType) {
        if (overId === "canvas-drop-zone") {
          builder.addField(activeData.fieldType);
        } else {
          const overIndex = builder.sortedFields.findIndex(
            (f) => f.id === overId
          );
          builder.addField(
            activeData.fieldType,
            overIndex >= 0 ? overIndex : undefined
          );
        }
        return;
      }

      if (activeData?.source === "canvas" && active.id !== over.id) {
        builder.reorderFields(String(active.id), overId);
      }
    },
    [builder]
  );

  const getLibraryDragData = useCallback(
    (fieldType: FieldType): { source: "library"; fieldType: FieldType } => ({
      source: "library",
      fieldType,
    }),
    []
  );

  const getCanvasDragData = useCallback(
    (fieldId: string): { source: "canvas"; fieldId: string } => ({
      source: "canvas",
      fieldId,
    }),
    []
  );

  return {
    sensors,
    activeDragData,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    getLibraryDragData,
    getCanvasDragData,
  };
}
