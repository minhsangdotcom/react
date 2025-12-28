import { DialogContent } from "@radix-ui/react-dialog";
import { useState, useLayoutEffect, useRef } from "react";
import {
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
import ICreateRoleRequest from "@/features/role/ICreateRoleRequest";
import IUpdateRoleRequest from "@/features/role/IUpdateRoleRequest";

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
          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500"
        />

        {/* Label (truncate prevents overflow) */}
        <span className="text-sm text-black truncate max-w-[240px]">
          {node.label}
        </span>
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
  onCreate,
  onUpdate,
  setOpen,
  roleId,
}: {
  onCreate: (roleData: ICreateRoleRequest) => Promise<void>;
  onUpdate: (roleData: IUpdateRoleRequest) => Promise<void>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roleId: string | null;
}) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [groups, setGroups] = useState<IPermissionGroup[]>([]);

  const didInit = useRef(false);

  useLayoutEffect(() => {
    if (didInit.current) {
      return;
    }
    didInit.current = true;

    init();
  }, []);

  async function init() {
    const apiResults = await permissionService.listPermission();
    if (!apiResults?.data?.results?.length) {
      return;
    }

    const permissions = apiResults.data.results as IGroupPermissionResponse[];
    let groups = mapPermissionGroups(permissions);

    if (roleId) {
      const roleResponse = await roleService.getById(roleId!);
      const role = roleResponse.data?.results as IRoleResponse;

      setName(role?.name || "");
      setDescription(role?.description || "");

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

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const permissionIds = collectCheckedParents(
      groups.flatMap((g) => g.permissions)
    );

    const payload = {
      name,
      description,
      permissionIds,
    };

    if (roleId) {
      onUpdate(payload as IUpdateRoleRequest);
    } else {
      onCreate(payload as ICreateRoleRequest);
    }
  };

  return (
    <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[800px] max-w-full shadow-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-semibold">
            {roleId ? "Update Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
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
            <h1 className="mb-3 text-lg font-semibold text-gray-800">
              Permissions
            </h1>

            <div className="space-y-4 rounded overflow-auto max-h-[60vh] pr-2">
              <div className="min-w-max">
                {groups.map((group) => (
                  <div key={group.name}>
                    <h3 className="mb-1 font-medium">{group.label}</h3>

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
          </div>
        </div>

        {/* Action buttons */}
        <DialogFooter className="flex justify-end space-x-2 pt-6">
          <DialogClose asChild>
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => {
                setOpen(false);
                setName("");
                setDescription("");
                setGroups([]);
              }}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            className="px-4 py-2 rounded bg-brand-primary text-white hover:bg-brand-primary-hover"
            onClick={handleSubmit}
          >
            {roleId ? "Update" : "Create"}
          </button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
