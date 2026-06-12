"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  COMPONENT_LIBRARY,
  COMPONENT_CATEGORIES,
} from "../../constants/component-library";
import type { FieldType } from "../../types/field.types";
import { ComponentLibraryItemCard } from "./component-library-item";

interface ComponentLibraryPanelProps {
  getLibraryDragData: (
    fieldType: FieldType
  ) => { source: "library"; fieldType: FieldType };
}

export function ComponentLibraryPanel({
  getLibraryDragData,
}: ComponentLibraryPanelProps) {
  return (
    <aside
      className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-card"
      aria-label="Component library"
    >
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Component Library
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Drag components to the canvas
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {COMPONENT_CATEGORIES.map((category, index) => {
            const items = COMPONENT_LIBRARY.filter(
              (item) => item.category === category.id
            );

            return (
              <div key={category.id}>
                {index > 0 && <Separator className="mb-4" />}
                <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.label}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <ComponentLibraryItemCard
                      key={item.type}
                      item={item}
                      dragData={getLibraryDragData(item.type)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
