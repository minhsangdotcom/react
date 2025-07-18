import { DialogContent } from "@radix-ui/react-dialog";
import { useState, useLayoutEffect, useRef } from "react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { IPermission, Permissions } from "@/src/config/permission";
import authService from "@/src/services/auth/authService";
import { ulid } from "ulidx";
import { roleService } from "@/src/services/roles/roleService";
import { IRoleClaim } from "@/src/types/role/IRole";

function mapping(roleClaims: IRoleClaim[], allPermissions: IPermission[]) {
  return (
    roleClaims.map((permission: any) => {
      const id = permission.id;
      const result: any = {
        label: permission.claimValue,
        value: permission.claimValue,
        roleId: id,
      };

      const listPermission = Permissions.find(
        (x: IPermission) => x.value == permission.claimValue
      ) as IPermission;

      const childrenPermissions = listPermission?.children
        ? [...listPermission.children]
        : [];

      childrenPermissions.forEach((child: IPermission) => {
        const childPermission = allPermissions
          .flatMap((x: any) => x.children)
          .find((p) => p?.value == child.value);
        child.id = childPermission?.id!;
      });

      const per: any = allPermissions.find(
        (x: any) => x.value == permission.claimValue
      );
      result.id = per?.id!;
      result.children = childrenPermissions;
      return result;
    }) ?? []
  );
}

async function init(
  setAvailablePermissions: any,
  setName: any,
  setDescription: any,
  setSelectedPermissions: any,
  roleId: string,
  mode: "create" | "update"
) {
  const apiResults = await authService.listPermission();

  if (apiResults?.data?.results?.length! <= 0) {
    return;
  }

  const listPermission = apiResults!.data!.results!.map((x) => x.claimValue);
  const allPermissions = listPermission.map((permission) => {
    const permissions = Permissions.find((x) => x.value == permission);
    permissions?.children?.forEach((x) => (x.id = ulid()));
    return {
      id: ulid(),
      label: permission,
      value: permission,
      children: permissions?.children,
    } as IPermission;
  });
  setAvailablePermissions(allPermissions);

  if (mode === "update") {
    const apiResults = await roleService.getById(roleId);

    if (!apiResults.isSuccess) {
      return;
    }

    const role = apiResults.data!.results;
    setName(role?.name!);
    setDescription(role?.description ?? "");

    const roleClaims = [...role!.roleClaims!];
    const rolePermissions = mapping(roleClaims, allPermissions);

    const initialSelected = rolePermissions.flatMap((p) => {
      const selectedItem = [{ roleId: p.roleId, value: p.value, id: p.id }];
      const childrenItem = p.children?.map((c: any) => ({
        value: c.value,
        id: c.id,
      }));
      return [...new Set(selectedItem), ...new Set(childrenItem)];
    });
    setSelectedPermissions(initialSelected);
  }
}

export default function AddRoleModal({ onSubmit, setOpen, roleId, mode }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [selectedPermissions, setSelectedPermissions] = useState<
    { id: string; value: string; roleId: string }[]
  >([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    IPermission[]
  >([]);

  console.log("🚀 ~ AddRoleModal ~ selectedPermissions:", selectedPermissions);
  const didInit = useRef(false);

  useLayoutEffect(() => {
    if (didInit.current) {
      return;
    }
    didInit.current = true;

    init(
      setAvailablePermissions,
      setName,
      setDescription,
      setSelectedPermissions,
      roleId,
      mode
    );
  }, []);

  const handlePermissionToggle = (
    { id, value, roleId }: { id: string; value: string; roleId: string },
    children?: IPermission[]
  ) => {
    setSelectedPermissions((prev: any) => {
      const isSelected = prev.some((x: any) => x.id == id);

      if (isSelected) {
        return prev.filter(
          (v: any) =>
            v.id !== id && !children?.some((child) => child.id === v.id)
        );
      }

      const newItems = [{ id, value, roleId }];
      return [...new Set([...prev, ...newItems])];
    });
  };

  const handleSubmit = () => {
    const distinctByValue = (() => {
      const m = new Map<string, (typeof selectedPermissions)[0]>();
      for (const p of selectedPermissions) {
        const existing = m.get(p.value);
        if (
          !existing ||
          (existing.roleId === undefined && p.roleId !== undefined)
        ) {
          m.set(p.value, p);
        }
      }
      return Array.from(m.values());
    })();

    const roleClaims = distinctByValue.map((p) => ({
      id: mode === "update" ? p.roleId : undefined,
      claimType: "Permission",
      claimValue: p.value,
    }));
    console.log("🚀 ~ roleClaims ~ roleClaims:", roleClaims);
    const payload = {
      name,
      description,
      roleClaims,
    };
    onSubmit(payload);
    setSelectedPermissions([]);
  };

  return (
    <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[800px] max-w-full shadow-lg">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-semibold">
            Create New Role
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left side: Name & Description */}
          <div className="space-y-4">
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              placeholder="Role Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Right side: Permissions */}
          <div>
            <h4 className="font-medium mb-2">Permissions</h4>
            <div className="max-h-64 overflow-y-auto shadow-md rounded p-3 space-y-2 bg-white">
              {RenderPermissions(
                availablePermissions,
                selectedPermissions,
                handlePermissionToggle
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <DialogFooter className="flex justify-end space-x-2 pt-6">
          <DialogClose asChild>
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={(_) => {
                setOpen((pre: any) => ({
                  ...pre,
                  isCreateOpen: false,
                  isUpdateOpen: false,
                }));
                setSelectedPermissions([]);
                setName("");
                setDescription("");
                setAvailablePermissions([]);
              }}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
          >
            {roleId ? "Update" : "Create"}
          </button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}

function RenderPermissions(
  availablePermissions: IPermission[],
  selectedPermissions: { id: string; value: string }[],
  handlePermissionToggle: any
) {
  return availablePermissions.map((perm: IPermission) => {
    const parentChecked = selectedPermissions.some((x) => x.id === perm.id);
    return (
      <div key={perm.id}>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={parentChecked}
            onChange={() =>
              handlePermissionToggle(
                { id: perm.id, value: perm.value, roleId: perm.roleId },
                perm.children
              )
            }
          />
          <span>{perm.label}</span>
        </label>

        {/* If permission has children and is selected, show them */}
        {perm.children && parentChecked && (
          <div className="pl-6 mt-2 space-y-2">
            {perm.children?.map((child: IPermission) => (
              <label
                key={child.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={parentChecked}
                  onChange={() =>
                    handlePermissionToggle(
                      { id: perm.id, value: perm.value, roleId: perm.roleId },
                      perm.children
                    )
                  }
                  disabled={true}
                />
                <span>{child.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  });
}
