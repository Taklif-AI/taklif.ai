import { toast } from "sonner";

export const Toast = {
  error: (message: string) => {
    toast.error(message, {
      duration: 7000,
      position: "top-center",
      className: "error-toast",
    });
  },

  success: (message: string) => {
    toast.success(message, {
      duration: 7000,
      position: "top-center",
      className: "success-toast",
    });
  },
};