import { useDrawer } from "@/src/components/contexts/DrawerContext";
import TextView from "@/src/components/ui/TextView";
import { infoDrawerStyles } from "@/src/features/order/styles/infoDrawer";
import { Service } from "@/src/features/service/types";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import Typography from "@/src/styles/theme/typography";
import { Theme } from "@/src/types/theme";
import React, { useMemo } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { X } from "react-native-feather";

interface IInfoDrawerProps {
  parent: Service;
}

const InfoDrawer = ({ parent }: IInfoDrawerProps) => {
  const { closeDrawer } = useDrawer();

  const styles = useThemedStyles(createStyles);

  const sortedAttributes = useMemo(() => {
    return [...(parent.attributes || [])].sort(
      (a, b) => (a?.sort || 1000) - (b?.sort || 1000),
    );
  }, [parent.attributes]);

  return (
    <View style={styles.infoModal}>
      <View style={styles.infoModalHeader}>
        <TouchableOpacity onPress={() => closeDrawer("infoDrawer")}>
          <X width={24} color="#666" />
        </TouchableOpacity>
        <TextView style={styles.headerTitle}>توضیحات {parent.title}</TextView>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {sortedAttributes.map((attribute) => (
          <View key={attribute.id} style={infoDrawerStyles.infoRow}>
            <TextView style={styles.attributeTitle}>{attribute.title}</TextView>
            <TextView style={styles.attributeDescription}>
              {attribute.description}
            </TextView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    infoModal: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "100%",
      paddingTop: 20,
    },
    infoModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
      ...Typography.weights.bold,
      fontSize: 18,
      color: theme.text,
    },
    scrollContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    infoRow: {
      alignItems: "flex-end",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f5f5f5",
    },
    attributeTitle: {
      ...Typography.weights.medium,
      fontSize: 16,
      color: theme.text,
      marginBottom: 4,
    },
    attributeDescription: {
      ...Typography.weights.thin,
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      textAlign: "right",
    },
  });
export default InfoDrawer;
