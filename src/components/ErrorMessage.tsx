"use client";

import { Info } from "lucide-react";

interface Props {
  message?: string;
}

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;

  return (
    <div className="mb-6 p-4 bg-red-500/20 border text-md border-red-500 rounded-lg text-textPrimary text-sm flex items-center">
      <Info className="mr-2 h-6 w-6 flex-shrink-0" />
      {message}
    </div>
  );
}
