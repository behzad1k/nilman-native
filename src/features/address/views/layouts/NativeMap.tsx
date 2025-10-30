import { useTheme } from '@/src/components/contexts/ThemeContext';
import TextView from '@/src/components/ui/TextView';
import { CenterButton, MapSearch } from '@/src/features/address/views/layouts/MapControls';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { FontFamilies } from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import React, { useEffect, useRef } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

interface NativeMapProps {
  position: number[];
  setPosition: React.Dispatch<React.SetStateAction<number[]>>;
}

let MapView: any;
let Camera: any;
let MapViewRef: any;
let PointAnnotation: any;
let CameraRef: any;

if (Platform.OS !== 'web') {
  const MapLibre = require('@maplibre/maplibre-react-native');
  MapView = MapLibre.MapView;
  Camera = MapLibre.Camera;
  MapViewRef = MapLibre.MapViewRef;
  PointAnnotation = MapLibre.PointAnnotation;
  CameraRef = MapLibre.CameraRef;
}

const NativeMap = ({ position, setPosition }: NativeMapProps) => {
  const { isDark } = useTheme();
  const styles = useThemedStyles(createStyles);

  const mapRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);


  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.flyTo([position[0], position[1]]);
    }
  }, [position]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <TextView>Map not available on web</TextView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        logoEnabled={false}
        compassViewPosition={2}
        compassViewMargins={{ x: 20, y: 180 }}
        onLongPress={(address: any) => setPosition(prev => 'coordinates' in address.geometry ? (address.geometry?.coordinates as number[]) : prev)}
        mapStyle={`https://www.parsimap.ir/styles/${isDark ? 'dark' : 'light'}.json?key=p1f7c17ef0b0fa499ca024f0a448a62eac98fcbfdb`}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: position,
            zoomLevel: 13,
          }}
        />
        <PointAnnotation
          id={'id124'}
          coordinate={position}
          draggable
          onDragEnd={(payload: any) => setPosition(payload.geometry.coordinates)}
        >
          <Image
            style={{ width: 60, height: 60 }}
            source={require('@/src/assets/images/pin.png')}
          />
        </PointAnnotation>
      </MapView>

      <MapSearch position={position} setPosition={setPosition} />

      <CenterButton position={position} setPosition={setPosition} />
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    marginTop: 20,
    left: '5%',
    backgroundColor: theme.background,
    borderWidth: .5,
    borderColor: theme.secondary,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 1000,
  },
  searchInput: {
    color: theme.text,
    borderWidth: 0,
    zIndex: 10000,
    fontSize: 16,
    flex: 1,
  },
  searchIcon: {
    alignSelf: 'center',
    marginRight: 8,
  },
  searchResultContainer: {
    minHeight: 100,
    maxHeight: 600,
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 20,
    position: 'absolute',
    width: '90%',
    marginTop: 60,
    left: '5%',
    backgroundColor: theme.background,
    borderWidth: .5,
    borderColor: theme.secondary,
    borderRadius: 6,
    borderTopWidth: 0,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    zIndex: 1001,
  },
  searchResultTitle: {
    color: theme.text,
    textAlign: 'right',
    fontFamily: FontFamilies.vazir.medium,
    fontSize: 14,
  },
  searchResultSubtitle: {
    color: theme.text,
    textAlign: 'right',
    fontFamily: FontFamilies.vazir.light,
    fontSize: 13,
  },
  centerAddress: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    backgroundColor: theme.background,
    borderRadius: 110,
    padding: 4,
    zIndex: 10,
  }
});

export default NativeMap;