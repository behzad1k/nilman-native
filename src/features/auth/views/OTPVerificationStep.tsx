import { useDrawer } from '@/src/components/contexts/DrawerContext';
import LogoIcon from '@/src/components/icons/LogoIcon';
import ButtonView from '@/src/components/ui/ButtonView';
import { OTP } from '@/src/components/ui/OTP';
import TextView from '@/src/components/ui/TextView';
import { cart, order } from '@/src/configs/redux/slices/orderSlice';
import { addresses, getWorkers, setUser } from '@/src/configs/redux/slices/userSlice';
import { AppDispatch } from '@/src/configs/redux/store';
import { services } from '@/src/configs/services';
import { LoginForm, LoginState } from '@/src/features/auth/authTypes';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useOtpTimer } from '@/src/hooks/useOTPTimer';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors, Theme } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import { persianNumToEn } from '@/src/utils/funs';
import { STORAGE_KEYS, StorageService } from '@/src/utils/storage';
import React, { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface OtpVerificationStepProps {
  formMethods: UseFormReturn<LoginForm>;
  setLoginState: React.Dispatch<React.SetStateAction<LoginState>>;
  dispatch: AppDispatch;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
                                                                          formMethods,
                                                                          setLoginState,
                                                                          dispatch,
                                                                        }) => {
  const { getValues } = formMethods;
  const [code, setCode] = useState<string[]>([]);
  const styles = useThemedStyles(createStyles);
  const { closeDrawer } = useDrawer();
  const {
    formattedTime,
    canResend,
    startTimer,
    resetTimer
  } = useOtpTimer();
  const {
    execute: codeSubmit,
    loading: isLoading
  } = useAsyncOperation();
  const {
    execute: initialApis,
    loading: initialApisLoading
  } = useAsyncOperation();
  const { t } = useLanguage();

  const verifyOtp = useCallback(async () => {
    if (code.length !== 6) {
      Toast.show({
        text1: t('error.otpInvalid'),
        type: 'error'
      });
      return;
    }

    try {
      const tempToken = await services.auth.getTempToken();

      if (!tempToken) {
        Toast.show({
          text1: t('error.sessionExpired'),
          type: 'error'
        });
        setLoginState('phoneNumber');
        return;
      }

      const res = await codeSubmit(() => services.auth.verifyOTP({
        code: persianNumToEn(code.join('')),
        token: tempToken,
      }));

      dispatch(setUser(res));

      if (!res.data?.user?.isVerified) {
        await StorageService.setItem(STORAGE_KEYS.LOGIN_STEP, 'complete-profile');
        setLoginState('complete-profile');
      } else {
        Toast.show({
          text1: t('message.welcome'),
          type: 'success'
        });

        await initialApis(() =>
          Promise.all([
            dispatch(order()),
            dispatch(cart()),
            dispatch(getWorkers()),
            dispatch(addresses()),
          ])
        );

        closeDrawer();
      }
    } catch (error) {
      console.error('Verification error:', error);
      Toast.show({
        text1: t('error.otpNotVerified'),
        type: 'error'
      });
    } finally {
    }
  }, [code, initialApisLoading, codeSubmit, initialApis, dispatch, setLoginState, closeDrawer, t]);

  useEffect(() => {
    startTimer();
  }, []);

  return (
    <View style={styles.loginBox}>
      <View style={styles.loginNilman}>
        <LogoIcon width={85} height={85} fill={colors.logoPink}/>
        <TextView style={styles.logoTextView}>nilman</TextView>
      </View>
      <TextView style={styles.loginSpan}>
        رمز یکبار مصرف به شماره{' '}
        <TextView style={styles.phoneNumber}>{getValues().phoneNumber}</TextView>
        {' '}ارسال شد
      </TextView>
      <OTP
        onComplete={verifyOtp}
        code={code}
        setCode={setCode}
      />
      <View style={styles.loginTicker}>
        <View style={styles.loginTickerLeft}>
          <TextView style={styles.loginCountdown}>{formattedTime}</TextView>
          {/* <Icon name="access-alarm" size={35} color="#666" /> */}
        </View>
        <TextView style={styles.tickerText}>زمان باقی مانده شما:</TextView>
      </View>

      {canResend && (
        <TouchableOpacity onPress={() => setLoginState('phoneNumber')}>
          <TextView style={styles.loginCodeNotReceived}>کد را دریافت نکردید؟</TextView>
        </TouchableOpacity>
      )}

      <View style={styles.buttonsContainer}>
        <ButtonView
          style={[styles.loginButton, styles.cancelButton]}
          onPress={() => {
            resetTimer();
            setLoginState('phoneNumber');
          }}
        >
          <TextView style={styles.loginButtonTextView}>مرحله قبل</TextView>
        </ButtonView>
        <ButtonView style={styles.loginButton} onPress={verifyOtp} loading={isLoading || initialApisLoading}>
          <TextView style={styles.loginButtonTextView}>ثبت</TextView>
        </ButtonView>

      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    loginBox: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      margin: spacing.md,
      elevation: 5,
    },
    loginNilman: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    logo: {
      width: 40,
      height: 40,
      marginRight: 10,
    },
    logoTextView: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.logoPink,
    },
    loginSpan: {
      fontSize: 16,
      fontWeight: 'medium',
      textAlign: 'center',
      marginVertical: spacing.sm,
      color: '#333',
      alignSelf: 'flex-end'
    },
    loginOtpSent: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
      lineHeight: 24,
    },
    phoneNumber: {
      fontWeight: 'bold',
      color: colors.logoPink,
    },
    loginTicker: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 20,
      paddingHorizontal: 10,
    },
    loginTickerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loginCountdown: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginRight: 10,
    },
    tickerText: {
      fontSize: 14,
      color: '#666',
    },
    loginCodeNotReceived: {
      fontSize: 14,
      color: colors.logoPink,
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    loginButton: {
      width: '70%',
      backgroundColor: colors.logoPink,
      borderRadius: 8,
      paddingVertical: spacing.sm,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      width: '30%'
    },
    loginButtonTextView: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'medium',
    },
  });
