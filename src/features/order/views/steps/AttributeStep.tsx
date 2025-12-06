import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { Form } from '@/src/features/order/types';
import SecAttrDrawer from '@/src/features/order/views/drawers/SecAttrDrawer';
import ServiceIcon from '@/src/features/order/views/shared/ServiceIcon';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import Typography from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import { ServiceEnum } from '@/src/utils/enums';
import { findAncestors, getServiceIcon } from '@/src/utils/funs';
import { Trash, TrashSimple } from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { attributeStepStyles } from '@/src/features/order/styles/attributeStep';
import { colors } from '@/src/styles/theme/colors';

interface Props {
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  setIsNextStepAllowed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AttributeStep = ({ selected, setSelected, setIsNextStepAllowed }: Props) => {
  const [nailTab, setNailTab] = useState<Service | undefined>();
  const [attributes, setAttributes] = useState<Service[]>([]);
  const services = useAppSelector(state => state.service.allServices);
  const styles = useThemedStyles(createStyles);
  const { openDrawer, closeDrawer } = useDrawer();

  const filteredAttributes = useMemo(() => {
    return attributes
    .filter(e => e.showInList)
    .sort((a, b) => (a?.sort || 1000) - (b?.sort || 1000));
  }, [attributes]);

  const handleSelectAttribute = useCallback((attribute: Service) => {
    if (attribute.attributes?.length && attribute.openDrawer) {
      if (selected.attributes.length === 0) {
        openDrawer('secAttrDrawer',
          <SecAttrDrawer
            parent={attribute}
            form={selected}
            setForm={setSelected}
            setIsNextStepAllowed={setIsNextStepAllowed}
            onClose={closeDrawer}
            visible
          />,
          { drawerHeight: 'auto' }
        );
      } else if (!attribute.parent?.isMulti &&
        !selected.attributes
        .map(e => findAncestors(services, e.id))
        .flat()
        .map(e => e.id)
        .includes(attribute.id)) {
        // Show error message for multi-selection not allowed
      }
    } else if (attribute.attributes?.length && attribute.attributes[0]?.attributes?.length) {
      setSelected(prev => ({
        ...prev,
        attributeStep: attribute
      }));
    }
  }, [selected, services, openDrawer, closeDrawer, setSelected, setIsNextStepAllowed]);

  const handleUnselectAttribute = useCallback((attribute: Service) => {
    const slugsToRemove = [
      attribute.id,
      ...(attribute.attributes?.map(attr => attr.id) || [])
    ];

    setSelected((prev: Form) => {
      const newForm = { ...prev };
      slugsToRemove.forEach(id => delete newForm.options[id]);

      if (Object.keys(newForm.options).length === 0) {
        setIsNextStepAllowed(false);
      }

      return newForm;
    });
  }, [setSelected, setIsNextStepAllowed]);

  const isAttributeSelected = useCallback((attribute: Service) => {
    return Object.keys(selected.options).find(e =>
      attribute.id.toString() === e ||
      findAncestors(services, e)?.map(k => k?.id)?.includes(attribute.id)
    );
  }, [selected.options, services]);

  const NailHeader = useMemo(() => {
    if (selected?.service?.slug !== ServiceEnum.Nail) return null;

    const hand = selected?.service?.attributes?.find(e => e.slug === ServiceEnum.Hand);
    const feet = selected?.service?.attributes?.find(e => e.slug === ServiceEnum.Feet);

    return (
      <View style={styles.nailHeader}>
        <TouchableOpacity
          style={[
            attributeStepStyles.nailHeaderButton,
            attributeStepStyles.nailHeaderButtonLeft,
            nailTab?.slug === feet?.slug && attributeStepStyles.selectedLeft
          ]}
          onPress={() => {
            setNailTab(feet);
            setAttributes(feet?.attributes || []);
          }}
        >
          <TextView style={[
            styles.nailHeaderButtonText,
            nailTab?.slug === feet?.slug && attributeStepStyles.selectedButtonText
          ]}>
            {feet?.title}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            attributeStepStyles.nailHeaderButton,
            attributeStepStyles.nailHeaderButtonRight,
            nailTab?.slug === hand?.slug && attributeStepStyles.selectedRight
          ]}
          onPress={() => {
            setNailTab(hand);
            setAttributes(hand?.attributes || []);
          }}
        >
          <TextView style={[
            styles.nailHeaderButtonText,
            nailTab?.slug === hand?.slug && attributeStepStyles.selectedButtonText
          ]}>
            {hand?.title}
          </TextView>
        </TouchableOpacity>
      </View>
    );
  }, [selected?.service, nailTab, styles]);

  // Effects
  useEffect(() => {
    setIsNextStepAllowed(Object.keys(selected.options).length > 0);
  }, [selected.options, setIsNextStepAllowed]);

  useEffect(() => {
    if (selected?.service?.slug === ServiceEnum.Nail) {
      const hand = selected?.service?.attributes?.find(e => e.slug === ServiceEnum.Hand);
      setNailTab(hand);
      setAttributes(hand?.attributes || []);
    } else {
      setAttributes((selected?.attributeStep || selected?.service)?.attributes || []);
    }
  }, [selected?.attributeStep, selected?.service]);

  return (
    <View style={styles.container}>
      {NailHeader}
      <ScrollView
        contentContainerStyle={attributeStepStyles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredAttributes.map((attribute, index) => {
          const isSelected = isAttributeSelected(attribute);

          return (
            <Animated.View key={attribute.slug}>
              <TouchableOpacity
                onPress={() => handleSelectAttribute(attribute)}
                style={[
                  styles.card,
                  attributeStepStyles.attributeCard,
                  isSelected && styles.selectedCard,
                ]}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleUnselectAttribute(attribute)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <TrashSimple size={24} />
                  </TouchableOpacity>
                )}
                <View style={attributeStepStyles.attributeCardRight}>
                  <TextView style={styles.attributeTitle}>{attribute.title}</TextView>
                  <ServiceIcon slug={attribute.slug} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingBottom: 0
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.pink,
    backgroundColor: theme.primary,
  },
  cardImage: {
    width: 40,
    height: 40,
    tintColor: theme.text,
  },
  attributeTitle: {
    ...Typography.weights.normal,
    fontSize: 18,
    color: theme.text,
    textAlign: 'left',
  },
  deleteButton: {
    borderRadius: 20,
    padding: 3,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  nailHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.primary,
  },
  nailHeaderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
});

export default AttributeStep;