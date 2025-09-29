import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
}) => {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
