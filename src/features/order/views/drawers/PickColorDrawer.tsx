import TextView from '@/src/components/ui/TextView';
import { PickColorDrawerStyles } from '@/src/features/order/styles/pickColorDrawer';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Color, Form, PickingColor } from '@/src/features/order/types';

interface IPickColorDrawerProps {
  colors: Color[];
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  currentAttribute: Service;
  setPickingColor: React.Dispatch<React.SetStateAction<PickingColor>>;
  handleAddAttribute?: (secAttr: Service | null, color: string | null) => void;
}

const PickColorDrawer = ({
                           colors,
                           selected,
                           setSelected,
                           currentAttribute,
                           setPickingColor,
                         }: IPickColorDrawerProps) => {
  const styles = useThemedStyles(createStyles);

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

      return { ...prev, options: newOptions };
    });
  }, [currentAttribute?.id, setSelected]);

  const handleConfirm = useCallback(() => {
    const selectedColors = selected.options[currentAttribute?.id]?.colors;

    if (Array.isArray(selectedColors) && selectedColors.length > 0) {
      setPickingColor({ attr: null, open: false });
    } else {
      // Show error toast: 'لطفا حداقل یک رنگ را انتخاب کنید'
    }
  }, [selected.options, currentAttribute?.id, setPickingColor]);

  const handleCancel = useCallback(() => {
    setPickingColor({ attr: null, open: false });
  }, [setPickingColor]);

  const selectedColors = selected.options[currentAttribute?.id]?.colors || [];

  return (
    <View style={styles.container}>
      <TextView style={styles.subtitle}>انتخاب رنگ</TextView>

      <ScrollView style={PickColorDrawerStyles.colorContainer} showsVerticalScrollIndicator={false}>
        {colors.map((colorItem) => {
          const isSelected = selectedColors.includes(colorItem.slug);

          return (
            <TouchableOpacity
              key={colorItem.slug}
              style={[styles.colorRow, isSelected && styles.selectedColorRow]}
              onPress={() => handleColorSelect(colorItem)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  PickColorDrawerStyles.colorSpan,
                  { backgroundColor: colorItem.code }
                ]}
              />
              <TextView style={styles.colorTitle}>
                {colorItem.title}
              </TextView>
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
    fontSize: 13,
    color: theme.text,
    marginBottom: 16,
    lineHeight: 16,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorTitle: {
    width: 'auto',
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
  selectedColorRow: {
    borderColor: '#007AFF',
    backgroundColor: theme.third,
  },
});

export default PickColorDrawer;