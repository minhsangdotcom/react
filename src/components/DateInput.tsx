import { useState, useRef, useEffect } from "react";
import { DatePicker, DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";

type ManualDateInputProps = {
  value?: string | null;
  onChange: (date?: string | null) => void;
  placeholder?: string;
  className?: string;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  locale: string;
  side?: "top" | "bottom";
};

export function DateInput({
  value = dayjs().toISOString(),
  onChange,
  placeholder = "Date of Birth",
  className,
  format = "DD/MM/YYYY",
  maxDate = dayjs().add(100, "year").endOf("year").toDate(),
  minDate = dayjs().subtract(100, "year").startOf("year").toDate(),
  locale,
  side = "bottom",
}: ManualDateInputProps) {
  const [opened, setOpened] = useState(false);
  const [dateInput, setDateInput] = useState<string>();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setDateInput(dayjs(value).format(format));
    } else {
      setDateInput("");
    }
  }, [value, format]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpened(false);
        setDateValue();
      }
    }

    if (opened) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [opened, dateInput]);

  function setDateValue() {
    const parsed = dayjs(dateInput);
    if (!parsed.isValid()) {
      return;
    }

    const date = parsed.toDate();

    if (date < minDate || date > maxDate) {
      return;
    }

    onChange(parsed.format(format));
    setOpened(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* INPUT */}
      <input
        value={dateInput}
        onClick={() => {
          setOpened((o) => !o);
        }}
        placeholder={placeholder}
        className={
          className ??
          `
          w-full h-12 px-4 rounded-lg
          border border-gray-300 dark:border-border-dark
          bg-white dark:bg-input-dark
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-blue-300
          cursor-pointer
        `
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setDateValue();
          }
        }}
        onChange={(e) => {
          setDateInput(e.target.value);
        }}
      />

      {/* CLEAR BUTTON */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setDateInput("");
            setOpened(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}

      {/* DATE PICKER */}
      {opened && (
        <div
          className={`
          absolute z-999 rounded-lg border shadow-lg bg-white dark:bg-input-dark px-4 py-3
          ${side === "bottom" ? "top-full mt-2" : "bottom-full mb-2"}
        `}
        >
          <DatePicker
            locale={locale}
            value={value}
            defaultDate={value ?? dayjs().toDate().toString()}
            onChange={(date) => {
              onChange(date);
              setOpened(false);
            }}
            maxDate={maxDate}
            minDate={minDate}
            allowDeselect
          />
        </div>
      )}
    </div>
  );
}
