"use client";

import React from "react";
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
        return <Droplets size={16} className="text-blue-400" />;
      case "village":
        return <MapPin size={16} className="text-or-ancestral" />;
      case "subtribe":
        return <Users size={16} className="text-amber-600" />;
      case "clan":
        return <Users size={16} className="text-or-ancestral" />;
      case "community_pin":
        return properties?.annotation_type === "video" ? (
          <Video size={16} className="text-or-ancestral" />
        ) : (
          <Image size={16} className="text-or-ancestral" />
        );
      default:
        return <MapPin size={16} className="text-or-ancestral" />;
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

    if (type === "clan") {
      return (
        <div className="space-y-4">
          {props.name_skt && (
            <p className="text-xs italic text-or-ancestral/70 bg-or-ancestral/5 p-2 rounded-lg border border-or-ancestral/10 text-center">
              &laquo; {String(props.name_skt)} &raquo;
            </p>
          )}
          <div className="space-y-2">
            {props.rank && (
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-wider opacity-40">Rang social</span>
                <span className="text-xs font-medium text-or-ancestral">{String(props.rank)}</span>
              </div>
            )}
            {props.description && (
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-wider opacity-40 mb-2">Mémoire du Clan</p>
                <p className="text-xs leading-relaxed text-ivoire-ancien/80">
                  {String(props.description)}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (type === "river") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {props.length_km && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Longueur</p>
                <p className="text-xs font-mono text-or-ancestral">{props.length_km} km</p>
              </div>
            )}
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
              <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Navigation</p>
              <p className={`text-xs font-mono ${props.navigable ? "text-green-400" : "text-red-400"}`}>
                {props.navigable ? "ACTIVE" : "NONE"}
              </p>
            </div>
          </div>
          {props.fishing_points && (
             <div className="p-3 rounded-xl bg-blue-900/10 border border-blue-500/10">
                <p className="text-[10px] opacity-40 mb-1">Ressources halieutiques</p>
                <p className="text-xs">{String(props.fishing_points)}</p>
             </div>
          )}
          {props.cultural_note && (
             <div className="p-4 rounded-xl bg-black/20 border border-white/5 italic text-xs leading-relaxed text-ivoire-ancien/70">
                "{String(props.cultural_note)}"
             </div>
          )}
        </div>
      );
    }

    if (type === "village") {
      return (
        <div className="space-y-4">
           {props.type && (
             <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-wider opacity-40">Type de localité</span>
                <span className="text-xs font-medium text-or-ancestral capitalize">{String(props.type)}</span>
             </div>
           )}
           {props.population && (
             <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-wider opacity-40">Démographie</span>
                <span className="text-xs font-medium text-ivoire-ancien">{String(props.population)}</span>
             </div>
           )}
           {props.clan && (
             <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-wider opacity-40">Clan Dominant</span>
                <span className="text-xs font-medium text-or-ancestral">{String(props.clan)}</span>
             </div>
           )}
           {props.description && (
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-wider opacity-40 mb-2">Chroniques</p>
                <p className="text-xs leading-relaxed text-ivoire-ancien/80 bg-black/10 p-4 rounded-2xl border border-white/5">
                  {String(props.description)}
                </p>
              </div>
           )}
        </div>
      );
    }

    if (type === "subtribe") {
      return (
        <div className="space-y-4">
           <div className="flex items-center gap-4 bg-amber-950/20 p-4 rounded-2xl border border-amber-500/10">
              <div className="flex-1">
                 <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Dialecte</p>
                 <p className="text-xs font-semibold text-or-ancestral">{String(props.dialect || "Sakata")}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex-1">
                 <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Population</p>
                 <p className="text-xs font-semibold text-ivoire-ancien">{String(props.population)}</p>
              </div>
           </div>
           {props.description && (
              <p className="text-xs leading-relaxed text-ivoire-ancien/70 px-2">
                {String(props.description)}
              </p>
           )}
        </div>
      );
    }

    if (type === "community_pin") {
      const cp = properties as any;
      return (
        <div className="space-y-4">
           {cp.image_url && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 mb-4 bg-black/40">
                 <img src={cp.image_url} alt={cp.title} className="w-full h-full object-cover" />
              </div>
           )}
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
             <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-or-ancestral/20 flex items-center justify-center text-[10px] font-bold text-or-ancestral">
                   {cp.user_name?.[0] || "U"}
                </div>
                <span className="text-[10px] font-medium text-ivoire-ancien/60">Témoignage de {cp.user_name}</span>
             </div>
             <p className="text-xs leading-relaxed text-ivoire-ancien/90 mb-4">{cp.description}</p>
             <div className="flex items-center gap-4 text-[10px] opacity-40">
                <span>{cp.likes_count || 0} Appréciations</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
             </div>
           </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative group">
         <div className="absolute -inset-2 bg-gradient-to-r from-or-ancestral/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
         <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                {getTypeIcon()}
              </div>
              <div>
                <p className="text-[9px] font-mono tracking-widest text-or-ancestral/60 uppercase">{type === "community_pin" ? "Archive Vivante" : "Identité Territoriale"}</p>
                <h2 className="text-sm font-semibold tracking-wide text-ivoire-ancien">{getTitle()}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-ivoire-ancien/40 hover:text-ivoire-ancien"
            >
              <X size={16} />
            </button>
         </div>
      </div>

      {coordinates && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/20 border border-white/5">
           <MapPin size={10} className="text-or-ancestral/40" />
           <span className="text-[10px] font-mono text-ivoire-ancien/40 uppercase tracking-tighter">
             Locus: {coordinates[1].toFixed(5)} / {coordinates[0].toFixed(5)}
           </span>
        </div>
      )}

      <div className="custom-scrollbar pr-1">
        {getDetails()}
      </div>

      <div className="pt-6 mt-6 border-t border-white/5 relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-black/20 text-[8px] font-mono uppercase tracking-[0.3em] text-or-ancestral/40">
            Sagesse
         </div>
         <p className="text-[10px] italic text-center text-ivoire-ancien/40 leading-relaxed px-4">
            &laquo; La terre n'est pas un don de nos parents, c'est un prêt de nos enfants. &raquo;
         </p>
      </div>
    </div>
  );
}