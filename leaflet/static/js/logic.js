// Define URL for earthquake data
const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Making map centered to SF
const map = L.map('map').setView([37.7749, -122.4194], 5);

// Create base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create function to determine marker size
function getMarkerSize(magnitude) {
    return Math.sqrt(magnitude) * 5;
}

// Create function to determine marker color based on earthquake depth
function getMarkerColor(depth) {
    if (depth <= 10) return 'lime';
    else if (depth <= 30) return 'greenyellow';
    else if (depth <= 50) return 'yellow';
    else if (depth <= 70) return 'orange';
    else if (depth <= 90) return 'red';
    else return 'darkred';
}
// Create a legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.backgroundColor = 'white'; 
    const depths = [-10, 10, 30, 50, 70, 90]; 
    const colors = ['lime', 'greenyellow', 'yellow', 'orange', 'red', 'darkred'];
    const labels = [];

    for (let i = 0; i < depths.length; i++) {
        const from = depths[i];
        const to = depths[i + 1] - 1;
        const color = colors[i];

        labels.push(
            '<i style="background:' + color + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
// Get earthquake data using D3
d3.json(earthquakeURL)
    .then(function (data) {
        L.geoJSON(data.features, {
            pointToLayer: function (feature, latlng) {
                const magnitude = feature.properties.mag;
                const depth = feature.geometry.coordinates[2];
                const markerSize = getMarkerSize(magnitude);
                const markerColor = getMarkerColor(depth);

                return L.circleMarker(latlng, {
                    radius: markerSize,
                    fillColor: markerColor,
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.7
                }).bindPopup(
                    `Magnitude: ${magnitude}<br>Depth: ${depth} km`
                );
            }
        }).addTo(map);
    })
    .catch(function (error) {
        console.error('Error fetching GeoJSON data:', error);
    });
