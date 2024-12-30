import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const [locations, setLocations] = useState([]);
    const [viewMode, setViewMode] = useState('markers');  

    // Fetch Locations from MongoDB API
    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/locations');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    // Initialize Mapbox
    useEffect(() => {
        if (mapInstance.current) return;

        mapInstance.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [0, 0],
            zoom: 2,
        });

        mapInstance.current.on('load', () => {
            fetchLocations();
        });
    }, []);

    // Plot Markers and Heatmap
    useEffect(() => {
        if (!mapInstance.current || locations.length === 0) return;

        const geojson = {
            type: 'FeatureCollection',
            features: locations.map((loc) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [loc.longitude, loc.latitude],
                },
                properties: {
                    intensity: loc.intensity || 1
                }
            }))
        };

        if (!mapInstance.current.getSource('locations')) {
            mapInstance.current.addSource('locations', {
                type: 'geojson',
                data: geojson,
            });
        } else {
            mapInstance.current.getSource('locations').setData(geojson);
        }

        if (!mapInstance.current.getLayer('markers')) {
            mapInstance.current.addLayer({
                id: 'markers',
                type: 'circle',
                source: 'locations',
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#ff5733'
                }
            });
        }

        if (!mapInstance.current.getLayer('heatmap-layer')) {
            mapInstance.current.addLayer({
                id: 'heatmap-layer',
                type: 'heatmap',
                source: 'locations',
                paint: {
                    'heatmap-weight': ['get', 'intensity'],
                    'heatmap-intensity': 0.6,
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-radius': 25,
                    'heatmap-opacity': 0.85,
                },
            });
        }

        // Layer Visibility Control
        mapInstance.current.setLayoutProperty('markers', 'visibility', viewMode === 'markers' ? 'visible' : 'none');
        mapInstance.current.setLayoutProperty('heatmap-layer', 'visibility', viewMode === 'heatmap' ? 'visible' : 'none');

    }, [locations, viewMode]);

    return (
        <div style={{ position: 'relative' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />

            {/* Toggle Button UI */}
            <div className="toggle-container">
                <button
                    className={`toggle-btn ${viewMode === 'markers' ? 'active' : ''}`}
                    onClick={() => setViewMode('markers')}
                >
                    Show Markers
                </button>
                <button
                    className={`toggle-btn ${viewMode === 'heatmap' ? 'active' : ''}`}
                    onClick={() => setViewMode('heatmap')}
                >
                    Show Heatmap
                </button>
            </div>
        </div>
    );
};

export default MapComponent;
