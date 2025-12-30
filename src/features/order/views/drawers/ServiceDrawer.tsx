import TextInputView from "@/src/components/ui/TextInputView";
import TextView from "@/src/components/ui/TextView";
import { serviceDrawerStyles } from "@/src/features/order/styles/serviceDrawer";
import { Form } from "@/src/features/order/types";
import { Service } from "@/src/features/service/types";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { colors } from "@/src/styles/theme/colors";
import { Theme } from "@/src/types/theme";
import { engNumToPersian, formatPrice } from "@/src/utils/funs";
import { OnPressEvent } from "@maplibre/maplibre-react-native";
import React, { useCallback, useMemo } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Minus, Plus, Trash2 } from "react-native-feather";

interface IServiceDrawerProps {
  currentParent: Service;
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  handleClickCard: (secAttr: Service, e?: GestureResponderEvent) => void;
  deleteAttribute: (attrId: number) => void;
  onClose: () => void;
}

const ServiceDrawer = ({
  currentParent,
  selected,
  setSelected,
  handleClickCard,
  deleteAttribute,
  onClose,
}: IServiceDrawerProps) => {
  const styles = useThemedStyles(createStyles);

  const filteredAttributes = useMemo(() => {
    return (
      currentParent?.attributes
        ?.filter((e) => e.showInList)
        ?.sort((a, b) => (a?.sort || 1000) - (b?.sort || 1000)) || []
    );
  }, [currentParent?.attributes]);

  const handleQuantityChange = useCallback(
    (secAttr: Service, newCount: number) => {
      if (newCount <= 0) {
        deleteAttribute(secAttr.id);
      } else {
        setSelected((prev) => {
          const newOptions = { ...prev.options };
          if (newOptions[secAttr.id]) {
            newOptions[secAttr.id].count = newCount;
          }
          return { ...prev, options: newOptions };
        });
      }
    },
    [deleteAttribute, setSelected],
  );

  const isAttributeSelected = useCallback(
    (secAttr: Service) => {
      return (
        Object.keys(selected?.options)?.find(
          (e) => e === secAttr.id.toString(),
        ) ||
        Object.keys(selected.options).find((e) =>
          secAttr.attributes?.map((j) => j.id.toString())?.includes(e),
        )
      );
    },
    [selected.options],
  );

  if (!filteredAttributes.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={serviceDrawerStyles.servicesList}>
        {filteredAttributes.map((secAttr) => {
          const isSelected = isAttributeSelected(secAttr);
          const count = selected?.options[secAttr.id]?.count || 1;
          const price = secAttr.price * (selected.isUrgent ? 1.5 : 1);

          function faNumToEng(text: string): string {
            throw new Error("Function not implemented.");
          }

          return (
            <TouchableOpacity
              key={secAttr.slug}
              style={[styles.attrBox, isSelected && styles.selectedAttrBox]}
              onPress={(e) => {
                e.stopPropagation();
                handleClickCard(secAttr);
              }}
              activeOpacity={0.7}
            >
              {secAttr.price > 0 ? (
                <View style={serviceDrawerStyles.priceContainer}>
                  <View style={serviceDrawerStyles.priceRow}>
                    <TextView style={styles.currency}>تومان</TextView>
                    <TextView style={styles.price}>
                      {formatPrice(price)}
                    </TextView>
                  </View>

                  {selected.isMulti &&
                    Object.keys(selected.options).includes(
                      secAttr.id?.toString(),
                    ) && (
                      <View style={serviceDrawerStyles.quantityContainer}>
                        <TouchableOpacity
                          style={serviceDrawerStyles.quantityButton}
                          disabled={
                            secAttr.addOns.length > 0
                              ? selected.options[secAttr.id?.toString()]?.addOns
                                ? Object.values(
                                    selected.options[secAttr.id?.toString()]
                                      .addOns || {},
                                  ).reduce((acc, curr) => acc + curr.count, 0) >
                                  0
                                : true
                              : false
                          }
                          onPress={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(secAttr, count - 1);
                          }}
                        >
                          {count === 1 ? (
                            <Trash2 width={16} color="#ff4444" />
                          ) : (
                            <Minus width={16} color="#666" />
                          )}
                        </TouchableOpacity>

                        <TextInputView
                          style={serviceDrawerStyles.quantityInput}
                          value={engNumToPersian(count.toString())}
                          editable={
                            !(secAttr.addOns.length > 0
                              ? selected.options[secAttr.id?.toString()]?.addOns
                                ? Object.values(
                                    selected.options[secAttr.id?.toString()]
                                      .addOns || {},
                                  ).reduce((acc, curr) => acc + curr.count, 0) >
                                  0
                                : true
                              : false)
                          }
                          onChangeText={(text) => {
                            if (
                              selected.options[secAttr.id?.toString()]?.addOns
                                ? Object.values(
                                    selected.options[secAttr.id?.toString()]
                                      .addOns || {},
                                  ).reduce(
                                    (acc, curr) => acc + curr.count,
                                    0,
                                  ) == 0
                                : true
                            ) {
                              const newCount = parseInt(faNumToEng(text)) || 0;
                              handleQuantityChange(secAttr, newCount);
                            }
                          }}
                          // keyboardType="numeric"
                          textAlign="center"
                          onFocus={(e) => e.stopPropagation()}
                        />

                        <TouchableOpacity
                          style={serviceDrawerStyles.quantityButton}
                          disabled={
                            secAttr.addOns.length > 0
                              ? selected.options[secAttr.id?.toString()]?.addOns
                                ? Object.values(
                                    selected.options[secAttr.id?.toString()]
                                      .addOns || {},
                                  ).reduce((acc, curr) => acc + curr.count, 0) >
                                  0
                                : true
                              : false
                          }
                          onPress={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(secAttr, count + 1);
                          }}
                        >
                          <Plus width={16} color="#666" />
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              ) : (
                <View></View>
              )}

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextView style={styles.attrTitle}>{secAttr.title}</TextView>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 0.5,
                    borderColor: colors.pink,
                  }}
                >
                  {isSelected && <View style={styles.selectedIcon}></View>}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={serviceDrawerStyles.confirmButton}
        onPress={onClose}
      >
        <TextView style={serviceDrawerStyles.confirmButtonText}>ثبت</TextView>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    attrBox: {
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderWidth: 2,
      justifyContent: "space-between",
      flexDirection: "row",
      borderColor: "transparent",
      backgroundColor: theme.primary,
    },
    currency: {
      fontSize: 14,
      color: theme.text,
    },
    price: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    attrTitle: {
      fontSize: 17,
      color: theme.text,
      fontWeight: "600",
    },
    selectedAttrBox: {
      borderColor: colors.pink,
    },
    selectedIcon: {
      width: 18,
      height: 18,
      borderRadius: 10,
      backgroundColor: colors.pink,
    },
  });

export default ServiceDrawer;
