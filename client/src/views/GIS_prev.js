import React, { useState, useEffect, useMemo, useCallback,ref } from 'react';
import { Row, Col } from 'react-bootstrap';


import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, useMapEvent } from 'react-leaflet';
// import { FeatureLayer } from 'react-esri-leaflet';
import { FeatureLayer } from 'react-esri-leaflet';

const dawsonParcelUrl = 'https://services7.arcgis.com/Ptz860OPLeIY55cX/arcgis/rest/services/Energov_Layers_Update2021/FeatureServer/3';

// const dawsonParcelLayer = new FeatureLayer({
//     url: dawsonParcelUrl
// });

const center = [32.191764, -83.951707]
const zoom = 15

function ParcelLayer(props) {
    const [bounds, setBounds] = useState(null)
    const map=useMap();
    const layerBoundaryHandler = useMemo(
        () => ({
            load() {
                const layers = map.layers;
                console.log({ 'load': this, map, layers });

            },
            layeradd() {
                const layers = map.layers;
                console.log({ 'layer add': this, map, layers });

            },
            onAdd(map) {
                console.log('I got added! ')
            }

        }), [],
    )
    // console.log({map});
    return (
        <FeatureLayer url={props.url} eventHandlers={layerBoundaryHandler} />
    )
}

function GISMap(props) {
    const map = useMap();

    
    const [position, setPosition] = useState(() => map.getCenter());

    const [bounds, setBounds] = useState(() => map.getBounds());

    const reset = useCallback(() => {
        console.log('destroying map...')
        map.setView(center, zoom);
    }, [map])

    // const onMove = useCallback(() => {
    //     setPosition(map.getCenter())
    // }, [map])
    const onLayerAdd = useCallback((layer) => {
        // console.log({ layer });
        const layerBounds = layer.target.getBounds();
        // console.log({ layerBounds, 'center': layerBounds.getCenter() });
        setBounds(layerBounds);
        map.fitBounds(layerBounds);
        map.flyToBounds(layerBounds);
    }, [map])

    const onLoad = useCallback(() => {
        console.log('map loaded');

    }, [map])


    useEffect(() => {
        map.on('init', onLoad)

    }, [map])

    useEffect(() => {
        map.once('layeradd', onLayerAdd)

    }, [map])

    return null;
}




// function LocationMarker() {
//     const [position, setPosition] = useState(null)
//     const map = useMapEvents({
//         click() {
//             map.locate()
//         },
//         locationfound(e) {
//             setPosition(e.latlng)
//             map.flyTo(e.latlng, map.getZoom())
//         },
//     })

//     return position === null ? null : (
//         <Marker position={position}>
//             <Popup>You are here</Popup>
//         </Marker>
//     )
// }

const mapRef=React.createRef();
const customAreaRef=React.createRef();
const fitToCustomLayer = () => {
    if (mapRef.current && customAreaRef.current) { //we will get inside just once when loading
        const map = mapRef.current.leafletElement
        const layer = customAreaRef.current.leafletElement
        map.fitBounds(layer.getBounds().pad(0.5))
    }
}

function GIS(props) {
    return (
        <Row>
            <Col className={"bg-dark text-light text-center"}>
                <h3>
                    Welcome to the GIS
                </h3>
            </Col>
            <Col xs={12}>
                <MapContainer
                    id='map'
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    ref={mapRef} 
                    onlayeradd={fitToCustomLayer}
                >
                    <GISMap />
                    <ParcelLayer url={props.parcelLayerUrl || dawsonParcelUrl} ref={customAreaRef} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </Col>
        </Row>
    );
}

export default GIS;
