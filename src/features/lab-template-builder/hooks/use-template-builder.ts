"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Template,
  TemplateField,
  FieldType,
} from "../types/field.types";
import {
  templateService,
  createFieldFromType,
  duplicateField,
} from "../services/template.service";
import {
  templateSchema,
  publishTemplateSchema,
} from "../schemas/template.schema";

export function useTemplateBuilder() {
  const [template, setTemplate] = useState<Template | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await templateService.fetchTemplate();
        if (mounted) {
          setTemplate(data);
        }
      } catch {
        if (mounted) {
          setError("Failed to load template. Please try again.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedField = useMemo(
    () => template?.fields.find((f) => f.id === selectedFieldId) ?? null,
    [template, selectedFieldId]
  );

  const sortedFields = useMemo(
    () =>
      template
        ? [...template.fields].sort((a, b) => a.order - b.order)
        : [],
    [template]
  );

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setSaveSuccess(false);
  }, []);

  const updateTemplateMeta = useCallback(
    (updates: Partial<Pick<Template, "name" | "category">>) => {
      setTemplate((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updates };
      });
      markDirty();
    },
    [markDirty]
  );

  const addField = useCallback(
    (type: FieldType, atIndex?: number) => {
      setTemplate((prev) => {
        if (!prev) return prev;
        const index = atIndex ?? prev.fields.length;
        const newField = createFieldFromType(type, index);
        const fields = [...prev.fields];
        fields.splice(index, 0, newField);
        const reordered = fields.map((f, i) => ({ ...f, order: i }));
        return { ...prev, fields: reordered };
      });
      markDirty();
    },
    [markDirty]
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<TemplateField>) => {
      setTemplate((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          fields: prev.fields.map((f) =>
            f.id === fieldId ? { ...f, ...updates } : f
          ),
        };
      });
      markDirty();
    },
    [markDirty]
  );

  const removeField = useCallback(
    (fieldId: string) => {
      setTemplate((prev) => {
        if (!prev) return prev;
        const fields = prev.fields
          .filter((f) => f.id !== fieldId)
          .map((f, i) => ({ ...f, order: i }));
        return { ...prev, fields };
      });
      setSelectedFieldId((prev) => (prev === fieldId ? null : prev));
      markDirty();
    },
    [markDirty]
  );

  const duplicateFieldById = useCallback(
    (fieldId: string) => {
      setTemplate((prev) => {
        if (!prev) return prev;
        const index = prev.fields.findIndex((f) => f.id === fieldId);
        if (index === -1) return prev;
        const copy = duplicateField(prev.fields[index], index + 1);
        const fields = [...prev.fields];
        fields.splice(index + 1, 0, copy);
        const reordered = fields.map((f, i) => ({ ...f, order: i }));
        return { ...prev, fields: reordered };
      });
      markDirty();
    },
    [markDirty]
  );

  const reorderFields = useCallback(
    (activeId: string, overId: string) => {
      setTemplate((prev) => {
        if (!prev) return prev;
        const oldIndex = prev.fields.findIndex((f) => f.id === activeId);
        const newIndex = prev.fields.findIndex((f) => f.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const fields = [...prev.fields];
        const [removed] = fields.splice(oldIndex, 1);
        fields.splice(newIndex, 0, removed);
        const reordered = fields.map((f, i) => ({ ...f, order: i }));
        return { ...prev, fields: reordered };
      });
      markDirty();
    },
    [markDirty]
  );

  const saveTemplate = useCallback(async () => {
    if (!template) return;
    const result = templateSchema.safeParse(template);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid template data");
      return;
    }
    try {
      setIsSaving(true);
      setError(null);
      const saved = await templateService.saveTemplate(template);
      setTemplate(saved);
      setIsDirty(false);
      setSaveSuccess(true);
    } catch {
      setError("Failed to save template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [template]);

  const publishTemplate = useCallback(async () => {
    if (!template) return;
    const result = publishTemplateSchema.safeParse(template);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid template data");
      return;
    }
    try {
      setIsPublishing(true);
      setError(null);
      const published = await templateService.publishTemplate(template);
      setTemplate(published);
      setIsDirty(false);
      setSaveSuccess(true);
    } catch {
      setError("Failed to publish template. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }, [template]);

  return {
    template,
    selectedField,
    selectedFieldId,
    setSelectedFieldId,
    sortedFields,
    isDirty,
    isSaving,
    isPublishing,
    isLoading,
    error,
    saveSuccess,
    setError,
    updateTemplateMeta,
    addField,
    updateField,
    removeField,
    duplicateFieldById,
    reorderFields,
    saveTemplate,
    publishTemplate,
  };
}

export type TemplateBuilderReturn = ReturnType<typeof useTemplateBuilder>;
