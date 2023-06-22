// Define the url for GeoJSON earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map
var myMap = L.map("map", {
    center: [40.09, -110.71],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get data using D3
d3.json(queryUrl).then(function (data) {
    // data is being retrieved?
    console.log(data);

    // Set up the style for map
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColors(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.4
        };

    }
    // switch case for fill on marker
    function mapColors(depth) {
        switch (true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }
    // Magnitude size
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }

        return mag * 4;
    }

    // Add earthquake data to the map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Activate pop-up on-click data

        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

// Add the legend with colors to corrolate with depth
var maplegend = L.control({position: "bottomright"});
maplegend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    // legend ranges to display
    depth = [-10, 10, 30, 50, 70, 90];

    // TODO Edit Iteration method ++
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML += '<i style="background:' + mapColors(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
maplegend.addTo(myMap)
});