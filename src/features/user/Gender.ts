import { TRANSLATION_KEYS } from "@/config/translationKey";

enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

const GENDER_TRANSLATION_MAP = Object.values(Gender)
  .filter((v) => typeof v === "number")
  .reduce<Record<string, string>>((acc, v) => {
    const key = Gender[v as Gender];
    acc[key] = getTranslation(v as Gender);
    return acc;
  }, {});

function getTranslation(value: Gender): string {
  switch (value) {
    case Gender.Male:
      return TRANSLATION_KEYS.profile.gender.male;
    case Gender.Female:
      return TRANSLATION_KEYS.profile.gender.female;
    default:
      return TRANSLATION_KEYS.profile.gender.other;
  }
}

type GenderKey = keyof typeof GENDER_TRANSLATION_MAP;

function createGenderOptions(t: any) {
  return (Object.keys(GENDER_TRANSLATION_MAP) as GenderKey[]).map((key) => ({
    value: key,
    label: t(GENDER_TRANSLATION_MAP[key]),
  }));
}
export { createGenderOptions, Gender };
