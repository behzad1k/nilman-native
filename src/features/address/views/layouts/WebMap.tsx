import { CenterButton, MapSearch } from '@/src/features/address/views/layouts/MapControls';
import React, { useEffect, useState } from 'react';
import { View, Platform, Text } from 'react-native';
import { Position } from '../../types';
import { useTheme } from '@/src/components/contexts/ThemeContext';

interface WebMapProps {
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>
}

const WebMap = ({ position, setPosition }: WebMapProps) => {
  const [map, setMap] = useState<any>(null);
  const [mapMarker, setMapMarker] = useState<any>(null);
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { isDark } = useTheme()

  // Load libraries only once
  useEffect(() => {
    setIsMounted(true);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      require('@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css');
      let isSubscribed = true;

      const loadLibraries = async () => {
        try {
          const [mapboxModule, reactModule] = await Promise.all([
            import('@neshan-maps-platform/mapbox-gl'),
            import('@neshan-maps-platform/mapbox-gl-react'),
          ]);

          if (isSubscribed) {
            setMapboxgl(mapboxModule.default);
            setMapComponent(() => reactModule.MapComponent);
          }
        } catch (error) {
          console.error('Failed to load map libraries:', error);
        }
      };

      loadLibraries();

      return () => {
        isSubscribed = false;
      };
    }
  }, []);

  // Create or update marker when both map and mapboxgl are available
  useEffect(() => {
    if (map && mapboxgl && position) {
      // Remove existing marker if any
      if (mapMarker) {
        mapMarker.remove();
      }

      // Create new marker
      const marker = new mapboxgl.Marker({
        draggable: true,
        scale: 2,
        anchor: 'center',
        pitchAlignment: 'map'
      }).setLngLat([position.lng, position.lat]).addTo(map as any)
      .on('dragend', (e: any) => setPosition({
        lng: e.target._lngLat.lng.toString(),
        lat: e.target._lngLat.lat.toString()
      }))
      setMapMarker(marker);

      // Center map on marker
      map.flyTo({
        center: [position.lng, position.lat],
        essential: true
      });
    }

    return () => {
      // Clean up marker on unmount
      if (mapMarker) {
        mapMarker.remove();
      }
    };
  }, [map, mapboxgl, position]); // This effect depends on map, mapboxgl, and position

  const search = async (query: string) => {
    try {
      // Replace with your actual API call
      console.log('Searching for:', query);
      // const response = await fetch(`your-search-endpoint?q=${query}&lat=${position.lat}&lng=${position.lng}`);
      // const data = await response.json();
      // setSearchResult(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const centerTarget = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (error) => console.error('Geolocation error:', error),
        { timeout: 10000 }
      );
    }
  };

  if (!isMounted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!MapComponent || !mapboxgl) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Web map not available on native platforms</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <MapSearch position={position} setPosition={setPosition} />

      {/* Map Component */}
      <MapComponent
        key={isDark ? 'dark' : 'light'}
        style={{ flex: 1 }}
        options={{
          mapKey: 'web.6809b3d028be4f27ace6326cd9eb0618',
          mapType: isDark ? 'neshanVectorNight' : 'neshanVector',
          container: 'map',
          zoom: 15,
          pitch: 0,
          center: [position.lng, position.lat],
          minZoom: 2,
          maxZoom: 21,
          trackResize: false,
          poi: false,
          traffic: false,
          isTouchPlatform: true,

          mapTypeControllerOptions: {
            show: false,
            position: 'bottom-left'
          }
        }}
        mapSetter={(map: any) => {
          (map as any).on('click', (e: any) => setPosition({
            lng: e.lngLat.lng.toString(),
            lat: e.lngLat.lat.toString()
          }))
          setMap(map);
        }}
      />

      <CenterButton position={position} setPosition={setPosition} />
    </View>
  );
};

export default WebMap;