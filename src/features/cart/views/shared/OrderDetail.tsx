import TextView from "@/src/components/ui/TextView";
import { useAppSelector } from "@/src/configs/redux/hooks";
import { Service } from "@/src/features/service/types";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { findAncestors, formatPrice } from "@/src/utils/funs";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Order, OrderService } from "@/src/features/order/types";
import { Theme } from "@/src/types/theme";

interface OrderDetailProps {
  item: Order;
}
const OrderDetail = ({ item }: OrderDetailProps) => {
  const services = useAppSelector((state) => state.service.allServices);
  const styles = useThemedStyles(createStyles);
  console.log(item);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        // contentContainerStyle={styles.container}
      >
        <TextView style={styles.header}>فاکتور سفارش</TextView>

        {item.orderServices?.map(
          (orderService: OrderService, index: number) => (
            <View key={index} style={styles.orderDetailRow}>
              <TextView>{formatPrice(orderService.price)} تومان</TextView>

              <TextView style={styles.orderDetailRowTitle}>
                {findAncestors(services, orderService.serviceId)
                  .slice(0, 3)
                  .reverse()
                  .reduce(
                    (acc: string, curr: Service, index: number) =>
                      acc + (index !== 0 ? " -> " : "") + curr.title,
                    "",
                  )}
              </TextView>
            </View>
          ),
        )}

        <View style={styles.divider} />

        <View style={styles.orderDetailRow}>
          <TextView>{formatPrice(item.price)} تومان</TextView>
          <TextView style={styles.orderDetailRowBoldTitle}>
            مجموع سفارش
          </TextView>
        </View>

        <View style={styles.orderDetailRow}>
          <TextView>{formatPrice(item.transportation)} تومان</TextView>
          <TextView style={styles.orderDetailRowTitle}>ایاب ذهاب</TextView>
        </View>

        <View style={styles.divider} />

        <View style={styles.orderDetailRow}>
          <TextView>{formatPrice(item.finalPrice)} تومان</TextView>
          <TextView style={styles.orderDetailRowBoldTitle}>جمع کل</TextView>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.background,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      width: "100%",
      padding: 16,
      minHeight: 280,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      width: "100%",
      padding: 16,
      minHeight: 280,
      alignItems: "flex-end",
    },
    header: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    divider: {
      height: 1,
      backgroundColor: "lightslategray",
      marginVertical: 10,
    },
    orderDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      fontSize: 14,
      marginVertical: 5,
    },
    orderDetailRowTitle: {
      color: "gray",
      fontSize: 14,
    },
    orderDetailRowBoldTitle: {
      fontWeight: "bold",
      fontSize: 14,
    },
    // Additional styles from your CSS that might be used
    orderInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 6,
    },
    finalPrice: {
      fontSize: 16,
      fontWeight: "600",
    },
    orderInfoTitle: {
      fontSize: 12,
      color: "#555b62",
    },
    orderInfoAddon: {
      flexDirection: "column",
      fontSize: 14,
    },
    orderInfoDelete: {
      flexDirection: "row",
      gap: 3,
    },
    dashedBottom: {
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "black",
      borderStyle: "dashed",
    },
    orderInfoCol: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    orderInfoIcon: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      marginTop: 5,
    },
  });

export default OrderDetail;
