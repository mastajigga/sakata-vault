"use client";

import { useState, useCallback, useEffect } from "react";

export interface TerrainStats {
  minElevation: number;
  maxElevation: number;
  avgElevation: number;
  totalArea: number;
}

export interface TerrainTileInfo {
  z: number;
  x: number;
  y: number;
  loaded: boolean;
}

/**
 * Hook pour charger et gérer les données d'élévation du terrain.
 */
export function useTerrainData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TerrainStats | null>(null);
  const [loadedTiles, setLoadedTiles] = useState<TerrainTileInfo[]>([]);

  const loadTerrainStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Charger les statistiques d'élévation depuis les tuiles SRTM
      // Pour l'instant, données approximatives pour le territoire de Kutu
      const mockStats: TerrainStats = {
        minElevation: 280, // mètres (niveau du lac Mai-Ndombe)
        maxElevation: 450, // mètres (collines au nord)
        avgElevation: 340,
        totalArea: 18000, // km²
      };
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement du terrain");
    } finally {
      setLoading(false);
    }
  }, []);

  const onTileLoaded = useCallback((tile: TerrainTileInfo) => {
    setLoadedTiles((prev) => {
      const exists = prev.some((t) => t.z === tile.z && t.x === tile.x && t.y === tile.y);
      if (exists) return prev;
      return [...prev, tile];
    });
  }, []);

  const resetTiles = useCallback(() => {
    setLoadedTiles([]);
  }, []);

  useEffect(() => {
    loadTerrainStats();
  }, [loadTerrainStats]);

  return {
    loading,
    error,
    stats,
    loadedTiles,
    onTileLoaded,
    resetTiles,
  };
}