import { Gender } from "@/features/user/Gender";

export const defaultAvatarPicker = {
  getAvatar(gender?: Gender | string | null): string {
    const resolvedGender =
      typeof gender === "string"
        ? Gender[gender as keyof typeof Gender]
        : typeof gender === "number"
        ? gender
        : Gender.Male;

    return resolvedGender === Gender.Female
      ? "/images/avatar-girl.png"
      : "/images/avatar-boy.png";
  },
};
