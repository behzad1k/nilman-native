import TextView from '@/src/components/ui/TextView';
import { PickColorDrawerStyles } from '@/src/features/order/styles/pickColorDrawer';
import { Color, Form, PickingColor } from '@/src/features/order/types';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import { colors } from '@/src/styles/theme/colors';

interface IPickColorDrawerProps {
  colors: Color[];
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  currentAttribute: Service;
  setPickingColor: React.Dispatch<React.SetStateAction<PickingColor>>;
  handleAddAttribute?: (secAttr: Service | null, color: string | null) => void;
}

const PickColorDrawer = ({
                           colors : allColors,
                           selected,
                           setSelected,
                           currentAttribute,
                           setPickingColor,
                         }: IPickColorDrawerProps) => {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme()
  const handleColorSelect = useCallback((colorItem: Color) => {
    setSelected(prev => {
      const newOptions = { ...prev.options };

      if (!newOptions[currentAttribute?.id]) {
        newOptions[currentAttribute?.id] = { count: 1 };
      }

      if (!newOptions[currentAttribute?.id]?.colors) {
        newOptions[currentAttribute?.id].colors = [];
      }

      const currentColors = newOptions[currentAttribute?.id].colors || [];
      const isSelected = currentColors.includes(colorItem.slug);

      newOptions[currentAttribute?.id].colors = isSelected
        ? currentColors.filter(color => color !== colorItem.slug)
        : [...currentColors, colorItem.slug];

      return {
        ...prev,
        options: newOptions
      };
    });
  }, [currentAttribute?.id, setSelected]);

  const handleConfirm = useCallback(() => {
    const selectedColors = selected.options[currentAttribute?.id]?.colors;

    if (Array.isArray(selectedColors) && selectedColors.length > 0) {
      setPickingColor({
        attr: null,
        open: false
      });
    } else {
      // Show error toast: 'لطفا حداقل یک رنگ را انتخاب کنید'
    }
  }, [selected.options, currentAttribute?.id, setPickingColor]);

  const handleCancel = useCallback(() => {
    setPickingColor({
      attr: null,
      open: false
    });
  }, [setPickingColor]);

  const selectedColors = selected.options[currentAttribute?.id]?.colors || [];

  return (
    <View style={styles.container}>
      <TextView style={styles.subtitle}>حداقل یکی از رنگ های زیر را انتخاب کنید</TextView>

      <ScrollView style={PickColorDrawerStyles.colorContainer} showsVerticalScrollIndicator={false}>
        {allColors.map((colorItem) => {
          const isSelected = selectedColors.includes(colorItem.slug);

          return (
            <TouchableOpacity
              key={colorItem.slug}
              onPress={() => handleColorSelect(colorItem)}
            >
              <LinearGradient dither={false} colors={[colorItem.code, theme.primary]} start={[.1, 1]} end={[.7, 0]} style={[styles.colorRow, isSelected && styles.selectedColorRow]} >
                {/* <View */}
                {/*   style={[ */}
                {/*     PickColorDrawerStyles.colorSpan, */}
                {/*     { backgroundColor: colorItem.code } */}
                {/*   ]} */}
                {/* /> */}

                <View style={{ flexDirection: 'row', gap: 10}}>
                  <TextView style={styles.colorTitle}>
                    {colorItem.title}
                  </TextView>
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 12, borderWidth: .5, borderColor: colors.pink}}>
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
          <TextView style={PickColorDrawerStyles.confirmButtonText}>تایید</TextView>
        </TouchableOpacity>

        <TouchableOpacity
          style={PickColorDrawerStyles.cancelButton}
          onPress={handleCancel}
          disabled={selectedColors.length == 0}
        >
          <TextView style={PickColorDrawerStyles.cancelButtonText}>بازگشت</TextView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
    textAlign: 'right',
  }
  ,
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingRight: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: .9

  },
  colorTitle: {
    width: 'auto',
    fontSize: 17,
    color: theme.text,
    fontWeight: '600',
  },
  selectedColorRow: {
    borderColor: colors.pink,
  },
  selectedIcon: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: colors.pink,
  }
});

export default PickColorDrawer;