import TextView from "@/src/components/ui/TextView";
import { PickColorDrawerStyles } from "@/src/features/order/styles/pickColorDrawer";
import { Color, Form, PickingColor } from "@/src/features/order/types";
import { Service } from "@/src/features/service/types";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import Typography from "@/src/styles/theme/typography";
import { Theme } from "@/src/types/theme";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/src/components/contexts/ThemeContext";
import { colors } from "@/src/styles/theme/colors";
import { Toast } from "toastify-react-native";
import { useTranslation } from "react-i18next";

interface IPickColorDrawerProps {
  colors: Color[];
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  currentAttribute: Service;
  setPickingColor: React.Dispatch<React.SetStateAction<PickingColor>>;
  handleAddAttribute?: (secAttr: Service | null, color: string | null) => void;
}

const PickColorDrawer = ({
  colors: allColors,
  selected,
  setSelected,
  currentAttribute,
  setPickingColor,
}: IPickColorDrawerProps) => {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const selectedColors = selected.options[currentAttribute?.id]?.colors || [];

  const handleColorSelect = useCallback(
    (colorItem: Color) => {
      setSelected((prev) => {
        const newOptions = { ...prev.options };

        if (!newOptions[currentAttribute?.id]) {
          newOptions[currentAttribute?.id] = { count: 1 };
        }

        if (!newOptions[currentAttribute?.id]?.colors) {
          newOptions[currentAttribute?.id].colors = [];
        }

        const currentColors = newOptions[currentAttribute?.id].colors || [];
        const isSelected = currentColors.includes(colorItem.slug);

        if (!isSelected && selectedColors.length == 4) {
          Toast.warn(t("error.tooManyColors"));
        } else {
          newOptions[currentAttribute?.id].colors = isSelected
            ? currentColors.filter((color) => color !== colorItem.slug)
            : [...currentColors, colorItem.slug];
        }
        return {
          ...prev,
          options: newOptions,
        };
      });
    },
    [currentAttribute?.id, setSelected, selectedColors],
  );

  const handleConfirm = useCallback(() => {
    const selectedColors = selected.options[currentAttribute?.id]?.colors;

    if (!Array.isArray(selectedColors) || selectedColors.length === 0) {
      // Show error toast
      Toast.show({
        type: "error",
        text1: "لطفا حداقل یک رنگ را انتخاب کنید",
      });
      return;
    }

    setPickingColor({
      attr: null,
      open: false,
    });
  }, [selected.options, currentAttribute?.id, setPickingColor]);

  const handleCancel = useCallback(() => {
    const selectedColors = selected.options[currentAttribute?.id]?.colors;

    // Check if colors are required and not selected
    if (!Array.isArray(selectedColors) || selectedColors.length === 0) {
      // Remove the service from options if no color is selected
      setSelected((prev) => {
        const newOptions = { ...prev.options };
        delete newOptions[currentAttribute?.id];
        return { ...prev, options: newOptions };
      });

      Toast.show({
        type: "warn",
        text1: "انتخاب رنگ الزامی است",
      });
    }

    setPickingColor({
      attr: null,
      open: false,
    });
  }, [currentAttribute?.id, setPickingColor, setSelected]);

  return (
    <View style={styles.container}>
      <TextView style={styles.subtitle}>
        حداقل یکی از رنگ های زیر را انتخاب کنید
      </TextView>

      <ScrollView
        style={PickColorDrawerStyles.colorContainer}
        showsVerticalScrollIndicator={false}
      >
        {allColors.map((colorItem) => {
          const isSelected = selectedColors.includes(colorItem.slug);

          return (
            <TouchableOpacity
              key={colorItem.slug}
              onPress={() => handleColorSelect(colorItem)}
            >
              <LinearGradient
                dither={false}
                colors={[colorItem.code, theme.primary]}
                start={[0.1, 1]}
                end={[0.7, 0]}
                style={[styles.colorRow, isSelected && styles.selectedColorRow]}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextView style={styles.colorTitle}>
                    {colorItem.title}
                  </TextView>
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
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={PickColorDrawerStyles.buttonContainer}>
        <TouchableOpacity
          style={PickColorDrawerStyles.confirmButton}
          onPress={handleConfirm}
        >
          <TextView style={PickColorDrawerStyles.confirmButtonText}>
            تایید
          </TextView>
        </TouchableOpacity>

        <TouchableOpacity
          style={PickColorDrawerStyles.cancelButton}
          onPress={handleCancel}
        >
          <TextView style={PickColorDrawerStyles.cancelButtonText}>
            بازگشت
          </TextView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    subtitle: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 16,
      textAlign: "right",
      ...Typography.weights.medium,
    },
    colorRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 8,
      paddingRight: 16,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: theme.primary,
      opacity: 1,
    },
    colorTitle: {
      fontSize: 16,
      color: theme.text,
      ...Typography.weights.medium,
    },
    selectedColorRow: {
      borderColor: colors.pink,
    },
    selectedIcon: {
      width: 18,
      height: 18,
      borderRadius: 10,
      backgroundColor: colors.pink,
    },
  });

export default PickColorDrawer;
