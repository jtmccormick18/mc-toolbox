import L from 'leaflet';
import geojsonvt from 'geojson-vt';
import 'leaflet-geojson-vt/src/leaflet-geojson-vt';
import 'leaflet.vectorgrid';

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
    maxZoom: 1,
    tolerance: 3,
    debug: 0,
    zindex:401,
    style: geojsonStyle
};


const GeojsonVectorGridLayer = ({ map, geojson, options = defaultOptions, setBounds = true }) => {
    var previousActiveId = null;
    var clearStyle = function (id) {
        if (!id) return
        vectorGrid.resetFeatureStyle(id, options.style);
    };
    L.DomEvent.fakeStop = function () {
        return true;
    }

    var vectorGrid = L.vectorGrid.slicer(geojson, {
        rendererFactory: L.canvas.tile,
        vectorTileLayerStyles: {
            sliced: options.style
        },
        interactive: true,
        getFeatureId: function (f) {
            return f.properties.PARCELID;
        }
    })
        .on('click', function (e) {
            var properties = e.layer.properties;
            L.popup()
                .setContent(properties.PARCELID || properties.Parcel_no || "Huh?")
                .setLatLng(e.latlng)
                .openOn(map);

            if (properties.PARCELID != previousActiveId) clearStyle(previousActiveId);
            var style = {
                fillColor: '#FFEDA0',
                fillOpacity: 0.5,
                fillOpacity: 1,
                stroke: true,
                fill: true,
                color: 'red',
                opacity: 1,
                weight: 2,
            };

            vectorGrid.setFeatureStyle(properties.PARCELID, style);
            previousActiveId = properties.PARCELID;
        })
    // .addTo(map);

    // if (setBounds) {
    //     const geoData = L.geoJSON(geojson);
    //     const geoBounds = geoData.getBounds();

    //     if (geoBounds) {

    //         map.flyToBounds(geoBounds);
    //     }
    // }

    return vectorGrid;

}

export default GeojsonVectorGridLayer;