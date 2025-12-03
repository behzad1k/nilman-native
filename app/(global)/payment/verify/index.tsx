import { Header } from '@/src/components/layouts/Header';
import ButtonView from '@/src/components/ui/ButtonView';
import TextView from '@/src/components/ui/TextView';
import ENDPOINTS from '@/src/configs/api/endpoints';
import { useAppDispatch } from '@/src/configs/redux/hooks';
import { cart, order } from '@/src/configs/redux/slices/orderSlice';
import { services } from '@/src/configs/services';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Payment = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParam = useSearchParams();
  const [isSuccessful, setIsSuccessful] = useState(searchParam.get('Status') == 'OK' || searchParam.get('State') == 'OK' || searchParam.get('PayGateTranID') != null);
  const styles = useThemedStyles(createStyles);
  const { execute } = useAsyncOperation();

  const send = async () => {

    const res = await execute(() => services.order.paymentVerify({
      authority: searchParam.get('Authority') || searchParam.get('Token') || searchParam.get('ReturningParams'),
      status: searchParam.get('Status') || searchParam.get('State') || searchParam.get('PayGateTranID') != null,
      terminalId: searchParam.get('TerminalId'),
      refNum: searchParam.get('RefNum'),
      tranId: searchParam.get('PayGateTranID')
    }));

    if (res.code == 200) {
      setIsSuccessful(true);
      dispatch(cart());
      dispatch(order());
    } else {
      setIsSuccessful(false);
    }
  };
  useEffect(() => {
    if (isSuccessful) {
      send();
    }
  }, []);

  return (
    <>
      <Header/>
      <View style={styles.paymentContainer}>
        {isSuccessful ?
          <View style={styles.payment}>
            <Image style={styles.paymentImage}
                   source={require('@/src/assets/images/checked.png')}/>
            <TextView>پرداخت شما موفقیت آمیز بود</TextView>
          </View>
          :
          <View style={styles.payment}>
            <Image style={styles.paymentImage}
                   source={require('@/src/assets/images/cancel.png')}/>
            <TextView>پرداخت موفقیت آمیز نبود</TextView>
          </View>
        }
        <ButtonView onPress={() => router.push('/cart')} style={[styles.paymentButton, isSuccessful ? styles.paymentSuccessful : styles.paymentUnSuccessful]}>بازگشت به صفحه سفارشات</ButtonView>
      </View>
    </>
  );
};
const createStyles = (theme: Theme) => StyleSheet.create({
  paymentContainer: {
    width: '100%',
    height: 100,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    flex: 1
  },
  paymentButton: {
    borderRadius: 12,
    padding: 8,
    color: '#FFF'
  },
  paymentUnSuccessful: {
    backgroundColor: '#f15249',
  },
  paymentSuccessful: {
    backgroundColor: 'mediumseagreen',
  },
  paymentImage: {
    width: 200,
    height: 200,
  },
  payment: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  }

});

export default Payment;
