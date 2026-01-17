import { DialogContent } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dscn/components/ui/dialog";
import { ulid } from "ulidx";
import { roleService } from "@/features/role/roleService";
import permissionService from "@services/permission/permissionService";
import {
  IGroupPermissionResponse,
  IPermission,
  IPermissionGroup,
  IPermissionResponse,
} from "@/types/permission/IPermission";
import { IRoleResponse } from "@/features/role/IRole";
import LoadingButton from "@/components/LoadingButton";
import { roleSchema, roleSchemaType } from "./roleSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function mapPermission(permission: any): IPermission {
  return {
    id: ulid(),
    permissionId: permission.id,
    code: permission.code,
    label: permission.codeTranslation,
    checked: false,
    expanded: false,
    children: permission.children?.map(mapPermission) ?? [],
    createdAt: permission.createdAt,
  };
}

export function mapPermissionGroups(
  response: IGroupPermissionResponse[]
): IPermissionGroup[] {
  return response.map((group) => ({
    name: group.name,
    label: group.nameTranslation,
    permissions: group.permissions.map(mapPermission),
  }));
}

interface PermissionNodeProps {
  node: IPermission;
  level?: number;
  onToggleCheck: (id: string, checked: boolean) => void;
  onToggleExpand: (id: string) => void;
}

