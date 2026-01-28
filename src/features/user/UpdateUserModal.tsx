import { DateInput } from "@/components/DateInput";
import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/design-system/cn/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { Mail, Phone, Upload } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Select, { MultiValue } from "react-select";
import Input from "./UserInput";
import DefaultUser, {
  IPermissionModel,
  IRoleModel,
  IUser,
  IUserResponse,
} from "./IUser";
import getGenderTranslation, { Gender } from "./Gender";
import getStatusTranslation, { UserStatus } from "./UserStatus";
import { userService } from "./userService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import permissionSelectStyles from "./permission-select-style";
import {
  SkeletonBlock,
  SkeletonInput,
  SkeletonToggle,
  SkeletonWideInput,
} from "@/components/Skeleton";
import { userSchema, userSchemaType } from "./userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { defaultAvatarPicker } from "@/utils/defaultAvatarPicker";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { useTranslation } from "react-i18next";
import { Switch } from "@/design-system/cn/components/ui/switch";
dayjs.extend(utc);

const toUserSchema = (
  dto: IUserResponse
): {
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  email: string;
  phoneNumber?: string | null;
} => {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    dateOfBirth: dto.dateOfBirth,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
  };
};

interface UpdateUserProps {
  open: boolean;
  roles: IRoleModel[];
  permissions: IPermissionModel[];
  userId: string;
  onRequestClose: () => void;
  onSubmit: () => void;
}

