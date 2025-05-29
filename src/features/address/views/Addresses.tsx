import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { services } from '@/src/configs/services';
import { addressesStyles } from '@/src/features/address/styles';
import { AddressRow } from '@/src/features/address/views/shared/AddressRow';
import { useNavigation } from '@react-navigation/native';
import { PlusCircle } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, } from 'react-native';
import type { Address } from '../types';

interface IAddressProps {
  onClick?: (address: Address) => void;
  editable?: boolean;
}

export const Addresses = ({
                            onClick,
                            editable = false
                          }: IAddressProps) => {
  const userReducer = useAppSelector((state) => state.user);
  const { openDrawer } = useDrawer();
  const userAddresses = userReducer.addresses;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const deleteAddress = async (id: number) => {
    // try {
    //   const res = await api(urls.address + id, { method: 'DELETE' }, true);
    //   if (res.code == 200) {
    //     toast('آدرس با موفقیت حذف شد.', { type: 'success' });
    //     dispatch(addresses());
    //   } else {
    //     toast('مشکلی پیش آمده، لطفا مجددا امتحان کنید یا با اپراتور تماس بگیرید', { type: 'error' });
    //   }
    // } catch (error) {
    //   toast('خطا در حذف آدرس', { type: 'error' });
    // }
    setModalVisible(false);
    setConfirmModalVisible(false);
  };

  const handleAddAddress = async () => {
    if (await !services.auth.isAuthenticated()) {
      navigation.navigate('AddAddress' as never);
    } else {
      // toast('لطفا ابتدا وارد شوید!', {
      //   onClose: () => openDrawer('loginDrawer'),
      //   type: 'error'
      // });
    }
  };

  const handleEditAddress = () => {
    setModalVisible(false);
    // navigation.navigate('EditAddress' as never, { addressId: selectedAddress?.id });
  };

  const handleDeleteConfirm = () => {
    setModalVisible(false);
    setConfirmModalVisible(true);
  };

  return (
    <View style={addressesStyles.addressSection}>
      {userAddresses.map((value, index) => (
        <AddressRow
          key={index}
          isSelected={selectedAddress?.id === value.id && onClick !== undefined}
          address={value}
          setSelected={setSelectedAddress}
          onClick={onClick}
          editable={editable}
          onEdit={() => {
            setSelectedAddress(value);
            setModalVisible(true);
          }}
          selectable={true}
        />
      ))}

      <TouchableOpacity style={addressesStyles.addAddressContainer} onPress={handleAddAddress}>
        <Text style={addressesStyles.addAddressText}>افزودن آدرس</Text>
        <PlusCircle size={20} color="green"/>
      </TouchableOpacity>

      {/* Address Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={addressesStyles.modalOverlay}>
          <View style={addressesStyles.addressModal}>
            <Text style={addressesStyles.modalTitle}>{selectedAddress?.title}</Text>
            <TouchableOpacity style={addressesStyles.addressModalButton} onPress={handleEditAddress}>
              <Text style={addressesStyles.modalButtonText}>ویرایش آدرس</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[addressesStyles.addressModalButton, addressesStyles.deleteButton]}
              onPress={handleDeleteConfirm}
            >
              <Text style={[addressesStyles.modalButtonText, addressesStyles.deleteButtonText]}>حذف آدرس</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={addressesStyles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={addressesStyles.cancelButtonText}>لغو</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      {selectedAddress &&
          <Modal
              animationType="fade"
              transparent={true}
              visible={confirmModalVisible}
              onRequestClose={() => setConfirmModalVisible(false)}
          >
              <View style={addressesStyles.modalOverlay}>
                  <View style={addressesStyles.deleteModal}>
                      <Text style={addressesStyles.deleteModalText}>
                          از حذف آدرس {selectedAddress?.title} مطمئن هستید؟
                      </Text>
                      <View style={addressesStyles.deleteModalButtons}>
                          <TouchableOpacity
                              style={addressesStyles.deleteModalButton}
                              onPress={() => setConfirmModalVisible(false)}
                          >
                              <Text style={addressesStyles.deleteModalButtonText}>بازگشت</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                              style={[addressesStyles.deleteModalButton, addressesStyles.confirmDeleteButton]}
                              onPress={() => deleteAddress(selectedAddress?.id)}
                          >
                              <Text style={[addressesStyles.deleteModalButtonText, addressesStyles.confirmDeleteText]}>بله</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
          </Modal>
      }
    </View>
  );
};
