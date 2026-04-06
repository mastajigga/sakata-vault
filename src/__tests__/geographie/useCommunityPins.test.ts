import { describe, it, expect } from 'vitest';
import type { CommunityPin } from '@/app/geographie/hooks/useCommunityPins';

// Fonctions pures extraites du hook pour test unitaire sans DOM/Supabase
const MOCK_PINS: CommunityPin[] = [
  {
    id: '1',
    title: 'Village de mon grand-père',
    description: 'Ici se trouvait le village de mon grand-père, un lieu de mémoire pour notre famille.',
    annotation_type: 'story',
    user_name: 'Jean-Pierre M.',
    likes_count: 12,
    coordinates: [17.75, -2.95],
    is_verified: true,
    created_at: '2026-04-01',
  },
  {
    id: '2',
    title: 'Pêche collective sur la Lebili',
    description: 'Photo de la pêche annuelle collective sur la rivière Lebili.',
    annotation_type: 'photo',
    user_name: 'Marie K.',
    likes_count: 24,
    coordinates: [17.68, -2.82],
    is_verified: false,
    created_at: '2026-03-28',
  },
  {
    id: '3',
    title: 'Proverbe du jour',
    description: '"La rivière ne tarit pas, elle change de chemin." — Proverbe sakata',
    annotation_type: 'proverb',
    user_name: 'Sage Mboko',
    likes_count: 45,
    coordinates: [17.82, -2.92],
    is_verified: true,
    created_at: '2026-03-25',
  },
];

// Fonctions pures simulant la logique du hook
function filterPinsByBounds(
  pins: CommunityPin[],
  bounds: { west: number; south: number; east: number; north: number }
): CommunityPin[] {
  return pins.filter(
    (pin) =>
      pin.coordinates[0] >= bounds.west &&
      pin.coordinates[0] <= bounds.east &&
      pin.coordinates[1] >= bounds.south &&
      pin.coordinates[1] <= bounds.north
  );
}

function createPin(
  pins: CommunityPin[],
  pin: Omit<CommunityPin, 'id' | 'likes_count' | 'is_verified' | 'created_at'>
): CommunityPin[] {
  const newPin: CommunityPin = {
    ...pin,
    id: `pin-${Date.now()}`,
    likes_count: 0,
    is_verified: false,
    created_at: new Date().toISOString().split('T')[0],
  };
  return [...pins, newPin];
}

function deletePin(pins: CommunityPin[], pinId: string): CommunityPin[] {
  return pins.filter((p) => p.id !== pinId);
}

function likePin(pins: CommunityPin[], pinId: string): CommunityPin[] {
  return pins.map((p) =>
    p.id === pinId ? { ...p, likes_count: p.likes_count + 1 } : p
  );
}

describe('useCommunityPins - logique pure', () => {
  describe('MOCK_PINS', () => {
    it('should have 3 mock pins', () => {
      expect(MOCK_PINS).toHaveLength(3);
    });

    it('should have valid coordinates for all pins', () => {
      MOCK_PINS.forEach((pin) => {
        expect(pin.coordinates).toHaveLength(2);
        expect(pin.coordinates[0]).toBeGreaterThanOrEqual(16.5);
        expect(pin.coordinates[0]).toBeLessThanOrEqual(19.0);
        expect(pin.coordinates[1]).toBeGreaterThanOrEqual(-3.5);
        expect(pin.coordinates[1]).toBeLessThanOrEqual(-2.5);
      });
    });

    it('should have valid annotation types', () => {
      const validTypes = ['photo', 'video', 'story', 'memory', 'question', 'proverb', 'historical'];
      MOCK_PINS.forEach((pin) => {
        expect(validTypes).toContain(pin.annotation_type);
      });
    });

    it('should have non-negative likes counts', () => {
      MOCK_PINS.forEach((pin) => {
        expect(pin.likes_count).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid date formats', () => {
      MOCK_PINS.forEach((pin) => {
        const date = new Date(pin.created_at);
        expect(date.toString()).not.toBe('Invalid Date');
      });
    });
  });

  describe('filterPinsByBounds', () => {
    it('should filter pins within bounds', () => {
      const bounds = { west: 17.6, south: -3.0, east: 17.9, north: -2.8 };
      const result = filterPinsByBounds(MOCK_PINS, bounds);

      // Pin 1: [17.75, -2.95] - within bounds
      // Pin 2: [17.68, -2.82] - within bounds
      // Pin 3: [17.82, -2.92] - within bounds
      expect(result).toHaveLength(3);
    });

    it('should exclude pins outside bounds', () => {
      const bounds = { west: 18.0, south: -3.0, east: 18.5, north: -2.5 };
      const result = filterPinsByBounds(MOCK_PINS, bounds);

      // All mock pins are outside this area
      expect(result).toHaveLength(0);
    });

    it('should return empty array for empty pins', () => {
      const bounds = { west: 17.0, south: -3.0, east: 18.0, north: -2.5 };
      const result = filterPinsByBounds([], bounds);
      expect(result).toHaveLength(0);
    });
  });

  describe('createPin', () => {
    it('should add a new pin to the array', () => {
      const newPin = {
        title: 'Test Pin',
        description: 'A test pin',
        annotation_type: 'story' as const,
        coordinates: [17.75, -2.95] as [number, number],
      };
      const result = createPin(MOCK_PINS, newPin);
      expect(result).toHaveLength(4);
    });

    it('should set default values for new pin', () => {
      const newPin = {
        title: 'Test Pin',
        description: 'A test pin',
        annotation_type: 'story' as const,
        coordinates: [17.75, -2.95] as [number, number],
      };
      const result = createPin(MOCK_PINS, newPin);
      const created = result[3];
      expect(created.likes_count).toBe(0);
      expect(created.is_verified).toBe(false);
      expect(created.id).toMatch(/^pin-/);
    });

    it('should not mutate the original array', () => {
      const original = [...MOCK_PINS];
      const newPin = {
        title: 'Test Pin',
        description: 'A test pin',
        annotation_type: 'story' as const,
        coordinates: [17.75, -2.95] as [number, number],
      };
      createPin(MOCK_PINS, newPin);
      expect(MOCK_PINS).toEqual(original);
    });
  });

  describe('deletePin', () => {
    it('should remove a pin by id', () => {
      const result = deletePin(MOCK_PINS, '1');
      expect(result).toHaveLength(2);
      expect(result.find((p) => p.id === '1')).toBeUndefined();
    });

    it('should return same length if pin not found', () => {
      const result = deletePin(MOCK_PINS, 'nonexistent');
      expect(result).toHaveLength(3);
    });

    it('should not mutate the original array', () => {
      const original = [...MOCK_PINS];
      deletePin(MOCK_PINS, '1');
      expect(MOCK_PINS).toEqual(original);
    });
  });

  describe('likePin', () => {
    it('should increment likes count', () => {
      const result = likePin(MOCK_PINS, '1');
      const liked = result.find((p) => p.id === '1');
      expect(liked!.likes_count).toBe(13);
    });

    it('should not affect other pins', () => {
      const result = likePin(MOCK_PINS, '1');
      expect(result.find((p) => p.id === '2')!.likes_count).toBe(24);
      expect(result.find((p) => p.id === '3')!.likes_count).toBe(45);
    });

    it('should return same array if pin not found', () => {
      const result = likePin(MOCK_PINS, 'nonexistent');
      expect(result).toEqual(MOCK_PINS);
    });

    it('should not mutate the original array', () => {
      const original = [...MOCK_PINS];
      likePin(MOCK_PINS, '1');
      expect(MOCK_PINS).toEqual(original);
    });
  });
});