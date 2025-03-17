"use client";

import { Music } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="text-2xl font-bold flex items-center gap-2">
      <Music className="text-accent" />
      <span className="gradient-text">
        MUZO
      </span>
    </Link>
  )
}
