import toast from "react-hot-toast";

export const showServerErrorToast = () => {
  toast.error("Something went wrong on our server. Please try again later.", {
    id: "server-error",
    duration: 6000,
    style: {
      background: "#FEF2F2",
      color: "#991B1B",
      border: "1px solid #FCA5A5",
      padding: "14px 16px",
      fontWeight: 500,
    },
    iconTheme: {
      primary: "#DC2626",
      secondary: "#FEF2F2",
    },
  });
};
