import toast from "react-hot-toast";

export const showNotFoundToast = () => {
  toast.error("The requested resource was not found.", {
    id: "not-found",
    duration: 4000,
    position: "top-right",
    style: {
      background: "#F3F4F6", // gray-100
      color: "#374151", // gray-700
      border: "1px solid #D1D5DB", // gray-300
      fontWeight: 500,
    },
    iconTheme: {
      primary: "#6B7280", // gray-500
      secondary: "#F3F4F6",
    },
  });
};
