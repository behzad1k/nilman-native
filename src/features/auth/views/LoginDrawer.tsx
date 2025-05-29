import { useAppDispatch } from '@/src/configs/redux/hooks';
import { LoginForm, LoginState } from '@/src/features/auth/authTypes';
import { OtpVerificationStep } from '@/src/features/auth/views/OTPVerificationStep';
import { PhoneNumberStep } from '@/src/features/auth/views/PhoneNumberStep';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/styles/theme/colors';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

const LoginDrawer: React.FC = () => {
  const [loginState, setLoginState] = useState<LoginState>('phoneNumber');
  const dispatch = useAppDispatch();
  const formMethods = useForm<LoginForm>();
  const styles = useThemedStyles(createStyles);

  // Load login state from AsyncStorage on component mount
  useEffect(() => {
    // const loadLoginState = async () => {
    //   try {
    //     const savedState = await AsyncStorage.getItem('login-step');
    //     if (savedState) {
    //       setLoginState(savedState as globalType.LoginState);
    //     }
    //   } catch (error) {
    //     console.log('Error loading login state:', error);
    //   }
    // };
    //
    // loadLoginState();
  }, []);

  // Note: OTP auto-fill is not available in React Native the same way as web
  // You might want to use a library like react-native-otp-verify for Android
  // or implement SMS reading functionality separately

  return (
    <View style={styles.loginContainer}>
      <View style={styles.formContainer}>
        {loginState === 'phoneNumber' && (
          <PhoneNumberStep
            formMethods={formMethods}
            setLoginState={setLoginState}
          />
        )}
        {loginState === 'otp' && (
          <OtpVerificationStep
            formMethods={formMethods}
            setLoginState={setLoginState}
            dispatch={dispatch}
          />
        )}
        {/* {loginState === 'complete-profile' && ( */}
        {/*   <CompleteProfileStep */}
        {/*     formMethods={formMethods} */}
        {/*     dispatch={dispatch} */}
        {/*     navigate={navigation} */}
        {/*   /> */}
        {/* )} */}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    loginContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for drawer effect
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.primary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
    },
  });

export default LoginDrawer;
