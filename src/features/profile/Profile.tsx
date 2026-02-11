import "./profile.css";
import { Loading } from "@/components/Loading";
import { ChangeEvent, useEffect, useState } from "react";
import profileService from "@features/profile/profileService";
import LoadingButton from "@/components/LoadingButton";
import { UserProfileResponse } from "@/features/profile/IUserProfile";
import Select from "react-select";
import { Gender, createGenderOptions } from "@/features/user/Gender";
import { DateInput } from "@mantine/dates";
import Edit from "@assets/icons/edit-icon.png";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAppSelector } from "@/store/hook";
import { profileSchema, profileSchemaType } from "./profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";
import { showSuccessToast } from "@/notifications/toastSuccess";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { useTranslation } from "react-i18next";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import { Avatar, AvatarImage } from "@/design-system/cn/components/ui/avatar";
dayjs.extend(utc);

export function Profile() {
  const { user, isLoading } = useAppSelector((store) => store.profile);
  const { code } = useAppSelector((store) => store.language);

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const { t } = useTranslation();
  const genderOptions = createGenderOptions(t);

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

    setSubmitLoading(true);
    var result = await profileService.updateProfile(formData);
    if (result.success) {
      const userResult = result.data?.results as UserProfileResponse;
      updateProfile(userResult);
      showSuccessToast("Update profile success!");
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    updateProfile(user);
  }, [isLoading]);

  function updateProfile(user: UserProfileResponse) {
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

  if (isLoading) {
    return (
      <div className="px-3 py-3 h-[calc(100vh-64px-105px)] md:h-[calc(100vh-64px-53px)]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="w-full px-4 pb-10 sm:px-0 sm:max-w-md md:max-w-lg 2xl:max-w-2xl mt-3 mx-auto">
        <div className="flex items-center gap-4 mb-3 p-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="h-20 w-20 overflow-hidden rounded-full">
              <AvatarImage
                src={userAvatar ?? defaultAvatarPicker.getAvatar(gender)}
                className="w-full h-full object-cover"
              />
            </Avatar>

            <label className="absolute bottom-0 right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-blue-500 shadow cursor-pointer">
              <img src={Edit} className="h-3 w-3" />
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
              <label>{t(TRANSLATION_KEYS.profile.form.fields.firstName)}</label>
              <input
                {...register("firstName")}
                className={errors.firstName && "border-red-500!"}
              />
              {errors.firstName?.message && (
                <span className="text-xs text-red-500">
                  {t(errors.firstName?.message as any)}
                </span>
              )}
            </div>

            <div className="field">
              <label>{t(TRANSLATION_KEYS.profile.form.fields.lastName)}</label>
              <input
                className={errors.lastName?.message && "border-red-500!"}
                {...register("lastName")}
              />
              {errors.lastName?.message && (
                <span className="text-xs text-red-500">
                  {t(errors.lastName?.message as any)}
                </span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>{t(TRANSLATION_KEYS.profile.form.fields.email)}</label>
              <input
                type="email"
                {...register("email")}
                className={errors.email?.message && "border-red-500!"}
              />
              {errors.email?.message && (
                <span className="text-xs text-red-500">
                  {t(errors.email?.message as any)}
                </span>
              )}
            </div>

            <div className="field">
              <label>{t(TRANSLATION_KEYS.profile.form.fields.phoneNumber)}</label>
              <input {...register("phoneNumber")} />
              {errors.phoneNumber?.message && (
                <span className="text-xs text-red-500">
                  {t(errors.phoneNumber?.message as any)}
                </span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>{t(TRANSLATION_KEYS.profile.form.fields.dateOfBirth)}</label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DateInput
                    locale={code}
                    value={field.value}
                    onChange={field.onChange}
                    allowDeselect
                    maxDate={dayjs()
                      .subtract(18, "year")
                      .endOf("year")
                      .toDate()}
                    minDate={dayjs()
                      .subtract(100, "year")
                      .startOf("year")
                      .toDate()}
                    valueFormat="DD/MM/YYYY"
                    placeholder={t(TRANSLATION_KEYS.profile.form.fields.dateOfBirth)}
                  />
                )}
              />
            </div>

            <div className="field">
              <label>{t(TRANSLATION_KEYS.profile.form.fields.gender)}</label>
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
            </div>
          </div>

          <div className="btn-wrapper">
            <LoadingButton
              loading={submitLoading}
              text={t(TRANSLATION_KEYS.common.actions.save)}
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