export default function UpdateUserModal({
  open,
  roles,
  permissions,
  userId,
  onRequestClose,
  onSubmit,
}: UpdateUserProps) {
  const [user, setUser] = useState<IUser>(DefaultUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<userSchemaType>({
    resolver: zodResolver(userSchema),
  });

  const [firstName, lastName] = useWatch({
    control,
    name: ["firstName", "lastName"],
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    if (!img.type.startsWith("image/")) {
      return;
    }
    setAvatar(img);
    setUser((pre) => ({ ...pre, avatar: URL.createObjectURL(img) }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
            ? UserStatus.Active
            : UserStatus.Inactive
          : value,
    }));
  };

  const submit = async (data: userSchemaType) => {
    const formData = new FormData();

    Object.entries({
      ...data,
      status: user.status,
      roles: user.roles.map((x) => x.id),
      permissions: user.permissions?.map((x) => x.id),
    }).forEach(([key, val]) => {
      if (!val || val == "") return;
      if (key === "avatar") return;
      if (key === "dateOfBirth") {
        val &&
          formData.append(
            key,
            dayjs(val as string)
              .utc()
              .format()
          );
        return;
      }

      if (Array.isArray(val)) {
        val.forEach((item) => {
          formData.append(key, item);
        });
        return;
      }

      formData.append(key, String(val));
    });

    if (avatar) {
      formData.append("avatar", avatar, avatar.name);
    }

    setSubmitLoading(true);
    const result = await userService.update(userId, formData);
    if (result.success) {
      onSubmit();
      setUser(DefaultUser);
      onRequestClose();
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    initUser();
  }, [open]);

  async function initUser() {
    setLoading(true);
    try {
      const userResult = await userService.get(userId);
      const user = userResult.data?.results as IUserResponse;

      const userPermissions = user.permissions;
      const currentPermission = permissions
        ?.filter((permission) =>
          userPermissions?.some((p) => p.id == permission.id)
        )
        .map((x) => ({
          id: x.id,
          code: x.code,
        }));

      const currentRoles = roles.filter((role) =>
        user.roles.some((r) => r.id == role.id)
      );

      setUser((pre) => ({
        ...pre,
        avatar: user.avatar ?? defaultAvatarPicker.getAvatar(user.gender),
        status: user.status,
        gender: user.gender,
        username: user.username,
        permissions: [...currentPermission],
        roles: [...currentRoles],
      }));

      reset({ ...toUserSchema(user) });
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={open}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-black/40 backdrop-blur-[2px]">
        <div className="relative w-full max-w-4xl flex flex-col max-h-[90vh] rounded-xl shadow-2xl bg-background-card border border-background-border overflow-hidden bg-white">
          {/* Header title */}
          <DialogHeader className="flex justify-between px-6 py-5 border-b border-background-border shrink-0 bg-background-card">
            <DialogTitle className="text-black tracking-tight text-xl font-bold leading-tight">
              {t(TRANSLATION_KEYS.user.modal.update.title)}
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          {loading ? (
            <Skeleton />
          ) : (
            <div className="overflow-y-auto custom-scrollbar flex-1 p-6 sm:p-8">
              <div className="flex flex-col gap-8">
                {/* profile info section*/}
                <div className="flex flex-col items-center gap-2 md:flex-row md:items-start p-4 rounded-xl bg-background-input border border-background-border">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-background-border shadow-sm">
                      <img
                        src={user.avatar!}
                        alt="User avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 items-center md:items-start">
                    <h4 className="text-black text-xl font-bold leading-tight">
                      {firstName} {lastName}
                    </h4>
                    <p className="text-sm font-normal text-gray-500">
                      {t(TRANSLATION_KEYS.user.form.fields.username.label)}: @
                      {user.username}
                    </p>
                    {user.gender && (
                      <p className="text-sm font-normal text-gray-500">
                        {t(TRANSLATION_KEYS.user.form.fields.gender.label)}:{" "}
                        {t(getGenderTranslation(user.gender as Gender) as any)}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                          true
                            ? "bg-green-200 text-green-400"
                            : "bg-red-200 text-red-400"
                        }`}
                      >
                        {t(
                          getStatusTranslation(user.status as UserStatus) as any
                        )}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-200 text-blue-400">
                        {user.roles[0]?.name}
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#324467] bg-background-border  text-sm font-bold hover:bg-[#324467] transition-all cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        <Upload />
                      </span>
                      <span>
                        {t(
                          TRANSLATION_KEYS.user.form.fields.avatar.button.label
                        )}
                      </span>
                    </button>
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* User info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={t(TRANSLATION_KEYS.user.form.fields.firstName.label)}
                    type="text"
                    {...register("firstName")}
                    error={t(errors.firstName?.message as any)}
                  />
                  <Input
                    label={t(TRANSLATION_KEYS.user.form.fields.lastName.label)}
                    type="text"
                    {...register("lastName")}
                    error={t(errors.lastName?.message as any)}
                  />
                  <Input
                    label={t(TRANSLATION_KEYS.user.form.fields.email.label)}
                    type="email"
                    icon={<Mail />}
                    {...register("email")}
                    error={t(errors.email?.message as any)}
                  />
                  <Input
                    label={t(
                      TRANSLATION_KEYS.user.form.fields.phoneNumber.label
                    )}
                    type="tel"
                    icon={<Phone />}
                    {...register("phoneNumber")}
                    error={t(errors.phoneNumber?.message as any)}
                  />
                  <div className="date-wrapper flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t(TRANSLATION_KEYS.user.form.fields.dateOfBirth.label)}
                    </span>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t(
                            TRANSLATION_KEYS.user.form.fields.dateOfBirth
                              .placeholder
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="flex gap-3 items-center py-3 px-2">
                    <Switch
                      className="scale-135 cursor-pointer  data-[state=checked]:bg-brand-primary"
                      checked={user.status === UserStatus.Active}
                      onCheckedChange={(checked) => {
                        handleInputChange({
                          target: {
                            name: "status",
                            value: checked
                              ? UserStatus.Active
                              : UserStatus.Inactive,
                          },
                        } as any);
                      }}
                    />

                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t(TRANSLATION_KEYS.user.form.fields.status.label)}
                    </span>
                  </div>
                </div>

                {/* roles and permissions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t(TRANSLATION_KEYS.user.form.fields.roles.label)}
                    </span>
                    <Select
                      isMulti
                      className="w-full"
                      classNamePrefix="permission-select"
                      placeholder={t(
                        TRANSLATION_KEYS.user.form.fields.roles.description
                      )}
                      name="permissions"
                      options={roles.map((role) => ({
                        label: role.name,
                        value: role.id,
                      }))}
                      styles={permissionSelectStyles}
                      defaultValue={user.roles.map((x) => ({
                        label: x.name,
                        value: x.id,
                      }))}
                      onChange={(options: MultiValue<any>) => {
                        setUser((prev) => ({
                          ...prev,
                          roles: options.map((o) => ({
                            id: o.value,
                            name: o.label,
                          })),
                        }));
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t(TRANSLATION_KEYS.user.form.fields.permissions.label)}
                    </span>
                    <Select
                      isMulti
                      className="w-full"
                      classNamePrefix="permission-select"
                      placeholder={t(
                        TRANSLATION_KEYS.user.form.fields.permissions
                          .description
                      )}
                      name="permissions"
                      styles={permissionSelectStyles}
                      options={permissions.map((per) => ({
                        label: per.code,
                        value: per.id,
                      }))}
                      defaultValue={user.permissions?.map((x) => ({
                        label: x.code,
                        value: x.id,
                      }))}
                      onChange={(options: MultiValue<any>) => {
                        setUser((prev) => ({
                          ...prev,
                          permissions: options.map((o) => ({
                            id: o.value,
                            code: o.label,
                          })),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111722] shrink-0">
            <DialogClose asChild>
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  onRequestClose();
                  setUser(DefaultUser);
                }}
              >
                {t(TRANSLATION_KEYS.common.actions.cancel)}
              </button>
            </DialogClose>
            <LoadingButton
              onClick={handleSubmit(submit)}
              type="button"
              loading={submitLoading}
              text={t(TRANSLATION_KEYS.common.actions.save)}
              className="px-4 py-2 rounded bg-brand-primary text-white hover:bg-brand-primary-hover cursor-pointer"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Skeleton = () => (
  <div className="overflow-y-auto flex-1 p-6 sm:p-8 animate-pulse">
    <div className="flex flex-col gap-8">
      {/* Profile info section */}
      <div className="flex items-center flex-col md:flex-row gap-4 md:items-start p-4 rounded-xl border border-gray-200 bg-gray-100/50">
        {/* Avatar */}
        <SkeletonBlock className="h-24 w-24 rounded-full" />

        {/* User info */}
        <div className="flex flex-col flex-1 gap-2 items-center md:items-start">
          <SkeletonBlock className="h-5 w-48" />
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-4 w-32" />

          <div className="flex gap-2 mt-2">
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-24" />
          </div>
        </div>

        {/* Change photo button */}
        <SkeletonBlock className="h-10 w-32 mt-0 md:mt-6" />
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonInput />
        <SkeletonInput />
        <SkeletonWideInput />
        <SkeletonWideInput />
        <SkeletonWideInput />
        <SkeletonToggle />
      </div>

      {/* Roles & Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SkeletonWideInput />
        <SkeletonWideInput />
      </div>
    </div>
  </div>
);
