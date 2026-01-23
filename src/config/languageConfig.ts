import VnFlag from "@assets/icons/vn.svg";
import UsFlag from "@assets/icons/us.svg";

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    flag: UsFlag,
  },
  {
    code: "vi",
    name: "Tiếng Việt",
    flag: VnFlag,
  },
];
