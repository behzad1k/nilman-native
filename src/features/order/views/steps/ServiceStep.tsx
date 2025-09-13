import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { serviceStepStyles } from '@/src/features/order/styles/serviceStep';
import { Form, Step } from '@/src/features/order/types';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import Typography from '@/src/styles/theme/typography';
import { Theme } from '@/src/types/theme';
import { getServiceIcon } from '@/src/utils/funs';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Toast } from 'toastify-react-native';

interface Props {
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}

const ServiceStep = ({ selected, setSelected, setStep }: Props) => {
  const services = useAppSelector(state => state.service.services);
  const cart = useAppSelector(state => state.order.cart);
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const filteredServices = useMemo(() => {
    return services
    .filter(e => e.showInList)
    .sort((a, b) => (a?.sort || 1000) - (b?.sort || 1000));
  }, [services]);

  const handleSelectService = useCallback((service: Service) => {
    if (cart.find(e => e.serviceId === service.id)) {
      Toast.show({
        type: 'warn',
        text1: t('error.duplicateCart')
      })
      return;
    }

    setSelected(prev => ({
      ...prev,
      service: service,
      attributes: []
    }));

    setStep({
      index: 1,
      name: 'attribute'
    });
  }, [cart, setSelected, setStep]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={serviceStepStyles.cardsContainer}>
        {filteredServices.map((service) => (
          <TouchableOpacity
            key={service.slug}
            onPress={() => handleSelectService(service)}
            style={[styles.card, styles.serviceCard]}
            activeOpacity={0.7}
          >
            <TextView style={styles.cardTitle}>{service.title}</TextView>
            <Image
              source={getServiceIcon(service.slug)}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  serviceCard: {
    minHeight: 70,
  },
  cardImage: {
    width: 60,
    height: 60,
    tintColor: theme.text
  },
  cardTitle: {
    ...Typography.weights.normal,
    fontSize: 20,
    color: theme.text,
    textAlign: 'left',
  },
  card: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
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
  }
});

export default ServiceStep;