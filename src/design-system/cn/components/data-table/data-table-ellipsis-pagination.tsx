import { TRANSLATION_KEYS } from "@/config/translationKey";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Table } from "@tanstack/table-core/build/lib/types";
import { useTranslation } from "react-i18next";
import { ROW_PER_PAGE } from "@/types/Params";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useMemo } from "react";

