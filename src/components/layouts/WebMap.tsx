// components/Map/WebMap.tsx
import TextInputView from '@/src/components/ui/TextInputView';
import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Platform, Text } from 'react-native';

interface WebMapProps {
  position: { lat: string; lng: string };
  setPosition: (position: { lat: string; lng: string }) => void;
}

const WebMap = ({ position, setPosition }: WebMapProps) => {
  const [map, setMap] = useState<any>(null);
  const [mapMarker, setMapMarker] = useState<any>(null);
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Load libraries only once
  useEffect(() => {
    setIsMounted(true);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      let isSubscribed = true;

      const loadLibraries = async () => {
        try {
          const [mapboxModule, reactModule] = await Promise.all([
            import('@neshan-maps-platform/mapbox-gl'),
            import('@neshan-maps-platform/mapbox-gl-react')
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

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = `${40}px`;
      el.style.height = `${40}px`;
      el.style.zIndex = '10000';
      el.style.backgroundColor = '#FF0000';

      // Create new marker
      const marker = new mapboxgl.Marker(el)
      .setLngLat([parseFloat(position.lng), parseFloat(position.lat)])
      .addTo(map)
      .on('dragend', (e: any) => {
        setPosition({
          lng: e.target._lngLat.lng.toString(),
          lat: e.target._lngLat.lat.toString()
        });
      });
      console.log(marker);
      setMapMarker(marker);

      // Center map on marker
      map.flyTo({
        center: [parseFloat(position.lng), parseFloat(position.lat)],
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
            lat: pos.coords.latitude.toString(),
            lng: pos.coords.longitude.toString()
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
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Search Input */}
      <View style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc'
      }}>
        <TextInputView
          style={{
            padding: 8,
            borderWidth: 0
          }}
          placeholder="Search for places..."
          value={searchQuery}
          onChangeText={async (text) => {
            setSearchQuery(text);
            if (text.length > 3) {
              await search(text);
            } else {
              setSearchResult([]);
            }
          }}
        />
      </View>

      {searchResult.length > 0 && (
        <View style={{
          position: 'absolute',
          top: 80,
          left: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: 8,
          maxHeight: 200,
          borderWidth: 1,
          borderColor: '#ccc'
        }}>
          <ScrollView>
            {searchResult.slice(0, 10).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee'
                }}
                onPress={() => setPosition({
                  lng: item.location.x.toString(),
                  lat: item.location.y.toString()
                })}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {item.title?.substring(0, 30)}
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  {(item.neighbourhood || item.address)?.substring(0, 40)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Map Component */}
      <MapComponent
        style={{ flex: 1 }}
        options={{
          mapKey: 'web.6809b3d028be4f27ace6326cd9eb0618',
          zoom: 15,
          pitch: 0,
          center: [parseFloat(position.lng), parseFloat(position.lat)],
          minZoom: 2,
          maxZoom: 21,
          trackResize: true,
          poi: false,
          traffic: false
        }}
        mapSetter={(mapInstance: any) => {
          mapInstance.on('click', (e: any) => {
            setPosition({
              lng: e.lngLat.lng.toString(),
              lat: e.lngLat.lat.toString()
            });
          });

          setMap(mapInstance);
        }}
      />

      {/* Center Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 120,
          right: 20,
          backgroundColor: 'white',
          padding: 12,
          borderRadius: 50,
          zIndex: 1000,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5
        }}
        onPress={centerTarget}
      >
        <Text style={{ fontSize: 20 }}>📍</Text>
      </TouchableOpacity>

      {/* Debug info - remove in production */}
      {__DEV__ && (
        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 8,
          borderRadius: 4,
          zIndex: 1000
        }}>
          <Text style={{ color: 'white', fontSize: 12 }}>
            Position: {position.lat}, {position.lng}
          </Text>
          <Text style={{ color: 'white', fontSize: 12 }}>
            Map: {map ? 'Loaded' : 'Loading'}
          </Text>
          <Text style={{ color: 'white', fontSize: 12 }}>
            Marker: {mapMarker ? 'Loaded' : 'Loading'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default WebMap;