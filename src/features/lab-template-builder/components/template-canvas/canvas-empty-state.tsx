import { LayoutTemplate, MousePointerClick } from "lucide-react";

export function CanvasEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50">
          <LayoutTemplate
            className="h-10 w-10 text-muted-foreground/60"
            aria-hidden="true"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <MousePointerClick
            className="h-4 w-4 text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
      <h3 className="text-base font-semibold text-foreground">
        Start building your lab template
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Drag components from the library on the left to design your lab report
        template. Reorder, edit, and configure each field.
      </p>
    </div>
  );
}
