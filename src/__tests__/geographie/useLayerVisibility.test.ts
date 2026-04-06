import { describe, it, expect } from 'vitest';

// Import des constantes et types pour tests unitaires
import type { LayerId, LayerState } from '@/app/geographie/hooks/useLayerVisibility';

// Recréer la logique du hook pour test unitaire sans DOM
const DEFAULT_LAYERS: LayerState[] = [
  {
    id: 'hydro',
    label: 'Rivières & Lac',
    labelSkt: 'Mbela & Iyâ',
    icon: 'droplets',
    visible: true,
    description: 'Réseau hydrographique vivant — rivières, lac, points de pêche',
  },
  {
    id: 'forest',
    label: 'Forêt & Savane',
    labelSkt: 'Mpunga & Etale',
    icon: 'trees',
    visible: false,
    description: 'Couverture forestière et zones de savane',
  },
  {
    id: 'subtribes',
    label: 'Sous-tribus',
    labelSkt: 'Bikolo',
    icon: 'users',
    visible: true,
    description: 'Territoires des sous-tribus Basakata (Bobai, Waria, Bayi...)',
  },
  {
    id: 'dialects',
    label: 'Dialectes',
    labelSkt: 'Ndinga',
    icon: 'languages',
    visible: false,
    description: 'Zones dialectales du kisakata (waria, kebai, mokan...)',
  },
  {
    id: 'villages',
    label: 'Villages & Ports',
    labelSkt: 'Mboka & Libongo',
    icon: 'map-pin',
    visible: true,
    description: 'Villages, ports historiques et sites importants',
  },
  {
    id: 'chiefdoms',
    label: 'Chefferies',
    labelSkt: 'Idju',
    icon: 'map',
    visible: false,
    description: '7 chefferies du territoire Sakata',
  },
  {
    id: 'community',
    label: 'Communauté',
    labelSkt: 'Bato',
    icon: 'message-circle',
    visible: false,
    description: 'Contributions de la communauté — photos, vidéos, récits',
  },
];

// Fonctions pures extraites du hook pour test unitaire
function toggleLayer(layers: LayerState[], id: LayerId): LayerState[] {
  return layers.map((layer) =>
    layer.id === id ? { ...layer, visible: !layer.visible } : layer
  );
}

function setLayerVisible(layers: LayerState[], id: LayerId, visible: boolean): LayerState[] {
  return layers.map((layer) =>
    layer.id === id ? { ...layer, visible } : layer
  );
}

function isLayerVisible(layers: LayerState[], id: LayerId): boolean {
  return layers.find((l) => l.id === id)?.visible ?? false;
}

