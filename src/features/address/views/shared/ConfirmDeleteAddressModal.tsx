import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch } from '@/src/configs/redux/hooks';
import { addresses } from '@/src/configs/redux/slices/userSlice';
import { services } from '@/src/configs/services';
import { addressesStyles } from '@/src/features/address/styles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ConfirmDeleteAddressModal = ({ selectedAddress }: any) => {
  const { closeDrawer } = useDrawer()
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();

  const deleteAddress = async (id: number) => {
    try {
      const res = await services.address.deleteAddress(id)
      if (res.code == 200) {
        // toast('آدرس با موفقیت حذف شد.', { type: 'success' });
        dispatch(addresses());
        closeDrawer('confirmDeleteAddress');
        closeDrawer('addressOption');
      } else {
        // toast('مشکلی پیش آمده، لطفا مجددا امتحان کنید یا با اپراتور تماس بگیرید', { type: 'error' });
      }
    } catch (error) {
      // toast('خطا در حذف آدرس', { type: 'error' });
    }
  };

  return (
      <View style={styles.deleteModal}>
        <TextView style={addressesStyles.deleteModalText}>
          از حذف آدرس {selectedAddress?.title} مطمئن هستید؟
        </TextView>
        <View style={addressesStyles.deleteModalButtons}>
          <TouchableOpacity
            style={styles.deleteModalButton}
            onPress={() => closeDrawer('confirmDeleteAddress')}
          >
            <TextView style={styles.deleteModalButtonText}>بازگشت</TextView>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteModalButton, styles.confirmDeleteButton]}
            onPress={() => deleteAddress(selectedAddress?.id)}
          >
            <TextView style={[styles.deleteModalButtonText, addressesStyles.confirmDeleteText]}>بله</TextView>
          </TouchableOpacity>
        </View>
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  deleteModal: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.background,
    borderRadius: 20,
    padding: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  deleteModalButton: {
    flex: 1,
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmDeleteButton: {
    backgroundColor: '#ffe6e6',
  },
  deleteModalButtonText: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  }
})
export default ConfirmDeleteAddressModal;