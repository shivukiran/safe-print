// components/ui/button.tsx
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "default" | "outline";
  className?: string;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "default", className = "", ...props }) => {
  const base = "px-4 py-2 rounded text-white font-medium focus:outline-none";
  const styles = {
    default: "bg-blue-600 hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 bg-red hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(base, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
