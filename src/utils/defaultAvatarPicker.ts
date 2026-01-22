import { Gender } from "@features/user/Gender";
import avatarGirl from "@assets/images/avatar-girl.png";
import avatarBoy from "@assets/images/avatar-boy.png";

export const defaultAvatarPicker = {
  getAvatar(gender?: Gender | string | null): string {
    const resolvedGender =
      typeof gender === "string"
        ? Gender[gender as keyof typeof Gender]
        : typeof gender === "number"
          ? gender
          : Gender.Male;

    return resolvedGender === Gender.Female ? avatarGirl : avatarBoy;
  },
};
