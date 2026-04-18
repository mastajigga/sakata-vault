import json
import os

def calculate_centroid(geojson_path, output_path):
    with open(geojson_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    points_features = []
    for feature in data['features']:
        geom = feature['geometry']
        props = feature['properties']
        
        # Simple centroid calculation for polygon
        if geom['type'] == 'Polygon':
            coords = geom['coordinates'][0]
        elif geom['type'] == 'MultiPolygon':
            # Use the first part of multipolygon for simplicity or find biggest
            coords = geom['coordinates'][0][0]
        else:
            continue
            
        lats = [c[1] for c in coords]
        lngs = [c[0] for c in coords]
        
        centroid_lat = sum(lats) / len(lats)
        centroid_lng = sum(lngs) / len(lngs)
        
        # Use more descriptive properties if available
        # geoBoundaries uses shapeName or shapeID
        name = props.get('shapeName', props.get('name', 'Unknown'))
        
        points_features.append({
            "type": "Feature",
            "properties": {
                "name": name,
                "type": "province_label"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [centroid_lng, centroid_lat]
            }
        })

    points_geojson = {
        "type": "FeatureCollection",
        "features": points_features
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(points_geojson, f, indent=2)

if __name__ == "__main__":
    calculate_centroid(
        r'c:\Users\Fortuné\Projects\Sakata\public\geographie\data\provinces.geojson',
        r'c:\Users\Fortuné\Projects\Sakata\public\geographie\data\provinces-points.geojson'
    )
