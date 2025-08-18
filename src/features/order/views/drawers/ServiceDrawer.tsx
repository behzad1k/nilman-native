import TextView from '@/src/components/ui/TextView';
import { serviceDrawerStyles } from '@/src/features/order/styles/serviceDrawer';
import { Form } from '@/src/features/order/types';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { formatPrice } from '@/src/utils/funs';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Minus, Plus, Trash2 } from 'react-native-feather';

interface IServiceDrawerProps {
  currentParent: Service;
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  handleClickCard: (secAttr: Service) => void;
  deleteAttribute: (attrId: number) => void;
  onClose: () => void;
}

const ServiceDrawer = ({
                         currentParent,
                         selected,
                         setSelected,
                         handleClickCard,
                         deleteAttribute,
                         onClose
                       }: IServiceDrawerProps) => {
  const styles = useThemedStyles(createStyles);

  const filteredAttributes = useMemo(() => {
    return currentParent?.attributes
    ?.filter(e => e.showInList)
    ?.sort((a, b) => (a?.sort || 1000) - (b?.sort || 1000)) || [];
  }, [currentParent?.attributes]);

  const handleQuantityChange = useCallback((secAttr: Service, newCount: number) => {
    if (newCount <= 0) {
      deleteAttribute(secAttr.id);
    } else {
      setSelected(prev => {
        const newOptions = { ...prev.options };
        if (newOptions[secAttr.id]) {
          newOptions[secAttr.id].count = newCount;
        }
        return { ...prev, options: newOptions };
      });
    }
  }, [deleteAttribute, setSelected]);

  const isAttributeSelected = useCallback((secAttr: Service) => {
    return Object.keys(selected?.options)?.find(e => e === secAttr.id.toString()) ||
      Object.keys(selected.options).find(e =>
        secAttr.attributes?.map(j => j.id.toString())?.includes(e)
      );
  }, [selected.options]);

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

          return (
            <TouchableOpacity
              key={secAttr.slug}
              style={[styles.attrBox, isSelected && styles.selectedAttrBox]}
              onPress={() => handleClickCard(secAttr)}
              activeOpacity={0.7}
            >
              {secAttr.price > 0 && (
                <View style={serviceDrawerStyles.priceContainer}>
                  <View style={serviceDrawerStyles.priceRow}>
                    <TextView style={styles.currency}>تومان</TextView>
                    <TextView style={styles.price}>
                      {formatPrice(price)}
                    </TextView>
                  </View>

                  {selected.isMulti && Object.keys(selected.options).includes(secAttr.id?.toString()) && (
                    <View style={serviceDrawerStyles.quantityContainer}>
                      <TouchableOpacity
                        style={serviceDrawerStyles.quantityButton}
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

                      <TextInput
                        style={serviceDrawerStyles.quantityInput}
                        value={count.toString()}
                        onChangeText={(text) => {
                          const newCount = parseInt(text) || 0;
                          handleQuantityChange(secAttr, newCount);
                        }}
                        keyboardType="numeric"
                        textAlign="center"
                        onFocus={(e) => e.stopPropagation()}
                      />

                      <TouchableOpacity
                        style={serviceDrawerStyles.quantityButton}
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
              )}

              <TextView style={styles.attrTitle}>
                {secAttr.title}
                {isSelected && <TextView style={styles.selectedIcon}> ✓</TextView>}
              </TextView>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={serviceDrawerStyles.confirmButton} onPress={onClose}>
        <TextView style={serviceDrawerStyles.confirmButtonText}>ثبت</TextView>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  attrBox: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: 'transparent',
    backgroundColor: theme.primary
  },
  currency: {
    fontSize: 14,
    color: theme.text,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  attrTitle: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
  selectedAttrBox: {
    borderColor: '#007AFF',
    backgroundColor: theme.third,
  },
  selectedIcon: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default ServiceDrawer;