import React from "react";

export default function Loader({ text = "Yuklanmoqda..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-shopix-muted gap-2">
      <div className="w-8 h-8 border-2 border-shopix-green border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
