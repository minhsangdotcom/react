import { TRANSLATION_KEYS } from "@/config/translationKey";

enum UserStatus {
  Active = 1,
  Inactive = 2,
}

const STATUS_TRANSLATION_MAP = Object.values(UserStatus)
  .filter((v) => typeof v === "number")
  .reduce<Record<string, string>>((acc, v) => {
    const key = UserStatus[v as UserStatus];
    acc[key] = getTranslation(v as UserStatus);
    return acc;
  }, {});

export default function getTranslation(value: UserStatus): string {
  switch (value) {
    case UserStatus.Active:
      return TRANSLATION_KEYS.user.status.active;
    case UserStatus.Inactive:
      return TRANSLATION_KEYS.user.status.inactive;
  }
}

type UserStatusKey = keyof typeof STATUS_TRANSLATION_MAP;

function createUserStatusOptions(t: any) {
  return (Object.keys(STATUS_TRANSLATION_MAP) as UserStatusKey[]).map(
    (key) => ({
      value: key,
      label: t(STATUS_TRANSLATION_MAP[key]),
    })
  );
}
export { createUserStatusOptions, UserStatus };
