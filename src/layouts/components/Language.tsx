import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dscn/components/ui/dropdown-menu";
import { LANGUAGES } from "@/config/languageConfig";
import { SUPPORTED_LANGUAGES } from "@/config/i18nConfig";

type Props = {
  currentLang: string;
  onChange: (lang: string) => void;
};

export function CircleLanguagePicker({ currentLang, onChange }: Props) {
  const activeLang = LANGUAGES.filter((lang) =>
    SUPPORTED_LANGUAGES.includes(lang.code)
  ).find((x) => x.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="
            h-8 w-8 md:h-9 md:w-9
            rounded-full
            overflow-hidden
            border
            border-border
            flex items-center justify-center
            hover:bg-muted
            transition
            cursor-pointer
        "
      >
        <img
          src={activeLang?.flag}
          alt={activeLang?.name}
          className="h-full w-full object-cover"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={lang.flag}
              alt={lang.name}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="flex-1">{lang.name}</span>

            {lang.code === currentLang && (
              <span className="text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
