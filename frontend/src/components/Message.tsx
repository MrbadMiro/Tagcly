import React from "react";

interface MessageProps {
  variant?: "success" | "error" | "info"; // You can add more variants if needed
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant = "info", children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return <div className={`p-4 rounded ${getVariantClass()}`}>{children}</div>;
};

export default Message;
