import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { useAuth } from '@/src/components/contexts/AuthContext';
import LogoIcon from '@/src/components/icons/LogoIcon';
import ButtonView from '@/src/components/ui/ButtonView';
import { OTP } from '@/src/components/ui/OTP';
import TextView from '@/src/components/ui/TextView';
import { cart, order } from '@/src/configs/redux/slices/orderSlice';
import { addresses, getWorkers, setUser, fetchUser } from '@/src/configs/redux/slices/userSlice';
import { AppDispatch } from '@/src/configs/redux/store';
import { services } from '@/src/configs/services';
import { LoginForm, LoginState } from '@/src/features/auth/authTypes';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useOtpTimer } from '@/src/hooks/useOTPTimer';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
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
  onLoginSuccess?: () => Promise<void> | void;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
                                                                          formMethods,
                                                                          setLoginState,
                                                                          dispatch,
                                                                          onLoginSuccess,
                                                                        }) => {
  const { getValues } = formMethods;
  const [code, setCode] = useState<string[]>([]);
  const styles = useThemedStyles(createStyles);
  const { closeDrawer } = useDrawer();
  const { checkAuthStatus } = useAuth();
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

  const handleResendCode = useCallback(async () => {
    try {
      const phoneNumber = getValues().phoneNumber;
      if (!phoneNumber) {
        setLoginState('phoneNumber');
        return;
      }

      await services.auth.login({ phoneNumber });
      resetTimer();
      startTimer();
      setCode([]);

      Toast.show({
        text1: t('message.otpResent'),
        type: 'success'
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      Toast.show({
        text1: t('error.otpResendFailed'),
        type: 'error'
      });
    }
  }, [getValues, resetTimer, startTimer, setLoginState, t]);

  const loadUserData = useCallback(async () => {
    try {
      await initialApis(() =>
        Promise.all([
          dispatch(fetchUser()),
          dispatch(order()),
          dispatch(cart()),
          dispatch(getWorkers()),
          dispatch(addresses()),
        ])
      );
    } catch (error) {
      console.error('Error loading user data:', error);
      // Don't show error toast here as login was successful
    }
  }, [dispatch, initialApis]);

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
      console.log(tempToken);
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

      // Check if user profile is complete
      if (!res.data?.user?.isVerified) {
        await StorageService.setItem(STORAGE_KEYS.LOGIN_STEP, 'complete-profile');
        console.log(res.data.user, 'bez');
        setLoginState('complete-profile');
        return;
      }

      // Update user in Redux store
      dispatch(setUser(res.data?.user));

      // Login successful - load user data
      await loadUserData();

      // Update auth context state
      await checkAuthStatus();

      // Call success callback if provided
      if (onLoginSuccess) {
        await onLoginSuccess();
      }

      Toast.show({
        text1: t('message.welcome'),
        type: 'success'
      });
      // Close the drawer
      closeDrawer('login');

    } catch (error) {
      console.error('Verification error:', error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          Toast.show({
            text1: t('error.otpExpired'),
            type: 'error'
          });
          setLoginState('phoneNumber');
        } else if (error.message.includes('invalid')) {
          Toast.show({
            text1: t('error.otpInvalid'),
            type: 'error'
          });
          setCode([]);
        } else {
          Toast.show({
            text1: t('error.otpNotVerified'),
            type: 'error'
          });
        }
      } else {
        Toast.show({
          text1: t('error.otpNotVerified'),
          type: 'error'
        });
      }
    }
  }, [
    code,
    codeSubmit,
    dispatch,
    setLoginState,
    loadUserData,
    checkAuthStatus,
    onLoginSuccess,
    closeDrawer,
    t
  ]);

  const handleGoBack = useCallback(() => {
    resetTimer();
    setCode([]);
    setLoginState('phoneNumber');
  }, [resetTimer, setLoginState]);

  useEffect(() => {
    startTimer();

    // Cleanup on unmount
    return () => {
      resetTimer();
    };
  }, [startTimer, resetTimer]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === 6 && !isLoading) {
      verifyOtp();
    }
  }, [code, isLoading, verifyOtp]);

  return (
    <View style={styles.loginBox}>
      <View style={styles.loginNilman}>
        <LogoIcon width={85} height={85} fill={colors.pink}/>
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
        disabled={isLoading || initialApisLoading}
      />

      <View style={styles.loginTicker}>
        <View style={styles.loginTickerLeft}>
          <TextView style={styles.loginCountdown}>{formattedTime}</TextView>
        </View>
        <TextView style={styles.tickerText}>زمان باقی مانده شما:</TextView>
      </View>

      {canResend && (
        <TouchableOpacity
          onPress={handleResendCode}
          disabled={isLoading || initialApisLoading}
        >
          <TextView style={styles.loginCodeNotReceived}>
            کد را دریافت نکردید؟ ارسال مجدد
          </TextView>
        </TouchableOpacity>
      )}

      <View style={styles.buttonsContainer}>
        <ButtonView
          style={[styles.loginButton, styles.cancelButton]}
          onPress={handleGoBack}
          disabled={isLoading || initialApisLoading}
        >
          <TextView style={[styles.loginButtonTextView, styles.loginButtonTextViewCancel]}>
            مرحله قبل
          </TextView>
        </ButtonView>

        <ButtonView
          style={styles.loginButton}
          onPress={verifyOtp}
          loading={isLoading || initialApisLoading}
          disabled={code.length !== 6}
        >
          <TextView style={styles.loginButtonTextView}>ثبت</TextView>
        </ButtonView>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    loginBox: {
      backgroundColor: theme.background,
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
      color: colors.pink,
    },
    loginSpan: {
      fontSize: 16,
      fontWeight: 'medium',
      textAlign: 'center',
      marginVertical: spacing.sm,
      alignSelf: 'flex-end'
    },
    loginOtpSent: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 24,
    },
    phoneNumber: {
      fontWeight: 'bold',
      color: colors.pink,
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
      marginRight: 10,
    },
    tickerText: {
      fontSize: 14,
    },
    loginCodeNotReceived: {
      fontSize: 14,
      color: colors.pink,
      textAlign: 'center',
      marginBottom: 20,
      textDecorationLine: 'underline',
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    loginButton: {
      width: '70%',
      backgroundColor: colors.pink,
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
    loginButtonTextViewCancel: {
      fontSize: 12,
    },
  });
