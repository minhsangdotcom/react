import { DialogContent } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { IPermission, Permissions } from "@/src/config/permission";
import authService from "@/src/services/auth/authService";
import { ulid } from "ulidx";

export default function AddRoleModal({ onSubmit, isOpen, setOpen }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<
    { id: string; value: string }[]
  >([]);
  const [availablePermissions, setAvailablePermissions] = useState<any>([]);

  useEffect(() => {
    authService.listPermission().then((data) => {
      if (data?.data?.results?.length! > 0) {
        const listPermission = data!.data!.results!.map((x) => x.claimValue);
        const a = Permissions.filter((x) =>
          listPermission.some((p) => p == x.value)
        ) as Array<IPermission>;
        a.forEach((x: IPermission) => {
          x.id = ulid();
          x.children?.forEach((p) => {
            p.id = ulid();
          });
        });
        setAvailablePermissions(a);
      }
    });
  }, [isOpen]);

  const handlePermissionToggle = (
    { id, value }: { id: string; value: string },
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

      const newItems = [{ id, value }];
      return Array.from(new Set([...prev, ...newItems]));
    });
  };

  const handleSubmit = () => {
    const payload = {
      name,
      description,
      roleClaims: selectedPermissions.map((permission) => ({
        claimType: "Permission",
        claimValue: permission.value,
      })),
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
              {availablePermissions?.map((perm: IPermission) => (
                <div key={perm.id}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.some((x) => perm.id == x.id)}
                      onChange={() =>
                        handlePermissionToggle(
                          { id: perm.id, value: perm.value },
                          perm.children
                        )
                      }
                    />
                    <span>{perm.label}</span>
                  </label>

                  {/* If permission has children and is selected, show them */}
                  {perm.children &&
                    selectedPermissions.some((x) => perm.id == x.id) && (
                      <div className="pl-6 mt-2 space-y-2">
                        {perm.children?.map((child: IPermission) => (
                          <label
                            key={child.id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.some(
                                (x) => perm.id == x.id
                              )}
                              onChange={() =>
                                handlePermissionToggle(
                                  { id: perm.id, value: perm.value },
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
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <DialogFooter className="flex justify-end space-x-2 pt-6">
          <DialogClose asChild>
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={(_) => {
                setOpen(false);
                setSelectedPermissions([]);
              }}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Create
          </button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
