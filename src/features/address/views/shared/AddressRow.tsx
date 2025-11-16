import TextView from '@/src/components/ui/TextView';
import { addressRowStyles } from '@/src/features/address/styles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import Typography from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import { Pencil } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';
import { Address } from '../../types';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import { colors } from '@/src/styles/theme/colors';

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
                             editable = true,
                             onEdit,
                             selectable = false
                           }: IAddressRowProps) {
  const styles = useThemedStyles(createStyles);

  const { theme } = useTheme();
  const handlePress = () => {
    setSelected(address);
    onClick && onClick(address);
  };

  return (
    <TouchableOpacity
      style={[
        styles.addressContainer,
        isSelected && styles.selected
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {editable && (
        <TouchableOpacity
          style={addressRowStyles.addressDots}
          onPress={onEdit}
        >
          <Pencil size={20} color={theme.text}/>
        </TouchableOpacity>
      )}
      <View style={addressRowStyles.addressDetails}>
        <View style={addressRowStyles.addressHeader}>
          <View style={addressRowStyles.addressItem}>
            <TextView style={styles.addressTitle}>{address.title}</TextView>
          </View>
        </View>
        <View style={addressRowStyles.addressItem}>
          <TextView style={styles.addressDescription}>{address.description}</TextView>
        </View>
      </View>
      {selectable && (
        <View style={[
          addressRowStyles.selectionIndicator,
          isSelected ? addressRowStyles.addressSelected : addressRowStyles.addressNotSelected
        ]}/>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  addressDescription: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: 'light',
    textAlign: 'right',
    color: theme.text,
  },
  addressTitle: {
    color: theme.text,
    fontSize: 16,
    ...Typography.weights.normal
  },
  selected: {
    borderColor: colors.pink,
  },
});
