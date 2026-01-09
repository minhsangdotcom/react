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
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Select, { MultiValue } from "react-select";
import Input from "./Input";
import DefaultIUser, { IUser, IUserResponse } from "./IUser";
import { Gender } from "./Gender";
import { UserStatus } from "./UserStatus";
import { userService } from "./userService";
import permissionService from "@/services/permission/permissionService";
import { IRole } from "../role/IRole";
import { roleService } from "../role/roleService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IPermissionResponse } from "@/types/permission/IPermission";
import permissionSelectStyles from "./permission-select-style";
dayjs.extend(utc);

const toIUser = (dto: IUserResponse): IUser => {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    dateOfBirth: dto.dateOfBirth,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
    avatar: dto.avatar ?? "/images/avatar-boy.png",
    id: dto.id,
    createdAt: dto.createdAt,
    gender: dto.gender,
    status: dto.status,
    username: dto.username,
    roles: dto.roles.map((x) => ({ id: x.id, name: x.name })),
    permissions: dto.permissions.map((x) => ({ id: x.id, code: x.code })),
  } as IUser;
};

export default function UpdateUserPopup({
  open,
  setOpen,
  userId,
}: {
  open: boolean;
  setOpen: any;
  userId: string;
}) {
  const [user, setUser] = useState<IUser>(DefaultIUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [permissions, setPermissions] = useState<
    { id: string; code: string }[]
  >([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries({
      ...user,
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

    setLoading(true);
    var result = await userService.update(userId, formData);

    const data = result.data?.results;
    if (result.isSuccess && data) {
      setOpen(false);
      setUser(DefaultIUser);
    }
    setLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    setLoading(true);
    InitUser();
    setLoading(false);
  }, [open]);

  async function InitUser() {
    const result = await userService.get(userId);
    const permissionResult = await permissionService.list();
    const roleResult = await roleService.list({});

    if (result.data?.status !== 200) {
      return;
    }
    if (permissionResult.data?.status !== 200) {
      return;
    }
    if (roleResult.data?.status !== 200) {
      return;
    }

    const user = result.data.results as IUserResponse;
    const permissions = permissionResult.data.results!.flatMap(
      (group) => group.permissions
    );
    const roles = roleResult.data.results! as IRole[];

    setPermissions([
      ...permissions!.map((x) => ({ id: x.id, code: x.codeTranslation })),
    ]);
    setRoles([...roles.map((x) => ({ id: x.id, name: x.name }))]);

    const userPermissions = user.permissions;
    const currentPermission = permissions
      ?.filter((permission) =>
        userPermissions?.some((p) => p.id == permission.id)
      )
      .map((x) => ({
        id: x.id,
        code: x.codeTranslation,
      })) as IPermissionResponse[];
    console.log("🚀 ~ InitUser ~ currentPermission:", currentPermission);

    setUser((pre) => ({
      ...pre,
      ...toIUser({ ...user, permissions: currentPermission }),
    }));
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    user.id && (
      <Dialog open={open}>
        <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-black/40 backdrop-blur-[2px]">
          <div className="relative w-full max-w-4xl flex flex-col max-h-[90vh] rounded-xl shadow-2xl bg-background-card border border-background-border overflow-hidden bg-white">
            {/* Header title */}
            <DialogHeader className="flex justify-between px-6 py-5 border-b border-background-border shrink-0 bg-background-card">
              <DialogTitle className="text-black tracking-tight text-xl font-bold leading-tight">
                Update User
              </DialogTitle>
            </DialogHeader>

            {/* Content */}
            <div className="overflow-y-auto custom-scrollbar flex-1 p-6 sm:p-8">
              <div className="flex flex-col gap-8">
                {/* profile info section*/}
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-4 rounded-xl bg-background-input border border-background-border">
                  <div className="relative group">
                    <img
                      className="bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 border-2 border-background-border shadow-sm"
                      src={user.avatar!}
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4 className="text-black text-xl font-bold leading-tight">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-sm font-normal text-gray-500">
                      Username: @{user.username}
                    </p>
                    <p className="text-sm font-normal text-gray-500">
                      Gender: {Gender[user.gender as Gender]}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                          true
                            ? "bg-green-200 text-green-400"
                            : "bg-red-200 text-red-400"
                        }`}
                      >
                        {UserStatus[user.status as UserStatus]}
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
                      <span>Change Photo</span>
                    </button>
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    type="text"
                    value={user.firstName}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    type="text"
                    value={user.lastName}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    icon={<Mail />}
                    value={user.email}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    icon={<Phone />}
                    value={user.phoneNumber}
                    onChange={handleInputChange}
                  />
                  <div className="date-wrapper flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Date of Birth
                    </span>
                    <DateInput
                      value={user.dateOfBirth}
                      onChange={(date) =>
                        setUser((pre) => ({ ...pre, dateOfBirth: date }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-white text-sm font-medium">
                      Account Status
                    </p>
                    <div className="h-12 flex items-center px-1">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="status"
                          checked={user.status === UserStatus.Active}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-[#324467] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                        <span className="ms-3 text-sm font-medium ">
                          Active User
                        </span>
                      </label>
                    </div>
                  </div>
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
                      placeholder="Add Roles..."
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
                      Permissions
                    </span>
                    <Select
                      isMulti
                      className="w-full"
                      classNamePrefix="permission-select"
                      placeholder="Add permissions..."
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

            {/* Footer */}
            <DialogFooter className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111722] shrink-0">
              <DialogClose asChild>
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    setUser(DefaultIUser);
                  }}
                >
                  Cancel
                </button>
              </DialogClose>
              <LoadingButton
                onClick={handleSubmit}
                type="button"
                loading={loading}
                text="Update"
                className="px-4 py-2 rounded bg-brand-primary text-white hover:bg-brand-primary-hover cursor-pointer"
              />
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
