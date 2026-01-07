"use client";

interface BadgeProps {
  children: React.ReactNode;
  color?: "default" | "green" | "red" | "yellow";
}

export function Badge({ children, color = "default" }: BadgeProps) {
  const colors = {
    default: "bg-gray-200 text-gray-800",
    green: "bg-green-200 text-green-800",
    red: "bg-red-200 text-red-800",
    yellow: "bg-yellow-200 text-yellow-800",
  };

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}
