const fs = require('fs');
const topojson = require('topojson-server');

const geojson = JSON.parse(fs.readFileSync('public/geographie/data/forest.geojson', 'utf8'));
const topology = topojson.topology({ forest: geojson });

fs.writeFileSync('public/geographie/data/forest.topojson', JSON.stringify(topology), 'utf8');
console.log('Successfully converted forest.geojson to forest.topojson (UTF-8)');
