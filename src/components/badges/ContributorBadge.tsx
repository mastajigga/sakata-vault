"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, Circle } from "lucide-react";

interface ContributorBadgeProps {
  status: "approved" | "pending" | "rejected" | "none";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ContributorBadge({
  status,
  showText = true,
  size = "md",
}: ContributorBadgeProps) {
  const sizeMap = {
    sm: { icon: 14, text: "text-xs", padding: "px-2 py-1" },
    md: { icon: 16, text: "text-sm", padding: "px-3 py-1.5" },
    lg: { icon: 20, text: "text-base", padding: "px-4 py-2" },
  };

  const styles = {
    approved: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
      icon: <CheckCircle2 size={sizeMap[size].icon} className="shrink-0" />,
      label: "Contributeur approuvé",
    },
    pending: {
      bg: "bg-[#C16B34]/10",
      border: "border-[#C16B34]/30",
      text: "text-[#C16B34]",
      icon: <Clock size={sizeMap[size].icon} className="shrink-0" />,
      label: "En attente d'approbation",
    },
    rejected: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      icon: <XCircle size={sizeMap[size].icon} className="shrink-0" />,
      label: "Demande rejetée",
    },
    none: {
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
      text: "text-gray-400",
      icon: <Circle size={sizeMap[size].icon} className="shrink-0" />,
      label: "Non contributeur",
    },
  };

  const style = styles[status];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${sizeMap[size].padding} ${style.bg} ${style.border} ${style.text}`}
    >
      {style.icon}
      {showText && <span className={sizeMap[size].text}>{style.label}</span>}
    </div>
  );
}
