import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { orderCardStyles } from '@/src/features/cart/styles';
import { findAncestors, formatPrice, getServiceIcon } from '@/src/utils/funs';
import { useNavigation } from '@react-navigation/native';
import moment from 'jalali-moment';
import React from 'react';
import { Image, TouchableOpacity, View, } from 'react-native';
import { Order } from '../../types';

interface IOrderCardProps {
  item: Order;
}

export default function OrderCard({ item }: IOrderCardProps) {
  const services = useAppSelector(state => state.service.allServices);
  const navigation = useNavigation();

  const { openDrawer } = useDrawer();
  const handleReorder = () => {
    const options: any = {};
    item.orderServices.map(e => options[e.serviceId] = {
      count: e.count,
      colors: e.colors?.map(j => j.id)
    });

    // Store data in AsyncStorage instead of localStorage
    // storeStep({
    //   name: 'address',
    //   index: 2
    // });

    // storeNewOrder({
    //   service: item?.service,
    //   addressId: item?.addressId,
    //   isUrgent: item?.isUrgent,
    //   attributes: item?.attributes,
    //   options
    // });

    navigation.navigate('Home' as never);
  };

  return (
    <View style={orderCardStyles.orderCardContainer}>
      <View style={orderCardStyles.orderCardInfo}>
        <View style={orderCardStyles.profilePicture}>
          <Image
            source={{ uri: item?.worker?.profilePic?.url }}
            style={orderCardStyles.profileImage}
            defaultSource={require('@/src/assets/images/girl.png')}
          />
        </View>

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

        {item.isUrgent && (
          <View style={orderCardStyles.isUrgent}>
            <TextView style={orderCardStyles.isUrgentText}>فوری</TextView>
          </View>
        )}
      </View>

      <View style={orderCardStyles.orderCardSecRow}>

        {item?.finalPrice && (
          <TextView style={orderCardStyles.finalPriceText}>
            {formatPrice(item?.finalPrice)} تومان
          </TextView>
        )}
        <View style={orderCardStyles.orderCardService}>
          {item.orderServices?.filter(e => !e.isAddOn).slice(0, 3)?.map((attribute, index) => {
            const attrFirstAncestor = findAncestors(services, attribute.serviceId).find(e => e?.showInList && e?.openDrawer);
            return (
              <View key={index} style={orderCardStyles.orderCardServiceIcon}>
                <View style={orderCardStyles.serviceCountBadge}>
                  <TextView style={orderCardStyles.serviceCountText}>{attribute.count}</TextView>
                </View>
                {attrFirstAncestor?.slug
                  &&
                    <Image
                        source={getServiceIcon(attrFirstAncestor.slug)}
                        style={orderCardStyles.serviceIcon}
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
          // onPress={() => openDrawer('orderDetail', { item })}
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
