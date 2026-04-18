import json
import random
import math

def create_polygon(center_lat, center_lon, radius, num_points=8, noise=0.05):
    points = []
    for i in range(num_points):
        angle = (i / num_points) * 2 * math.pi
        r = radius * (1 + random.uniform(-noise, noise))
        lat = center_lat + r * math.cos(angle)
        lon = center_lon + r * math.sin(angle)
        points.append([lon, lat])
    points.append(points[0]) # Close poly
    return [points]

# Mai-Ndombe center approx: -2.0, 18.0
features = []

# 1. Major Forest Blocks (Primary Forest)
for i in range(15):
    lat = -2.0 + random.uniform(-1.5, 1.5)
    lon = 18.0 + random.uniform(-1.5, 1.5)
    radius = random.uniform(0.1, 0.4)
    features.append({
        "type": "Feature",
        "properties": {
            "name": f"Forêt de {random.choice(['Inongo', 'Kiri', 'Oshwe', 'Bolobo'])} {i}",
            "type": "forest",
            "density": random.uniform(0.7, 1.0)
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": create_polygon(lat, lon, radius, num_points=12)
        }
    })

# 2. Savanna Patches
for i in range(10):
    lat = -3.0 + random.uniform(-1.0, 1.0)
    lon = 17.5 + random.uniform(-1.0, 1.0)
    radius = random.uniform(0.05, 0.2)
    features.append({
        "type": "Feature",
        "properties": {
            "name": f"Savane de {random.choice(['Nioki', 'Mushie', 'Yumbi'])} {i}",
            "type": "savanna",
            "density": random.uniform(0.2, 0.4)
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": create_polygon(lat, lon, radius, num_points=8)
        }
    })

# 3. Concessions (Rectangular mostly)
for i in range(5):
    lat = -2.0 + random.uniform(-1.0, 1.0)
    lon = 18.5 + random.uniform(-1.0, 1.0)
    w, h = 0.2, 0.15
    coords = [[
        [lon, lat],
        [lon + w, lat],
        [lon + w, lat + h],
        [lon, lat + h],
        [lon, lat]
    ]]
    features.append({
        "type": "Feature",
        "properties": {
            "name": f"Concession Forestière #{100+i}",
            "type": "concession",
            "company": random.choice(["Sodefor", "Siforco", "Compagnie du Mai-Ndombe"]),
            "status": "active"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": coords
        }
    })

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open("public/geographie/data/forest.geojson", "w", encoding='utf-8') as f:
    json.dump(geojson, f, ensure_ascii=False, indent=2)

print("Generated simulated forest.geojson")
