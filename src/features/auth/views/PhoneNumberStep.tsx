import LogoIcon from '@/src/components/icons/LogoIcon';
import ButtonView from '@/src/components/ui/ButtonView';
import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { LoginForm, LoginState } from '@/src/features/auth/authTypes';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import { spacing } from '@/src/styles/theme/spacing';
import Typography from '@/src/styles/theme/typography';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { services } from '@/src/configs/services'
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

interface PhoneNumberStepProps {
  formMethods: UseFormReturn<LoginForm>;
  setLoginState: React.Dispatch<React.SetStateAction<LoginState>>;
}
export const PhoneNumberStep: React.FC<PhoneNumberStepProps> = ({
                                                                  formMethods,
                                                                  setLoginState,
                                                                }) => {
  const { handleSubmit, control } = formMethods;
  const { execute: submit, loading: loading } = useAsyncOperation();
  const { closeDrawer } = useDrawer();
  const styles = useThemedStyles(createStyles);

  const onSubmit = async (data: LoginForm) => {
    try {
      await submit(() => services.auth.login(data));
      setLoginState('otp');
    } catch (error) {
      // Error already handled by the hook
    }
  };
  return (
    <View style={styles.loginBox}>
      <View style={styles.loginNilman}>
        <LogoIcon width={85} height={85} fill={colors.pink} />
        <TextView style={styles.logoTextView}>nilman</TextView>
      </View>
      <TextView style={styles.loginSpan}>ورود / ثبت نام</TextView>
      <Controller
        control={control}
        name="phoneNumber"
        rules={{ required: 'شماره تلفن الزامی است' }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInputView
            style={styles.loginPhoneInput}
            placeholder="تلفن همراه"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
          />
        )}
      />
      <TextView style={styles.termsCondition} >
        ثبت نام در نیلمان، به منزله‌ پذیرش{' '}
        <TextView style={styles.basicLink}>قوانین و شرایط استفاده</TextView> و{' '}
        <TextView style={styles.basicLink}>قوانین حریم شخصی</TextView> می باشد
      </TextView>
      <View style={styles.buttonsContainer}>
        <ButtonView
          style={[styles.loginButton, styles.cancelButton]}
          onPress={() => closeDrawer()}
        >
          <TextView style={styles.loginButtonTextView}>انصراف</TextView>
        </ButtonView>
        <ButtonView
          style={styles.loginButton}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >
          <TextView style={styles.loginButtonTextView}>ارسال کد</TextView>
        </ButtonView>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
 StyleSheet.create({
  loginBox: {
    backgroundColor: theme.background,
    padding: spacing.sm,
    margin: spacing.md
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    alignSelf: 'flex-end'
  },
  loginPhoneInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'right',
    backgroundColor: colors.lightPink,
  },
  termsCondition: {
    ...Typography.weights.thin,
    fontSize: 14,
    textAlign: 'right',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
    lineHeight: 25,
    fontWeight: '500'
  },
  basicLink: {
    color: '#007bff',
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
});
