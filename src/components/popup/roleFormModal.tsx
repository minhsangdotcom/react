import { DialogContent } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function AddRoleModal({ onSubmit }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [availablePermissions, setAvailablePermissions] = useState([
    {
      label: "Users",
      value: "Users",
      children: [
        { label: "View Users", value: "Users.View" },
        { label: "Edit Users", value: "Users.Edit" },
      ],
    },
    {
      label: "Roles",
      value: "Roles",
      children: [
        { label: "View Roles", value: "Roles.View" },
        { label: "Create Roles", value: "Roles.Create" },
      ],
    },
  ]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/permissions") // Replace with your actual endpoint
      .then((res) => res.json())
      .then((data) => setAvailablePermissions(data));
  }, []);

  const handlePermissionToggle = (value: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    const payload = {
      name,
      description,
      roleClaims: selectedPermissions.map((value) => ({
        claimType: "Permission",
        claimValue: value,
      })),
    };
    onSubmit(payload);
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
              {availablePermissions.map((perm) => (
                <div key={perm.value}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.value)}
                      onChange={() => handlePermissionToggle(perm.value)}
                    />
                    <span>{perm.label}</span>
                  </label>

                  {/* If permission has children and is selected, show them */}
                  {perm.children &&
                    selectedPermissions.includes(perm.value) && (
                      <div className="pl-6 mt-2 space-y-2">
                        {perm.children.map((child) => (
                          <label
                            key={child.value}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(
                                child.value
                              )}
                              onChange={() =>
                                handlePermissionToggle(child.value)
                              }
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
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
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
