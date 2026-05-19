"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface PeriodSelectorProps {
  currentPreset: string;
  currentFrom: Date;
  currentTo: Date;
}

const PRESETS = [
  { value: "month", label: "Ce mois" },
  { value: "last-month", label: "Mois précédent" },
  { value: "3-months", label: "3 derniers mois" },
  { value: "12-months", label: "12 derniers mois" },
];

export function PeriodSelector({ currentPreset, currentFrom, currentTo }: PeriodSelectorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>({
    from: currentFrom,
    to: currentTo,
  });

  function selectPreset(preset: string) {
    const params = new URLSearchParams();
    params.set("period", preset);
    router.push(`/admin?${params.toString()}`);
  }

  function selectCustom(newRange: DateRange | undefined) {
    setRange(newRange);
    if (newRange?.from && newRange?.to) {
      const params = new URLSearchParams();
      params.set("period", "custom");
      params.set("from", format(newRange.from, "yyyy-MM-dd"));
      params.set("to", format(newRange.to, "yyyy-MM-dd"));
      router.push(`/admin?${params.toString()}`);
      setOpen(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      {PRESETS.map((p) => (
        <button
          key={p.value}
          onClick={() => selectPreset(p.value)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            currentPreset === p.value
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {p.label}
        </button>
      ))}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
              currentPreset === "custom"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            {currentPreset === "custom"
              ? `${format(currentFrom, "dd/MM/yyyy")} → ${format(currentTo, "dd/MM/yyyy")}`
              : "Personnalisé"}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={8}
            className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50"
            align="end"
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={selectCustom}
              locale={fr}
              numberOfMonths={2}
              defaultMonth={range?.from ?? currentFrom}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
