import { useTheme } from '@/src/components/contexts/ThemeContext';
import { Header } from '@/src/components/layouts/Header';
import { Addresses } from '@/src/features/address/views/Addresses';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { spacing } from '@/src/styles/theme/spacing';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { Theme } from '@/src/types/theme';

const AddressPage = () => {
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={true}/>
      <View style={styles.addressContainer}>
        <Addresses selectable={false}/>
      </View>
    </SafeAreaView>
  );
};
const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary
  },
  addressContainer: {
    flex: 1,
    height: '100%',
    padding: spacing.md,
    backgroundColor: theme.background,
  }
})

export default AddressPage;