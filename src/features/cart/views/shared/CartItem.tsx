import { useAppSelector } from '@/src/configs/redux/hooks';
import { cartItemStyle } from '@/src/features/cart/styles';
import { findAncestors, formatPrice } from '@/src/utils/funs';
import moment from 'jalali-moment';
import { Calendar, MapPin, Trash } from 'phosphor-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Order } from '@/src/features/cart/types'

interface ICartItemProps {
  item: Order;
  deleteCartItem: (id: number) => void;
}

const CartItem = ({ item, deleteCartItem }: ICartItemProps) => {
  const services = useAppSelector(state => state.service.allServices);

  return (
    <View style={cartItemStyle.cartItemContainer}>
      <View style={cartItemStyle.orderInfo}>
        <View style={cartItemStyle.orderInfoLeft}>
          {item.isUrgent && (
            <View style={cartItemStyle.isUrgent}>
              <Text style={cartItemStyle.isUrgentText}>فوری</Text>
            </View>
          )}
          <Text style={cartItemStyle.serviceTitle}>{item.service.title}</Text>
        </View>

        <TouchableOpacity
          style={cartItemStyle.trashCart}
          onPress={() => deleteCartItem(item.id)}
        >
          <Text style={cartItemStyle.deleteText}>حذف سفارش</Text>
          <Trash size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {item.orderServices.filter(e => !e.isAddOn)?.map((attribute, index) => (
        <View key={index} style={cartItemStyle.orderInfo}>
          <View style={cartItemStyle.orderInfoAddon}>
            <Text style={cartItemStyle.orderInfoTitle}>
              {findAncestors(services, attribute.serviceId)
                .slice(0, 3)
                .reverse()
                .reduce((acc, curr, index) => acc + (index != 0 ? ' -> ' : '') + curr.title, '') +
                ' ' + attribute.count + 'x '}
            </Text>
            {attribute.addOns?.map((e, addOnIndex) => (
              <Text key={addOnIndex} style={cartItemStyle.addOnText}>
                -{e.addOn?.title + ' ' + e.count + 'x'}
              </Text>
            ))}
          </View>

          <View style={cartItemStyle.orderInfoDelete}>
            <View style={cartItemStyle.orderInfoAddon}>
              <Text style={cartItemStyle.priceText}>{formatPrice(attribute.price)} تومان</Text>
              {attribute.addOns?.map((e, addOnIndex) => (
                <Text key={addOnIndex} style={cartItemStyle.priceText}>
                  {formatPrice(e.addOn?.price * e.count)} تومان
                </Text>
              ))}
            </View>
          </View>
        </View>
      ))}

      <View style={cartItemStyle.orderInfo}>
        <Text style={cartItemStyle.orderInfoText}>ایاب ذهاب</Text>
        <Text style={cartItemStyle.priceText}>
          {formatPrice(
            moment(item.date, 'jYYYY/jMM/jDD').unix() >= moment('1403/12/01', 'jYYYY/jMM/jDD').unix()
              ? 200000
              : 100000
          )} تومان
        </Text>
      </View>

      {item.discountAmount && (
        <View style={cartItemStyle.orderInfo}>
          <Text style={cartItemStyle.orderInfoText}>تخفیف</Text>
          <Text style={cartItemStyle.discountText}>{formatPrice(item.discountAmount)}- تومان</Text>
        </View>
      )}

      <View style={[cartItemStyle.orderInfo, cartItemStyle.dashedBottom]}>
        <Text style={cartItemStyle.totalTitle}>جمع کل</Text>
        <Text style={cartItemStyle.finalPrice}>{formatPrice(item.finalPrice)} تومان</Text>
      </View>

      <View style={cartItemStyle.orderInfo}>
        <View style={cartItemStyle.orderInfoIcon}>
          <MapPin size={20} color="#666" />
          <Text style={cartItemStyle.addressText}>{item.address?.title}</Text>
        </View>

        <View style={cartItemStyle.orderInfoCol}>
          <View style={cartItemStyle.orderInfoIcon}>
            <Text style={cartItemStyle.dateTimeText}>{item.date}</Text>
            <Calendar size={20} color="#666" />
          </View>
          <View style={cartItemStyle.orderInfoIcon}>
            <Text style={cartItemStyle.dateTimeText}>{item.fromTime}</Text>
            <View style={cartItemStyle.timerIcon} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
