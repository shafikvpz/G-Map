import React, { useEffect } from 'react';
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

const MapComponent = ({ location }) => {
    const map = useMap();

    useEffect(() => {
        if (map && location) {
            map.panTo(location);
        }
    }, [map, location]);

    return (
        <div className="h-full w-full">
            <Map
                defaultZoom={15}
                defaultCenter={location || { lat: 0, lng: 0 }}
                mapId="DEMO_MAP_ID" // You can replace this with your own Map ID or use a demo one
                className="h-full w-full"
            >
                {location && (
                    <AdvancedMarker position={location}>
                        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                )}
            </Map>
        </div>
    );
};

export default MapComponent;
