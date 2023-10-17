
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()    //se adauga un marker (pin ) pe harta
    .setLngLat(campground.geometry.coordinates)   //centrat in punctul asta
    .setPopup(                                //popup
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)                //se adauga variabilei de mai sus