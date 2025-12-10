import { useTheme } from "@/src/components/contexts/ThemeContext";
import { Header } from "@/src/components/layouts/Header";
import { Addresses } from "@/src/features/address/views/Addresses";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { spacing } from "@/src/styles/theme/spacing";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Theme } from "@/src/types/theme";
import { useRouter } from "expo-router";

const AddressPage = () => {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => router.push("/")} />
      <View style={styles.addressContainer}>
        <Addresses selectable={false} />
      </View>
    </SafeAreaView>
  );
};
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
    },
    addressContainer: {
      flex: 1,
      height: "100%",
      padding: spacing.md,
      backgroundColor: theme.background,
    },
  });

export default AddressPage;
