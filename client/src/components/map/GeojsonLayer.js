import { useRef } from 'react'
import L from 'leaflet';
import { GeoJSON, LayerGroup, useMap } from 'react-leaflet';

const GeoJSONLayer = (props) => {

    const { data, onEachFeature, options, setBounds } = props;

    const map = useMap();

    const eventHandlers = {
        loading: () => console.log('loading feature layer...'),
        load: (layer) => {
            console.log({ 'loaded': true, layer });
            zoomToLayer(layer);
        },
    }


    const zoomToFeature = (e) => {
        console.log({ e, 'target': e.target });

        const markerBounds = e.target.getBounds();
        console.log({ markerBounds });
        map.fitBounds(markerBounds);
    }


    const zoomToLayer = (map) => {
        const layerBounds = geoJsonRef && geoJsonRef.current && geoJsonRef.current.getBounds() || this.layer.getBounds() || new L.latLngBounds(data);
        console.log({ layerBounds, this: this });
        map.fitBounds(layerBounds);
    }
    // map.on('overlayadd', zoomToLayer);


    const markerOptions = { radius: 2, weight: 1, opacity: 1, fillOpacity: 0.8, }

    const markerStyles = function (feature) {
        switch (feature.properties.type) {
            case 'Sticker': return { color: '#a50026' };
            case 'Mural': return { color: '#d73027' };
            case 'Marker': return { color: '#f46d43' };
            case 'Characters': return { color: '#fdae61' };
            case 'Letters': return { color: '#fee090' };
            case 'Tippex': return { color: '#ffffbf' };
            case 'Spray': return { color: '#e0f3f8' };
            case 'Chalk': return { color: '#abd9e9' };
            case 'Label maker sticker': return { color: '#74add1' };
            case 'Poster': return { color: '#4575b4' };
        }
    }
    // Map Events
    const geoJsonRef = useRef();
    geoJsonRef.onAdd=zoomToLayer;
    const onMouseOut = (e) => {
        var layer = e.target;
        geoJsonRef.current.setStyle(markerOptions);
    }

    const onMouseOver = (e) => {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7,
            radius: 3
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function forEachFeature(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(`<div>${feature.properties.PARCELID}</div>`)
        }
        layer.on({
            mouseover: onMouseOver,
            mouseout: onMouseOut,
            click: zoomToFeature,
        });
    }

    function pointToLayer(feature, latLng) {
        return L.circleMarker(latLng, markerOptions)
    }

    const methods = {
        beforeAdd: zoomToLayer,
        onAdd: zoomToLayer,
        onEachFeature: onEachFeature || forEachFeature,
        pointToLayer,
        // eventHandlers,
    }


    return (
    
        <GeoJSON data={data} pathOptions={markerStyles} ref={geoJsonRef} {...methods} onAdd={zoomToLayer} />
    )

}

export default GeoJSONLayer