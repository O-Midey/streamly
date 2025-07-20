import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton({
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className="bg-[#ff69b4] text-white border border-[#ff69b4] px-5 py-2 rounded-lg shadow hover:bg-[#ff4da0] transition disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
}
