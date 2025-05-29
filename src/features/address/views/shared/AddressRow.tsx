import { addressRowStyles } from '@/src/features/address/styles';
import { Pencil } from 'phosphor-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Address } from '../../types'

interface IAddressRowProps {
  address: Address;
  isSelected: boolean;
  onClick?: (address: Address) => void;
  setSelected: (address: Address) => void;
  editable?: boolean;
  onEdit?: () => void;
  selectable?: boolean;
}

export function AddressRow({
                             address,
                             isSelected,
                             onClick,
                             setSelected,
                             editable = false,
                             onEdit,
                             selectable = false
                           }: IAddressRowProps) {

  const handlePress = () => {
    setSelected(address);
    onClick && onClick(address);
  };

  return (
    <TouchableOpacity
      style={[
        addressRowStyles.addressContainer,
        isSelected && addressRowStyles.selected
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {selectable && (
        <View style={[
          addressRowStyles.selectionIndicator,
          isSelected ? addressRowStyles.addressSelected : addressRowStyles.addressNotSelected
        ]} />
      )}

      <View style={addressRowStyles.addressDetails}>
        <View style={addressRowStyles.addressHeader}>
          <View style={addressRowStyles.addressItem}>
            <Text style={addressRowStyles.addressTitle}>{address.title}</Text>
          </View>
        </View>
        <View style={addressRowStyles.addressItem}>
          <Text style={addressRowStyles.addressDescription}>{address.description}</Text>
        </View>
      </View>

      {editable && (
        <TouchableOpacity
          style={addressRowStyles.addressDots}
          onPress={onEdit}
        >
          <Pencil size={20} color="#666" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
