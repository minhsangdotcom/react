import "./profile.css";
import { Loading } from "@components/Loading";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import profileService from "@features/profile/profileService";
import LoadingButton from "@components/LoadingButton";
import {
  IUserProfile,
  IUserProfileResponse,
} from "@/features/profile/IUserProfile";
import Select from "react-select";
import { Gender } from "@/types/user/Gender";
import { DateInput } from "@mantine/dates";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAppSelector } from "@/store/hook";

dayjs.extend(utc);

const toUserProfile = (user: IUserProfileResponse): IUserProfile => ({
  firstName: user?.firstName!,
  lastName: user?.lastName!,
  dateOfBirth: user?.dateOfBirth!,
  email: user?.email!,
  phoneNumber: user?.phoneNumber!,
  avatar: user?.avatar && user.avatar,
  gender: user?.gender!,
});

export default function Profile() {
  const { user, isLoading } = useAppSelector((store) => store.profile);

  const [loading, setLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<IUserProfile>({
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    email: "",
    phoneNumber: "",
    avatar: "/images/default-avatar.png",
    gender: Gender.Male,
  } as IUserProfile);
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    if (!img.type.startsWith("image/")) {
      return;
    }
    setAvatar(img);
    setUserProfile((pre) => ({ ...pre, avatar: URL.createObjectURL(img) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(userProfile).forEach(([key, val]) => {
      if (val == null) return;
      if (key === "avatar") return;
      if (key === "dateOfBirth") {
        formData.append(key, dayjs(val).utc().format());
        return;
      }

      formData.append(key, String(val));
    });

    if (avatar) {
      formData.append("avatar", avatar, avatar.name);
    }

    setLoading(true);
    var result = await profileService.updateProfile(formData);

    if (result.isSuccess) {
      const data = result.data?.results;
      setUserProfile((pre) => ({
        ...pre,
        avatar: data?.avatar ? data.avatar : "/images/default-avatar.png",
      }));
    }
    setLoading(false);
  };

  const genderOptions = Object.values(Gender)
    .filter((v) => typeof v === "number")
    .map((v) => ({
      value: v as Gender,
      label: Gender[v as Gender],
    }));

  useEffect(() => {
    if (!user) {
      return;
    }
    setUserProfile(toUserProfile(user));
  }, [isLoading]);

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="profile-page p-5 w-full md:w-6/10 lg:w-5/10">
      <div className="profile-header">
        <div className="relative flex-none">
          <img
            src={userProfile?.avatar!}
            alt="Avatar"
            className="rounded-full w-30"
          />
          <label className="edit-icon absolute sm:bottom-0 sm:right-0 bg-blue-300 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer shadow-md">
            <img
              src="/icons/edit-icon.png"
              alt="Edit"
              className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="profile-info flex-1 min-w-0 pl-2 md:pl-1">
          <h2>
            {userProfile?.firstName} {userProfile?.lastName}
          </h2>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input
              name="firstName"
              value={userProfile?.firstName}
              onChange={(e) =>
                setUserProfile((pre) => ({ ...pre, firstName: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input
              name="lastName"
              value={userProfile?.lastName}
              onChange={(e) =>
                setUserProfile((pre) => ({ ...pre, lastName: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={userProfile?.email}
              onChange={(e) =>
                setUserProfile((pre) => ({ ...pre!, email: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input
              name="phone"
              value={userProfile?.phoneNumber}
              onChange={(e) =>
                setUserProfile((pre) => ({
                  ...pre!,
                  phoneNumber: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Date of Birth</label>
            <DateInput
              value={userProfile?.dateOfBirth}
              onChange={(date) => {
                console.log("🚀 ~ profilePage ~ date:", date);

                setUserProfile((pre) => ({
                  ...pre,
                  dateOfBirth: date ?? undefined,
                }));
              }}
              allowDeselect
              maxDate={new Date(new Date().getFullYear() - 18, 11, 31)}
              minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
              valueFormat="DD/MM/YYYY"
              placeholder="Date of Birth"
            />
          </div>

          <div className="field">
            <label>Gender</label>
            <Select
              styles={customStyles}
              options={genderOptions}
              value={
                userProfile.gender
                  ? {
                      value: userProfile.gender,
                      label: Gender[userProfile.gender],
                    }
                  : null
              }
              onChange={(option) => {
                setUserProfile((prev) => ({
                  ...prev,
                  gender: option?.value as Gender,
                }));
              }}
            />
          </div>
        </div>

        <div className="btn-wrapper">
          <LoadingButton
            loading={loading}
            text="Save Changes"
            type="submit"
            className="save-btn"
          />
        </div>
      </form>
    </div>
  );
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: "0.5rem",
    borderColor: "#b4afaf",
    padding: "0.4rem",
    boxShadow: "none",
    background: "white",
    cursor: "pointer",
    height: "47px",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.5rem",
    overflow: "hidden",
  }),
  option: (base: any, state: any) => ({
    ...base,
    padding: "0.75rem 1rem",
    backgroundColor: state.isFocused ? "rgba(91,192,222,0.2)" : "white",
    color: "#333",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({ ...base, color: "#333" }),
};
