import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "@/design-system/cn/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { createGenderOptions } from "./Gender";
import { MultiValue } from "react-select";
import Select from "react-select";
import PasswordInput from "@/components/PasswordInput";
import { Mail, Phone } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import DefaultUser, { PermissionModel, RoleModel, User } from "./IUser";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { UserStatus } from "./UserStatus";
import { DateInput } from "@/components/DateInput";
import { userService } from "./userService";
import LoadingButton from "@/components/LoadingButton";
import Input from "./UserInput";
import { genderSelectStyles } from "./genderSelectStyles";
import { permissionSelectStyles, roleSelectStyles } from "./selectStyle";
import { createUserSchema, createUserSchemaType } from "./userSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEYS } from "@/config/translationKey";
import { Switch } from "@/design-system/cn/components/ui/switch";
dayjs.extend(utc);

interface CreateUserProps {
  open: boolean;
  roles: RoleModel[];
  permissions: PermissionModel[];
  language: string;
  onRequestClose: () => void;
  onSubmit: () => void;
}

export default function CreateUserModal({
  open,
  language,
  roles,
  permissions,
  onRequestClose,
  onSubmit,
}: CreateUserProps) {
  const [user, setUser] = useState<User>(DefaultUser);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const { t } = useTranslation();
  const genderOptions = createGenderOptions(t);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<createUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: setDefault(),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    if (!img.type.startsWith("image/")) {
      return;
    }
    setAvatar(img);
    setUser((pre) => ({ ...pre, avatar: URL.createObjectURL(img) }));
  };

  const submit = async (data: createUserSchemaType) => {
    const formData = new FormData();

    Object.entries({
      ...data,
      status: user.status,
      roles: user.roles.map((x) => x.id),
      permissions: user.permissions?.map((x) => x.id),
    }).forEach(([key, val]) => {
      if (!val || val == "") return;
      if (key === "avatar") return;
      if (key === "dateOfBirth" && val != dayjs().toDate().toString()) {
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
    const result = await userService.create(formData);

    if (result.success) {
      onSubmit();
      setUser(DefaultUser);
      resetForm();
      onRequestClose();
    }

    setSubmitLoading(false);
  };

  function setDefault() {
    return {
      email: DefaultUser.email,
      dateOfBirth: DefaultUser.dateOfBirth,
      firstName: DefaultUser.firstName,
      lastName: DefaultUser.lastName,
      gender: DefaultUser.gender,
      password: DefaultUser.password,
      phoneNumber: DefaultUser.phoneNumber,
      username: DefaultUser.username,
    };
  }

  function resetForm() {
    reset({ ...setDefault() });
  }

  return (
    <Dialog open={open}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[2px]">
        <div className="flex flex-col w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 animate-fade-in-up bg-white">
          {/*Header*/}
          <DialogHeader className="flex justify-between px-6 py-5 border-b border-gray-200 dark:border-border-dark bg-background-light dark:bg-background-dark shrink-0">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {t(TRANSLATION_KEYS.user.modal.create.title)}
            </DialogTitle>
          </DialogHeader>

          {/*Content*/}
          <div className="flex-1 overflow-y-auto p-6 relative">
            <form id="create-user-form" className="flex flex-col gap-8">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4 min-w-40">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-input-dark flex items-center justify-center group-hover:border-primary transition-colors relative">
                      <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-text-muted">
                        <img
                          src={user.avatar!}
                          className="w-full h-32 rounded-full object-cover"
                        />
                      </span>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white">
                          {t(TRANSLATION_KEYS.common.actions.upload)}
                        </span>
                      </div>
                      <input
                        ref={fileInputRef}
                        accept="image/*"
                        hidden
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-text-muted text-center">
                    {t(TRANSLATION_KEYS.user.form.fields.avatar.label)}
                    <br />
                    <span className="text-xs opacity-70">
                      {t(TRANSLATION_KEYS.user.form.fields.avatar.description)}
                    </span>
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
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

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t(TRANSLATION_KEYS.user.form.fields.gender.label)}
                    </span>
                    <div className="relative">
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={genderOptions}
                            styles={genderSelectStyles}
                            placeholder={t(
                              TRANSLATION_KEYS.user.form.fields.gender
                                .placeholder
                            )}
                            value={
                              genderOptions.find(
                                (x) => x.value.toString() == field.value
                              ) ?? null
                            }
                            onChange={(option: any) => {
                              field.onChange(option?.value ?? null);
                            }}
                            isClearable
                          />
                        )}
                      />
                    </div>
                  </div>

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
                          locale={language}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-border-dark w-full" />
              {/* Contact & Account */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  {t(TRANSLATION_KEYS.user.form.sections.contactAndAccount)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <Input
                    label={t(TRANSLATION_KEYS.user.form.fields.username.label)}
                    type="text"
                    autoComplete="username"
                    {...register("username")}
                    error={t(errors.username?.message as any)}
                  />
                  <div className="flex flex-col gap-2">
                    <PasswordInput
                      label={t(
                        TRANSLATION_KEYS.user.form.fields.password.label
                      )}
                      labelClassName="text-sm font-medium text-gray-700 dark:text-gray-200"
                      inputClassName="w-full rounded-lg border focus:outline-none border-gray-300 bg-white text-gray-900 h-12 px-4 focus:ring-2 focus:ring-blue-300"
                      errorClassName="text-xs text-red-500 mt-0.5"
                      {...register("password")}
                      error={t(errors.password?.message as any)}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-border-dark w-full" />

              {/* Access Control */}
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {t(TRANSLATION_KEYS.user.form.sections.accessControl)}
                  </h3>
                  <div className="flex gap-3 items-center py-3 px-2">
                    <Switch
                      className="scale-135 cursor-pointer  data-[state=checked]:bg-brand-primary"
                      checked={user.status === UserStatus.Active}
                      onCheckedChange={(checked) => {
                        console.log("🚀 ~ CreateUserModal ~ checked:", checked);
                        setUser((pre) => ({
                          ...pre,
                          status:
                            checked === true
                              ? UserStatus.Active
                              : UserStatus.Inactive,
                        }));
                      }}
                    />
                    <span className="text-sm font-medium  text-gray-700 dark:text-gray-200">
                      {t(TRANSLATION_KEYS.user.form.fields.status.label)}
                    </span>
                    <br />
                  </div>
                </div>

                {/* role & permission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t(TRANSLATION_KEYS.user.form.fields.roles.label)}
                    </span>
                    <Select
                      className="w-full"
                      classNamePrefix="role-select"
                      placeholder={t(
                        TRANSLATION_KEYS.user.form.fields.roles.description
                      )}
                      name="roles"
                      options={roles.map((role) => ({
                        label: role.name,
                        value: role.id,
                      }))}
                      styles={roleSelectStyles}
                      onChange={(option: any) => {
                        setUser((prev) => ({
                          ...prev,
                          roles: [
                            {
                              id: option.value,
                              name: option.label,
                            },
                          ],
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
                      options={permissions.map((per) => ({
                        label: per.code,
                        value: per.id,
                      }))}
                      styles={permissionSelectStyles}
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
              </>
            </form>
          </div>

          {/*Footer*/}
          <DialogFooter className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111722] shrink-0">
            <DialogClose asChild>
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  onRequestClose();
                  setUser(DefaultUser);
                  resetForm();
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
