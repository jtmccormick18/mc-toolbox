import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import L from 'leaflet';

import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl } from 'react-leaflet';

import GeojsonVtLayer from '../components/map/GeojsonVTLayer';
import GeoJSONLayer from '../components/map/GeojsonLayer';
import AddBasemaps from '../components/map/Basemaps';
import GeojsonVectorGridLayer from '../components/map/GeojsonVectorGrid';


import ParcelData from '../data/dawson/dawson_2023.json';

import 'leaflet-basemaps/L.Control.Basemaps.js';
import 'leaflet-basemaps/L.Control.Basemaps.css';

import CsvTable from '../components/tables/CsvTable';


const dawsonParcelUrl = 'https://services7.arcgis.com/Ptz860OPLeIY55cX/arcgis/rest/services/Energov_Layers_Update2021/FeatureServer/3';


const center = [32.191764, -83.951707]
const zoom = 15
const minZoom = 10
const maxZoom = 22


const onEachParcel = (parcel, layer) => {
    const parcelId = parcel.properties.PARCELID;
    const parcelNo = parcel.properties.Parcel_no;
    layer.bindPopup(`${parcelId} / ${parcelNo}`);
}


function ParcelLayer(props) {
    const { setBounds } = props;

    return (
        // <GeoJSONLayer data={ParcelData} onEachFeature={onEachParcel} eventHandlers={eventHandlers} />
        <GeoJSONLayer data={ParcelData} setBounds={setBounds} />
    )
}



function Map(props) {
    const { setChecked, parcelData, setOMap } = props;
    const map = useMap();
    console.log("Map is ready...", { map });

    const reset = () => {
        console.log('destroying map...')
        map.setView(center, zoom);
    }

    const onLayerAdd = (layer) => {
        console.log({ layer });
        const layerBounds = layer.layer.getBounds();

        // map.fitBounds(layerBounds);
        map.flyToBounds(layerBounds);
    };

    const onVectorLayerAdd = (layer) => {
        console.log({ layer });
    }
    //Save map 
    useEffect(() => {
        setOMap(map);
    }, [map]);

    // const parcelVectorLayer = GeojsonVtLayer({ map, geojson: parcelData }).addTo(map);


    // map.on('overlayadd', onLayerAdd);

    // setChecked(true);
    return null;
}

function GIS() {
    const [omap, setOMap] = useState();
    const [checked, setChecked] = useState(false);
    const [geojson, setGeojson] = useState(ParcelData);
    useEffect(() => {

        if (omap) {
            const parcelVectorLayer = GeojsonVectorGridLayer({ map: omap, geojson });
            console.log({parcelVectorLayer});
            const overLays = {
                "Parcels": parcelVectorLayer,
            }
            L.control.layers(null, overLays).addTo(omap);

            AddBasemaps(omap);

            const geoData = L.geoJSON(geojson);
            const geoBounds = geoData.getBounds();

            if (geoBounds) {

                omap.flyToBounds(geoBounds);
            }
            const mapParcelLayer=parcelVectorLayer.addTo(omap);
            console.log({mapParcelLayer});

        }

    }, [omap]);

    return (<Row>
        <Col xs={12}>
            <MapContainer id='map' scrollWheelZoom={true} center={center} zoom={zoom} maxZoom={maxZoom} minZoom={minZoom}>
                <Map parcelData={ParcelData} setOMap={setOMap} />

            </MapContainer>
        </Col>
        <Col xs={12}>
            <CsvTable />

        </Col>
    </Row>)
}

export default GIS;