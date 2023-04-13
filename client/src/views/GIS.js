import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import L from 'leaflet';

import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl } from 'react-leaflet';

import GeojsonVtLayer from '../components/map/GeojsonVTLayer';
import GeoJSONLayer from '../components/map/GeojsonLayer';
import AddBasemaps from '../components/map/Basemaps';
import GeojsonVectorGridLayer from '../components/map/GeojsonVectorGrid';
// import { FeatureLayer } from 'react-esri-leaflet';
import { FeatureLayer } from 'react-esri-leaflet';

import ParcelData from '../data/dawson/dawson_2023.json';

import 'leaflet-basemaps/L.Control.Basemaps.js';
import 'leaflet-basemaps/L.Control.Basemaps.css';


const dawsonParcelUrl = 'https://services7.arcgis.com/Ptz860OPLeIY55cX/arcgis/rest/services/Energov_Layers_Update2021/FeatureServer/3';


const center = [32.191764, -83.951707]
const zoom = 15


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
    const [geojson,setGeojson]=useState(ParcelData);
    useEffect(() => {

        if (omap) {
            const parcelVectorLayer = GeojsonVectorGridLayer({ map: omap, geojson });
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
            parcelVectorLayer.addTo(omap);

        }

    }, [omap]);

    return (<Row>
        <Col xs={12}>
            <MapContainer id='map' scrollWheelZoom={true} center={center} zoom={zoom}>
                <Map parcelData={ParcelData} setOMap={setOMap} />
                {/* <ParcelLayer setBounds={setBounds} /> */}
                {/* <LayersControl position='topright'>
                    <LayersControl.Overlay checked={checked} name="Parcels" key="Parcels">

                        <ParcelLayer setBounds={setBounds} />
                    </LayersControl.Overlay>
                    <LayersControl.BaseLayer checked name="Open Street Map">
                        <TileLayer
                            attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl> */}
            </MapContainer>
        </Col>
    </Row>)
}

export default GIS;