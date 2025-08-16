import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { infoDrawerStyles } from '@/src/features/order/styles/infoDrawer';
import { Service } from '@/src/features/service/types';
import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X } from 'react-native-feather';

interface IInfoDrawerProps {
  parent: Service;
}

const InfoDrawer = ({ parent }: IInfoDrawerProps) => {
  const { closeDrawer } = useDrawer();

  const sortedAttributes = useMemo(() => {
    return [...(parent.attributes || [])]
    .sort((a, b) => (a?.sort || 1000) - (b?.sort || 1000));
  }, [parent.attributes]);

  return (
    <View style={infoDrawerStyles.infoModal}>
      <View style={infoDrawerStyles.infoModalHeader}>
        <TouchableOpacity onPress={() => closeDrawer('infoDrawer')}>
          <X width={24} color="#666" />
        </TouchableOpacity>
        <TextView style={infoDrawerStyles.headerTitle}>
          توضیحات {parent.title}
        </TextView>
      </View>

      <ScrollView style={infoDrawerStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {sortedAttributes.map((attribute) => (
          <View key={attribute.id} style={infoDrawerStyles.infoRow}>
            <TextView style={infoDrawerStyles.attributeTitle}>
              {attribute.title}
            </TextView>
            <TextView style={infoDrawerStyles.attributeDescription}>
              {attribute.description}
            </TextView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default InfoDrawer;