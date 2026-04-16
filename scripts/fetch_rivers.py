import json
import requests
import os

# BBOX for Sakata region (Reduced to core territory)
BBOX = "-3.7,16.8,-1.8,18.9"

query = f"""
[out:json][timeout:180];
(
  way["waterway"="river"]({BBOX});
  way["waterway"="canal"]({BBOX});
  way["waterway"="stream"]({BBOX});
);
out body;
>;
out skel qt;
"""

url = "https://overpass.kumi.systems/api/interpreter"

def fetch_osm():
    print(f"Fetching data from Overpass API for BBOX {BBOX}...")
    response = requests.post(url, data={"data": query})
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None
    return response.json()

def osm_to_geojson(osm_data):
    nodes = {n['id']: (n['lon'], n['lat']) for n in osm_data['elements'] if n['type'] == 'node'}
    
    # Sakata priority data
    sakata_rivers = {
        "Kasaï": {"name_skt": "Kasayi", "navigable": True, "cultural_note": "Grande rivière à l'ouest du territoire, artère vitale."},
        "Lukenie": {"name_skt": "Lukeni-mfimie", "navigable": True, "cultural_note": "Frontière naturelle à l'est, sépare les Basakata des Nkundo."},
        "Mfimi": {"name_skt": "Mfimie", "navigable": True, "cultural_note": "Rivière centrale reliant le lac Mai-Ndombe."},
        "Fimi": {"name_skt": "Mfimie", "navigable": True, "cultural_note": "Rivière centrale reliant le lac Mai-Ndombe."},
        "Lebili": {"name_skt": "Lebili", "navigable": True, "cultural_note": "Rivière sacrée dans les rites d'initiation."},
        "Lekobe": {"name_skt": "Lekobe", "navigable": True, "cultural_note": "Affluent du Kasaï, voie commerciale historique."},
        "Sow": {"name_skt": "Sow", "navigable": True, "cultural_note": "Voie fluviale reliant plusieurs villages du centre."},
        "Molibampei": {"name_skt": "Molibampei", "navigable": False, "cultural_note": "Celle qui nourrit les enfants."},
        "Lemomo": {"name_skt": "Lemomo", "navigable": True, "cultural_note": "Rivière poissonneuse, point de rassemblement."},
        "Lebuku": {"name_skt": "Lebuku", "navigable": False, "cultural_note": "Bordée de forêt dense, lieu de cueillette."},
        "Lelaw": {"name_skt": "Lelaw", "navigable": False, "cultural_note": "Rivière saisonnière active en saison des pluies."},
        "Mokaw": {"name_skt": "Mokaw", "navigable": True, "cultural_note": "Affluent qui rejoint le réseau lacustre."}
    }

    river_groups = {} # name -> list of coordinates lists

    for element in osm_data['elements']:
        if element['type'] == 'way':
            tags = element.get('tags', {})
            name = tags.get('name', tags.get('waterway', 'Rivière inconnue'))
            
            # Normalize name
            found_key = None
            for key in sakata_rivers:
                if key.lower() in name.lower() or name.lower() in key.lower():
                    found_key = key
                    break
            
            final_name = found_key if found_key else name
            
            coords = []
            for node_id in element['nodes']:
                if node_id in nodes:
                    coords.append(nodes[node_id])
            
            if len(coords) < 2: continue
            
            if final_name not in river_groups:
                river_groups[final_name] = []
            river_groups[final_name].append(coords)

    features = []
    for name, list_of_coords in river_groups.items():
        # Merge segments if they share endpoints (simple merge)
        # This is a bit complex for a script, so we'll just keep them as MultiLineString for now
        # or separate Features if they don't touch.
        skt_data = sakata_rivers.get(name, {
            "name_skt": name, 
            "navigable": False, 
            "cultural_note": "Cours d'eau du territoire Sakata."
        })
        
        feature = {
            "type": "Feature",
            "properties": {
                "name": name,
                "name_skt": skt_data["name_skt"],
                "navigable": skt_data["navigable"],
                "cultural_note": skt_data["cultural_note"]
            },
            "geometry": {
                "type": "MultiLineString",
                "coordinates": list_of_coords
            }
        }
        features.append(feature)
                
    return {"type": "FeatureCollection", "features": features}

if __name__ == "__main__":
    osm_data = fetch_osm()
    if osm_data:
        geojson = osm_to_geojson(osm_data)
        with open('public/geographie/data/rivers.geojson', 'w', encoding='utf-8') as f:
            json.dump(geojson, f, indent=2, ensure_ascii=False)
        print(f"Success! Saved {len(geojson['features'])} river segments to public/geographie/data/rivers.geojson")
