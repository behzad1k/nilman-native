import { Header } from '@/src/components/layouts/Header';
import TextView from '@/src/components/ui/TextView';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { spacing } from '@/src/styles/theme/spacing';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Theme } from '@/src/types/theme';

const Privacy = () => {
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={true}/>
      <TextView>pppp</TextView>
    </SafeAreaView>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary
  },
  addressContainer: {
    flex: 1,
    padding: spacing.md,
  }
})

export default Privacy;