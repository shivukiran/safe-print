// components/ui/use-toast.ts
import { toast as sonnerToast } from "sonner"; // or your preferred toast library

export const toast = ({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}) => {
  sonnerToast[variant === "destructive" ? "error" : "success"](
    `${title}: ${description}`
  );
};
