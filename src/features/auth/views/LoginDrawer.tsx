import { useAppDispatch } from '@/src/configs/redux/hooks';
import { LoginForm, LoginState } from '@/src/features/auth/authTypes';
import { CompleteProfileStep } from '@/src/features/auth/views/CompleteProfileStep';
import { OtpVerificationStep } from '@/src/features/auth/views/OTPVerificationStep';
import { PhoneNumberStep } from '@/src/features/auth/views/PhoneNumberStep';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const LoginDrawer: React.FC = () => {
  const [loginState, setLoginState] = useState<LoginState>('phoneNumber');
  const dispatch = useAppDispatch();
  const formMethods = useForm<LoginForm>();
  const styles = useThemedStyles(createStyles);


  // Load login state from AsyncStorage on component mount
  useEffect(() => {
    // const loadLoginState = async () => {
    //   try {
    //     const savedState = await services.auth.getLoginStep();
    //     if (savedState) {
    //       setLoginState(savedState as LoginState);
    //     }
    //   } catch (error) {
    //     console.log('Error loading login state:', error);
    //   }
    // };
    //
    // loadLoginState();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.loginContainer}>
      <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>

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
        {loginState === 'complete-profile' && (
          <CompleteProfileStep
            formMethods={formMethods}
          />
        )}
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    loginContainer: {
      flex: 1,
      height: 460,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1
    },
    formContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
    },
  });

export default LoginDrawer;
