import {
  Type,
  Hash,
  AlignLeft,
  Calendar,
  ChevronDown,
  CircleDot,
  CheckSquare,
  FlaskConical,
  Ruler,
  ArrowLeftRight,
  AlertTriangle,
  Calculator,
  Table,
  FileText,
  Image,
  Barcode,
  QrCode,
  PenLine,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Type,
  Hash,
  AlignLeft,
  Calendar,
  ChevronDown,
  CircleDot,
  CheckSquare,
  FlaskConical,
  Ruler,
  ArrowLeftRight,
  AlertTriangle,
  Calculator,
  Table,
  FileText,
  Image,
  Barcode,
  QrCode,
  PenLine,
};

export function getComponentIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Type;
}
