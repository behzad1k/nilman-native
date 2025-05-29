import { useLanguage } from '@/src/hooks/useLanguage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/styles/theme/colors';
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Header } from '@/src/components/layouts/Header';

const NewOrder: React.FC = () => {
  const { t } = useLanguage();
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewOrder;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});