import { describe, it, expect } from 'vitest';
import {
  KISAKATA_COLORS,
  TERRITORY_CENTER,
  TERRITORY_BOUNDS,
  DEFAULT_VIEW_STATE,
  kisakataMapStyle,
  createVectorStyle,
} from '@/app/geographie/lib/mapStyles';

describe('mapStyles', () => {
  describe('KISAKATA_COLORS', () => {
    it('should contain all V1 palette colors', () => {
      expect(KISAKATA_COLORS.foretNocturne).toBe('#0A1F15');
      expect(KISAKATA_COLORS.eauSombre).toBe('#0C2920');
      expect(KISAKATA_COLORS.ivoireAncien).toBe('#F0EDE5');
      expect(KISAKATA_COLORS.orAncestral).toBe('#C4A035');
      expect(KISAKATA_COLORS.amberLight).toBe('#E8C670');
      expect(KISAKATA_COLORS.emeraldDeep).toBe('#0F2C24');
    });

    it('should contain V3 Terre & Ciel palette', () => {
      expect(KISAKATA_COLORS.cielNocturne).toBe('#1B2838');
      expect(KISAKATA_COLORS.terreProfonde).toBe('#2A1810');
      expect(KISAKATA_COLORS.cuivreArtisanal).toBe('#B87333');
      expect(KISAKATA_COLORS.sableDoux).toBe('#E8DCC8');
      expect(KISAKATA_COLORS.cendreChauffe).toBe('#9B8E80');
    });

    it('should contain cartographic layer colors', () => {
      expect(KISAKATA_COLORS.water).toBe('#0C2920');
      expect(KISAKATA_COLORS.forest).toBe('#0F2C24');
      expect(KISAKATA_COLORS.savanna).toBe('#2A3A20');
      expect(KISAKATA_COLORS.borderLine).toBe('#C4A035');
    });
  });

  describe('TERRITORY_CENTER', () => {
    it('should have correct longitude', () => {
      expect(TERRITORY_CENTER.longitude).toBe(17.75);
    });

    it('should have correct latitude', () => {
      expect(TERRITORY_CENTER.latitude).toBe(-2.95);
    });
  });

  describe('TERRITORY_BOUNDS', () => {
    it('should have correct bounds', () => {
      expect(TERRITORY_BOUNDS.west).toBe(16.5);
      expect(TERRITORY_BOUNDS.south).toBe(-3.5);
      expect(TERRITORY_BOUNDS.east).toBe(19.0);
      expect(TERRITORY_BOUNDS.north).toBe(-2.5);
    });

    it('should have valid bounds (west < east, south < north)', () => {
      expect(TERRITORY_BOUNDS.west).toBeLessThan(TERRITORY_BOUNDS.east);
      expect(TERRITORY_BOUNDS.south).toBeLessThan(TERRITORY_BOUNDS.north);
    });
  });

  describe('DEFAULT_VIEW_STATE', () => {
    it('should center on territory', () => {
      expect(DEFAULT_VIEW_STATE.longitude).toBe(TERRITORY_CENTER.longitude);
      expect(DEFAULT_VIEW_STATE.latitude).toBe(TERRITORY_CENTER.latitude);
    });

    it('should have appropriate zoom level for territory overview', () => {
      expect(DEFAULT_VIEW_STATE.zoom).toBe(8);
    });

    it('should have 3D pitch enabled', () => {
      expect(DEFAULT_VIEW_STATE.pitch).toBe(55);
    });

    it('should have bearing for angled view', () => {
      expect(DEFAULT_VIEW_STATE.bearing).toBe(-15);
    });

    it('should have zoom constraints', () => {
      expect(DEFAULT_VIEW_STATE.maxZoom).toBe(16);
      expect(DEFAULT_VIEW_STATE.minZoom).toBe(5);
    });
  });

  describe('kisakataMapStyle', () => {
    it('should be a valid MapLibre style specification', () => {
      expect(kisakataMapStyle.version).toBe(8);
      expect(kisakataMapStyle.name).toBe('Kisakata Brume');
    });

    it('should have OSM raster source', () => {
      const osmSource = kisakataMapStyle.sources['osm-tiles'] as any;
      expect(osmSource).toBeDefined();
      expect(osmSource.type).toBe('raster');
      expect(osmSource.tileSize).toBe(256);
    });

    it('should have terrain DEM source', () => {
      const terrainSource = kisakataMapStyle.sources['terrain-dem'] as any;
      expect(terrainSource).toBeDefined();
      expect(terrainSource.type).toBe('raster-dem');
      expect(terrainSource.encoding).toBe('terrarium');
    });

    it('should have terrain configuration', () => {
      expect((kisakataMapStyle.terrain as any).source).toBe('terrain-dem');
      expect((kisakataMapStyle.terrain as any).exaggeration).toBe(1.8);
    });

    it('should have sky configuration', () => {
      const sky = kisakataMapStyle.sky as any;
      expect(sky).toBeDefined();
      expect(sky['sky-color']).toBe(KISAKATA_COLORS.cielNocturne);
      expect(sky['fog-color']).toBe(KISAKATA_COLORS.foretNocturne);
    });

    it('should have background layer with foretNocturne color', () => {
      const backgroundLayer = kisakataMapStyle.layers.find((l) => l.id === 'background');
      expect(backgroundLayer).toBeDefined();
      expect(backgroundLayer!.type).toBe('background');
      expect((backgroundLayer!.paint as any)['background-color']).toBe(KISAKATA_COLORS.foretNocturne);
    });

    it('should have OSM base raster layer', () => {
      const osmLayer = kisakataMapStyle.layers.find((l) => l.id === 'osm-base') as any;
      expect(osmLayer).toBeDefined();
      expect(osmLayer!.type).toBe('raster');
      expect(osmLayer!.source).toBe('osm-tiles');
    });

    it('should have glyphs URL configured', () => {
      expect(kisakataMapStyle.glyphs).toContain('maplibre.org');
    });
  });

  describe('createVectorStyle', () => {
    it('should create a valid vector style with MapTiler key', () => {
      const style = createVectorStyle('test-key');
      expect(style.version).toBe(8);
      expect(style.name).toBe('Kisakata Brume Vector');
    });

    it('should include MapTiler key in source URL', () => {
      const style = createVectorStyle('my-secret-key');
      const tiles = style.sources['openmaptiles'] as any;
      expect(tiles.url).toContain('my-secret-key');
    });

    it('should include water layer with correct color', () => {
      const style = createVectorStyle('test-key');
      const waterLayer = style.layers.find((l) => l.id === 'water');
      expect(waterLayer).toBeDefined();
      expect((waterLayer!.paint as any)['fill-color']).toBe(KISAKATA_COLORS.water);
    });

    it('should include forest layer with correct color', () => {
      const style = createVectorStyle('test-key');
      const forestLayer = style.layers.find((l) => l.id === 'landcover-forest');
      expect(forestLayer).toBeDefined();
      expect((forestLayer!.paint as any)['fill-color']).toBe(KISAKATA_COLORS.forest);
    });

    it('should include road layers', () => {
      const style = createVectorStyle('test-key');
      const roadMinor = style.layers.find((l) => l.id === 'road-minor');
      const roadMajor = style.layers.find((l) => l.id === 'road-major');
      expect(roadMinor).toBeDefined();
      expect(roadMajor).toBeDefined();
    });

    it('should include boundary layer', () => {
      const style = createVectorStyle('test-key');
      const boundaryLayer = style.layers.find((l) => l.id === 'boundary');
      expect(boundaryLayer).toBeDefined();
      expect((boundaryLayer!.paint as any)['line-color']).toBe(KISAKATA_COLORS.borderLine);
    });

    it('should include place labels', () => {
      const style = createVectorStyle('test-key');
      const placeLayer = style.layers.find((l) => l.id === 'place-label');
      expect(placeLayer).toBeDefined();
      expect((placeLayer!.layout as any)['text-field']).toBe('{name}');
    });
  });
});