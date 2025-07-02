export const Permissions = [
  {
    label: "Create user",
    value: "create:user",
    children: [
      {
        label: "See List user",
        value: "list:user",
      },
    ],
  },
  {
    label: "Update user",
    value: "update:user",
    children: [
      {
        label: "See List user",
        value: "list:user",
      },
      {
        label: "See user Detail",
        value: "detail:user",
      },
    ],
  },
  {
    label: "Delete user",
    value: "delete:user",
    children: [
      {
        label: "See List user",
        value: "list:user",
      },
      {
        label: "See user Detail",
        value: "detail:user",
      },
    ],
  },
  {
    label: "See user detail",
    value: "detail:user",
    children: [
      {
        label: "See List user",
        value: "list:user",
      },
    ],
  },
  {
    label: "List user",
    value: "list:user",
  },

  {
    label: "Create role",
    value: "create:role",
    children: [
      {
        label: "See List role",
        value: "list:role",
      },
    ],
  },
  {
    label: "Update role",
    value: "update:role",
    children: [
      {
        label: "See List role",
        value: "list:role",
      },
      {
        label: "See role Detail",
        value: "detail:role",
      },
    ],
  },
  {
    label: "Delete role",
    value: "delete:role",
    children: [
      {
        label: "See List role",
        value: "list:role",
      },
      {
        label: "See role Detail",
        value: "detail:role",
      },
    ],
  },
  {
    label: "See role detail",
    value: "detail:role",
    children: [
      {
        label: "See List role",
        value: "list:role",
      },
    ],
  },
  {
    label: "List role",
    value: "list:role",
  },
] as Array<{
  label: string;
  value: string;
  children: Array<{ label: string; value: string }>;
}>;

export interface IPermission {
  id: string;
  label: string;
  value: string;
  children?: IPermission[];
}

