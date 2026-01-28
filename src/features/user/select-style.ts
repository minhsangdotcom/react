import { StylesConfig } from "react-select";

const permissionSelectStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "8px",
    borderColor: state.isFocused ? "transparent" : "#D1D5DB",
    boxShadow: state.isFocused
      ? "0 0 0 2px #93C5FD" // blue-300
      : "none",
    backgroundColor: "white",
    padding: "4px",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#D1D5DB",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9CA3AF",
    fontSize: "14px",
  }),

  /* CHIPS */
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#ECFDF5", // green-50
    borderRadius: "6px",
    padding: "2px 4px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "#047857", // green-700
    fontSize: "13px",
    fontWeight: 500,
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#047857",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#D1FAE5",
      color: "#065F46",
    },
  }),

  /* DROPDOWN ARROW */
  dropdownIndicator: (base) => ({
    ...base,
    color: "#6B7280",
    padding: "0 6px",
    ":hover": {
      color: "#374151",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    zIndex: 50,
  }),

  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#2563EB"
      : state.isFocused
        ? "#F3F4F6"
        : "white",
    color: state.isSelected ? "white" : "#111827",
  }),
  singleValue: (base: any) => ({ ...base, color: "#333" }),
};

const roleSelectStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "8px",
    borderColor: state.isFocused ? "transparent" : "#D1D5DB",
    boxShadow: state.isFocused
      ? "0 0 0 2px #93C5FD" // blue-300
      : "none",
    backgroundColor: "white",
    padding: "4px",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#D1D5DB",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9CA3AF",
    fontSize: "14px",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#111827",
    fontSize: "14px",
    fontWeight: 500,
  }),

  /* DROPDOWN ARROW */
  dropdownIndicator: (base) => ({
    ...base,
    color: "#6B7280",
    padding: "0 6px",
    ":hover": {
      color: "#374151",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    zIndex: 50,
  }),

  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#93C5FD"
      : state.isFocused
        ? "#F3F4F6"
        : "white",
    color: state.isSelected ? "white" : "#111827",
  }),
};
export { permissionSelectStyles, roleSelectStyles };
