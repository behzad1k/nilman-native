import LogoIcon from '@/src/components/icons/LogoIcon';
import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { services } from '@/src/configs/services';
import { LoginForm } from '@/src/features/auth/authTypes';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { UseFormReturn } from 'react-hook-form';
import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { Theme } from '@/src/types/theme';

interface CompleteProfileStepProps {
  formMethods: UseFormReturn<LoginForm>;
}

export const CompleteProfileStep: React.FC<CompleteProfileStepProps> = ({ formMethods }) => {
  const { register, setValue, handleSubmit } = formMethods;
  const { closeDrawer } = useDrawer();
  const styles = useThemedStyles(createStyles);
  const { execute: submit, loading: loading } = useAsyncOperation();

  React.useEffect(() => {
    register('name');
    register('lastName');
    register('nationalCode');
  }, [register]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await submit(() => services.auth.completeProfile(data));
      if (res.code == 200) {
        closeDrawer();
      }
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

      <TextView style={styles.loginLabels}>نام</TextView>
      <TextInputView
        style={styles.loginInput}
        placeholder=""
        onChangeText={(text) => setValue('name', text)}
      />

      <TextView style={styles.loginLabels}>نام خانوادگی</TextView>
      <TextInput
        style={styles.loginInput}
        placeholder=""
        onChangeText={(text) => setValue('lastName', text)}
      />

      <TextView style={styles.loginLabels}>کد ملی</TextView>
      <TextInput
        style={styles.loginInput}
        placeholder=""
        keyboardType="numeric"
        maxLength={10}
        onChangeText={(text) => setValue('nationalCode', text)}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSubmit(onSubmit)}
        >
          <TextView style={styles.buttonText}>تایید</TextView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, styles.cancelButton]}
          onPress={() => closeDrawer()}
        >
          <TextView style={styles.buttonText}>انصراف</TextView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  loginBox: {
    backgroundColor: theme.background,
    padding: spacing.sm,
    margin: spacing.md
  },
  loginNilman: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  nilmanText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loginLabels: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 5,
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  loginButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'right',
    backgroundColor: colors.lightPink,
  },
  logoTextView: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.pink,
  },
});