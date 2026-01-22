import toast from "react-hot-toast";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#ECFDF5", // green-50
      color: "#065F46", // green-800
      border: "1px solid #6EE7B7", // green-300
      fontWeight: 500,
    },
    iconTheme: {
      primary: "#10B981", // green-500
      secondary: "#ECFDF5",
    },
  });
};
