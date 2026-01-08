import React, { useEffect } from 'react';
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

const MapComponent = ({ location, onLocationChange }) => {
    const map = useMap();

    useEffect(() => {
        if (map && location) {
            map.panTo({ lat: location.lat, lng: location.lng });
        }
    }, [map, location]);

    useEffect(() => {
        if (!map || !location || !location.accuracy) return;

        const circle = new google.maps.Circle({
            strokeColor: '#4285F4',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#4285F4',
            fillOpacity: 0.35,
            map,
            center: { lat: location.lat, lng: location.lng },
            radius: location.accuracy
        });

        return () => {
            circle.setMap(null);
        };
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
                    <AdvancedMarker
                        position={location}
                        draggable={true}
                        onDragEnd={(e) => {
                            if (e.latLng && onLocationChange) {
                                onLocationChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                            }
                        }}
                    >
                        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                )}
            </Map>
        </div>
    );
};

export default MapComponent;
