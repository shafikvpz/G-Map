import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapComponent from './components/MapComponent';
import { useLocationTracker } from './hooks/useLocationTracker';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function App() {
  const { location, error } = useLocationTracker();

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
    <APIProvider apiKey={API_KEY}>
      <div className="h-screen w-full relative">
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error: </strong> {error}
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow-md">
          <h1 className="text-xl font-bold mb-2">Location Tracker</h1>
          {location ? (
            <div>
              <p>Lat: {location.lat.toFixed(6)}</p>
              <p>Lng: {location.lng.toFixed(6)}</p>
              <p className="text-sm text-gray-500 mt-1">Accuracy: {location.accuracy ? `${Math.round(location.accuracy)}m` : 'N/A'}</p>
            </div>
          ) : (
            <p className="text-gray-500">Locating...</p>
          )}
        </div>

        <MapComponent location={location} />
      </div>
    </APIProvider>
  );
}

export default App;
