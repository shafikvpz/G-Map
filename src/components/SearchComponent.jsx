import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export const SearchComponent = ({ onPlaceSelect }) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary('places');

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            const place = placeAutocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            onPlaceSelect({ lat, lng });
        });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-80 max-w-full">
            <input
                ref={inputRef}
                type="text"
                placeholder="Search for a location..."
                className="w-full px-4 py-3 rounded-lg shadow-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all"
            />
        </div>
    );
};
