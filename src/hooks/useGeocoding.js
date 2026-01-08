import { useState, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export const useGeocoding = (location) => {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const geocodingLib = useMapsLibrary('geocoding');
    const [geocoder, setGeocoder] = useState(null);

    useEffect(() => {
        if (geocodingLib) {
            setGeocoder(new geocodingLib.Geocoder());
        }
    }, [geocodingLib]);

    useEffect(() => {
        if (!geocoder || !location) return;

        setLoading(true);
        // Debounce or just run? for now just run, map dragging usually happens onDragEnd which is safe.
        geocoder.geocode({ location: { lat: location.lat, lng: location.lng } })
            .then((response) => {
                if (response.results[0]) {
                    setAddress(response.results[0].formatted_address);
                } else {
                    setAddress('Address not found');
                }
            })
            .catch((e) => {
                console.error("Geocoding failed: " + e);
                setAddress('Address unavailable');
            })
            .finally(() => {
                setLoading(false);
            });

    }, [geocoder, location?.lat, location?.lng]); // Depend on lat/lng values to trigger updates

    return { address, loading };
};
