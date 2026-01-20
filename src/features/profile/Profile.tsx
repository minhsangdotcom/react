import "./profile.css";
import { Loading } from "@components/Loading";
import { ChangeEvent, useEffect, useState } from "react";
import profileService from "@features/profile/profileService";
import LoadingButton from "@components/LoadingButton";
import { IUserProfileResponse } from "@/features/profile/IUserProfile";
import Select from "react-select";
import { Gender, genderOptions } from "@/features/user/Gender";
import { DateInput } from "@mantine/dates";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAppSelector } from "@/store/hook";
import { profileSchema, profileSchemaType } from "./profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";

dayjs.extend(utc);

export default function Profile() {
  const { user, isLoading } = useAppSelector((store) => store.profile);

  const [loading, setLoading] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<profileSchemaType>({
    resolver: zodResolver(profileSchema),
  });

  const [firstName, lastName, gender] = useWatch({
    control,
    name: ["firstName", "lastName", "gender"],
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    if (!img.type.startsWith("image/")) {
      return;
    }
    setAvatar(img);
    setUserAvatar(URL.createObjectURL(img));
  };

  const submit = async (data: profileSchemaType) => {
    const formData = new FormData();

    Object.entries({ ...data, avatar: user?.avatar }).forEach(([key, val]) => {
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
    try {
      var result = await profileService.updateProfile(formData);
      const user = result.data?.results as IUserProfileResponse;
      updateProfile(user);
    } catch (error) {
      //
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    updateProfile(user);
  }, [isLoading]);

  function updateProfile(user: IUserProfileResponse) {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender ? Gender[user.gender as Gender] : null,
    });
    setUserAvatar(user.avatar ?? null);
  }

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="w-full px-4 sm:px-0 sm:max-w-md md:max-w-lg 2xl:max-w-2xl mt-3 mx-auto">
        <div className="flex items-center gap-4 mb-3 p-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={userAvatar ?? defaultAvatarPicker.getAvatar(gender)}
              alt="Avatar"
              className="w-20 rounded-full object-cover"
            />

            <label className="absolute bottom-0 right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-blue-500 shadow cursor-pointer">
              <img src="/icons/edit-icon.png" className="h-3 w-3" />
              <input type="file" hidden onChange={handleFileChange} />
            </label>
          </div>

          {/* Name */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold leading-tight">
              {firstName} {lastName}
            </h2>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit(submit)}>
          <div className="row">
            <div className="field">
              <label>First Name</label>
              <input {...register("firstName")} />
              {errors.firstName?.message && (
                <span className="text-xs text-red-500">
                  {errors.firstName?.message}
                </span>
              )}
            </div>
            <div className="field">
              <label>Last Name</label>
              <input {...register("lastName")} />
            </div>
            {errors.lastName?.message && (
              <span className="text-xs text-red-500">
                {errors.lastName?.message}
              </span>
            )}
          </div>

          <div className="row">
            <div className="field">
              <label>Email Address</label>
              <input type="email" {...register("email")} />
              {errors.email?.message && (
                <span className="text-xs text-red-500">
                  {errors.email?.message}
                </span>
              )}
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input {...register("phoneNumber")} />
              {errors.phoneNumber?.message && (
                <span className="text-xs text-red-500">
                  {errors.phoneNumber?.message}
                </span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Date of Birth</label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DateInput
                    value={field.value}
                    onChange={field.onChange}
                    allowDeselect
                    maxDate={new Date(new Date().getFullYear() - 18, 11, 31)}
                    minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                    valueFormat="DD/MM/YYYY"
                    placeholder="Date of Birth"
                  />
                )}
              />
            </div>

            <div className="field">
              <label>Gender</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    styles={customStyles}
                    options={genderOptions}
                    value={
                      genderOptions.find(
                        (x) => x.value.toString() == field.value
                      ) ?? null
                    }
                    onChange={(option) => {
                      field.onChange(option?.value ?? null);
                    }}
                  />
                )}
              />
              {errors.gender?.message && (
                <span className="text-xs text-red-500">
                  {errors.gender?.message}
                </span>
              )}
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
