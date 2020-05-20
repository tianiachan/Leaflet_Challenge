//get the url for the geojson
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

//get request from URL
d3.json(URL, function (data) 
{
    createFeatures(data.features);
});

//helper functin for the earthquake data
function createFeatures(earthquakeData) 
{
    //create feature with pop up for place and time of earthquake
    function onEachFeature(feature, layer) 
    {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    //create geojson layer 
    var earthquakes = L.geoJSON(earthquakeData, { onEachFeature: onEachFeature });

    //call create map and pass in the layer created above
    createMap(earthquakes);
}

function createMap(earthquakes) 
{
    // Define streetmap and darkmap layers - optional asthetic 
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", 
    {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,//set default zoom
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", 
    {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,//set default zoom
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps =
    {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps =
    {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load on the map div 
    var myMap = L.map("map",
        {
            center: [33.684566, -117.826508],//centered on Irvine, CA
            zoom: 5,
            layers: [streetmap, earthquakes]
        });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);
}