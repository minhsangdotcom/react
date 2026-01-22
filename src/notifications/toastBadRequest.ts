import toast from "react-hot-toast";

export const showBadRequestToast = (message?: string) => {
  toast.error(message ?? "The request is invalid. Please check your input.", {
    id: "bad-request",
    duration: 4000,
    position: "top-right",
    style: {
      background: "#FFFBEB", // amber-50
      color: "#92400E", // amber-800
      border: "1px solid #FCD34D", // amber-300
      fontWeight: 500,
    },
    iconTheme: {
      primary: "#F59E0B", // amber-500
      secondary: "#FFFBEB",
    },
  });
};
