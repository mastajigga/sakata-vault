"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Droplets, MapPin, Users, Image, Video } from "lucide-react";
import type { SelectedFeature } from "../../GeographieClient";

interface InfoPanelProps {
  feature: SelectedFeature;
  onClose: () => void;
}

export default function InfoPanel({ feature, onClose }: InfoPanelProps) {
  const { type, properties, coordinates } = feature;

  const getTypeIcon = () => {
    switch (type) {
      case "river":
        return <Droplets size={20} style={{ color: "#0C2920" }} />;
      case "village":
        return <MapPin size={20} style={{ color: "#C4A035" }} />;
      case "subtribe":
        return <Users size={20} style={{ color: "#B87333" }} />;
      case "community_pin":
        return properties?.annotation_type === "video" ? (
          <Video size={20} style={{ color: "#C4A035" }} />
        ) : (
          <Image size={20} style={{ color: "#C4A035" }} />
        );
      default:
        return <MapPin size={20} style={{ color: "#C4A035" }} />;
    }
  };

  const getTitle = () => {
    if (type === "community_pin") {
      return (properties as any)?.title || "Contribution communautaire";
    }
    return (
      (properties as any)?.name ||
      (properties as any)?.name_skt ||
      "Lieu inconnu"
    );
  };

  const getDetails = () => {
    const props = properties as Record<string, string | number | boolean>;

    if (type === "river") {
      return (
        <div className="space-y-3">
          {props.name_skt && (
            <p
              className="text-sm italic"
              style={{ color: "rgba(196, 160, 53, 0.7)" }}
            >
              &laquo; {String(props.name_skt)} &raquo;
            </p>
          )}
          {props.length_km && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Longueur</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--or-ancestral)" }}
              >
                {props.length_km} km
              </span>
            </div>
          )}
          {props.navigable !== undefined && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Navigable</span>
              <span
                className="text-xs font-medium"
                style={{
                  color: props.navigable ? "#4ADE80" : "#F87171",
                }}
              >
                {props.navigable ? "Oui" : "Non"}
              </span>
            </div>
          )}
          {props.fishing_points && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Points de pêche</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--ivoire-ancien)" }}
              >
                {String(props.fishing_points)}
              </span>
            </div>
          )}
          {props.cultural_note && (
            <div className="pt-3">
              <p className="text-xs opacity-60 mb-1">Note culturelle</p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--brume-matinale)" }}
              >
                {String(props.cultural_note)}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (type === "village") {
      return (
        <div className="space-y-3">
          {props.type && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Type</span>
              <span
                className="text-xs font-medium capitalize"
                style={{ color: "var(--or-ancestral)" }}
              >
                {String(props.type)}
              </span>
            </div>
          )}
          {props.population && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Population estimée</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--ivoire-ancien)" }}
              >
                {String(props.population)}
              </span>
            </div>
          )}
          {props.description && (
            <div className="pt-3">
              <p className="text-xs opacity-60 mb-1">Description</p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--brume-matinale)" }}
              >
                {String(props.description)}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (type === "subtribe") {
      return (
        <div className="space-y-3">
          {props.population && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Population estimée</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--ivoire-ancien)" }}
              >
                {String(props.population)}
              </span>
            </div>
          )}
          {props.dialect && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Dialecte principal</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--or-ancestral)" }}
              >
                {String(props.dialect)}
              </span>
            </div>
          )}
          {props.description && (
            <div className="pt-3">
              <p className="text-xs opacity-60 mb-1">Description</p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--brume-matinale)" }}
              >
                {String(props.description)}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (type === "community_pin") {
      const cp = properties as Record<string, string | number>;
      return (
        <div className="space-y-3">
          {cp?.user_name && (
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs opacity-60">Par</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--or-ancestral)" }}
              >
                {String(cp.user_name)}
              </span>
            </div>
          )}
          {cp?.description && (
            <div className="pt-3">
              <p className="text-xs opacity-60 mb-1">Description</p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--brume-matinale)" }}
              >
                {String(cp.description)}
              </p>
            </div>
          )}
          {cp?.likes_count !== undefined && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs opacity-60">Likes</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--or-ancestral)" }}
              >
                {String(cp.likes_count)}
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full z-30 w-full max-w-md"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{
          background: "rgba(10, 31, 21, 0.95)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(196, 160, 53, 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(196, 160, 53, 0.15)" }}
        >
          <div className="flex items-center gap-3">
            {getTypeIcon()}
            <h2
              className="text-sm font-semibold tracking-wide truncate max-w-[220px]"
              style={{
                color: "var(--or-ancestral)",
                fontFamily: "var(--font-geist-mono)",
                letterSpacing: "0.05em",
              }}
            >
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
            style={{ color: "var(--brume-matinale)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {coordinates && (
            <div className="mb-4 pb-3 border-b border-white/5">
              <p className="text-[10px] opacity-40 mb-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
                Coordonnées
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: "var(--brume-matinale)" }}
              >
                {coordinates[1].toFixed(4)}°S, {coordinates[0].toFixed(4)}°E
              </p>
            </div>
          )}
          {getDetails()}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t text-center"
          style={{ borderColor: "rgba(196, 160, 53, 0.15)" }}
        >
          <p
            className="text-[10px] italic opacity-40"
            style={{ color: "var(--brume-matinale)" }}
          >
            &laquo; La terre ne ment pas. Elle garde la mémoire de ceux qui l'ont foulée. &raquo;
          </p>
        </div>
      </div>
    </motion.div>
  );
}