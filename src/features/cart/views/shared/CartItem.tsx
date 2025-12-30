import TextView from "@/src/components/ui/TextView";
import { useAppSelector } from "@/src/configs/redux/hooks";
import { cartItemStyle } from "@/src/features/cart/styles";
import useNumerals from "@/src/hooks/useNumerals";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { Theme } from "@/src/types/theme";
import { engNumToPersian, findAncestors } from "@/src/utils/funs";
import moment from "jalali-moment";
import { Calendar, MapPin, Timer, Trash } from "phosphor-react-native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Order } from "@/src/features/order/types";
import { useTheme } from "@/src/components/contexts/ThemeContext";
import { decimalToTimeFormat } from "@/src/components/ui/DigitalTimePicker";

interface ICartItemProps {
  item: Order;
  deleteCartItem: (id: number) => void;
}

const CartItem = ({ item, deleteCartItem }: ICartItemProps) => {
  const services = useAppSelector((state) => state.service.allServices);
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const { formatPrice } = useNumerals();
  return (
    <View style={styles.cartItemContainer}>
      <View style={cartItemStyle.orderInfo}>
        <TouchableOpacity
          style={cartItemStyle.trashCart}
          onPress={() => deleteCartItem(item?.id)}
        >
          <TextView style={cartItemStyle.deleteText}>حذف سفارش</TextView>
          <Trash size={20} color="#ff4444" />
        </TouchableOpacity>
        <View style={cartItemStyle.orderInfoLeft}>
          {item.isUrgent ? (
            <View style={cartItemStyle.isUrgent}>
              <TextView style={cartItemStyle.isUrgentText}>فوری</TextView>
            </View>
          ) : null}
          <TextView style={cartItemStyle.serviceTitle}>
            {item.service?.title}
          </TextView>
        </View>
      </View>

      {item.orderServices
        .filter((e) => !e.isAddOn)
        ?.map((attribute, index) => (
          <View key={index} style={cartItemStyle.orderInfo}>
            <View style={cartItemStyle.orderInfoDelete}>
              <View style={cartItemStyle.orderInfoAddon}>
                <TextView style={cartItemStyle.priceText}>
                  {formatPrice(attribute.price)} تومان
                </TextView>
                {attribute.addOns?.map((e, addOnIndex) => (
                  <TextView key={addOnIndex} style={cartItemStyle.priceText}>
                    {formatPrice(e.addOn?.price * e.count)} تومان
                  </TextView>
                ))}
              </View>
            </View>
            <View style={cartItemStyle.orderInfoAddon}>
              <TextView style={cartItemStyle.orderInfoTitle}>
                {findAncestors(services, attribute.serviceId)
                  .slice(0, 3)
                  .reverse()
                  .reduce(
                    (acc, curr, index) =>
                      acc + (index != 0 ? " -> " : "") + curr?.title,
                    "",
                  ) +
                  " " +
                  attribute.count +
                  "x "}
              </TextView>
              {attribute.addOns?.map((e, addOnIndex) => (
                <TextView key={addOnIndex} style={cartItemStyle.addOnText}>
                  -{e.addOn?.title + " " + engNumToPersian(e.count) + "x"}
                </TextView>
              ))}
            </View>
          </View>
        ))}

      <View style={cartItemStyle.orderInfo}>
        <TextView style={cartItemStyle.priceText}>
          {formatPrice(
            moment(item.date, "jYYYY/jMM/jDD").unix() >=
              moment("1403/12/01", "jYYYY/jMM/jDD").unix()
              ? 200000
              : 100000,
          )}{" "}
          تومان
        </TextView>
        <TextView style={cartItemStyle.orderInfoText}>ایاب ذهاب</TextView>
      </View>

      {item.discountAmount && item.discountAmount > 0 ? (
        <View style={cartItemStyle.orderInfo}>
          <TextView style={cartItemStyle.discountText}>
            {formatPrice(item.discountAmount)}- تومان
          </TextView>
          <TextView style={cartItemStyle.orderInfoText}>تخفیف</TextView>
        </View>
      ) : null}

      <View style={[cartItemStyle.orderInfo, cartItemStyle.dashedBottom]}>
        <TextView style={cartItemStyle.finalPrice}>
          {formatPrice(item.finalPrice)} تومان
        </TextView>
        <TextView style={cartItemStyle.totalTitle}>جمع کل</TextView>
      </View>

      <View style={cartItemStyle.orderInfo}>
        <View style={cartItemStyle.orderInfoIcon}>
          <TextView style={cartItemStyle.addressText}>
            {item.address?.title}
          </TextView>
          <MapPin size={20} color={theme.text} />
        </View>

        <View style={cartItemStyle.orderInfoIcon}>
          <TextView style={cartItemStyle.dateTimeText}>{item.date}</TextView>
          <Calendar size={20} color={theme.text} />
        </View>
        <View style={cartItemStyle.orderInfoIcon}>
          <TextView style={cartItemStyle.dateTimeText}>
            {decimalToTimeFormat(item.fromTime)}
          </TextView>
          <Timer style={cartItemStyle.timerIcon} color={theme.text} />
        </View>
      </View>
    </View>
  );
};
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cartItemContainer: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      gap: 12,
    },
  });

export default CartItem;
