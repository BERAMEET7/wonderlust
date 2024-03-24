if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};

// let mapToken = "<%= process.env.MAP_TOKEN %>"
mapboxgl.accessToken = process.env.MAP_TOKEN;



var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${map_location}.json?access_token=${mapToken}`;
fetch(url)
    .then(response => response.json())
    .then(data => {
        var coordinates = data.features[0].geometry.coordinates;
        console.log(data);
        const lat = coordinates[1];
        const lon = coordinates[0];
        
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lon, lat],
            zoom: 12
        });

        new mapboxgl.Marker({color:"#fe424d" ,draggable :true})
            .setLngLat([lon, lat])
            .setPopup( new mapboxgl.Popup({offset:20}).setHTML(`<h4 style="color : #fe424d;">${map_location}</h4><p style="color : #fe424d; height:5px;">Exact location provide after booking<p>`))
            .addTo(map);

            map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true,
                showAccuracyCircle : true,
                showUserLocation :true,
            }))


        })
    .catch(error => {
        console.error('Error fetching geocoding data:', error);
    });

  