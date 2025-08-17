import NativeMap from '@/src/components/layouts/NativeMap';
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
    return (
      <></>
    )
  } else {
    return <NativeMap position={position} setPosition={setPosition} />
  }
};

export default Map;