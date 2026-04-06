"use client";

import { useState, useCallback } from "react";

export type LayerId =
  | "hydro"
  | "forest"
  | "subtribes"
  | "dialects"
  | "villages"
  | "community";

export interface LayerState {
  id: LayerId;
  label: string;
  labelSkt: string;
  icon: string;
  visible: boolean;
  description: string;
}

const DEFAULT_LAYERS: LayerState[] = [
  {
    id: "hydro",
    label: "Rivières & Lac",
    labelSkt: "Mbela & Iyâ",
    icon: "droplets",
    visible: true,
    description: "Réseau hydrographique vivant — rivières, lac, points de pêche",
  },
  {
    id: "forest",
    label: "Forêt & Savane",
    labelSkt: "Mpunga & Etale",
    icon: "trees",
    visible: false,
    description: "Couverture forestière et zones de savane",
  },
  {
    id: "subtribes",
    label: "Sous-tribus",
    labelSkt: "Bikolo",
    icon: "users",
    visible: true,
    description: "Territoires des sous-tribus Basakata (Bobai, Waria, Bayi...)",
  },
  {
    id: "dialects",
    label: "Dialectes",
    labelSkt: "Ndinga",
    icon: "languages",
    visible: false,
    description: "Zones dialectales du kisakata (waria, kebai, mokan...)",
  },
  {
    id: "villages",
    label: "Villages & Ports",
    labelSkt: "Mboka & Libongo",
    icon: "map-pin",
    visible: true,
    description: "Villages, ports historiques et sites importants",
  },
  {
    id: "community",
    label: "Communauté",
    labelSkt: "Bato",
    icon: "message-circle",
    visible: false,
    description: "Contributions de la communauté — photos, vidéos, récits",
  },
];

export function useLayerVisibility() {
  const [layers, setLayers] = useState<LayerState[]>(DEFAULT_LAYERS);

  const toggleLayer = useCallback((id: LayerId) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const isLayerVisible = useCallback(
    (id: LayerId) => layers.find((l) => l.id === id)?.visible ?? false,
    [layers]
  );

  const setLayerVisible = useCallback((id: LayerId, visible: boolean) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible } : layer
      )
    );
  }, []);

  return {
    layers,
    toggleLayer,
    isLayerVisible,
    setLayerVisible,
  };
}
