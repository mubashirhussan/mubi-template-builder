"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentLibraryItem } from "../../types/field.types";
import { getComponentIcon } from "../../constants/icon-map";
import { cn } from "@/lib/utils";

interface ComponentLibraryItemCardProps {
  item: ComponentLibraryItem;
  dragData: { source: "library"; fieldType: ComponentLibraryItem["type"] };
}

export function ComponentLibraryItemCard({
  item,
  dragData,
}: ComponentLibraryItemCardProps) {
  const Icon = getComponentIcon(item.icon);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `library-${item.type}`,
      data: dragData,
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-all",
        "hover:border-primary/30 hover:shadow-md hover:bg-accent/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40 shadow-none"
      )}
      aria-label={`Drag ${item.title} to canvas`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
          {item.description}
        </p>
      </div>
    </button>
  );
}