function PermissionNode({
  node,
  level = 0,
  onToggleCheck,
  onToggleExpand,
}: PermissionNodeProps) {
  const hasChildren = node.children.length > 0;
  const indent = Math.min(level, 4) * 16;

  return (
    <div style={{ marginLeft: indent }}>
      <div className="flex items-center gap-2 py-1 min-w-0">
        {/* Expand / collapse */}
        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggleExpand(node.id)}
            className="w-4 text-xs text-gray-400 hover:text-black"
          >
            {node.expanded ? "▼" : "▶"}
          </button>
        )}

        {!hasChildren && <span className="w-4" />}

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={node.checked}
          disabled={node.inherited}
          onChange={(e) => onToggleCheck(node.id, e.target.checked)}
          className="h-4 w-4 rounded border-gray-600 bg-gray-800"
        />

        {/* Label (truncate prevents overflow) */}
        <span className="text-sm truncate max-w-60">{node.label}</span>
      </div>

      {/* Children */}
      {hasChildren && node.expanded && (
        <div className="space-y-1">
          {node.children.map((child) => (
            <PermissionNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggleCheck={onToggleCheck}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function toggleRecursive(node: IPermission, checked: boolean): IPermission {
  return {
    ...node,
    checked,
    inherited: false,
    children: node.children.map((child) => ({
      ...toggleRecursive(child, checked),
      checked,
      inherited: checked,
    })),
  };
}

function updatePermissions(
  list: IPermission[],
  uiId: string,
  checked: boolean
): IPermission[] {
  return list.map((node) => {
    if (node.id === uiId) {
      return toggleRecursive(node, checked);
    }

    if (node.children.length > 0) {
      return {
        ...node,
        children: updatePermissions(node.children, uiId, checked),
      };
    }

    return node;
  });
}

function collectCheckedParents(list: IPermission[]): string[] {
  return list.flatMap((p) => [
    ...(p.checked && !p.inherited ? [p.permissionId] : []),
  ]);
}

function getCheckedPermissions(
  list: IPermissionResponse[],
  permissions: IPermission[]
): Array<{ id: string; permissionId: string }> {
  return permissions
    .flatMap((p) => ({
      id: p.id,
      permissionId: p.permissionId,
    }))
    .filter((p) => list.some((lp) => lp.id === p.permissionId));
}

function markAsChecked(
  list: IPermission[],
  checkedCodes: Array<{ id: string; permissionId: string }>,
  isInherited = false
): IPermission[] {
  return list.map((node) => {
    let isChecked =
      checkedCodes.some(
        (c) => c.permissionId === node.permissionId && c.id === node.id
      ) || isInherited;
    return {
      ...node,
      checked: isChecked,
      inherited: isInherited,
      children: markAsChecked(node.children, checkedCodes, isChecked),
    };
  });
}

export default function RolePopup({
  open,
  setOpen,
  setRoleId,
  roleId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRoleId: React.Dispatch<React.SetStateAction<string | null>>;
  roleId: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<roleSchemaType>({
    resolver: zodResolver(roleSchema),
  });

  const [groups, setGroups] = useState<IPermissionGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    init();
  }, [open]);

  async function init() {
    const result = await permissionService.list();
    if (!result?.data?.results?.length) {
      return;
    }
    const permissions = result.data.results as IGroupPermissionResponse[];
    let groups = mapPermissionGroups(permissions);

    if (roleId) {
      const roleResponse = await roleService.getById(roleId!);

      if (!roleResponse.isSuccess) {
        return;
      }
      const role = roleResponse.data!.results as IRoleResponse;

      reset({
        name: role.name,
        description: role.description,
      });

      const checkedPermissions = getCheckedPermissions(
        role.permissions,
        groups.flatMap((g) => g.permissions)
      );
      groups = groups.map((g) => {
        const updatedPermission = markAsChecked(
          g.permissions,
          checkedPermissions
        );
        return {
          ...g,
          permissions: updatedPermission,
        };
      });
    }

    setGroups(groups);
  }

  const onToggleCheck = (id: string, checked: boolean) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        permissions: updatePermissions(g.permissions, id, checked),
      }))
    );
  };

  function toggleExpand(list: IPermission[], id: string): IPermission[] {
    return list.map((node) => {
      if (node.id === id) {
        return { ...node, expanded: !node.expanded };
      }

      if (node.children.length > 0) {
        return {
          ...node,
          children: toggleExpand(node.children, id),
        };
      }

      return node;
    });
  }

  const onToggleExpand = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        permissions: toggleExpand(g.permissions, id),
      }))
    );
  };

  const submit = async (data: any) => {
    const permissionIds = collectCheckedParents(
      groups.flatMap((g) => g.permissions)
    );

    const payload = {
      name: data.name,
      description: data.description,
      permissionIds,
    };
    setLoading(true);
    if (roleId) {
      await roleService.update(roleId!, payload);
    } else {
      await roleService.create(payload);
    }

    reset({ name: "", description: "" });
    setLoading(false);
    setRoleId(null);
    setGroups([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={roleId ? "update-role" : "create-role"}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[2px]"
      >
        <div className="bg-white rounded-xl p-6 w-200 max-w-full shadow-lg max-h-[90vh] flex flex-col border border:grey-100">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg font-semibold">
              {roleId ? "Update Role" : "Create New Role"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
            {/* Left side: Name & Description */}
            <div className="space-y-4">
              <input
                type="text"
                className={`w-full border p-2 rounded focus:outline-none ${
                  errors.name
                    ? "border-red-300 focus:ring-red-300"
                    : "focus:border-blue-200 focus:ring-blue-300"
                }`}
                placeholder="Role Name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              <textarea
                className={`w-full border p-2 rounded focus:outline-none ${
                  errors.description
                    ? "border-red-300 focus:ring-red-300"
                    : "focus:border-blue-200 focus:ring-blue-300"
                }`}
                placeholder="Description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Right side: Permissions */}
            <div className="space-y-4 rounded p-2 overflow-auto">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Permissions
              </h3>

              {groups.map((group) => (
                <div key={group.name}>
                  <h4 className="mb-1 text-md font-medium">{group.label}</h4>

                  {group.permissions.map((p) => (
                    <PermissionNode
                      key={p.id}
                      node={p}
                      onToggleCheck={onToggleCheck}
                      onToggleExpand={onToggleExpand}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <DialogFooter className="flex justify-end space-x-2 pt-6">
            <DialogClose asChild>
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  reset({ name: "", description: "" });
                  setGroups([]);
                  setRoleId(null);
                }}
              >
                Cancel
              </button>
            </DialogClose>
            <LoadingButton
              loading={loading}
              text={roleId ? "Update" : "Create"}
              onClick={handleSubmit(submit)}
              type="button"
              className="px-4 py-2 rounded bg-brand-primary text-white hover:bg-brand-primary-hover cursor-pointer"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
