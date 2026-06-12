"use client";

import {
  Save,
  Eye,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Template } from "../../types/field.types";
import { TEMPLATE_CATEGORIES } from "../../types/template.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface BuilderHeaderProps {
  template: Template;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  saveSuccess: boolean;
  error: string | null;
  onNameChange: (name: string) => void;
  onCategoryChange: (category: Template["category"]) => void;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onDismissError: () => void;
}

export function BuilderHeader({
  template,
  isDirty,
  isSaving,
  isPublishing,
  saveSuccess,
  error,
  onNameChange,
  onCategoryChange,
  onSave,
  onPreview,
  onPublish,
  onDismissError,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">
                Template Builder
              </h1>
              {template.status === "published" && (
                <Badge variant="success">Published</Badge>
              )}
              {isDirty && (
                <Badge variant="warning">Unsaved changes</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Design templates for any application — admin, finance, and more
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="template-name" className="text-xs">
              Template Name
            </Label>
            <Input
              id="template-name"
              value={template.name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full sm:w-64"
              placeholder="Enter template name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="template-category" className="text-xs">
              Category
            </Label>
            <Select
              value={template.category}
              onValueChange={(value) =>
                onCategoryChange(value as Template["category"])
              }
            >
              <SelectTrigger id="template-category" className="w-full sm:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onSave}
              disabled={isSaving || !isDirty}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Template
            </Button>
            <Button variant="outline" onClick={onPreview}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={onPublish} disabled={isPublishing}>
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 border-t border-destructive/20 bg-destructive/5 px-6 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-destructive hover:text-destructive"
            onClick={onDismissError}
          >
            Dismiss
          </Button>
        </div>
      )}

      {saveSuccess && !isDirty && !error && (
        <div className="flex items-center gap-2 border-t border-emerald-200 bg-emerald-50 px-6 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Template saved successfully
        </div>
      )}
    </header>
  );
}
