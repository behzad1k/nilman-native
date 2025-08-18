import { useTheme } from '@/src/components/contexts/ThemeContext';
import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { services } from '@/src/configs/services';
import { AddressSearchResult } from '@/src/features/address/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { FontFamilies } from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import * as Location from 'expo-location';
import { Crosshair, MagnifyingGlass } from 'phosphor-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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
  MapView = MapLibre.default;
  Camera = MapLibre.Camera;
  MapViewRef = MapLibre.MapViewRef;
  PointAnnotation = MapLibre.PointAnnotation;
  CameraRef = MapLibre.CameraRef;
}
const NativeMap = ({ position, setPosition }: NativeMapProps) => {
  const { isDark } = useTheme();
  const [searchResult, setSearchResult] = useState<AddressSearchResult[]>([]);
  const [status, requestPermission] = Location.useForegroundPermissions();
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  const mapRef = useRef<typeof MapViewRef>(null);
  const cameraRef = useRef<typeof CameraRef>(null);
  const search = async (query: string) => {
    const res = await services.address.searchByQuery({
      search_text: query,
      district: `${position[0].toString()},${position[1].toString()}`
    });
    if (res.code == 200) {
      setSearchResult(res.data);
    }
  };

  const centerTarget = async () => {
    if(status?.status != 'granted'){
      requestPermission();
    } else {
      const userPosition = await Location.getCurrentPositionAsync()
      setPosition([userPosition?.coords?.longitude, userPosition?.coords?.latitude]);
    }
  };

  useEffect(() => {
    cameraRef?.current?.flyTo(
      [position[0], position[1]]
    );
    setSearchResult([]);
  }, [position]);

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
        <View style={styles.searchContainer}>
          <MagnifyingGlass style={styles.searchIcon} color={theme.secondary} size={30}/>
          <TextInputView
            onChangeText={async (input) => {
              if (input.length > 3) {
                await search(input);
              } else {
                setSearchResult([]);
              }
            }}
            style={styles.searchInput}
          />
        </View>
        {searchResult.length > 0 ?
          <ScrollView style={styles.searchResultContainer}>
            {searchResult.length > 0 ? (
              searchResult.slice(0, 10).map(e =>
                <View>
                  <TextView style={styles.searchResultTitle} onPress={() => setPosition([e.geo_location.center.lng, e.geo_location.center.lat])}>{e.geo_location?.title}</TextView>
                  <TextView style={styles.searchResultSubtitle}>{e.description?.substring(0, 50)}</TextView>
                </View>
              )
            ) : null}
          </ScrollView>
          : null}
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: position,
            zoomLevel: 13,
          }}
        />
        <PointAnnotation id={'id124'} coordinate={position}  draggable onDragEnd={(payload: any) => setPosition(payload.geometry.coordinates)}>
          <Image style={{
            width: 60,
            height: 60
          }} source={require('@/src/assets/images/pin.png')}/>
        </PointAnnotation>
      </MapView>
      <TouchableOpacity style={styles.centerAddress} onPress={centerTarget}>
        <Crosshair size={40} color={theme.text}/>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
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
    fontSize: 16
  },
  searchIcon: {
    marginVertical: 'auto',
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
    overflow: 'scroll'
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
  searchInputContainer: {
    width: '100%'
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
