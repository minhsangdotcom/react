import { StylesConfig } from "react-select";
const genderSelectStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    width: "100%",
    minHeight: "48px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "transparent" : "#D1D5DB",
    backgroundColor: "white",
    paddingLeft: "0.25rem",
    cursor: "pointer",
    boxShadow: state.isFocused ? "0 0 0 2px var(--color-blue-300)" : "none",
    "&:hover": {
      borderColor: "#D1D5DB",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 0.75rem",
  }),

  input: (base) => ({
    ...base,
    color: "#111827",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9CA3AF",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    paddingRight: "0.5rem",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#6B7280",
    "&:hover": {
      color: "#374151",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "0.5rem",
    zIndex: 50,
  }),

  option: (base, state) => ({
    ...base,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "rgba(91,192,222,0.2)"
      : state.isFocused
      ? "rgba(91,192,222,0.2)"
      : "white",
    color: state.isSelected ? "black" : "#111827",
  }),
};
export default genderSelectStyles;