import L from 'leaflet';
import geojsonvt from 'geojson-vt';
import 'leaflet-geojson-vt/src/leaflet-geojson-vt';

window.geojsonvt = geojsonvt;
// const defaultOptions = {
//     type: 'slicer',
//     idField: 'PARCELID',
//     tooltip: 'Parcel_no',
//     popup: (layer) => `<div>${layer.properties.PARCELID}</div>`,
//     style: {
//         weight: 0.5,
//         opacity: 1,
//         color: '#ccc',
//         fillColor: '#390870',
//         fillOpacity: 0.6,
//         fill: true,
//         stroke: true
//     },
//     hoverStyle: {
//         fillColor: '#390870',
//         fillOpacity: 1
//     },
//     activeStyle: {
//         fillColor: '#390870',
//         fillOpacity: 1
//     },
//     zIndex: 401
// };

var geojsonStyle = {
    fillColor: "#ff0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7,
};

var defaultOptions = {
    maxZoom: 20,
    tolerance: 3,
    debug: 0,
    style: geojsonStyle
};


const GeojsonVtLayer = ({ map, geojson, options = defaultOptions, setBounds = true }) => {
    var tileLayer = L.geoJson.vt(geojson, options, map).addTo(map);

    console.log({ tileLayer });

    if (setBounds) {
        const geoData = L.geoJSON(geojson);
        const geoBounds = geoData.getBounds();

        if (geoBounds) {

            map.flyToBounds(geoBounds);
        }
    }

    return tileLayer;

}

export default GeojsonVtLayer;