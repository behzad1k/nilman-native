import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { orderCardStyles } from '@/src/features/cart/styles';
import OrderDetail from '@/src/features/cart/views/shared/OrderDetail';
import { useAsyncOperation } from '@/src/hooks/useAsyncOperation';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { findAncestors, formatPrice, getServiceIcon } from '@/src/utils/funs';
import { router } from 'expo-router';
import moment from 'jalali-moment';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { Order } from '@/src/features/order/types';
import { services } from '@/src/configs/services';

interface IOrderCardProps {
  item: Order;
}

export default function OrderCard({ item }: IOrderCardProps) {
  const allServices = useAppSelector(state => state.service.allServices);
  const styles = useThemedStyles(createStyles)
  const { execute: submit } = useAsyncOperation();
  const { openDrawer } = useDrawer();

  const handleReorder = async () => {
    const options: any = {};
    item.orderServices.map(e => options[e.serviceId] = {
      count: e.count,
      colors: e.colors?.map(j => j.id)
    });

    await submit(() => services.cart.reOrder({
      service: item?.service,
      address: item?.address,
      isUrgent: item?.isUrgent,
      price: 0,
      options,
      attributes: item.orderServices.map(e => e.service),
      worker: null,
      date: null,
      time: null,
      isMulti: false
    }))

    router.push('/');
  };

  return (
    <View style={styles.orderCardContainer}>
      <View style={orderCardStyles.orderCardInfo}>
        <View style={orderCardStyles.profilePicture}>
          <Image
            source={item?.worker?.profilePic?.url ? { uri: item?.worker?.profilePic?.url } : require('@/src/assets/images/girl.png')}
            style={orderCardStyles.profileImage}
          />
        </View>
        {item.isUrgent && (
          <View style={orderCardStyles.isUrgent}>
            <TextView style={orderCardStyles.isUrgentText}>فوری</TextView>
          </View>
        )}
        <View style={orderCardStyles.orderCardInfoHeader}>
          <TextView style={orderCardStyles.serviceTitle}>{item.service.title}</TextView>
          <TextView style={orderCardStyles.orderCardDate}>
            {moment(item.date + ' ' + item.fromTime, 'jYYYY/jMM/jDD HH')
            .locale('fa')
            .format('dddd jD jMMMM  .  ساعت HH')}
          </TextView>
          <TextView style={orderCardStyles.orderCardAddress}>آدرس: {item.address?.title}</TextView>
          {item.worker?.name && (
            <TextView style={orderCardStyles.orderCardAddress}>
              استایلیست: {item.worker?.name + ' ' + item?.worker?.lastName}
            </TextView>
          )}
        </View>

      </View>

      <View style={orderCardStyles.orderCardSecRow}>

        {item?.finalPrice && (
          <TextView style={orderCardStyles.finalPriceText}>
            {formatPrice(item?.finalPrice)} تومان
          </TextView>
        )}
        <View style={orderCardStyles.orderCardService}>
          {item.orderServices?.filter(e => !e.isAddOn).slice(0, 3)?.map((attribute, index) => {
            const attrFirstAncestor = findAncestors(allServices, attribute.serviceId).find(e => e?.showInList && e?.openDrawer);
            return (
              <View key={index} style={orderCardStyles.orderCardServiceIcon}>
                <View style={orderCardStyles.serviceCountBadge}>
                  <TextView style={orderCardStyles.serviceCountText}>{attribute.count.toString()}</TextView>
                </View>
                {attrFirstAncestor?.slug
                  &&
                    <Image
                        source={getServiceIcon(attrFirstAncestor.slug)}
                        style={styles.serviceIcon}
                        resizeMode={'cover'}
                    />
                }

              </View>
            );
          })}
        </View>
      </View>

      <View style={orderCardStyles.orderCardButtons}>
        <TouchableOpacity
          style={orderCardStyles.viewInvoiceButton}
          onPress={() => openDrawer('orderDetail', <OrderDetail item={item} />, { drawerHeight: 'auto'})}
        >
          <TextView style={orderCardStyles.viewInvoiceButtonText}>مشاهده فاکتور</TextView>
        </TouchableOpacity>

        <TouchableOpacity
          style={orderCardStyles.reOrderButton}
          onPress={handleReorder}
        >
          <TextView style={orderCardStyles.reOrderButtonText}>سفارش مجدد</TextView>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const createStyles = (theme: Theme) => StyleSheet.create({
  orderCardContainer: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 15,
  },
  serviceIcon: {
    width: 30,
    height: 30,
    marginBottom: 12,
    tintColor: theme.text
  }
})
