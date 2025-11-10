import { useTheme } from '@/src/components/contexts/ThemeContext';
import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { services } from '@/src/configs/services';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { FontFamilies } from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import * as Location from 'expo-location';
import { Crosshair, MagnifyingGlass } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AddressSearchResult, Position } from '../../types';

interface CenterButtonProps<T extends Position | number[]> {
  position: T
  setPosition:  React.Dispatch<React.SetStateAction<T>>
}
interface MapSearchProps<T extends Position | number[]> {
  position: T;
  setPosition: React.Dispatch<React.SetStateAction<T>>;
}


export const MapSearch = <T extends Position | number[]>({
                                                           position,
                                                           setPosition
                                                         }: MapSearchProps<T>) => {
  const [searchResult, setSearchResult] = useState<AddressSearchResult[]>([]);

  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  const search = async (query: string) => {
    const res = await services.address.searchByQuery({
      search_text: query,
      district: Array.isArray(position) ? `${position[0].toString()},${position[1].toString()}` : `${position.lng.toString()},${position.lat.toString()}`
    });
    if (res.code == 200) {
      setSearchResult(res.data);
    }
  };

  useEffect(() => {
    setSearchResult([])
  }, [position])
  return (
    <>
    <View style={styles.searchContainer}>
      <MagnifyingGlass style={styles.searchIcon} color={theme.secondary} size={30}/>
      <TextInputView
        containerStyle={styles.searchInputContainer}
        onChangeText={(input) => {
          if (input.length > 3) {
            search(input);
          } else {
            setSearchResult([]);
          }
        }}

        style={styles.searchInput}
      />
    </View>

  {searchResult.length > 0 && (
    <ScrollView style={styles.searchResultContainer}>
      {searchResult.slice(0, 10).map((e, index) => (
        <View key={index}>
          <TextView
            style={styles.searchResultTitle}
            onPress={() => Array.isArray(position) ? setPosition([e.geo_location.center.lng, e.geo_location.center.lat] as T) : setPosition({ lat: e.geo_location.center.lat, lng: e.geo_location.center.lng } as T)}
          >
            {e.geo_location?.title}
          </TextView>
          <TextView style={styles.searchResultSubtitle}>
            {e.description?.substring(0, 50)}
          </TextView>
        </View>
      ))}
    </ScrollView>
  )}
    </>
  )
}
export const CenterButton = <T extends Position | number[]> ({position, setPosition}: CenterButtonProps<T>) => {
  const [status, requestPermission] = Location.useForegroundPermissions();

  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  const centerTarget = async () => {
    if(status?.status != 'granted'){
      requestPermission();
    } else {
      const userPosition = await Location.getCurrentPositionAsync()
      if (Array.isArray(position)) setPosition([userPosition?.coords?.longitude, userPosition?.coords?.latitude] as T);
      else setPosition({ lng: userPosition?.coords?.longitude, lat: userPosition?.coords?.latitude } as T)
    }
  };
  return(
    <TouchableOpacity style={styles.centerAddress} onPress={centerTarget}>
      <Crosshair size={40} color={theme.text}/>
    </TouchableOpacity>
  )
};

const createStyles = (theme: Theme) => StyleSheet.create({
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
  searchInputContainer: { flex: 1 },
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
