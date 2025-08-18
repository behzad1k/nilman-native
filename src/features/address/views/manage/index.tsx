import Map from '@/src/components/layouts/Map';
import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { addresses } from '@/src/configs/redux/slices/userSlice';
import { services } from '@/src/configs/services';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const defaultPosition = [
  52.4319429449887,
  35.80761631591913,
];

interface AddressManageProps {
  paramId?: number;
}

const AddressManagePage = ({ paramId }: AddressManageProps) => {
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(createStyles);
  const userReducer = useAppSelector(state => state.user);
  const address = userReducer.addresses.find(e => e.id == Number(paramId));

  const [step, setStep] = useState(1);
  const [position, setPosition] = useState<number[]>(
    address?.longitude && address?.latitude ? [
      address?.longitude,
      address?.latitude
    ] : defaultPosition
  );
  const [form, setForm] = useState({
    title: address?.title || '',
    phoneNumber: address?.phoneNumber || '',
    description: address?.description || '',
    pelak: address?.pelak || '',
    vahed: address?.vahed || '',
    districtId: address?.districtId || '',
    floor: address?.floor || ''
  });

  const submit = async () => {
    if (step == 1) {
      if (position[0] != defaultPosition[0] && position[1] != defaultPosition[1]) {
        const res = await services.address.geoCode({
          lng: position[0],
          lat: position[1]
        });
        const districts = [1, 2, 3, 4, 5, 6, 7, 8, 22];
        if (res.code == 200) {

          if (!districts.includes(Number(res.data.municipality_zone)) || res.data.city != 'تهران') {
            // Toast.show({
            //   type: 'error',
            //   text1: 'موقعیت مکانی انتخاب شده در محدوده پشتیانی نیلمان نمی باشد'
            // });
            return;
          }
          if (!paramId) {
            setForm(prev => ({
              ...prev,
              description: res.data.formatted_address
            }));
          }
          setForm(prev => ({
            ...prev,
            districtId: res.data.municipality_zone
          }));
          setStep(prev => prev + 1);
        }
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: 'لطفا موقعیت مکانی خود را به درستی وارد کنید'
        // });
      }
      return;
    }

    if (!form?.description || !form.pelak || !form.vahed) {
      // Toast.show({
      //   type: 'error',
      //   text1: 'لطفا تمامی اطلاعات را به درستی وارد کنید'
      // });
      return;
    }
    const res = await services.address.basicAddress({
      title: form?.title,
      phoneNumber: form?.phoneNumber,
      description: form?.description,
      pelak: form?.pelak,
      vahed: form?.vahed,
      longitude: position[0],
      latitude: position[1],
      districtId: Number(form?.districtId) || undefined,
      floor: form?.floor
    }, paramId);
    if (res.code == 200) {
      console.log(res);
      // Toast.show({
      //   type: 'success',
      //   text1: 'اطلاعات آدرس با موفقیت ذخیره شد.'
      // });
      dispatch(addresses());
      router.push('/address');
    } else {
      // Toast.show({
      //   type: 'error',
      //   text1: 'مشکلی پیش آمده، لطفا مجددا امتحان کنید یا با اپراتور تماس بگیرید'
      // });
    }
  };
  return (

    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
        <View style={styles.addressManage}>
          <TextView style={styles.title}>
            {paramId ? 'ویرایش' : 'افزودن'} آدرس
          </TextView>

          {step == 1 ? (
            <>
              <TextView style={styles.subtitle}>
                لطفا موقعیت مکانی دقیق خود را روی نقشه انتخاب نمایید
              </TextView>
              <View style={styles.mapContainer}>
                <Map position={position.map(e => Number(e))} setPosition={setPosition}/>
              </View>
            </>
          ) : (
            <View style={styles.editProfile}>
              <TextInputView
                style={styles.textInput}
                value={form?.title}
                onChangeText={(text) => setForm(prev => ({
                  ...prev,
                  title: text
                }))}
                placeholder="عنوان (مثال: خانه)"
                placeholderTextColor="#999"
              />

              <TextInputView
                style={styles.textInput}
                value={form?.phoneNumber}
                onChangeText={(text) => setForm(prev => ({
                  ...prev,
                  phoneNumber: text
                }))}
                placeholder="تلفن"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />

              <View style={styles.addressManageRow}>
                <TextInputView
                  style={[styles.textInput, styles.halfInput]}
                  value={form?.pelak}
                  onChangeText={(text) => setForm(prev => ({
                    ...prev,
                    pelak: text
                  }))}
                  placeholder="پلاک"
                  placeholderTextColor="#999"
                />

                <TextInputView
                  style={[styles.textInput, styles.halfInput]}
                  value={form?.vahed}
                  onChangeText={(text) => setForm(prev => ({
                    ...prev,
                    vahed: text
                  }))}
                  placeholder="واحد"
                  placeholderTextColor="#999"
                />

                <TextInputView
                  style={[styles.textInput, styles.halfInput]}
                  value={form?.floor}
                  onChangeText={(text) => setForm(prev => ({
                    ...prev,
                    floor: text
                  }))}
                  placeholder="طبقه"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <TextInputView
                style={[styles.textInput, styles.multilineInput]}
                value={form?.description}
                onChangeText={(text) => setForm(prev => ({
                  ...prev,
                  description: text
                }))}
                placeholder="نشانی"
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
              />

            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={submit}
        activeOpacity={0.8}
      >
        <TextView style={styles.confirmButtonText}>ثبت</TextView>
      </TouchableOpacity>
    </KeyboardAvoidingView>

  );
};
const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  addressManage: {
    flex: 1,
    backgroundColor: theme.background,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: theme.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: theme.text,
    lineHeight: 24,
  },
  mapContainer: {
    height: '100%',
    maxHeight: 800,
    borderRadius: 8,
  },
  editProfile: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.primary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  multilineInput: {
    height: 200
  },
  addressManageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  halfInput: {
    minWidth: 100,
    textAlign: 'center'
  },
  confirmButton: {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    width: '90%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddressManagePage;