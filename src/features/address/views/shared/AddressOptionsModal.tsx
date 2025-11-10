import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { addressesStyles } from '@/src/features/address/styles';
import ConfirmDeleteAddressModal from '@/src/features/address/views/shared/ConfirmDeleteAddressModal';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const AddressOptionsModal = ({ selectedAddress }: any) => {
  const {
    openDrawer,
    closeDrawer
  } = useDrawer();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.addressModal}>
      <TextView style={addressesStyles.modalTitle}>{selectedAddress?.title}</TextView>
      <TouchableOpacity
        style={styles.addressModalButton}
        onPress={() => {
          router.push(`/address/manage/${selectedAddress?.id}`);
          closeDrawer();
        }}
      >
        <TextView style={addressesStyles.modalButtonText}>ویرایش آدرس</TextView>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addressModalButton, addressesStyles.deleteButton]}
        onPress={() => openDrawer('confirmDeleteAddress', <ConfirmDeleteAddressModal selectedAddress={selectedAddress}/>, { drawerHeight: 'auto' })}
      >
        <TextView style={[addressesStyles.modalButtonText, addressesStyles.deleteButtonText]}>حذف آدرس</TextView>
      </TouchableOpacity>
      <TouchableOpacity
        style={addressesStyles.cancelButton}
        onPress={() => closeDrawer('addressOption')}
      >
        <TextView style={styles.cancelButtonText}>لغو</TextView>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({

  addressModal: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addressModalButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.third
  },
});

export default AddressOptionsModal;