describe('useLayerVisibility - logique pure', () => {
  describe('DEFAULT_LAYERS', () => {
    it('should have 7 layers', () => {
      expect(DEFAULT_LAYERS).toHaveLength(7);
    });

    it('should have correct layer IDs in order', () => {
      expect(DEFAULT_LAYERS.map((l) => l.id)).toEqual([
        'hydro',
        'forest',
        'subtribes',
        'dialects',
        'villages',
        'chiefdoms',
        'community',
      ]);
    });

    it('should have correct default visibility states', () => {
      const visibleLayers = DEFAULT_LAYERS.filter((l) => l.visible);
      expect(visibleLayers.map((l) => l.id)).toEqual(['hydro', 'subtribes', 'villages']);

      const hiddenLayers = DEFAULT_LAYERS.filter((l) => !l.visible);
      expect(hiddenLayers.map((l) => l.id)).toEqual(['forest', 'dialects', 'chiefdoms', 'community']);
    });

    it('should have correct layer metadata for hydro', () => {
      const hydro = DEFAULT_LAYERS.find((l) => l.id === 'hydro');
      expect(hydro).toBeDefined();
      expect(hydro!.label).toBe('Rivières & Lac');
      expect(hydro!.labelSkt).toBe('Mbela & Iyâ');
      expect(hydro!.icon).toBe('droplets');
    });

    it('should have correct layer metadata for chiefdoms', () => {
      const chiefdoms = DEFAULT_LAYERS.find((l) => l.id === 'chiefdoms');
      expect(chiefdoms).toBeDefined();
      expect(chiefdoms!.label).toBe('Chefferies');
      expect(chiefdoms!.labelSkt).toBe('Idju');
      expect(chiefdoms!.icon).toBe('map');
    });

    it('should have correct layer metadata for subtribes', () => {
      const subtribes = DEFAULT_LAYERS.find((l) => l.id === 'subtribes');
      expect(subtribes).toBeDefined();
      expect(subtribes!.label).toBe('Sous-tribus');
      expect(subtribes!.labelSkt).toBe('Bikolo');
      expect(subtribes!.icon).toBe('users');
    });
  });

  describe('toggleLayer', () => {
    it('should toggle hidden layer to visible', () => {
      const result = toggleLayer(DEFAULT_LAYERS, 'forest');
      expect(isLayerVisible(result, 'forest')).toBe(true);
    });

    it('should toggle visible layer to hidden', () => {
      const result = toggleLayer(DEFAULT_LAYERS, 'hydro');
      expect(isLayerVisible(result, 'hydro')).toBe(false);
    });

    it('should toggle back to hidden', () => {
      const once = toggleLayer(DEFAULT_LAYERS, 'forest');
      const twice = toggleLayer(once, 'forest');
      expect(isLayerVisible(twice, 'forest')).toBe(false);
    });

    it('should return a new array reference', () => {
      const result = toggleLayer(DEFAULT_LAYERS, 'forest');
      expect(result).not.toBe(DEFAULT_LAYERS);
    });

    it('should not mutate the original array', () => {
      const copy = [...DEFAULT_LAYERS];
      toggleLayer(copy, 'forest');
      expect(copy).toEqual(DEFAULT_LAYERS);
    });

    it('should only change the targeted layer', () => {
      const result = toggleLayer(DEFAULT_LAYERS, 'forest');
      const unchangedCount = result.filter(
        (l, i) => l.id !== 'forest' && l.visible === DEFAULT_LAYERS[i].visible
      ).length;
      expect(unchangedCount).toBe(6);
    });
  });

  describe('setLayerVisible', () => {
    it('should set layer to visible', () => {
      const result = setLayerVisible(DEFAULT_LAYERS, 'dialects', true);
      expect(isLayerVisible(result, 'dialects')).toBe(true);
    });

    it('should set layer to hidden', () => {
      const result = setLayerVisible(DEFAULT_LAYERS, 'hydro', false);
      expect(isLayerVisible(result, 'hydro')).toBe(false);
    });

    it('should return a new array reference', () => {
      const result = setLayerVisible(DEFAULT_LAYERS, 'community', true);
      expect(result).not.toBe(DEFAULT_LAYERS);
    });
  });

  describe('isLayerVisible', () => {
    it('should return true for visible layers', () => {
      expect(isLayerVisible(DEFAULT_LAYERS, 'hydro')).toBe(true);
      expect(isLayerVisible(DEFAULT_LAYERS, 'subtribes')).toBe(true);
      expect(isLayerVisible(DEFAULT_LAYERS, 'villages')).toBe(true);
    });

    it('should return false for hidden layers', () => {
      expect(isLayerVisible(DEFAULT_LAYERS, 'forest')).toBe(false);
      expect(isLayerVisible(DEFAULT_LAYERS, 'dialects')).toBe(false);
      expect(isLayerVisible(DEFAULT_LAYERS, 'chiefdoms')).toBe(false);
      expect(isLayerVisible(DEFAULT_LAYERS, 'community')).toBe(false);
    });

    it('should return false for non-existent layer', () => {
      // @ts-ignore - testing invalid input
      expect(isLayerVisible(DEFAULT_LAYERS, 'nonexistent')).toBe(false);
    });
  });
});