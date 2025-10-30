import NativeMap from '@/src/features/address/views/layouts/NativeMap';
import WebMap from '@/src/features/address/views/layouts/WebMap';
import React from 'react';
import { Platform } from 'react-native';

interface MapProps {
  position: number[];
  setPosition: React.Dispatch<React.SetStateAction<number[]>>;
}

const Map = ({
               position,
               setPosition
             }: MapProps) => {
  if (Platform.OS === 'web') {
    const webPosition = {
      lat: position[1].toString(),
      lng: position[0].toString()
    };
    const setWebPosition = (newPos: { lat: string; lng: string }) => {
      setPosition([parseFloat(newPos.lng), parseFloat(newPos.lat)]);
    };

    return <WebMap position={webPosition} setPosition={setWebPosition} />;
  } else {
    return <NativeMap position={position} setPosition={setPosition} />
  }
};

export default Map;