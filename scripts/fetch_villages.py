import json
import requests
import os

# BBOX for Sakata territory
BBOX = "-3.7,16.8,-1.8,18.9"

# Query for cities, towns, villages and hamlets
query = f"""
[out:json][timeout:180];
(
  node["place"~"city|town|village|hamlet"]({BBOX});
  way["place"~"city|town|village|hamlet"]({BBOX});
);
out body;
>;
out skel qt;
"""

url = "https://overpass.kumi.systems/api/interpreter"

def fetch_osm():
    print(f"Fetching settlement data from Overpass API for BBOX {BBOX}...")
    try:
        response = requests.post(url, data={"data": query})
        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            return None
        return response.json()
    except Exception as e:
        print(f"Exception: {e}")
        return None

def osm_to_geojson(osm_data):
    features = []
    
    # Simple mapping of village types to importance weights
    importance_map = {
        "city": 5,
        "town": 4,
        "village": 3,
        "hamlet": 2,
        "isolated_dwelling": 1
    }

    for element in osm_data['elements']:
        # We only care about nodes for points, or centroids for ways
        tags = element.get('tags', {})
        if not tags: continue
        
        name = tags.get('name', 'Localité inconnue')
        place_type = tags.get('place', 'village')
        
        lat = element.get('lat')
        lon = element.get('lon')
        
        # If it was a way, use the first node's coords as a fallback or just skip 
        # (usually place names are nodes in OSM)
        if not lat or not lon: continue
        
        feature = {
            "type": "Feature",
            "properties": {
                "name": name,
                "type": place_type,
                "importance": importance_map.get(place_type, 2),
                "population": tags.get('population', 'Inconnu'),
                "name_skt": name, # Initial fallback
                "clan": "À documenter",
                "cultural_note": "Localité du territoire Sakata."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            }
        }
        features.append(feature)
                
    return {"type": "FeatureCollection", "features": features}

if __name__ == "__main__":
    osm_data = fetch_osm()
    if osm_data:
        geojson = osm_to_geojson(osm_data)
        with open('public/geographie/data/villages.geojson', 'w', encoding='utf-8') as f:
            json.dump(geojson, f, indent=2, ensure_ascii=False)
        print(f"Success! Saved {len(geojson['features'])} settlements to public/geographie/data/villages.geojson")
