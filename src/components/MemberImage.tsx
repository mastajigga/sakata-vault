"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { resolveStorageUrl } from "@/lib/supabase/storage-utils";

interface Profile {
  id?: string;
  username?: string;
  nickname?: string | null;
  avatar_url?: string | null;
  cover_photo_url?: string | null;
}

interface MemberImageProps {
  profile: Profile;
  priority?: boolean;
  className?: string;
  type?: "avatar" | "cover";
}

/**
 * Composant robuste pour l'affichage des images de profil (Avatar ou Cover)
 * Résout les URLs Storage et gère les placeholders.
 * Bascule automatiquement sur <img> pour les images distantes (Google/FB) 
 * pour éviter les restrictions de domaines Next.js Images.
 */
export function MemberImage({ 
  profile, 
  priority = false,
  className = "object-cover",
  type = "avatar"
}: MemberImageProps) {
  const rawUrl = type === "cover" ? profile.cover_photo_url : profile.avatar_url;
  
  const resolvedUrl = useMemo(() => {
    return resolveStorageUrl(rawUrl);
  }, [rawUrl]);

  const isPlaceholder = resolvedUrl.includes("placeholder-avatar.jpg");

  const commonProps = {
    alt: profile.nickname || profile.username || "Sakata Member",
    className: `transition-transform duration-700 ${className}`
  };

  if (isPlaceholder) {
    return (
      <Image
        src={resolvedUrl}
        {...commonProps}
        fill
        priority={priority}
      />
    );
  }

  return (
    <img
      src={resolvedUrl}
      {...commonProps}
      loading={priority ? "eager" : "lazy"}
      className={`absolute inset-0 w-full h-full ${commonProps.className}`}
    />
  );
}
