/** Converts a display label into a snake_case field key for JSON/API use. */
export function labelToFieldName(label: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!slug) return "field";
  return /^[a-z]/.test(slug) ? slug : `field_${slug}`;
}
