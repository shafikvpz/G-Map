import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapComponent from './components/MapComponent';
import { SearchComponent } from './components/SearchComponent';
import { useLocationTracker } from './hooks/useLocationTracker';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function App() {
  const { location: trackedLocation, error } = useLocationTracker();
  const [manualLocation, setManualLocation] = React.useState(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });

  // Use manual location if available, otherwise fallback to tracked location
  const displayLocation = manualLocation || trackedLocation;

  // Update manual location when user drags the marker
  const handleLocationChange = (newPos) => {
    const updatedLocation = {
      lat: newPos.lat,
      lng: newPos.lng,
      accuracy: manualLocation?.accuracy || trackedLocation?.accuracy || 0
    };
    setManualLocation(updatedLocation);
    localStorage.setItem('userLocation', JSON.stringify(updatedLocation));
  };

  const handlePlaceSelect = (place) => {
    const updatedLocation = {
      lat: place.lat,
      lng: place.lng,
      accuracy: 0 // Selected places are precise
    };
    setManualLocation(updatedLocation);
    localStorage.setItem('userLocation', JSON.stringify(updatedLocation));
  };

  const handleResetLocation = () => {
    setManualLocation(null);
    localStorage.removeItem('userLocation');
  };

  // Reset manual location if needed (optional, maybe added later)

  if (!API_KEY) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">API Key Missing</h2>
          <p className="text-gray-700">
            Please add your Google Maps API key to a <code className="bg-gray-200 px-1 rounded">.env.local</code> file:
          </p>
          <pre className="mt-4 bg-gray-800 text-white p-4 rounded overflow-x-auto">
            VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
          </pre>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <div className="h-screen w-full relative">
        <SearchComponent onPlaceSelect={handlePlaceSelect} />

        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error: </strong> {error}
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">Location Tracker</h1>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">v1.3</span>
          </div>
          {displayLocation ? (
            <div>
              <p>Lat: {displayLocation.lat.toFixed(6)}</p>
              <p>Lng: {displayLocation.lng.toFixed(6)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Accuracy: {displayLocation.accuracy ? `${Math.round(displayLocation.accuracy)}m` : 'Precise'}
              </p>
              <p className="text-xs text-orange-600 mt-2 italic">
                * Drag marker to correct location
              </p>
              <button
                onClick={handleResetLocation}
                className="mt-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded w-full border border-gray-300 transition-colors"
              >
                📍 Use Live GPS
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Locating...</p>
          )}
        </div>

        <MapComponent location={displayLocation} onLocationChange={handleLocationChange} />
      </div>
    </APIProvider>
  );
}

export default App;
