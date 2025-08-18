import { useAuth } from '@/src/components/contexts/AuthContext';
import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import AddressOptionsModal from '@/src/features/address/views/shared/AddressOptionsModal';
import { AddressRow } from '@/src/features/address/views/shared/AddressRow';
import LoginDrawer from '@/src/features/auth/views/LoginDrawer';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { spacing } from '@/src/styles/theme/spacing';
import { PlusCircle } from 'phosphor-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';
import type { Address } from '../types';
import { router } from 'expo-router';
import { Theme } from '@/src/types/theme';

interface IAddressProps {
  onClick?: (address: Address) => void;
  editable?: boolean;
  selectable?: boolean;
}

export const Addresses = ({
                            onClick,
                            selectable = true,
                            editable = true
                          }: IAddressProps) => {
  const userReducer = useAppSelector((state) => state.user);
  const { openDrawer } = useDrawer();
  const userAddresses = userReducer.addresses;
  const styles = useThemedStyles(createStyles)
  const { isAuthenticated } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState<Address>();

  const handleAddAddress = async () => {
    if (isAuthenticated) {
      router.push(`/address/manage`);
    } else {
      openDrawer('login', <LoginDrawer />, { drawerHeight: 'auto' })
    }
  };

  return (
    <View style={styles.addressSection}>
      {userAddresses.map((value, index) => (
        <AddressRow
          key={index}
          isSelected={selectedAddress?.id === value.id && onClick !== undefined}
          address={value}
          setSelected={setSelectedAddress}
          onClick={onClick}
          editable={editable}
          onEdit={() => {
            openDrawer('addressOption', <AddressOptionsModal selectedAddress={value} />, { drawerHeight: 'auto' })
            setSelectedAddress(value);
          }}
          selectable={selectable}
        />
      ))}

      <TouchableOpacity style={styles.addAddressContainer} onPress={handleAddAddress}>
        <TextView style={styles.addAddressText}>افزودن آدرس</TextView>
        <PlusCircle size={20} color="#3b93f3"/>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  addressSection: {
    backgroundColor: theme.background,
    gap: 12,
  },
  addAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: spacing.sm
  },
  addAddressText: {
    fontSize: 18,
    color: '#3b93f3',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1
  }
})