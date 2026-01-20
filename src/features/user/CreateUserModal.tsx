import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "@/design-system/cn/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { genderOptions } from "./Gender";
import { MultiValue } from "react-select";
import Select from "react-select";
import PasswordInput from "@/components/PasswordInput";
import { Mail, Phone } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import DefaultUser, { IPermissionModel, IRoleModel, IUser } from "./IUser";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { UserStatus } from "./UserStatus";

import { DateInput } from "@/components/DateInput";
import { userService } from "./userService";
import LoadingButton from "@/components/LoadingButton";
import Input from "./UserInput";
import genderSelectStyles from "./gender-select-style";
import permissionSelectStyles from "./permission-select-style";
import {
  DividerSkeleton,
  SkeletonInput,
  SkeletonSelect,
} from "@/components/Skeleton";
import { createUserSchema, createUserSchemaType } from "./userSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
dayjs.extend(utc);

interface CreateUserProps {
  open: boolean;
  roles: IRoleModel[];
  permissions: IPermissionModel[];
  onRequestClose: () => void;
}

export default function CreateUserModal({
  open,
  roles,
  permissions,
  onRequestClose,
}: CreateUserProps) {
  const [user, setUser] = useState<IUser>(DefaultUser);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);

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
    try {
      await userService.create(formData);
    } catch (error) {
      //
    } finally {
      onRequestClose();
      setUser(DefaultUser);
      resetForm();
      setSubmitLoading(false);
    }
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
              Create new user
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
                          className="w-32 rounded-full object-cover"
                        />
                      </span>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white">
                          upload
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
                    Upload Avatar
                    <br />
                    <span className="text-xs opacity-70">Max 2MB</span>
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="First Name"
                    type="text"
                    {...register("firstName")}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    {...register("lastName")}
                    error={errors.lastName?.message}
                  />

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Gender
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
                      Date of Birth
                    </span>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          value={field.value}
                          onChange={field.onChange}
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
                  Contact & Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Email Address"
                    type="email"
                    icon={<Mail />}
                    {...register("email")}
                    error={errors.email?.message}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    icon={<Phone />}
                    {...register("phoneNumber")}
                    error={errors.phoneNumber?.message}
                  />
                  <Input
                    label="Username"
                    type="text"
                    autoComplete="username"
                    {...register("username")}
                    error={errors.username?.message}
                  />
                  <div className="flex flex-col gap-2">
                    <PasswordInput
                      label="Password"
                      labelClassName="text-sm font-medium text-gray-700 dark:text-gray-200"
                      inputClassName="w-full rounded-lg border focus:outline-none border-gray-300 bg-white text-gray-900 h-12 px-4 focus:ring-2 focus:ring-blue-300"
                      errorClassName="text-xs text-red-500 mt-0.5"
                      {...register("password")}
                      error={errors.password?.message}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-border-dark w-full" />

              {/* Access Control */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Access Control
                  </h3>
                  <label className="inline-flex items-center cursor-pointer gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Status
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="status"
                        checked={user.status == UserStatus.Active}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Roles
                    </span>
                    <Select
                      isMulti
                      className="w-full"
                      classNamePrefix="permission-select"
                      placeholder="Add permissions..."
                      name="permissions"
                      options={roles.map((role) => ({
                        label: role.name,
                        value: role.id,
                      }))}
                      styles={permissionSelectStyles}
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
                      Permissions
                    </span>
                    <Select
                      isMulti
                      className="w-full"
                      classNamePrefix="permission-select"
                      placeholder="Add permissions..."
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
              </div>
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
                Cancel
              </button>
            </DialogClose>
            <LoadingButton
              onClick={handleSubmit(submit)}
              type="button"
              loading={submitLoading}
              text="Create"
              className="px-4 py-2 rounded bg-brand-primary text-white hover:bg-brand-primary-hover cursor-pointer"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Avatar & Basic Info */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4 min-w-40">
          <div className="w-32 h-32 rounded-full bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200 opacity-70" />
        </div>

        {/* Basic info inputs */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonSelect />
          <SkeletonInput />
        </div>
      </div>

      <DividerSkeleton />

      {/* Contact & Account */}
      <div>
        <div className="h-5 w-48 rounded bg-gray-200 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonInput />
        </div>
      </div>

      <DividerSkeleton />

      {/* Access Control */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-6 w-14 rounded-full bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonSelect />
          <SkeletonSelect />
        </div>
      </div>
    </div>
  );
};
