"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { useTemplateBuilder } from "../../hooks/use-template-builder";
import { useDragDrop } from "../../hooks/use-drag-drop";
import { BuilderHeader } from "./builder-header";
import { ComponentLibraryPanel } from "../component-library/component-library-panel";
import { TemplateCanvas } from "../template-canvas/template-canvas";
import { PropertiesPanel } from "../properties-panel/properties-panel";
import { TemplatePreviewDialog } from "../template-preview/template-preview-dialog";
import { COMPONENT_LIBRARY } from "../../constants/component-library";
import { getComponentIcon } from "../../constants/icon-map";

export function BuilderLayout() {
  const builder = useTemplateBuilder();
  const dragDrop = useDragDrop(builder);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (builder.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading template builder...
          </p>
        </div>
      </div>
    );
  }

  if (!builder.template) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Unable to load template
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {builder.error ?? "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  const activeLibraryItem =
    dragDrop.activeDragData?.source === "library" &&
    dragDrop.activeDragData.fieldType
      ? COMPONENT_LIBRARY.find(
          (item) => item.type === dragDrop.activeDragData?.fieldType
        )
      : null;

  const ActiveIcon = activeLibraryItem
    ? getComponentIcon(activeLibraryItem.icon)
    : null;

  return (
    <DndContext
      sensors={dragDrop.sensors}
      collisionDetection={closestCenter}
      onDragStart={dragDrop.handleDragStart}
      onDragOver={dragDrop.handleDragOver}
      onDragEnd={dragDrop.handleDragEnd}
    >
      <div className="flex h-screen flex-col bg-background">
        <BuilderHeader
          template={builder.template}
          isDirty={builder.isDirty}
          isSaving={builder.isSaving}
          isPublishing={builder.isPublishing}
          saveSuccess={builder.saveSuccess}
          error={builder.error}
          onNameChange={(name) => builder.updateTemplateMeta({ name })}
          onCategoryChange={(category) =>
            builder.updateTemplateMeta({ category })
          }
          onSave={builder.saveTemplate}
          onPreview={() => setPreviewOpen(true)}
          onPublish={builder.publishTemplate}
          onDismissError={() => builder.setError(null)}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <ComponentLibraryPanel
            getLibraryDragData={dragDrop.getLibraryDragData}
          />

          <TemplateCanvas
            fields={builder.sortedFields}
            selectedFieldId={builder.selectedFieldId}
            onSelectField={builder.setSelectedFieldId}
            onDuplicateField={builder.duplicateFieldById}
            onDeleteField={builder.removeField}
            getCanvasDragData={dragDrop.getCanvasDragData}
          />

          <div className="sticky top-0 h-full overflow-hidden">
            <PropertiesPanel
              selectedField={builder.selectedField}
              onUpdateField={builder.updateField}
            />
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeLibraryItem && ActiveIcon ? (
          <div className="flex items-center gap-3 rounded-lg border border-primary bg-card px-4 py-3 shadow-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ActiveIcon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{activeLibraryItem.title}</span>
          </div>
        ) : null}
      </DragOverlay>

      <TemplatePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={builder.template}
      />
    </DndContext>
  );
}
