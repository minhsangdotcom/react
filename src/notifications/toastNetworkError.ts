import toast from "react-hot-toast";

export const showNetworkErrorToast = () => {
  toast.error("Cannot connect to the server. Please check your network.", {
    id: "network-error",
    duration: 8000,
    position: "top-right",
    style: {
      background: "#EFF6FF", // blue-50
      color: "#1E40AF", // blue-800
      border: "1px solid #93C5FD", // blue-300
      fontWeight: 500,
    },
    iconTheme: {
      primary: "#2563EB", // blue-600
      secondary: "#EFF6FF",
    },
  });
};
