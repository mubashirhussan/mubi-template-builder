"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Template } from "../../types/field.types";
import { FIELD_TYPE_LABELS } from "../../constants/component-library";
import { getCategoryLabel } from "../../types/template.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template;
}

type PreviewTab = "layout" | "json";

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  template,
}: TemplatePreviewDialogProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("layout");
  const [copied, setCopied] = useState(false);

  const sortedFields = [...template.fields].sort((a, b) => a.order - b.order);

  const templateJson = JSON.stringify(
    {
      ...template,
      fields: sortedFields,
    },
    null,
    2
  );

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(templateJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>
            Preview template layout or export as JSON
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("layout")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "layout"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Layout
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "json"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            JSON
          </button>
        </div>

        {activeTab === "layout" ? (
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryLabel(template.category)} Template
                  </p>
                </div>
                <Badge
                  variant={
                    template.status === "published" ? "success" : "secondary"
                  }
                >
                  {template.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 p-6">
              {sortedFields.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No fields configured in this template
                </p>
              ) : (
                sortedFields.map((field) => (
                  <div key={field.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {field.label}
                            {field.required && (
                              <span className="text-destructive ml-0.5">*</span>
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {FIELD_TYPE_LABELS[field.type]}
                          </span>
                        </div>
                        {(field.defaultValue || field.placeholder) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {field.defaultValue
                              ? `Default: ${field.defaultValue}`
                              : field.placeholder}
                          </p>
                        )}
                      </div>
                      <div className="flex h-8 w-32 shrink-0 items-center rounded border border-dashed border-border bg-muted/30 px-2">
                        {field.defaultValue && (
                          <span className="truncate text-xs text-foreground">
                            {field.defaultValue}
                          </span>
                        )}
                      </div>
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border px-6 py-3 text-center">
              <p className="text-[10px] text-muted-foreground">
                End of Template Preview
              </p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg border border-border bg-muted/20">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                Template JSON
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={handleCopyJson}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy JSON
                  </>
                )}
              </Button>
            </div>
            <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-relaxed text-foreground">
              <code>{templateJson}</code>
            </pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
